'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * WalletErrorBoundary Component
 * 
 * A React error boundary specifically designed to catch and handle wallet-related errors.
 * This component prevents wallet errors from crashing the entire application and provides
 * a user-friendly error display with recovery options.
 * 
 * @component
 * @example
 * ```tsx
 * <WalletErrorBoundary>
 *   <WalletButton />
 *   <WalletStatus />
 * </WalletErrorBoundary>
 * ```
 */
export class WalletErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service
    console.error('Wallet Error:', error);
    console.error('Error Info:', errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Wallet Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {this.state.error?.message || 'An error occurred while interacting with the wallet.'}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
