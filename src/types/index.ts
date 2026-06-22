export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface ResearchSession {
  id: string
  walletAddress: string
  createdAt: number
  blockNumber: number
  thesis: string
  messages: Message[]
  storageHash: string
  patternMatches: string[]
}

export interface JournalEntry {
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

export interface VaultEntry {
  id: string
  type: 'session' | 'journal'
  createdAt: number
  summary: string
  storageHash: string
  reviewStatus?: 'approved' | 'flagged' | 'rejected'
  content: ResearchSession | JournalEntry
}
