# Wallet Integration Guide

This guide explains how Unity on Midnight integrates with the Midnight Lace wallet for secure transactions and account management.

## Overview

The Midnight Lace wallet provides a secure way to:
- Connect to the Midnight network
- Manage user addresses and public keys
- Sign and submit transactions
- Generate zero-knowledge proofs

## Integration Details

### Connection Flow

1. The wallet is accessed via `window.midnight.mnLace`
2. Call `enable()` to get the wallet API
3. Use the API to access wallet functionality:
   ```typescript
   const mnLace = window.midnight?.mnLace;
   const api = await mnLace.enable();
   const state = await api.state();
   const address = state.address;
   const publicKey = address.split('|')[1];
   ```

### Available Methods

The wallet API provides several methods for transaction management:

#### State Management
- `state()`: Get the current wallet state including address and public key

#### Transaction Handling
- `balanceAndProveTransaction`: Balance and prove a transaction in one step
- `proveTransaction`: Generate zero-knowledge proofs for a transaction
- `balanceTransaction`: Balance a transaction's inputs and outputs
- `submitTransaction`: Submit a signed transaction to the network

### Address Format

The wallet address is returned in a combined format:
```
<address>|<publicKey>
```

Example:
```
baeb8ea7...797e1ab|03003753...646194
```

### Type Definitions

```typescript
interface WalletState {
  // Address format: <address>|<publicKey>
  address: string;
}

interface WalletAPI {
  balanceAndProveTransaction: (tx: any) => Promise<any>;
  proveTransaction: (tx: any) => Promise<any>;
  balanceTransaction: (tx: any) => Promise<any>;
  submitTransaction: (tx: any) => Promise<string>;
  state: () => Promise<WalletState>;
}

interface MnLaceWallet {
  name: string;
  apiVersion: string;
  enable: () => Promise<WalletAPI>;
  isEnabled: () => Promise<boolean>;
}
```

## Error Handling

Common errors and their solutions:

1. **Wallet Not Found**
   ```typescript
   if (!window.midnight?.mnLace) {
     throw new Error('Midnight Lace wallet not found. Please install the wallet extension.');
   }
   ```

2. **Connection Failed**
   ```typescript
   const isEnabled = await mnLace.isEnabled();
   if (!isEnabled) {
     throw new Error('Failed to connect to Midnight Lace wallet');
   }
   ```

## Best Practices

1. **State Management**
   - Always verify wallet connection before operations
   - Keep wallet state in a central provider
   - Use React context for sharing wallet state

2. **Error Handling**
   - Implement proper error boundaries
   - Provide clear error messages to users
   - Handle network disconnections gracefully

3. **Security**
   - Never store private keys
   - Validate all transaction data
   - Clear sensitive data when disconnecting

## Example Implementation

See our [WalletProvider](../src/providers/WalletProvider.tsx) for a complete implementation example.
