import type { JournalEntry, ResearchSession, VaultEntry } from '../types'

/**
 * Builds a stable id for client-created records.
 */
export function createId(): string {
  if (crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

/**
 * Shortens a wallet address or storage hash for display.
 */
export function shortenHash(value?: string, head = 6, tail = 4): string {
  if (!value) return 'Not connected'
  if (value.length <= head + tail) return value
  return `${value.slice(0, head)}...${value.slice(-tail)}`
}

/**
 * Formats a timestamp for compact app rows.
 */
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(timestamp))
}

/**
 * Turns a stored record into a vault row.
 */
export function toVaultEntry(record: ResearchSession | JournalEntry, type: 'session' | 'journal'): VaultEntry {
  const summary =
    type === 'session'
      ? (record as ResearchSession).thesis
      : `${(record as JournalEntry).asset.toUpperCase()} ${(record as JournalEntry).direction} - ${
          (record as JournalEntry).thesis
        }`

  return {
    id: record.id,
    type,
    createdAt: record.createdAt,
    summary,
    storageHash: record.storageHash,
    reviewStatus: type === 'journal' ? (record as JournalEntry).reviewStatus : undefined,
    content: record,
  }
}

/**
 * Returns a deterministic demo hash when 0G is not configured.
 */
export async function createLocalRootHash(content: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(content))
  const bytes = Array.from(new Uint8Array(digest))
  return `0x${bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')}`
}

/**
 * Creates a short session summary from chat messages.
 */
export function summariseMessages(messages: { content: string }[]): string {
  const first = messages[0]?.content ?? 'Untitled research session'
  return first.length > 120 ? `${first.slice(0, 117)}...` : first
}
