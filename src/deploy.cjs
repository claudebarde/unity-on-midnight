const { deployContract } = require('@midnight-ntwrk/midnight-js-contracts');
const { NetworkId } = require('@midnight-ntwrk/zswap');
const bip39 = require('bip39');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs/promises');
const fetch = require('node-fetch');

dotenv.config();

const kycContractModule = require('../build/contracts/kyc/contract/index.cjs');
const didContractModule = require('../build/contracts/did/contract/index.cjs');
const ammContractModule = require('../build/contracts/amm/contract/index.cjs');

const dummyKey = Buffer.from('dummy-key-32-bytes-long-for-test');
const createWitness = (key) => () => [null, key];

const kycContract = new kycContractModule.Contract({ local_secret_key: createWitness(dummyKey) });
const didContract = new didContractModule.Contract({ local_secret_key: createWitness(dummyKey) });
const ammContract = new ammContractModule.Contract({ local_secret_key: createWitness(dummyKey) });

const CONFIG = {
  indexer: 'https://indexer.testnet-02.midnight.network',
  node: 'https://rpc.testnet-02.midnight.network',
  proofServer: 'http://localhost:6300'
};

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
  const { WalletBuilder } = require('@midnight-ntwrk/wallet');
  const { firstValueFrom } = require('rxjs');

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
  const state = await firstValueFrom(wallet.state());
  console.log('Wallet state:', JSON.stringify(state, null, 2));
  if (!state.address) throw new Error('Wallet not initialized');

  const { indexerPublicDataProvider } = require('@midnight-ntwrk/midnight-js-indexer-public-data-provider');
  const { httpClientProofProvider } = require('@midnight-ntwrk/midnight-js-http-client-proof-provider');
  const { levelPrivateStateProvider } = require('@midnight-ntwrk/midnight-js-level-private-state-provider');

  return {
    publicDataProvider: await indexerPublicDataProvider(
      `${CONFIG.indexer}/graphql`,
      `wss://${CONFIG.indexer.replace('https://', '')}/graphql`,
      require('ws')
    ),
    proofProvider: httpClientProofProvider(CONFIG.proofServer),
    privateStateProvider: levelPrivateStateProvider(),
    walletProvider: wallet,
    midnightProvider: wallet,
    zkConfigProvider: {
      async getVerifierKey(name, contract = 'kyc') {
        const keyPath = path.join('build', 'contracts', contract, 'keys', `${name}.verifier`);
        try {
          const key = await fs.readFile(keyPath, 'utf8');
          console.log(`Loaded verifier key for ${contract}/${name}: ${key.length} bytes`);
          return key;
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
}

async function deployContractWithLogging(providers, options, name) {
  console.log(`Deploying ${name} contract...`);
  console.log('Deployment options:', JSON.stringify({
    contract: options.contract.constructor.name,
    initialPrivateState: options.initialPrivateState instanceof Map ? Array.from(options.initialPrivateState) : options.initialPrivateState,
    privateStateKey: options.privateStateKey,
    verifierKeys: Array.from(options.verifierKeys.keys())
  }, null, 2));
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

    // KYC
    const kycCircuits = ['generate_key_proof', 'set_admin', 'add_verifier', 'remove_verifier', 'submit_kyc', 'verify_kyc'];
    const kycVerifierKeys = new Map(await Promise.all(kycCircuits.map(async c => [c, await providers.zkConfigProvider.getVerifierKey(c, 'kyc')])));
    const kycDeployed = await deployContractWithLogging(providers, {
      contract: kycContract,
      initialPrivateState: new Map(),
      privateStateKey: 'records',
      verifierKeys: kycVerifierKeys
    }, 'KYC');

    // DID
    const didCircuits = ['generate_key_proof', 'set_admin', 'create_did', 'update_did', 'deactivate_did'];
    const didVerifierKeys = new Map(await Promise.all(didCircuits.map(async c => [c, await providers.zkConfigProvider.getVerifierKey(c, 'did')])));
    const didDeployed = await deployContractWithLogging(providers, {
      contract: didContract,
      initialPrivateState: new Map(),
      privateStateKey: 'documents',
      verifierKeys: didVerifierKeys
    }, 'DID');

    // AMM
    const ammCircuits = ['deposit', 'borrow', 'repay', 'compensate_default'];
    const ammVerifierKeys = new Map(await Promise.all(ammCircuits.map(async c => [c, await providers.zkConfigProvider.getVerifierKey(c, 'amm')])));
    const ammDeployed = await deployContractWithLogging(providers, {
      contract: ammContract,
      initialPrivateState: { pool: new Map(), deactivated: new Map(), didCounter: 0n },
      privateStateKey: 'pool',
      verifierKeys: ammVerifierKeys
    }, 'AMM');

    console.log('All contracts deployed successfully!');
    const addresses = {
      kyc: kycDeployed.deployTxData.public.contractAddress,
      did: didDeployed.deployTxData.public.contractAddress,
      amm: ammDeployed.deployTxData.public.contractAddress
    };
    await fs.writeFile('deployed-addresses.json', JSON.stringify(addresses, null, 2));
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
