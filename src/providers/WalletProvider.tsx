'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { NetworkId } from '@midnight-ntwrk/ledger';
import Logger from '@/lib/utils/logger';
import { WalletState } from '@/types/wallet';

interface WalletContextType {
  isLoading: boolean;
  connected: boolean;
  address: string | null;
  publicKey: string | null;
  did: string | null;
  networkId: NetworkId;
  kycLevel: number | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    address: null,
    publicKey: null,
    did: null,
    networkId: NetworkId.TestNet,
    kycLevel: null
  });

  const connect = useCallback(async () => {
    try {
      Logger.wallet.connecting();
      setIsLoading(true);
      
      if (!window.midnight?.mnLace) {
        throw new Error('Midnight Lace wallet not installed');
      }

      const api = await window.midnight.mnLace.enable();
      const state = await api.state();

      // Extract public key from combined address
      const [address, publicKey] = state.address.split('|');

      setWalletState({
        connected: true,
        address: state.address,
        publicKey: publicKey || null,
        did: state.did || null,
        networkId: NetworkId.TestNet,
        kycLevel: state.kycLevel || null
      });

      Logger.wallet.connected({
        address: state.address,
        publicKey,
        networkId: NetworkId.TestNet,
        did: state.did || null,
        kycLevel: state.kycLevel || null
      });
    } catch (error: any) {
      Logger.wallet.error('connect', { error: error.message });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      Logger.wallet.disconnecting();

      setWalletState({
        connected: false,
        address: null,
        publicKey: null,
        did: null,
        networkId: NetworkId.TestNet,
        kycLevel: null
      });

      Logger.wallet.disconnected();
    } catch (error: any) {
      Logger.wallet.error('disconnect', { error: error.message });
      throw error;
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isLoading,
        ...walletState,
        connect,
        disconnect
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
