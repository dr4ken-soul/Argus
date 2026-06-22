# Argus — Codex Context

## What This Is

Argus is a 0G-native trading research companion that turns every market thesis and signal into a permanent on-chain record, with decentralised AI that challenges your reasoning before you trade.

Built for the 0G Labs Zero Cup hackathon, Jun 15 to Jul 19 2026. First submission deadline: Jun 23 2026.

---

## One-Line Pitch

Argus is a 0G-native trading research companion that turns every market thesis and signal into a permanent on-chain record, with decentralised AI that challenges your reasoning before you trade.

---

## MVP Features

1. Research session — chat with an AI powered by 0G Compute that asks probing questions, challenges your thesis and stress-tests your reasoning on any setup
2. On-chain vault — every session, note and AI exchange stored permanently on 0G Storage with a timestamp and searchable history
3. Signal journal — log pre-trade thesis in structured form; the AI reviews it and flags weak reasoning before entry
4. Pattern recall — when a new research session opens the AI surfaces relevant past analyses from the vault that match the current setup
5. Research dashboard — a timeline view of full on-chain history with search across all sessions

Post-MVP: automated signal alerts, social sharing of anonymised research, multi-wallet support, export to PDF.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| Wallet connection | wagmi v2 + viem |
| 0G Storage | @0glabs/0g-ts-sdk |
| 0G Compute | 0G Compute API (REST) |
| Chain interaction | ethers.js v6 |
| State management | Zustand |
| Routing | React Router v6 |
| Icons | Lucide React |

No backend server is required for MVP. All writes go to 0G Storage directly from the client, signed by the connected wallet.

---

## Project Structure

```
argus/
├── public/
│   └── images/
│       └── hero-right.webp          (hero image — user provides)
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── FadeIn.tsx
│   │   │   ├── BlurText.tsx
│   │   │   └── GrainOverlay.tsx
│   │   ├── layout/
│   │   │   ├── Nav.tsx
│   │   │   └── AppNav.tsx
│   │   └── sections/
│   │       ├── Hero.tsx
│   │       ├── ProofStrip.tsx
│   │       ├── HowItWorks.tsx
│   │       ├── Features.tsx
│   │       ├── WhyZeroG.tsx
│   │       └── CtaFooter.tsx
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Research.tsx
│   │   ├── Vault.tsx
│   │   └── Journal.tsx
│   ├── hooks/
│   │   ├── useZeroGStorage.ts
│   │   ├── useZeroGCompute.ts
│   │   └── useResearchSession.ts
│   ├── lib/
│   │   ├── zeroG.ts                 (0G SDK config and helpers)
│   │   ├── wallet.ts                (wagmi config)
│   │   └── utils.ts
│   ├── store/
│   │   └── useAppStore.ts           (Zustand global state)
│   ├── types/
│   │   └── index.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── .env.example
```

---

## Design System

All design decisions are confirmed. Do not deviate from these values.

**Aesthetic:** Dark editorial

**Fonts:**
- Display: Spectral (serif, screen-optimised)
- Body: IBM Plex Sans
- Mono: IBM Plex Mono

Load via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

**Colour palette — Signal Indigo:**
```css
--bg-primary:     #08090f;
--bg-secondary:   #0d0e18;
--bg-surface:     #12141f;
--bg-elevated:    #181a28;
--accent:         #c8d0e8;
--accent-hover:   #e2e8f8;
--accent-glow:    rgba(200, 208, 232, 0.08);
--accent-dim:     #6168a8;
--text-primary:   #e4e8f2;
--text-secondary: #7880a0;
--text-muted:     #3c4260;
--border-subtle:  rgba(255, 255, 255, 0.04);
--border-default: rgba(255, 255, 255, 0.08);
```

**Nav:**
- Landing: minimal two-item top bar. Argus wordmark left, Connect Wallet right. No centre links
- App interior: minimal top bar only. Logo and wallet status left, four tab links right. No sidebar

**Background:**
- Landing hero: premium static image (hero-right.webp) in split layout, image fills right half, copy sits on left dark background
- App interior: static atmospheric. Near-black base with faint grain and subtle radial glow. No motion

