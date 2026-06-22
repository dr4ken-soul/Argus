# Argus — Build Guide

## Hackathon Timeline

| Deadline | Round | Priority |
|---|---|---|
| Jun 23 | Group Stage | First working submission |
| Jun 28 | Round of 32 | Improved build with full vault working |
| Jul 4 | Round of 16 | Polished UI, all five MVP features complete |
| Jul 8 | Final lock | No changes after this date |

Today is Jun 20. You have three days to first submission.

---

## Environment Setup

```bash
npm create vite@latest argus -- --template react-ts
cd argus
npm install
npm install tailwindcss @tailwindcss/vite
npm install framer-motion
npm install wagmi viem @wagmi/core
npm install ethers
npm install @0glabs/0g-ts-sdk
npm install zustand
npm install react-router-dom
npm install lucide-react
npx tailwindcss init -p
```

Create `.env` from `.env.example` and fill in your 0G testnet values before any 0G calls are made.

0G testnet RPC: `https://evmrpc-testnet.0g.ai`
0G testnet indexer: `https://indexer-storage-testnet-standard.0g.ai`
0G Flow contract: `0xbD2C3F0E65eDF5582141C35969d66e34629cC768` (testnet, verify against 0G docs)

---

## Day 1 — Jun 20: Scaffold and Landing Page

**Goal:** A live, deployed landing page that looks complete.

### Step 1: Project scaffold

Set up the folder structure from CLAUDE.md. Configure Tailwind with the design system tokens from FRONTEND_SPEC.md. Add fonts to `index.html`. Add CSS variables and liquid glass classes to `globals.css`. Add noise grain via `body::after`.

### Step 2: Landing nav

Build `Nav.tsx`. Wordmark left ("Argus" in Spectral serif), Connect Wallet button right in liquid-glass style. Fixed at top, floats over hero. No centre links.

```tsx
/**
 * Landing navigation bar.
 * Minimal two-item layout: wordmark left, wallet CTA right.
 */
export function Nav() {
  return (
    <nav className="fixed top-4 inset-x-0 z-50 px-8">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <span className="font-display text-xl text-[var(--text-primary)] tracking-tight">Argus</span>
        <button className="liquid-glass rounded-full px-5 py-2.5 text-sm font-body
          text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
          Connect wallet
        </button>
      </div>
    </nav>
  )
}
```

### Step 3: Hero section

Build `Hero.tsx`. Split layout: copy left, hero image right.

Left side copy stagger sequence:
- Badge chip: delay 0.4s
- Headline (Spectral, large, tight leading): delay 0.5s
- Sub-headline: delay 0.8s
- CTA button: delay 1.1s

Right side: `<img src="/images/hero-right.webp" />` with blur-in entrance. Ambient glow div behind it using `--accent-glow`. Left-side gradient bleeds into right to blend the two halves.

Placeholder the hero image with a `bg-[var(--bg-surface)] rounded-2xl` div until the real image is placed in `public/images/`.

### Step 4: Proof strip

Build `ProofStrip.tsx`. Three stats in IBM Plex Mono: "12,400+ analyses stored", "3,800+ sessions", "0G network live". Scroll-triggered fade-up with Framer Motion `whileInView`.

### Step 5: How it works

Build `HowItWorks.tsx`. Three steps in a horizontal row. Numbers in `--accent-dim`, one sentence per step, no icons. Steps:
1. Connect your wallet and start a research session
2. The AI powered by 0G Compute challenges your thesis and surfaces past patterns
3. Your full exchange is stored permanently on 0G Storage and timestamped on-chain

### Step 6: Features grid

Build `Features.tsx`. Two-by-two grid of dark glass cards. Each card: small label in `--text-muted`, bold short headline in `--text-primary`, two sentences of body in `--text-secondary`. Four features: Research session, On-chain vault, Signal journal, Pattern recall.

### Step 7: Why 0G section

Build `WhyZeroG.tsx`. Three columns. Each column covers one 0G pillar: Compute (AI inference), Storage (permanent vault), Chain (verifiable timestamps). Short paragraph per column explaining how Argus depends on each. This is the "not a bolt-on" section.

### Step 8: CTA footer

Build `CtaFooter.tsx`. Full-width, single headline: "Your research lives on-chain forever." One Connect Wallet button centred below.

### Step 9: Deploy

Deploy to Vercel. Push public repo to GitHub with a basic README covering what Argus is and how to run it locally.

---

## Day 2 — Jun 21: Wallet Connection and 0G Storage

**Goal:** Real wallet connection and a working 0G Storage write and read.

### Step 1: Wagmi config

Set up `src/lib/wallet.ts` with wagmi config. Add WalletConnect and injected connector. Wrap App.tsx with wagmi and query client providers.

```typescript
/**
 * Wagmi configuration for Argus.
 * Supports WalletConnect and browser-injected wallets (MetaMask etc).
 */
import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { walletConnect, injected } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [
    injected(),
    walletConnect({ projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID }),
  ],
  transports: { [mainnet.id]: http() },
})
```

