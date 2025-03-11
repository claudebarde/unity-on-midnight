# Contributing to Unity on Midnight

Thank you for your interest in contributing to Unity on Midnight! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our Code of Conduct.

## Development Process

### 1. Setting Up Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/unity-on-midnight.git
   ```
3. Install dependencies:
   ```bash
   cd unity-on-midnight
   npm install
   ```
4. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### 2. Making Changes

1. Follow our coding standards:
   - Use TypeScript
   - Follow ESLint configuration
   - Use Prettier for formatting
   - Write meaningful commit messages

2. Testing:
   - Write unit tests for new features
   - Ensure all tests pass
   - Add integration tests if needed
   - Test wallet integration thoroughly

3. Documentation:
   - Update relevant documentation
   - Add JSDoc comments to functions
   - Update README if needed
   - Document any new wallet features

### 3. Submitting Changes

1. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a Pull Request:
   - Use a clear PR title
   - Describe your changes
   - Reference any related issues
   - Include screenshots if UI changes

## Project Structure

```
unity-on-midnight/
├── src/
│   ├── app/           # Next.js pages
│   ├── components/    # React components
│   ├── providers/     # Context providers
│   ├── hooks/         # Custom hooks
│   ├── types/         # TypeScript types
│   └── utils/         # Helper functions
├── docs/             # Documentation
├── public/           # Static assets
└── tests/            # Test files
```

## Coding Standards

### TypeScript

```typescript
// Use interfaces for object types
interface UserData {
  address: string;
  balance: number;
}

// Use type for unions/intersections
type TransactionStatus = 'pending' | 'confirmed' | 'failed';

// Use meaningful names
const handleTransactionSubmit = async () => {
  // Implementation
};
```

### React Components

```typescript
// Use functional components
const TransactionForm: React.FC<Props> = ({ onSubmit }) => {
  // Implementation
};

// Use hooks for state
const [isLoading, setIsLoading] = useState(false);

// Use custom hooks for reusable logic
const { connect, disconnect } = useWallet();
```

### Error Handling

```typescript
try {
  await submitTransaction(tx);
} catch (error) {
  handleError(error);
  showErrorToast('Transaction failed');
}
```

## Testing

### Unit Tests

```typescript
describe('WalletProvider', () => {
  it('should connect to wallet', async () => {
    // Test implementation
  });

  it('should handle connection errors', async () => {
    // Test implementation
  });
});
```

### Integration Tests

```typescript
describe('Wallet Integration', () => {
  it('should complete transaction flow', async () => {
    // Test implementation
  });
});
```

## Common Tasks

### Adding a New Feature

1. Create feature branch
2. Implement feature
3. Add tests
4. Update documentation
5. Submit PR

### Fixing a Bug

1. Create bug fix branch
2. Add test case for bug
3. Fix bug
4. Verify fix
5. Submit PR

### Updating Documentation

1. Update relevant .md files
2. Update code comments
3. Update type definitions
4. Submit PR

## Getting Help

- Check existing issues
- Join our Discord channel
- Read our documentation
- Ask in our discussions

## Review Process

1. Code review by maintainers
2. Automated tests must pass
3. Documentation must be updated
4. Changes must follow guidelines

Thank you for contributing to Unity on Midnight!
