import { FadeIn } from '../ui/FadeIn'

const stats = ['12,400+ analyses stored', '3,800+ sessions', '0G network live']

/**
 * Horizontal proof strip below the landing hero.
 */
export function ProofStrip() {
  return (
    <section className="border-y border-[var(--border-subtle)] py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 md:flex-row md:items-center md:justify-between md:px-8">
        {stats.map((stat, index) => (
          <div key={stat} className="flex items-center gap-6">
            <FadeIn delay={index * 0.1}>
              <p className="font-mono text-sm text-[var(--text-muted)]">{stat}</p>
            </FadeIn>
            {index < stats.length - 1 ? <span className="hidden h-4 w-px bg-[var(--border-default)] md:block" /> : null}
          </div>
        ))}
      </div>
    </section>
  )
}
