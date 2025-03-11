# Midnight Lace Wallet Integration

This document provides comprehensive documentation for the Midnight Lace wallet integration in the Unity App.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Components](#components)
- [Hooks](#hooks)
- [Error Handling](#error-handling)
- [Network Monitoring](#network-monitoring)
- [TypeScript Support](#typescript-support)
- [Usage Examples](#usage-examples)

## Overview

The Unity App integrates with the Midnight Lace wallet to provide secure transaction signing, message signing, and wallet state management. The integration is built with TypeScript and React, following best practices for error handling and state management.

## Architecture

The wallet integration follows a provider pattern with hooks for easy state access:

```
src/
├── components/wallet/     # Wallet-related components
├── hooks/                # Custom hooks for wallet functionality
├── providers/            # Context providers
├── types/               # TypeScript definitions
└── lib/wallet/          # Wallet utilities
```

## Components

### WalletProvider
The core provider component that manages wallet state and provides context to child components.

```typescript
<WalletProvider>
  <App />
</WalletProvider>
```

### WalletButton
A button component that handles wallet connection/disconnection with loading states.

```typescript
<WalletButton />
```

### WalletStatus
Displays current wallet status including:
- Connected address
- Network
- DID
- KYC level

```typescript
<WalletStatus />
```

### WalletErrorBoundary
Catches and handles wallet-related errors gracefully.

```typescript
<WalletErrorBoundary>
  <WalletButton />
</WalletErrorBoundary>
```

### TransactionDemo
A component for testing wallet functionality:
- Message signing
- Transaction signing
- Error handling

```typescript
<TransactionDemo />
```

## Hooks

### useMidnightLace
The primary hook for wallet interactions:

```typescript
const {
  connected,
  address,
  did,
  networkId,
  kycLevel,
  handleConnect,
  handleDisconnect,
  handleSignMessage
} = useMidnightLace();
```

### useWalletMonitor
Monitors wallet state changes and network status:
- Connection changes
- Network changes
- Address updates
- DID updates

```typescript
useWalletMonitor();
```

## Error Handling

The integration includes comprehensive error handling:

1. **WalletErrorBoundary**: Catches and displays wallet errors
2. **Toast Notifications**: User-friendly error messages
3. **Type-safe Error Handling**: Defined error types and messages

## Network Monitoring

Real-time monitoring of:
- Network changes
- Connection status
- Wallet state
- Tab visibility

## TypeScript Support

Full TypeScript support with:
- Type definitions for wallet API
- Interface definitions for state
- Type-safe error handling
- Comprehensive JSDoc documentation

## Usage Examples

### Basic Wallet Connection
```typescript
import { WalletButton } from "@/components/wallet/WalletButton";
import { WalletStatus } from "@/components/wallet/WalletStatus";

export default function App() {
  return (
    <WalletErrorBoundary>
      <WalletButton />
      <WalletStatus />
    </WalletErrorBoundary>
  );
}
```

### Message Signing
```typescript
import { useMidnightLace } from "@/hooks/useMidnightLace";

export default function SignMessage() {
  const { handleSignMessage } = useMidnightLace();

  const signMessage = async () => {
    const message = new TextEncoder().encode("Hello, Midnight!");
    const signature = await handleSignMessage(message);
    console.log("Signature:", signature);
  };

  return <button onClick={signMessage}>Sign Message</button>;
}
```

### Network Monitoring
```typescript
import { useWalletMonitor } from "@/hooks/useWalletMonitor";

export default function App() {
  useWalletMonitor(); // Automatically handles network monitoring
  return <div>Your app content</div>;
}
```
