import { create } from 'zustand'
import type { VaultEntry } from '../types'

const vaultKey = 'argus:vault'

interface AppStore {
  vaultEntries: VaultEntry[]
  hydrateVault: () => void
  addVaultEntry: (entry: VaultEntry) => void
}

/**
 * Loads vault rows from local storage.
 */
function readVault(): VaultEntry[] {
  const raw = localStorage.getItem(vaultKey)
  if (!raw) return []

  try {
    return JSON.parse(raw) as VaultEntry[]
  } catch {
    return []
  }
}

/**
 * Persists vault rows to local storage for immediate demo continuity.
 */
function writeVault(entries: VaultEntry[]): void {
  localStorage.setItem(vaultKey, JSON.stringify(entries))
}

export const useAppStore = create<AppStore>((set, get) => ({
  vaultEntries: [],
  hydrateVault: () => {
    set({ vaultEntries: readVault() })
  },
  addVaultEntry: (entry) => {
    const entries = [entry, ...get().vaultEntries.filter((item) => item.id !== entry.id)]
    writeVault(entries)
    set({ vaultEntries: entries })
  },
}))
