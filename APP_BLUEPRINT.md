# Argus — App Blueprint

## Product Summary

Argus is a 0G-native trading research companion. Every market thesis, signal log and AI exchange a trader produces is stored permanently on 0G Storage with a verifiable on-chain timestamp. Before any trade, the user runs their setup through an AI research session powered by 0G Compute. The AI challenges the reasoning, surfaces similar past analyses from the vault and flags weak logic. The result is a permanent, searchable record of every research decision a trader has ever made, stored on decentralised infrastructure that no one can modify or delete.

The product is built for the 0G Labs Zero Cup hackathon (Jun 15 to Jul 19 2026). 0G does real work in all three pillars: Compute powers the AI inference, Storage holds the permanent vault, Chain provides the verifiable timestamps. Remove 0G and the product does not function.

---

## Market Context

**Who pays for this:**

1. Active crypto traders who make discretionary decisions and want to build a disciplined research process
2. Portfolio managers at small funds who need an auditable record of investment thesis creation
3. DeFi power users who trade across multiple protocols and lose track of why they entered positions

**What they currently use:** Trading journals in Notion or Obsidian with no AI review layer and no on-chain permanence. AI trading bots that execute without explanation. Discord signal groups with no personal thesis tracking.

**Why they switch:** Their current tools do not challenge their reasoning before they trade. Their notes live in centralised tools that can be lost or modified. There is no proof of when an analysis was created, which matters for accountability and for learning from past decisions.

**TAM estimate:** The discretionary crypto trader market is estimated at 25 to 30 million active traders globally. At any SaaS price point above free, the SAM of engaged, research-oriented traders is roughly 2 to 3 million. Year-one SOM with a well-executed hackathon submission and 0G ecosystem distribution is realistically 5,000 to 15,000 registered users.

---

## MVP Feature Set

### Feature 1: Research Session

**User story:** As a trader I want to describe my current market thesis to an AI so that it challenges my reasoning and helps me identify weaknesses before I enter a position.

**How it works:** The user opens the Research page, connects their wallet if not already connected, and types their thesis or setup into the session input. The AI powered by 0G Compute responds with clarifying questions, counterarguments and risk factors the user may not have considered. The exchange continues until the user ends the session. The full session is then stored to 0G Storage, signed by the user's wallet.

**Acceptance criteria:** User can start a session, receive AI responses within five seconds, continue the conversation for multiple turns and save the session to the vault with one action.

**Complexity:** Medium

---

### Feature 2: On-Chain Vault

**User story:** As a trader I want every research session permanently stored on 0G Storage so that I have a tamper-proof, searchable record of every analysis I have ever made.

**How it works:** After a session ends, the client calls the 0G Storage SDK to upload the session as a ZgFile. The user's wallet signs the upload transaction. The returned root hash is stored locally as the permanent reference to that session. The Vault page queries 0G Storage to retrieve and display all past sessions linked to the connected wallet.

**Acceptance criteria:** Sessions appear in the vault within thirty seconds of being saved. Each entry shows the date, thesis summary and AI review status. The vault is read-only; entries cannot be deleted or modified.

**Complexity:** Medium

---

### Feature 3: Signal Journal

**User story:** As a trader I want to log a structured pre-trade entry before I enter a position so that the AI can review my reasoning and flag anything weak.

**How it works:** The Journal page provides a structured form: asset, direction (long or short), entry trigger, stop loss level, thesis summary in free text and confidence rating from one to five. On submission the AI (0G Compute) reviews the entry against common reasoning errors, returns a written critique and an overall review status of approved, flagged or rejected. The entry and the AI critique are stored together on 0G Storage.

**Acceptance criteria:** User can complete the journal form, receive an AI critique within ten seconds and see the entry appear in the vault with its review status displayed.

**Complexity:** Medium

---

### Feature 4: Pattern Recall

**User story:** As a trader I want the AI to surface relevant past analyses from my vault when I start a new research session so that I can learn from my own history.

**How it works:** When a new research session begins, the client retrieves recent vault entries from 0G Storage and sends a summary of them alongside the new session prompt to 0G Compute. The AI references relevant past analyses in its response, noting when the current setup resembles a previous one and what the outcome was if the user logged it.

**Acceptance criteria:** The AI references at least one past analysis in the first response of any new session where relevant history exists. If no relevant history exists the AI begins the session normally without a forced reference.

**Complexity:** Low (once vault retrieval works, the pattern recall is a prompt engineering addition)

---

### Feature 5: Research Dashboard

**User story:** As a trader I want a single view of my full research history so that I can track my activity and quickly find past analyses.

**How it works:** The Dashboard page shows a timeline of all past sessions and journal entries retrieved from 0G Storage. A search input filters by keyword across session content. Three stat cards show total sessions, total journal entries and pending AI reviews.

**Acceptance criteria:** Dashboard loads and displays all vault entries within three seconds. Search returns results within one second of typing. Stats are accurate and update when new sessions are saved.

