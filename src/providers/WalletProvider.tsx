'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import Logger from '@/lib/utils/logger';
import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import type { WalletContextValue, WalletSession } from '@/types/wallet';

const WALLET_SESSION_KEY = 'wallet_session';

const WalletContext = createContext<WalletContextValue>({
  isConnected: false,
  publicKey: null,
  address: null,
  networkId: null,
  did: null,
  kycLevel: null,
  connect: async () => false,
  disconnect: async () => {},
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [networkId, setNetworkId] = useState<NetworkId | null>(null);
  const [did, setDid] = useState<string | null>(null);
  const [kycLevel, setKycLevel] = useState<number | null>(null);

  // Load session on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionData = localStorage.getItem(WALLET_SESSION_KEY);
        if (!sessionData) return;

        const session: WalletSession = JSON.parse(sessionData);
        
        // Verify wallet is still available
        if (!window.midnight?.mnLace) {
          localStorage.removeItem(WALLET_SESSION_KEY);
          return;
        }

        // Try to reconnect
        const api = await window.midnight.mnLace.enable();
        if (!api) {
          localStorage.removeItem(WALLET_SESSION_KEY);
          return;
        }

        const state = await api.state();
        if (!state?.address) {
          localStorage.removeItem(WALLET_SESSION_KEY);
          return;
        }

        // Verify address matches saved session
        if (state.address !== session.address) {
          localStorage.removeItem(WALLET_SESSION_KEY);
          return;
        }

        // Extract wallet info
        const [walletAddress, walletPublicKey] = state.address.split('|');
        setAddress(walletAddress);
        setPublicKey(walletPublicKey);
        setNetworkId(state.networkId ? (state.networkId as NetworkId) : null);
        setDid(state.did || null);
        setKycLevel(state.kycLevel || null);
        setIsConnected(true);

        Logger.log('🔵 Wallet Session Restored', {
          component: 'WalletProvider',
          data: { address: walletAddress }
        });
      } catch (error) {
        localStorage.removeItem(WALLET_SESSION_KEY);
        Logger.log('⚠️ Failed to restore wallet session', {
          component: 'WalletProvider',
          data: { error }
        });
      }
    };

    loadSession();
  }, []);

  // Save session when connection state changes
  useEffect(() => {
    if (isConnected && address && publicKey) {
      const session: WalletSession = {
        address: `${address}|${publicKey}`,
        timestamp: Date.now()
      };
      localStorage.setItem(WALLET_SESSION_KEY, JSON.stringify(session));
      
      Logger.log('🔵 Wallet Session Saved', {
        component: 'WalletProvider',
        data: { address }
      });
    }
  }, [isConnected, address, publicKey]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isConnected) {
        // Verify wallet is still connected when page becomes visible
        try {
          const api = await window.midnight?.mnLace?.enable();
          const state = await api?.state();
          
          if (!api || !state?.address) {
            Logger.log('⚠️ Wallet disconnected while away', {
              component: 'WalletProvider'
            });
            await disconnect();
          }
        } catch (error) {
          Logger.log('⚠️ Failed to verify wallet connection', {
            component: 'WalletProvider',
            data: { error }
          });
          await disconnect();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isConnected]);

  // Log connection status changes
  useEffect(() => {
    if (isConnected) {
      Logger.log('🔵 Wallet Connected', {
        component: 'WalletProvider',
        data: {
          isConnected,
          publicKey,
          address,
          networkId,
          did,
          kycLevel,
        }
      });
    }
  }, [isConnected, publicKey, address, networkId, did, kycLevel]);

  const connect = async (): Promise<boolean> => {
    try {
      if (!window.midnight?.mnLace) {
        Logger.log('⚠️ Midnight Lace wallet not found', {
          component: 'WalletProvider',
          data: {
            window: typeof window,
            midnight: !!window.midnight,
            mnLace: !!window.midnight?.mnLace
          }
        });
        toast.error('Please install Midnight Lace wallet');
        return false;
      }

      const api = await window.midnight.mnLace.enable();
      if (!api) {
        toast.error('Failed to connect to wallet');
        return false;
      }

      const state = await api.state();
      if (!state?.address) {
        toast.error('Failed to get wallet state');
        return false;
      }

      // Extract wallet info
      const [walletAddress, walletPublicKey] = state.address.split('|');
      setAddress(walletAddress);
      setPublicKey(walletPublicKey);
      setNetworkId(state.networkId ? (state.networkId as NetworkId) : null);
      setDid(state.did || null);
      setKycLevel(state.kycLevel || null);
      setIsConnected(true);
      
      toast.success('Wallet connected successfully');
      return true;
    } catch (error: any) {
      Logger.log('⚠️ Wallet Connection Error', {
        component: 'WalletProvider',
        data: {
          errorMessage: error.message || 'Unknown error',
          errorType: error.name,
          errorStack: error.stack
        }
      });
      toast.error(error.message || 'Failed to connect wallet');
      return false;
    }
  };

  const disconnect = async () => {
    try {
      localStorage.removeItem(WALLET_SESSION_KEY);
      setAddress(null);
      setPublicKey(null);
      setNetworkId(null);
      setDid(null);
      setKycLevel(null);
      setIsConnected(false);
      toast.success('Wallet disconnected');
    } catch (error: any) {
      Logger.log('⚠️ Wallet Disconnection Error', {
        component: 'WalletProvider',
        data: {
          errorMessage: error.message || 'Unknown error',
          errorType: error.name,
          errorStack: error.stack
        }
      });
      toast.error('Failed to disconnect wallet');
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        publicKey,
        address,
        networkId,
        did,
        kycLevel,
        connect,
        disconnect,
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
