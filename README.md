# Argus

Argus is a 0G-native trading research companion built for the 0G Zero Cup 2026.

Before a trader enters a position, they run their thesis through an AI research session. The AI challenges the reasoning, asks direct questions and can reference past analyses from the vault. Sessions and journal entries are stored as permanent vault records with 0G Storage root hashes and block numbers for timestamp proof.

## Built With

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- wagmi and viem
- ethers.js
- Zustand
- 0G Storage SDK
- 0G Compute endpoint support

## Run Locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and fill in the 0G values when you are ready to use live testnet services.

```bash
VITE_ZEROG_RPC=https://evmrpc-testnet.0g.ai
VITE_ZEROG_INDEXER_URL=https://indexer-storage-testnet-standard.0g.ai
VITE_ZEROG_FLOW_ADDRESS=0xbD2C3F0E65eDF5582141C35969d66e34629cC768
VITE_ZEROG_COMPUTE_URL=
VITE_WALLETCONNECT_PROJECT_ID=
```

If a 0G Compute URL or wallet signer is not configured, Argus uses local demo fallbacks so the product flow remains testable during judging rehearsals.

## Demo Flow

1. Open the landing page
2. Enter the app and start a research session
3. Send a thesis and review the AI critique
4. Save the session to the vault
5. Submit a structured journal entry
6. Search the vault and review dashboard stats
