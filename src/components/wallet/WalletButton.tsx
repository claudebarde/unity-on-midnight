'use client';

import { useWallet } from '../../providers/WalletProvider';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import Logger from '@/lib/utils/logger';
import Image from 'next/image';

export function WalletButton() {
  const { isConnected, publicKey, address, connect, disconnect } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    const [address] = addr.split('|');
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleClick = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      Logger.wallet.stateChange({ isConnected, publicKey, address });
      
      if (isConnected) {
        Logger.wallet.disconnecting();
        await disconnect();
        Logger.wallet.disconnected();
      } else {
        Logger.wallet.connecting();
        await connect();
      }
    } catch (error) {
      Logger.wallet.error(error, isConnected ? 'disconnect' : 'connect');
    } finally {
      setIsLoading(false);
      Logger.log('Wallet operation completed', { component: 'WalletButton' });
    }
  };

  const buttonContent = (
    <>
      <Image
        src="/images/lace-sm.png"
        alt="Lace Logo"
        width={24}
        height={24}
        className="rounded-full"
      />
      <span className="font-medium whitespace-nowrap">
        {isConnected && address ? formatAddress(address) : "Connect Lace"}
      </span>
      {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
      {isConnected && (
        <div className="w-[8px] h-[8px] rounded-full bg-[#00D588] shadow-[0_0_4px_rgba(0,213,136,0.4)] ml-2" />
      )}
    </>
  );

  return (
    <div 
      className={`
        relative inline-flex items-center justify-center
        ${isConnected ? 'w-[200px]' : 'w-[160px]'}
        h-[44px]
      `}
    >
      {/* Background gradient for border */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FF1351] via-[#FF7F37] to-[#FF9800]" />
      
      {/* Button with white background */}
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="
          relative m-[2px] w-[calc(100%-4px)] h-[40px]
          flex items-center justify-center gap-2 px-4
          rounded-[6px] bg-white
          text-black hover:bg-gray-50 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          whitespace-nowrap
        "
      >
        {buttonContent}
      </button>
    </div>
  );
}
