import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import type { WalletState as MidnightWalletState, WalletAPI as MidnightWalletAPI } from './midnight';

// Re-export WalletState from midnight.d.ts
export type { MidnightWalletState as WalletState };

export enum WalletError {
  NOT_CONNECTED = "Wallet not connected",
  WRONG_NETWORK = "Wrong network",
  REJECTED = "User rejected",
  TIMEOUT = "Connection timeout",
  UNKNOWN = "Unknown error"
}

export interface WalletContextValue {
  isConnected: boolean;
  publicKey: string | null;
  address: string | null;
  networkId: NetworkId | null;
  did: string | null;
  kycLevel: number | null;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
}

// Re-export WalletAPI and extend if needed
export interface WalletAPI extends MidnightWalletAPI {}

export interface MnLaceWallet {
  enable: () => Promise<WalletAPI>;
  isEnabled: () => Promise<boolean>;
}

export interface MidnightWindow {
  midnight?: {
    mnLace: MnLaceWallet;
  };
}

export interface WalletSession {
  address: string; // Combined address|publicKey
  timestamp: number;
}

// Extend the Window interface
declare global {
  interface Window extends MidnightWindow {}
}
