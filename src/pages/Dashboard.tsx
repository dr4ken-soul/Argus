import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'
import { ReviewBadge } from '../components/ui/ReviewBadge'
import { formatDate } from '../lib/utils'
import { useAppStore } from '../store/useAppStore'

/**
 * Research dashboard page.
 */
export default function Dashboard() {
  const vaultEntries = useAppStore((state) => state.vaultEntries)
  const sessions = vaultEntries.filter((entry) => entry.type === 'session')
  const journals = vaultEntries.filter((entry) => entry.type === 'journal')
  const pending = journals.filter((entry) => entry.reviewStatus === 'flagged').length
  const recent = vaultEntries.slice(0, 5)

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 pt-24 md:px-8 lg:pb-16">
      <div className="mb-12 grid gap-4 md:grid-cols-3">
        <StatCard label="Sessions" value={sessions.length} sub="total stored on 0G" />
        <StatCard label="Journal entries" value={journals.length} sub="total submitted" />
        <StatCard label="Pending review" value={pending} sub="awaiting AI critique" />
      </div>

      <Link
        to="/app/research"
        className="inline-flex w-full justify-center rounded-xl bg-[var(--accent)] px-6 py-3 font-body text-sm font-medium text-[var(--bg-primary)] transition-colors hover:bg-[var(--accent-hover)] md:w-auto"
      >
        Start research
      </Link>

      <div className="mt-12">
        <h1 className="mb-4 font-body text-sm uppercase tracking-widest text-[var(--text-muted)]">Recent sessions</h1>
        {recent.length === 0 ? (
          <EmptyState
            title="No sessions yet"
            body="Start your first research session above and your analysis will appear here."
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
            {recent.map((entry) => (
              <article
                key={entry.id}
                className="flex flex-col gap-3 border-b border-[var(--border-subtle)] py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-mono text-xs text-[var(--text-muted)]">{formatDate(entry.createdAt)}</p>
                  <p className="mt-1 max-w-3xl font-body text-sm text-[var(--text-primary)]">{entry.summary}</p>
                </div>
                <ReviewBadge status={entry.reviewStatus} />
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

interface StatCardProps {
  label: string
  value: number
  sub: string
}

/**
 * Displays a dashboard statistic.
 */
function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <article className="liquid-glass-strong rounded-2xl p-6">
      <p className="mb-2 font-body text-xs uppercase tracking-widest text-[var(--text-muted)]">{label}</p>
      <p className="mb-1 font-display text-4xl leading-none tracking-tight text-[var(--text-primary)]">{value}</p>
      <p className="font-body text-xs text-[var(--text-secondary)]">{sub}</p>
    </article>
  )
}
