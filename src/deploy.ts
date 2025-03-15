import { createRequire } from 'module';
import * as bip39 from 'bip39';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';

dotenv.config();
const require = createRequire(import.meta.url);

const kycContractModule = require('../build/contracts/kyc/contract/index.cjs');
const didContractModule = require('../build/contracts/did/contract/index.cjs');
const ammContractModule = require('../build/contracts/amm/contract/index.cjs');

// Initialize contracts
const kycContract = new kycContractModule.Contract({ local_secret_key: () => Buffer.from('dummy-key-32-bytes-long-for-test') });
const didContract = new didContractModule.Contract({ local_secret_key: () => Buffer.from('dummy-key-32-bytes-long-for-test') });
const ammContract = new ammContractModule.Contract({ local_secret_key: () => Buffer.from('dummy-key-32-bytes-long-for-test') });

// Test proof server connection
async function checkProofServer() {
  try {
    const response = await fetch('http://localhost:6300/health');
    if (!response.ok) {
      throw new Error(`Proof server health check failed: ${response.statusText}`);
    }
    console.log('Proof server is running');
  } catch (error) {
    console.error('Failed to connect to proof server:', error);
    throw new Error('Please ensure the Chrome extension proof server is running on port 6300');
  }
}

async function deployContract(contract: any, options: any) {
  const response = await fetch('http://localhost:6300/deploy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contract: contract.constructor.name,
      ...options
    })
  });

  if (!response.ok) {
    throw new Error(`Deployment failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
}

async function main() {
  try {
    // Check proof server
    await checkProofServer();

    // Deploy KYC
    console.log('Deploying KYC contract...');
    const kycDeployed = await deployContract(kycContract, {
      initialPrivateState: {},
      privateStateKey: 'records'
    });
    console.log('KYC contract deployed at:', kycDeployed.address);

    // Deploy DID
    console.log('Deploying DID contract...');
    const didDeployed = await deployContract(didContract, {
      initialPrivateState: {},
      privateStateKey: 'documents',
      constructorArgs: { kyc_contract_address: kycDeployed.address }
    });
    console.log('DID contract deployed at:', didDeployed.address);

    // Deploy AMM
    console.log('Deploying AMM contract...');
    const ammDeployed = await deployContract(ammContract, {
      initialPrivateState: {
        pool: {},
        deactivated: {},
        didCounter: 0
      },
      privateStateKey: 'pool',
      constructorArgs: { kyc_contract_address: kycDeployed.address }
    });
    console.log('AMM contract deployed at:', ammDeployed.address);

    // Save deployed addresses
    const addresses = {
      kyc: kycDeployed.address,
      did: didDeployed.address,
      amm: ammDeployed.address
    };

    await fs.writeFile('deployed-addresses.json', JSON.stringify(addresses, null, 2));
    console.log('Addresses saved to deployed-addresses.json');
  } catch (error) {
    console.error('Deployment failed:', error);
    throw error;
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
