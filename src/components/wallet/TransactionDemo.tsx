'use client';

import { useState } from 'react';
import { useMidnightLace } from '@/hooks/useMidnightLace';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

/**
 * TransactionDemo Component
 * 
 * A demonstration component that showcases wallet functionality including:
 * - Message signing
 * - Transaction signing
 * - Error handling
 * - Loading states
 * 
 * This component is useful for testing wallet integration and demonstrating
 * wallet capabilities during development or presentations.
 * 
 * @component
 * @example
 * ```tsx
 * <TransactionDemo />
 * ```
 */
export function TransactionDemo() {
  const { connected, handleSignMessage } = useMidnightLace();
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSign = async () => {
    if (!message) return;
    
    setLoading(true);
    setError(null);
    setSignature(null);

    try {
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = await handleSignMessage(messageBytes);
      setSignature(Buffer.from(signatureBytes).toString('hex'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign message');
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Test Wallet Functions</CardTitle>
        <CardDescription>
          Sign a message to test the wallet integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Enter a message to sign"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            onClick={handleSign}
            disabled={!message || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing...
              </>
            ) : (
              'Sign Message'
            )}
          </Button>
        </div>

        {signature && (
          <div className="p-3 rounded-lg bg-green-500/10 flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-green-500">Signature:</p>
              <p className="text-xs text-muted-foreground break-all">{signature}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 flex items-start gap-2">
            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-500">Error:</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
