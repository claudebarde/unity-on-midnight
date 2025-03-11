'use client';

import { useCallback, useEffect, useState } from 'react';
import { useWallet } from '../providers/WalletProvider';
import { toast } from 'sonner';
import { WalletError } from '../types/wallet';
import Logger from '@/lib/utils/logger';

export function useMidnightLace() {
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);

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
      
      if (!window.midnight?.mnLace) {
        throw new Error(WalletError.NOT_CONNECTED);
      }

      await wallet.connect();
    } catch (error: any) {
      Logger.log('⚠️ Error connecting wallet', {
        component: 'useMidnightLace',
        data: {
          errorMessage: error.message || 'Unknown error',
          errorType: error.name,
          errorStack: error.stack
        }
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  const handleDisconnect = useCallback(async () => {
    try {
      setIsLoading(true);
      await wallet.disconnect();
    } catch (error: any) {
      Logger.log('⚠️ Error disconnecting wallet', {
        component: 'useMidnightLace',
        data: {
          errorMessage: error.message || 'Unknown error',
          errorType: error.name,
          errorStack: error.stack
        }
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  return {
    isLoading,
    handleConnect,
    handleDisconnect,
  };
}
