import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'
import { FadeIn } from '../components/ui/FadeIn'
import { ReviewBadge } from '../components/ui/ReviewBadge'
import { useDebounce } from '../hooks/useDebounce'
import { formatDate, shortenHash } from '../lib/utils'
import { useAppStore } from '../store/useAppStore'

/**
 * Searchable on-chain vault page.
 */
export default function Vault() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const vaultEntries = useAppStore((state) => state.vaultEntries)

  const filteredEntries = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase()
    if (!query) return vaultEntries

    return vaultEntries.filter((entry) => {
      const body = JSON.stringify(entry.content).toLowerCase()
      return entry.summary.toLowerCase().includes(query) || body.includes(query) || entry.storageHash.toLowerCase().includes(query)
    })
  }, [debouncedSearch, vaultEntries])

  return (
    <section className="mx-auto max-w-5xl px-4 pb-24 pt-24 md:px-8 lg:pb-16">
      <h1 className="mb-8 font-display text-3xl leading-tight tracking-tight text-[var(--text-primary)]">Vault</h1>
      <label htmlFor="vault-search" className="sr-only">
        Search your vault
      </label>
      <input
        id="vault-search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search your vault"
        className="mb-8 w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 font-body text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-dim)]"
      />

      {filteredEntries.length === 0 ? (
        <EmptyState
          title="Your vault is empty"
          body="Save your first research session and it will appear here."
          action={
            <Link
              to="/app/research"
              className="rounded-xl bg-[var(--accent)] px-5 py-3 font-body text-sm font-medium text-[var(--bg-primary)] transition-colors hover:bg-[var(--accent-hover)]"
            >
              Start research
            </Link>
          }
        />
      ) : (
        <div>
          {filteredEntries.map((entry, index) => (
            <FadeIn key={entry.id} delay={Math.min(index * 0.04, 0.4)}>
              <article className="flex flex-col gap-3 border-b border-[var(--border-subtle)] py-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="mb-1 font-mono text-xs uppercase text-[var(--accent-dim)]">{entry.type}</p>
                  <h2 className="font-body text-sm leading-snug text-[var(--text-primary)]">{entry.summary}</h2>
                  <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
                    {formatDate(entry.createdAt)} - {shortenHash(entry.storageHash)}
                  </p>
                </div>
                <ReviewBadge status={entry.reviewStatus} />
              </article>
            </FadeIn>
          ))}
        </div>
      )}
    </section>
  )
}