**Liquid glass classes** (defined in globals.css, not in Tailwind):
```
.liquid-glass
.liquid-glass-strong
.liquid-glass-dark
```

**Noise grain** (applied via body::after pseudo-element in globals.css):
```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 128px 128px;
  opacity: 0.035;
}
```

---

## Landing Page Sections (in order)

1. Hero — full viewport, split layout. Copy left, hero image right. Minimal two-item nav floats at top
2. Proof strip — narrow horizontal band. Three numbers: total analyses stored, total sessions, 0G network status
3. How it works — three steps horizontal. Numbered, one sentence each. Scroll-triggered fade-up
4. Features — four cards in a two-by-two grid. Dark surface panels, headline and two lines of body copy each
5. Why 0G — three columns for Compute, Storage and Chain. Explains how each does real work inside Argus
6. CTA footer — full-width dark section. Single large headline, one Connect Wallet button

## App Interior Pages

- `/app` — dashboard: recent sessions, vault stats, quick-start button
- `/app/research` — active AI research session powered by 0G Compute
- `/app/vault` — searchable on-chain history from 0G Storage
- `/app/journal` — signal journal entries with AI review status per entry

---

## 0G Integration

**0G Storage (writes require wallet signature):**
```typescript
import { ZgFile, Indexer } from '@0glabs/0g-ts-sdk'

// Every research session and journal entry is stored as a ZgFile
// The user's wallet signs the upload transaction
// The returned root hash is the permanent on-chain reference
```

**0G Compute (AI inference):**
```typescript
// POST to 0G Compute API endpoint with the user's research prompt
// Returns streaming AI response
// The full exchange is stored to 0G Storage after each session ends
```

**Environment variables:**
```
VITE_ZEROG_RPC=
VITE_ZEROG_INDEXER_URL=
VITE_ZEROG_FLOW_ADDRESS=
VITE_ZEROG_COMPUTE_URL=
VITE_WALLETCONNECT_PROJECT_ID=
```

---

## Code Rules (follow without exception)

**TypeScript / React:**
- camelCase for all variables and functions
- JSDoc comments on every function and custom hook
- No inline styles unless a CSS variable or dynamic value requires it. Use Tailwind for layout and spacing
- CSS variables from the design system used directly in style props or globals.css, never hardcoded hex values in components
- No hardcoded placeholder logos, favicons or icon symbols. Logo and favicon are provided by the user and placed in public/. Reference them only via src path
- No AI-generated icon symbols or emoji used as visual accents anywhere

**Writing rules (apply to all frontend copy, labels, comments, dashboard text):**
- British English throughout
- No em dashes anywhere
- Periods only when necessary
- Commas only when necessary
- Short direct sentences that flow naturally
- No filler phrases: no "seamlessly", "leverage", "powerful", "robust", "cutting-edge", "unlock"
- Dashboard labels are short and precise: "Sessions", "Vault entries", "Last analysis", "AI reviews pending"
- CTA text is direct: "Start research", "Connect wallet", "Open vault", "Review signal"
- Error messages are plain and helpful: "Could not connect to 0G Storage. Check your wallet connection and try again"
- Empty states are honest: "No sessions yet. Start your first research session above"

**Component rules:**
- CSS class-based hover states only. No inline JS onMouseEnter or onMouseLeave handlers
- Framer Motion for all entrance animations. No CSS animation keyframes for entrance effects
- Blur-in entrance animations: `initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}` with `animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}`
- Stagger sequences via Framer Motion `staggerChildren` on container, `delayChildren` for offset
- Loading states use skeleton shimmer, not spinners

**Never do these:**
- Never add a logo, favicon or brand mark that the user has not provided
- Never hardcode wallet addresses
- Never write on-chain before the transaction confirms
- Never use `console.log` in production paths. Use a `logger` utility if logging is needed

---

## Hackathon Checklist

- Project name: Argus
- Hackathon: 0G Labs Zero Cup
- Track: AI-native apps using 0G storage, compute or chain
- First submission deadline: Jun 23 2026 (Group Stage)
- Final lock: Jul 8 2026 (no changes after this)
- Public repo required with working demo or demo video
- 0G must do real work: Storage for vault, Compute for AI, Chain for timestamps
- Demo must show all three 0G pillars in use
