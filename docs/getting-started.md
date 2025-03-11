# Getting Started

This guide will help you set up Unity on Midnight for local development.

## Prerequisites

1. **Node.js**: Version 18 or later
2. **Midnight Lace Wallet**: Get it from [lace.io](https://www.lace.io/)
3. **Git**: For version control

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/unity-on-midnight.git
cd unity-on-midnight
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser

## Project Structure

```
unity-on-midnight/
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   ├── providers/     # Context providers
│   ├── types/         # TypeScript definitions
│   └── utils/         # Helper functions
├── public/           # Static assets
├── docs/            # Documentation
└── contracts/       # Midnight smart contracts
```

## Development Workflow

1. Create a new branch for your feature
2. Make your changes
3. Run tests: `npm test`
4. Submit a pull request

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run test`: Run tests
- `npm run lint`: Run linter

## Next Steps

- Read about our [wallet integration](wallet-integration.md)
- Learn about our [smart contracts](smart-contracts.md)
- Understand our [architecture](architecture.md)
- See how to [contribute](contributing.md)
