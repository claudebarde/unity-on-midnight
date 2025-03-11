import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';

export interface WalletState {
  // Address format: <address>|<publicKey>
  address: string;
  publicKey: string;
  networkId: string;
  did?: string;
  kycLevel?: number;
}

export interface WalletAPI {
  balanceAndProveTransaction: (tx: any) => Promise<any>;
  proveTransaction: (tx: any) => Promise<any>;
  balanceTransaction: (tx: any) => Promise<any>;
  submitTransaction: (tx: any) => Promise<string>;
  state: () => Promise<WalletState>;
}

export interface MnLaceWallet {
  name: string;
  apiVersion: string;
  enable: () => Promise<WalletAPI>;
  isEnabled: () => Promise<boolean>;
}

declare global {
  interface Window {
    midnight?: {
      mnLace: MnLaceWallet;
    };
  }
}
