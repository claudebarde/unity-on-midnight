import { NetworkId } from '@midnight-ntwrk/ledger';

export enum WalletError {
  NOT_INSTALLED = 'Midnight Lace wallet is not installed',
  NOT_CONNECTED = 'Wallet is not connected',
  USER_REJECTED = 'User rejected the request',
  INVALID_NETWORK = 'Invalid network',
  INVALID_ADDRESS = 'Invalid address',
  INVALID_SIGNATURE = 'Invalid signature',
  UNKNOWN_ERROR = 'Unknown error occurred'
}

export interface WalletState {
  address: string | null;
  publicKey: string | null;
  did: string | null;
  networkId: NetworkId;
  kycLevel: number | null;
  connected: boolean;
}

export interface WalletAPI {
  state(): Promise<{
    address: string;
    did?: string;
    networkId?: string;
    kycLevel?: number;
  }>;
  enable(): Promise<WalletAPI>;
  isEnabled(): Promise<boolean>;
  apiVersion: string;
  name: string;
}

declare global {
  interface Window {
    midnight?: {
      mnLace?: WalletAPI;
    };
  }
}
