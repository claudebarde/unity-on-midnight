'use client';

import { useMidnightLace } from '@/hooks/useMidnightLace';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NetworkId } from '@midnight-ntwrk/ledger';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Network, Fingerprint, Key } from 'lucide-react';

export function WalletStatus() {
  const { connected, address, did, networkId, kycLevel } = useMidnightLace();

  if (!connected || !address) {
    return null;
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 8)}...${addr.slice(-8)}`;
  };

  const getNetworkBadgeColor = (network: NetworkId) => {
    if (network === NetworkId.TestNet) {
      return 'bg-yellow-500/10 text-yellow-500';
    }
    return 'bg-gray-500/10 text-gray-500';
  };

  const getKycLevelColor = (level: number | null) => {
    if (level === null) return 'bg-gray-500/10 text-gray-500';
    switch (level) {
      case 2:
        return 'bg-green-500/10 text-green-500';
      case 1:
        return 'bg-yellow-500/10 text-yellow-500';
      default:
        return 'bg-red-500/10 text-red-500';
    }
  };

  const getKycLevelText = (level: number | null) => {
    if (level === null) return 'Unknown';
    switch (level) {
      case 2:
        return 'Full KYC';
      case 1:
        return 'Basic KYC';
      default:
        return 'No KYC';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Address</span>
          </div>
          <span className="text-sm font-mono">{formatAddress(address)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Network className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Network</span>
          </div>
          <Badge variant="outline" className={getNetworkBadgeColor(networkId)}>
            TestNet
          </Badge>
        </div>

        {did && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Fingerprint className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">DID</span>
            </div>
            <span className="text-sm font-mono">{formatAddress(did)}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">KYC Level</span>
          </div>
          <Badge variant="outline" className={getKycLevelColor(kycLevel)}>
            {getKycLevelText(kycLevel)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
