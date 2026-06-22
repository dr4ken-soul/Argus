interface ReviewBadgeProps {
  status?: 'approved' | 'flagged' | 'rejected'
}

/**
 * Displays a text status badge for AI-reviewed journal entries.
 */
export function ReviewBadge({ status }: ReviewBadgeProps) {
  if (!status) return null

  const className =
    status === 'approved'
      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
      : status === 'flagged'
        ? 'border-amber-500/20 bg-amber-500/10 text-amber-400'
        : 'border-red-500/20 bg-red-500/10 text-red-400'

  return (
    <span className={`rounded-full border px-3 py-1 font-body text-xs capitalize ${className}`}>
      {status}
    </span>
  )
}
