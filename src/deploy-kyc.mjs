import { deployContract } from "@midnight-ntwrk/midnight-js-contracts";
import { NetworkId } from "@midnight-ntwrk/zswap";
import * as bip39 from "bip39";
import dotenv from "dotenv";
import { join } from "path";
import { readFile, writeFile } from "fs/promises";
import fetch from "node-fetch";
import { firstValueFrom } from "rxjs";

dotenv.config();

const kycContractModule = await import(
  "../build/contracts/kyc/contract/index.cjs"
);
// Use a proper 32-byte secret key (could be derived from mnemonic later)
const secretKey = Buffer.from("secret-key-32-bytes-for-kyc-test123456");
const createWitness = key => () => [null, key];
const kycContract = new kycContractModule.Contract({
  local_secret_key: createWitness(secretKey)
});

const CONFIG = {
  indexer: "https://indexer.testnet-02.midnight.network",
  node: "https://rpc.testnet-02.midnight.network",
  proofServer: "http://localhost:6300"
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkProofServer() {
  try {
    const response = await fetch(`${CONFIG.proofServer}/health`);
    if (!response.ok)
      throw new Error(
        `Proof server health check failed: ${response.statusText}`
      );
    console.log("Proof server is running");
  } catch (error) {
    console.error("Failed to connect to proof server:", error);
    throw error;
  }
}

async function createProviders() {
  if (!process.env.MNEMONIC) throw new Error("MNEMONIC required in .env");
  const { WalletBuilder } = await import("@midnight-ntwrk/wallet");

  console.log("Initializing wallet...");
  const wallet = await WalletBuilder.buildFromSeed(
    `${CONFIG.indexer}/graphql`,
    `wss://${CONFIG.indexer.replace("https://", "")}/graphql`,
    CONFIG.proofServer,
    CONFIG.node,
    bip39.mnemonicToSeedSync(process.env.MNEMONIC).slice(0, 32).toString("hex"),
    NetworkId.TestNet,
    "error"
  );
  console.log("Wallet initialized, syncing state...");
  await delay(5000);
  const state = await firstValueFrom(wallet.state());
  console.log("Wallet state:", JSON.stringify(state, null, 2));

  if (!state || !state.address)
    throw new Error("Wallet state or address not initialized");
  if (!state.coinPublicKey) {
    console.error("coinPublicKey is missing:", state.coinPublicKey);
    throw new Error("coinPublicKey is required");
  }
  const coinPublicKey = String(state.coinPublicKey);
  console.log("Coin public key:", coinPublicKey);

  const { indexerPublicDataProvider } = await import(
    "@midnight-ntwrk/midnight-js-indexer-public-data-provider"
  );
  const { httpClientProofProvider } = await import(
    "@midnight-ntwrk/midnight-js-http-client-proof-provider"
  );
  const { levelPrivateStateProvider } = await import(
    "@midnight-ntwrk/midnight-js-level-private-state-provider"
  );

  // Create minimal provider with only required properties
  const provider = {
    coinPublicKey,
    state: wallet.state
  };

  const providers = {
    publicDataProvider: await indexerPublicDataProvider(
      `${CONFIG.indexer}/graphql`,
      `wss://${CONFIG.indexer.replace("https://", "")}/graphql`,
      await import("ws").then(m => m.default)
    ),
    proofProvider: httpClientProofProvider(CONFIG.proofServer),
    privateStateProvider: levelPrivateStateProvider(),
    walletProvider: provider,
    midnightProvider: provider, // Use same provider instance for both
    zkConfigProvider: {
      async getVerifierKey(name, contract = "kyc") {
        const keyPath = join(
          "build",
          "contracts",
          contract,
          "keys",
          `${name}.verifier`
        );
        const keyBuffer = await readFile(keyPath); // Load as Buffer
        const key = Uint8Array.from(keyBuffer); // Convert to Uint8Array
        console.log(
          `Loaded verifier key for ${contract}/${name}: ${key.length} bytes (type: ${key.constructor.name})`
        );
        return key;
      },
      async getVerifierKeys(names, contract = "kyc") {
        return Promise.all(names.map(n => this.getVerifierKey(n, contract)));
      }
    }
  };
  console.log("Providers created with coinPublicKey:", provider.coinPublicKey);
  return providers;
}

async function deployContractWithLogging(providers, options, name) {
  console.log(`\n=== Deploying ${name} Contract ===\n`);
  console.log("Contract Circuits:", Object.keys(options.contract.circuits));

  // Convert Map to array of [circuit, key] pairs
  const verifierKeys = Array.from(options.verifierKeys.entries()).map(
    ([circuit, key]) => [
      String(circuit), // Ensure string type
      key instanceof Uint8Array ? key : new Uint8Array(Buffer.from(key)) // Ensure Uint8Array type
    ]
  );

  // Log each pair's structure
  console.log("\n=== Verifier Key Pairs ===");
  verifierKeys.forEach(([circuit, key], index) => {
    console.log(`\nPair ${index + 1}:`, {
      circuit,
      circuitType: typeof circuit,
      keyType:
        key instanceof Uint8Array ? "Uint8Array" : key?.constructor?.name,
      keyLength: key?.length,
      keyHeader:
        key instanceof Uint8Array
          ? Buffer.from(key.slice(0, 4)).toString("hex")
          : "N/A"
    });
  });

  const stateInfo = {
    contract: options.contract.constructor.name,
    privateStateKey: options.privateStateKey,
    initialState: {
      records: {
        type: "Map<Bytes<32>, KYCRecord>",
        size: options.initialPrivateState[0].size
      },
      verifiers: {
        type: "Map<Bytes<32>, Field>",
        size: options.initialPrivateState[1].size
      },
      admin: { type: "Bytes<32>", value: options.initialPrivateState[2] },
      kycCounter: { type: "Counter", value: options.initialPrivateState[3] }
    },
    verifierKeys: verifierKeys.map(([circuit]) => circuit) // Show circuit names only
  };
  console.log(
    "\nDeployment Configuration:",
    JSON.stringify(stateInfo, null, 2)
  );

  try {
    console.log("\nAttempting deployment with array of pairs...");
    console.log("VerifierKeys structure:", {
      type: "Array of Pairs",
      length: verifierKeys.length,
      samplePair: {
        circuit: verifierKeys[0][0],
        circuitType: typeof verifierKeys[0][0],
        keyType:
          verifierKeys[0][1] instanceof Uint8Array ? "Uint8Array" : "Unknown",
        keyHeader:
          verifierKeys[0][1] instanceof Uint8Array
            ? Buffer.from(verifierKeys[0][1].slice(0, 4)).toString("hex")
            : "N/A"
      }
    });

    const deployed = await deployContract(providers, {
      ...options,
      verifierKeys // Pass array of [circuit, key] pairs
    });
    console.log(
      `\n✓ ${name} contract deployed successfully at:`,
      deployed.deployTxData.public.contractAddress
    );
    return deployed;
  } catch (error) {
    console.error(`\n✗ Failed to deploy ${name} contract:`, error.message);
    console.error("\nVerifierKeys Array State at Error:", {
      length: verifierKeys.length,
      pairs: verifierKeys.map(([circuit, key], index) => ({
        index,
        circuit: JSON.stringify({
          value: circuit,
          type: typeof circuit,
          constructor: circuit?.constructor?.name
        }),
        key: JSON.stringify({
          type:
            key instanceof Uint8Array ? "Uint8Array" : key?.constructor?.name,
          length: key?.length,
          header:
            key instanceof Uint8Array
              ? Buffer.from(key.slice(0, 4)).toString("hex")
              : "N/A"
        })
      }))
    });
    console.error("\nError Details:", {
      message: error.message,
      name: error.name,
      type: error.constructor.name,
      stack: error.stack?.split("\n")
    });
    throw error;
  }
}

async function main() {
  try {
    await checkProofServer();
    console.log("Creating providers...");
    const providers = await createProviders();

    // Log detailed contract module information
    console.log("\n=== Contract Module Analysis ===");
    console.log("Module exports:", Object.keys(kycContractModule));
    console.log("Contract instance type:", kycContract.constructor.name);
    console.log(
      "Contract properties:",
      Object.getOwnPropertyNames(kycContract)
    );

    const kycCircuits = [
      "generate_key_proof",
      "set_admin",
      "add_verifier",
      "remove_verifier",
      "submit_kyc",
      "verify_kyc",
      "get_kyc_status",
      "is_verified",
      "is_verifier"
    ];

    console.log("\n=== Loading Verifier Keys ===");
    const kycVerifierKeys = new Map();
    for (const circuit of kycCircuits) {
      const key = await providers.zkConfigProvider.getVerifierKey(
        circuit,
        "kyc"
      );
      if (!key || key.length === 0) {
        console.error(`Warning: Empty verifier key for circuit: ${circuit}`);
        throw new Error(`Empty verifier key for circuit: ${circuit}`);
      }
      kycVerifierKeys.set(circuit, key);
      console.log(`✓ Loaded key for ${circuit}: ${key.length} bytes`);
    }

    // Verify no empty keys in map
    console.log("\n=== Verifying Verifier Keys Map ===");
    for (const [circuit, key] of kycVerifierKeys.entries()) {
      if (!circuit || circuit.trim() === "") {
        console.error("Found empty circuit name in verifierKeys!");
        throw new Error("Empty circuit name detected in verifierKeys");
      }
      if (!key || key.length === 0) {
        console.error(`Empty key found for circuit: ${circuit}`);
        throw new Error(`Empty key detected for circuit: ${circuit}`);
      }
    }
    console.log("✓ All verifier keys validated");

    const coinPublicKey = providers.walletProvider.coinPublicKey;
    const initialState = [
      new Map(), // records: Map<Bytes<32>, KYCRecord>
      new Map(), // verifiers: Map<Bytes<32>, Field>
      coinPublicKey, // admin: Bytes<32>
      0 // kycCounter: Counter
    ];

    const kycDeployed = await deployContractWithLogging(
      providers,
      {
        contract: kycContract,
        initialPrivateState: initialState,
        privateStateKey: "records",
        verifierKeys: kycVerifierKeys
      },
      "KYC"
    );

    console.log("\n=== Deployment Success ===");
    const addresses = { kyc: kycDeployed.deployTxData.public.contractAddress };
    await writeFile(
      "deployed-addresses.json",
      JSON.stringify(addresses, null, 2)
    );
    console.log("Contract addresses saved to deployed-addresses.json");
  } catch (error) {
    console.error("\n=== Deployment Failed ===");
    console.error("Error:", {
      message: error.message,
      name: error.name,
      type: error.constructor.name,
      stack: error.stack?.split("\n")
    });
    throw error;
  }
}

main().catch(err => {
  console.error("Main process failed:", err.stack || err);
  process.exit(1);
});
