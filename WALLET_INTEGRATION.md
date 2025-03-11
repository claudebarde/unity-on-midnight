# Midnight Lace Wallet Integration

This document provides comprehensive documentation for the Midnight Lace wallet integration in the Unity App.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Components](#components)
- [Hooks](#hooks)
- [Error Handling](#error-handling)
- [TypeScript Support](#typescript-support)
- [Usage Examples](#usage-examples)

## Overview

The Unity App integrates with the Midnight Lace wallet to provide secure transaction signing and wallet state management. The integration is built with TypeScript and React, following best practices for error handling and state management.

## Architecture

The wallet integration follows a provider pattern with hooks for easy state access:

```
src/
├── components/wallet/     # Wallet-related components
├── providers/            # Context providers
├── types/               # TypeScript definitions
└── lib/utils/           # Utilities including logger
```

## Components

### WalletProvider
The core provider component that manages wallet state and provides context to child components. Always enforces TestNet for network ID.

```typescript
interface WalletState {
  connected: boolean;
  address: string | null;
  publicKey: string | null;
  did: string | null;
  networkId: NetworkId;
  kycLevel: number | null;
}

<WalletProvider>
  <App />
</WalletProvider>
```

### WalletButton
A button component that handles wallet connection/disconnection with loading states. Features:
- Connect/Disconnect functionality
- Loading state indicator
- Address display with truncation
- Connection status indicator

```typescript
<WalletButton />
```

## Hooks

### useWallet
The primary hook for wallet interactions:

```typescript
const {
  connected,
  address,
  publicKey,
  did,
  networkId,
  kycLevel,
  connect,
  disconnect
} = useWallet();
```

## Error Handling

The wallet integration includes comprehensive error handling:

### Error Types
```typescript
export enum WalletError {
  NOT_INSTALLED = 'Midnight Lace wallet is not installed',
  NOT_CONNECTED = 'Wallet is not connected',
  USER_REJECTED = 'User rejected the request',
  INVALID_NETWORK = 'Invalid network',
  INVALID_ADDRESS = 'Invalid address',
  INVALID_SIGNATURE = 'Invalid signature',
  UNKNOWN_ERROR = 'Unknown error occurred'
}
```

### Logging
All wallet operations are logged using a custom logger that provides:
- Operation status (connecting, connected, disconnecting, disconnected)
- Error details
- State changes
- Timestamps

## TypeScript Support

### WalletAPI Interface
```typescript
export interface WalletAPI {
  state(): Promise<{
    address: string;
    did?: string;
    networkId?: string;
    kycLevel?: number;
  }>;
  enable(): Promise<WalletAPI>;
  isEnabled(): Promise<boolean>;
  apiVersion: string;
  name: string;
}
```

## Usage Examples

### Basic Connection
```typescript
function MyComponent() {
  const { connected, connect, disconnect } = useWallet();

  return (
    <button onClick={connected ? disconnect : connect}>
      {connected ? 'Disconnect' : 'Connect'}
    </button>
  );
}
```

### Accessing Wallet State
```typescript
function WalletInfo() {
  const { address, did, networkId, kycLevel } = useWallet();

  return (
    <div>
      <p>Address: {address}</p>
      <p>DID: {did}</p>
      <p>Network: {networkId}</p>
      <p>KYC Level: {kycLevel}</p>
    </div>
  );
}
```

### Protected Routes/Features
```typescript
function ProtectedFeature() {
  const { connected } = useWallet();

  if (!connected) {
    return <p>Please connect your wallet to access this feature</p>;
  }

  return <div>Protected Content</div>;
}
