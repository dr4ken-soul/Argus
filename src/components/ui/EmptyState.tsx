import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  body: string
  action?: ReactNode
}

/**
 * Shared empty state block for app pages.
 */
export function EmptyState({ title, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-default)] p-10 text-center md:p-16">
      <h2 className="font-display text-xl text-[var(--text-secondary)]">{title}</h2>
      <p className="mt-3 max-w-md font-body text-sm text-[var(--text-muted)]">{body}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
