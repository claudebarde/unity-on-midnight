'use client';

import { useRouter } from 'next/navigation';
import { useWallet } from '@/providers/WalletProvider';

export function useWalletNavigation() {
  const router = useRouter();
  const { isConnected, connect } = useWallet();

  const handleBorrowClick = async () => {
    if (!isConnected) {
      await connect();
    }
    router.push('/borrower');
  };

  const handleLendClick = async () => {
    if (!isConnected) {
      await connect();
    }
    router.push('/lender');
  };

  return {
    handleBorrowClick,
    handleLendClick,
    isConnected
  };
}
