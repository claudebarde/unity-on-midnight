import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { NetworkId } from '@midnight-ntwrk/zswap';
import * as bip39 from 'bip39';
import dotenv from 'dotenv';
import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';
import fetch from 'node-fetch';
import { firstValueFrom } from 'rxjs';

dotenv.config();

const kycContractModule = await import('../build/contracts/kyc/contract/index.cjs');
const dummyKey = Buffer.from('dummy-key-32-bytes-long-for-test');
const createWitness = (key) => () => [null, key];
const kycContract = new kycContractModule.Contract({ local_secret_key: createWitness(dummyKey) });

const CONFIG = {
  indexer: 'https://indexer.testnet-02.midnight.network',
  node: 'https://rpc.testnet-02.midnight.network',
  proofServer: 'http://localhost:6300'
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkProofServer() {
  try {
    const response = await fetch(`${CONFIG.proofServer}/health`);
    if (!response.ok) throw new Error(`Proof server health check failed: ${response.statusText}`);
    console.log('Proof server is running');
  } catch (error) {
    console.error('Failed to connect to proof server:', error);
    throw error;
  }
}

async function createProviders() {
  if (!process.env.MNEMONIC) throw new Error('MNEMONIC required in .env');
  const { WalletBuilder } = await import('@midnight-ntwrk/wallet');

  console.log('Initializing wallet...');
  const wallet = await WalletBuilder.buildFromSeed(
    `${CONFIG.indexer}/graphql`,
    `wss://${CONFIG.indexer.replace('https://', '')}/graphql`,
    CONFIG.proofServer,
    CONFIG.node,
    bip39.mnemonicToSeedSync(process.env.MNEMONIC).slice(0, 32).toString('hex'),
    NetworkId.TestNet,
    'error'
  );
  console.log('Wallet initialized, syncing state...');
  await delay(5000);
  const state = await firstValueFrom(wallet.state());
  console.log('Wallet state:', JSON.stringify(state, null, 2));
  
  if (!state || !state.address) throw new Error('Wallet state or address not initialized');
  if (!state.coinPublicKey) {
    console.error('coinPublicKey is missing:', state.coinPublicKey);
    throw new Error('coinPublicKey is required');
  }
  const coinPublicKey = String(state.coinPublicKey);
  console.log('Coin public key:', coinPublicKey);

  const { indexerPublicDataProvider } = await import('@midnight-ntwrk/midnight-js-indexer-public-data-provider');
  const { httpClientProofProvider } = await import('@midnight-ntwrk/midnight-js-http-client-proof-provider');
  const { levelPrivateStateProvider } = await import('@midnight-ntwrk/midnight-js-level-private-state-provider');

  // Create minimal provider with only required properties
  const provider = {
    coinPublicKey,
    state: wallet.state
  };

  const providers = {
    publicDataProvider: await indexerPublicDataProvider(
      `${CONFIG.indexer}/graphql`,
      `wss://${CONFIG.indexer.replace('https://', '')}/graphql`,
      await import('ws').then(m => m.default)
    ),
    proofProvider: httpClientProofProvider(CONFIG.proofServer),
    privateStateProvider: levelPrivateStateProvider(),
    walletProvider: provider,
    midnightProvider: provider, // Use same provider instance for both
    zkConfigProvider: {
      async getVerifierKey(name, contract = 'kyc') {
        const keyPath = join('build', 'contracts', contract, 'keys', `${name}.verifier`);
        try {
          const key = await readFile(keyPath, 'utf8');
          const keyLength = key.length;
          if (keyLength === 0) {
            throw new Error(`Empty verifier key found for ${name}`);
          }
          console.log(`Loaded verifier key for ${contract}/${name}: ${keyLength} bytes`);
          return String(key);
        } catch (error) {
          console.error(`Failed to load verifier key ${keyPath}:`, error);
          throw error;
        }
      },
      async getVerifierKeys(names, contract = 'kyc') {
        return Promise.all(names.map(n => this.getVerifierKey(n, contract)));
      }
    }
  };
  console.log('Providers created with coinPublicKey:', provider.coinPublicKey);
  return providers;
}

async function deployContractWithLogging(providers, options, name) {
  console.log(`Deploying ${name} contract...`);
  console.log('walletProvider.coinPublicKey:', providers.walletProvider.coinPublicKey);
  
  // Log contract circuits
  console.log('Contract circuits:', Object.keys(options.contract.circuits));
  
  // Log verifier keys
  const verifierKeyInfo = Array.from(options.verifierKeys.entries()).map(([circuit, key]) => ({
    circuit,
    keyLength: key.length
  }));
  console.log('Verifier keys:', JSON.stringify(verifierKeyInfo, null, 2));

  // Log initial state structure
  const stateInfo = {
    contract: options.contract.constructor.name,
    privateStateKey: options.privateStateKey,
    initialState: {
      recordsMap: Array.from(options.initialPrivateState[0].entries()),
      verifiersMap: Array.from(options.initialPrivateState[1].entries())
    },
    verifierKeys: Array.from(options.verifierKeys.keys())
  };
  console.log('Deployment options:', JSON.stringify(stateInfo, (key, value) => 
    typeof value === 'bigint' ? value.toString() : value
  , 2));

  try {
    const deployed = await deployContract(providers, options);
    console.log(`${name} contract deployed at:`, deployed.deployTxData.public.contractAddress);
    return deployed;
  } catch (error) {
    console.error(`Failed to deploy ${name} contract:`, error.stack || error);
    throw error;
  }
}

async function main() {
  try {
    await checkProofServer();
    console.log('Creating providers...');
    const providers = await createProviders();

    // Get circuits from contract
    const kycCircuits = Object.keys(kycContract.circuits);
    console.log('Loading verifier keys for circuits:', kycCircuits);

    // Load and validate verifier keys
    const kycVerifierKeys = new Map();
    for (const circuit of kycCircuits) {
      const key = await providers.zkConfigProvider.getVerifierKey(circuit, 'kyc');
      if (!key || key.length === 0) {
        throw new Error(`Empty verifier key for circuit: ${circuit}`);
      }
      kycVerifierKeys.set(circuit, key);
      console.log(`Loaded key for ${circuit}: ${key.length} bytes`);
    }

    // Initialize contract state with two Maps
    const initialState = [
      new Map(), // records
      new Map()  // verifiers
    ];
    console.log('Initial state structure:', {
      recordsLength: initialState[0].size,
      verifiersLength: initialState[1].size
    });

    // Deploy with dual-map state
    const kycDeployed = await deployContractWithLogging(providers, {
      contract: kycContract,
      initialPrivateState: initialState,
      privateStateKey: 'records',
      verifierKeys: kycVerifierKeys
    }, 'KYC');

    console.log('KYC contract deployed successfully!');
    const addresses = { kyc: kycDeployed.deployTxData.public.contractAddress };
    await writeFile('deployed-addresses.json', JSON.stringify(addresses, null, 2));
    console.log('Addresses saved to deployed-addresses.json');
  } catch (error) {
    console.error('Deployment failed:', error.stack || error);
    throw error;
  }
}

main().catch(err => {
  console.error('Main process failed:', err.stack || err);
  process.exit(1);
});
