# Unity on Midnight - Privacy-Preserving AMM

A decentralized exchange (DEX) built on Midnight that uses zero-knowledge proofs to provide privacy for trades and liquidity pools. This project is part of the AMM Midnight Hackathon.

## Features

- **Private Trading**: Execute trades with privacy using zero-knowledge proofs
- **Hidden Liquidity**: Provide liquidity without revealing your position
- **Midnight Integration**: Built natively on the Midnight network
- **Modern UI**: Beautiful and intuitive interface built with Next.js and shadcn/ui

## Technology Stack

- **Frontend**:
  - Next.js 14 (App Router)
  - TypeScript
  - shadcn/ui components
  - Tailwind CSS
  - Midnight Lace Wallet Integration

- **Smart Contracts**:
  - Midnight's Compact language
  - Zero-knowledge proofs for privacy
  - AMM algorithms for price balancing

## Documentation

- [Getting Started](docs/getting-started.md)
- [Wallet Integration](docs/wallet-integration.md)
- [Smart Contracts](docs/smart-contracts.md)
- [Architecture](docs/architecture.md)
- [Contributing](docs/contributing.md)

## Quick Start

### Prerequisites

1. Install [Node.js](https://nodejs.org/) (v18 or later)
2. Install [Midnight Lace Wallet](https://www.lace.io/)

### Installation

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

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built during the AMM Midnight Hackathon
- Uses Midnight's Compact language for smart contracts
- UI components from shadcn/ui
