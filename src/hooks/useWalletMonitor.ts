'use client';

import { useEffect, useRef } from 'react';
import { useMidnightLace } from './useMidnightLace';
import { NetworkId } from '@midnight-ntwrk/ledger';
import Logger from '@/lib/utils/logger';

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
  const lastStateRef = useRef({ connected, networkId, address, did });

  useEffect(() => {
    const currentState = { connected, networkId, address, did };
    const lastState = lastStateRef.current;

    // Check for changes
    if (currentState.connected !== lastState.connected) {
      Logger.log(`Wallet ${currentState.connected ? 'connected' : 'disconnected'}`, {
        component: 'WalletMonitor',
        data: { connected: currentState.connected }
      });
    }

    if (currentState.networkId !== lastState.networkId) {
      Logger.log('Network changed', {
        component: 'WalletMonitor',
        data: {
          network: currentState.networkId === NetworkId.TestNet ? 'TestNet' : 'Unknown'
        }
      });
    }

    if (currentState.address !== lastState.address) {
      Logger.log('Address changed', {
        component: 'WalletMonitor',
        data: { address: currentState.address }
      });
    }

    if (currentState.did !== lastState.did) {
      Logger.log('DID changed', {
        component: 'WalletMonitor',
        data: { did: currentState.did }
      });
    }

    // Update ref
    lastStateRef.current = currentState;
  }, [connected, networkId, address, did]);
}