**Complexity:** Low

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript | Fast build, excellent TypeScript support, standard for dApp frontends |
| Styling | Tailwind CSS v3 | Utility-first, no runtime overhead, pairs cleanly with Framer Motion |
| Animations | Framer Motion | Production-grade entrance animations, stagger support, blur-in transitions |
| Wallet | wagmi v2 + viem | Industry standard for EVM wallet connection, well-maintained, pairs with ethers.js |
| 0G Storage | @0glabs/0g-ts-sdk | Official 0G SDK for file upload and retrieval |
| 0G Compute | 0G Compute REST API | Decentralised AI inference, required by hackathon |
| Chain | ethers.js v6 | Transaction signing and on-chain reads |
| State | Zustand | Lightweight global state, no boilerplate, works cleanly with hooks |
| Routing | React Router v6 | Standard SPA routing |
| Icons | Lucide React | Clean outline icons, tree-shakeable |

No backend server for MVP. All 0G interactions happen client-side, signed by the connected wallet.

---

## 0G Integration Detail

### 0G Storage

Every research session and journal entry is serialised to JSON and uploaded as a ZgFile using the 0G TypeScript SDK. The upload is signed by the user's connected wallet. The returned root hash is the permanent, immutable reference to that file on the 0G network.

```typescript
/**
 * Uploads a research session to 0G Storage.
 * @param session - The completed session object to persist
 * @param signer - The ethers signer from the connected wallet
 * @returns The root hash of the stored file
 */
async function uploadSession(session: ResearchSession, signer: ethers.Signer): Promise<string> {
  const content = JSON.stringify(session)
  const file = new ZgFile(Buffer.from(content), session.id + '.json', 'application/json')
  const [tree, err] = await file.merkleTree()
  if (err) throw new Error('Failed to build Merkle tree')
  const indexer = new Indexer(process.env.VITE_ZEROG_INDEXER_URL!)
  const [tx, uploadErr] = await indexer.upload(file, signer)
  if (uploadErr) throw new Error('0G Storage upload failed')
  return tree.rootHash()
}
```

### 0G Compute

The AI research session calls the 0G Compute API, which runs decentralised LLM inference. The prompt includes the user's current thesis and a summary of relevant past sessions retrieved from the vault.

```typescript
/**
 * Sends a research prompt to 0G Compute and returns the AI response.
 * @param prompt - The user's current thesis or question
 * @param context - Relevant past sessions to include as context
 * @returns The AI critique and follow-up questions
 */
async function queryCompute(prompt: string, context: VaultEntry[]): Promise<string> {
  const systemPrompt = buildSystemPrompt(context)
  const response = await fetch(`${import.meta.env.VITE_ZEROG_COMPUTE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system: systemPrompt, message: prompt }),
  })
  if (!response.ok) throw new Error('0G Compute request failed')
  const data = await response.json()
  return data.content
}
```

### On-Chain timestamps

Every stored session includes the block number at the time of upload, retrieved via ethers.js, providing a verifiable on-chain timestamp that proves when the analysis was created.

---

## App Pages and Routes

| Route | Page | Description |
|---|---|---|
| `/` | Landing | Marketing landing page. Wallet connection not required |
| `/app` | Dashboard | Overview of all sessions and vault stats. Wallet required |
| `/app/research` | Research | Live AI research session. Wallet required |
| `/app/vault` | Vault | Searchable on-chain session history. Wallet required |
| `/app/journal` | Journal | Structured signal log with AI review. Wallet required |

---

## Environment Variables

```
VITE_ZEROG_RPC=
VITE_ZEROG_INDEXER_URL=
VITE_ZEROG_FLOW_ADDRESS=
VITE_ZEROG_COMPUTE_URL=
VITE_WALLETCONNECT_PROJECT_ID=
```

---

## Data Structures

```typescript
interface ResearchSession {
  id: string                 // uuid
  walletAddress: string
  createdAt: number          // unix timestamp
  blockNumber: number        // on-chain block at upload time
  thesis: string             // the user's opening thesis
  messages: Message[]        // full AI exchange
  storageHash: string        // 0G Storage root hash
  patternMatches: string[]   // ids of related past sessions
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface JournalEntry {
  id: string
  walletAddress: string
  createdAt: number
  blockNumber: number
  asset: string
  direction: 'long' | 'short'
  entryTrigger: string
  stopLevel: string
  thesis: string
  confidence: 1 | 2 | 3 | 4 | 5
  aiReview: string
  reviewStatus: 'approved' | 'flagged' | 'rejected'
  storageHash: string
}

interface VaultEntry {
  id: string
  type: 'session' | 'journal'
  createdAt: number
  summary: string
  storageHash: string
  reviewStatus?: 'approved' | 'flagged' | 'rejected'
}
```

---

## What Is Not Being Built in MVP

- Automated trade execution or signals
- Price feeds or real-time market data
- Portfolio tracking or P&L display
- Social features or shared research
- Multi-wallet or multi-user support
- PDF export
- Mobile app
- Notification system

These are deferred until after the hackathon if the product gains traction.

---

## Hackathon Build Priority

The first deadline is Jun 23 2026 (Group Stage). The judges score against: AI-native use of 0G, working demo, quality of build, originality.

Priority order for first submission:
1. Landing page live and deployed
2. Wallet connection working
3. 0G Storage write and read working with a real session
4. 0G Compute returning AI responses for a research prompt
5. Research page functional end-to-end
6. Vault displaying stored sessions

Everything else ships in the improvement window before subsequent deadlines.
