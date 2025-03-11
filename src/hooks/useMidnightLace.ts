'use client';

import { useCallback, useEffect, useState } from 'react';
import { useWallet } from '../providers/WalletProvider';
import { toast } from 'sonner';
import { WalletError } from '../types/wallet';
import { NetworkId } from '@midnight-ntwrk/ledger';
import Logger from '@/lib/utils/logger';

export function useMidnightLace() {
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [did, setDid] = useState<string | null>(null);
  const [networkId, setNetworkId] = useState<NetworkId>(NetworkId.TestNet);
  const [kycLevel, setKycLevel] = useState<number | null>(null);

  useEffect(() => {
    const checkWalletAvailability = async () => {
      if (typeof window === 'undefined') return;
      
      if (!window.midnight?.mnLace) {
        Logger.log('⚠️ Midnight Lace wallet not found', {
          component: 'useMidnightLace',
          data: {
            midnight: !!window.midnight,
            mnLace: !!window.midnight?.mnLace,
            enable: !!window.midnight?.mnLace?.enable
          }
        });
        toast.error('Please install Midnight Lace wallet');
      }
    };

    checkWalletAvailability();
  }, []);

  const handleConnect = useCallback(async () => {
    try {
      setIsLoading(true);
      await wallet.connect();
      setConnected(true);
      setAddress(wallet.address);
      setDid(wallet.did);
      setNetworkId(wallet.networkId);
      setKycLevel(wallet.kycLevel);
    } catch (error) {
      const walletError = error as WalletError;
      toast.error(walletError.message || 'Failed to connect wallet');
      Logger.error('Failed to connect wallet', {
        component: 'useMidnightLace',
        error: walletError
      });
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  const handleDisconnect = useCallback(async () => {
    try {
      setIsLoading(true);
      await wallet.disconnect();
      setConnected(false);
      setAddress(null);
      setDid(null);
      setNetworkId(NetworkId.TestNet);
      setKycLevel(null);
    } catch (error) {
      const walletError = error as WalletError;
      toast.error(walletError.message || 'Failed to disconnect wallet');
      Logger.error('Failed to disconnect wallet', {
        component: 'useMidnightLace',
        error: walletError
      });
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  const handleSignMessage = useCallback(async (message: string) => {
    try {
      setIsLoading(true);
      const signature = await wallet.signMessage(message);
      return signature;
    } catch (error) {
      const walletError = error as WalletError;
      toast.error(walletError.message || 'Failed to sign message');
      Logger.error('Failed to sign message', {
        component: 'useMidnightLace',
        error: walletError
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  return {
    isLoading,
    connected,
    address,
    did,
    networkId,
    kycLevel,
    handleConnect,
    handleDisconnect,
    handleSignMessage
  };
}
