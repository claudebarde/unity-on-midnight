import { useEffect } from 'react';
import { useMidnightLace } from './useMidnightLace';
import { toast } from 'sonner';
import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';

/**
 * useWalletMonitor Hook
 * 
 * A custom hook that monitors wallet state changes and network status.
 * It provides real-time updates and notifications for:
 * - Wallet connection changes
 * - Network changes
 * - Account changes
 * - DID updates
 * 
 * @hook
 * @example
 * ```tsx
 * function App() {
 *   useWalletMonitor();
 *   return <div>Your app content</div>;
 * }
 * ```
 */
export function useWalletMonitor() {
  const { connected, networkId, address, did } = useMidnightLace();

  // Monitor wallet connection
  useEffect(() => {
    if (connected) {
      toast.success('Wallet connected');
    }
  }, [connected]);

  // Monitor network changes
  useEffect(() => {
    if (connected && networkId) {
      const network = NetworkId[networkId];
      toast.info(`Network: ${network}`);
    }
  }, [connected, networkId]);

  // Monitor address changes
  useEffect(() => {
    if (connected && address) {
      toast.info('Address updated', {
        description: `${address.slice(0, 8)}...${address.slice(-8)}`,
      });
    }
  }, [connected, address]);

  // Monitor DID changes
  useEffect(() => {
    if (connected && did) {
      toast.info('DID updated', {
        description: `${did.slice(0, 8)}...${did.slice(-8)}`,
      });
    }
  }, [connected, did]);

  // Set up window event listeners
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && connected) {
        // Refresh wallet state when tab becomes visible
        try {
          await window.cardano?.midnight?.isEnabled();
        } catch (error) {
          toast.error('Wallet connection lost');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [connected]);
}