### Step 2: App nav

Build `AppNav.tsx`. Minimal top bar: Argus wordmark left, wallet address displayed as shortened string centre-right, four tab buttons right (Dashboard, Research, Vault, Journal). Active tab underlined in `--accent`. No sidebar.

### Step 3: 0G Storage hook

Build `src/hooks/useZeroGStorage.ts`.

```typescript
/**
 * Hook for reading and writing to 0G Storage.
 * All writes require a connected wallet signer.
 */
export function useZeroGStorage() {
  /**
   * Uploads a session JSON object to 0G Storage.
   * @param data - The session or journal entry to store
   * @param signer - ethers signer from the connected wallet
   * @returns The 0G Storage root hash for permanent reference
   */
  async function upload(data: object, signer: ethers.Signer): Promise<string> {
    // implementation
  }

  /**
   * Retrieves a file from 0G Storage by its root hash.
   * @param rootHash - The hash returned at upload time
   * @returns Parsed JSON content of the stored file
   */
  async function retrieve(rootHash: string): Promise<object> {
    // implementation
  }

  return { upload, retrieve }
}
```

### Step 4: Test the full write-read cycle

Write a test session to 0G Storage from the browser. Retrieve it. Confirm the data matches. This is the most important technical proof for the judges.

### Step 5: Vault page

Build `Vault.tsx`. On connect, retrieve all stored sessions for the wallet address. Display as a timeline list. Each entry shows: date, type (session or journal), brief summary, review status badge. Search input filters by keyword.

---

## Day 3 — Jun 22: Research Page and 0G Compute

**Goal:** A working end-to-end research session with AI.

### Step 1: 0G Compute hook

Build `src/hooks/useZeroGCompute.ts`.

```typescript
/**
 * Hook for calling 0G Compute AI inference.
 */
export function useZeroGCompute() {
  /**
   * Sends a research message to 0G Compute and returns the AI response.
   * @param message - The user's current message in the session
   * @param history - Prior messages in the session for context
   * @param vaultContext - Summaries of relevant past sessions
   * @returns AI response string
   */
  async function query(
    message: string,
    history: Message[],
    vaultContext: VaultEntry[]
  ): Promise<string> {
    // implementation
  }

  return { query }
}
```

### Step 2: Research page

Build `Research.tsx`. Two panels: left is the session input and conversation history, right shows a summary of the current session being built. The AI responds to each message in turn. A "Save to vault" button appears after the first AI response.

Session flow:
1. User types their thesis
2. AI responds via 0G Compute with questions and challenges
3. Conversation continues for as many turns as the user wants
4. User clicks "Save to vault" which triggers the 0G Storage upload
5. Session appears in the vault immediately after

### Step 3: Dashboard page

Build `Dashboard.tsx`. Three stat cards at top using liquid-glass-strong style: total sessions, total journal entries and journal entries pending review. Below: a "Recent sessions" list showing the last five sessions. A large "Start research" button in the centre-top.

### Step 4: Journal page

Build `Journal.tsx`. Structured form: asset ticker input, direction toggle (long or short), entry trigger text area, stop level input, thesis text area, confidence slider one to five. On submit the entry is sent to 0G Compute for AI review, the critique is displayed to the user and the entry plus critique are saved to 0G Storage.

### Step 5: Final checks before submission

- All four app pages working with wallet connected
- 0G Storage writes and reads confirmed working
- 0G Compute returning real AI responses
- Landing page deployed and live
- GitHub repo public with README
- Submission form filled: public repo URL, description, working demo or demo video

---

## Between Rounds: Improvement Windows

**After Jun 23 Group Stage submission (improving for Round of 32, due Jun 28):**
- Polish any rough UI that shipped under time pressure
- Improve AI system prompt quality for more useful research critiques
- Add pattern recall if not shipped in first submission
- Improve vault display with better search and filtering
- Test on multiple wallets and browsers

**After Round of 32 (improving for Round of 16, due Jul 4):**
- Complete all five MVP features to a high standard
- Add loading states and error handling for all 0G calls
- Improve empty states so new users understand what to do
- Add a demo video link to the README

**Final improvements before Jul 8 lock:**
- Community vote preparation: make the landing page screenshot-worthy
- Ensure the demo is clean and reproducible for judges
- Add a clear "Built with 0G" section to both the landing page and README

---

## Common Issues

**0G Storage upload fails:**
Check that the wallet is on the correct testnet chain. The 0G testnet chain ID is 16600. Confirm the Flow contract address matches the current testnet deployment in the 0G docs.

**0G Compute request times out:**
The compute network can have variable latency on testnet. Add a thirty-second timeout and display a clear message to the user if it is exceeded.

**Wallet does not sign:**
Ensure the wagmi chain config matches the 0G testnet. The user must be on chain ID 16600 for storage write transactions to succeed.

**Hero image not appearing:**
Confirm the file is at `public/images/hero-right.webp`. Vite serves the public folder at the root, so the src path in the img tag is `/images/hero-right.webp`.
