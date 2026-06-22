import { FadeIn } from '../ui/FadeIn'

const pillars = [
  {
    label: '0G Compute',
    title: 'AI inference',
    body: 'Every AI response in Argus runs on the 0G decentralised compute network. There is no centralised API in the intended production path. The inference is on-chain and verifiable.',
  },
  {
    label: '0G Storage',
    title: 'Permanent vault',
    body: 'Every research session and journal entry is stored as a file on 0G Storage, signed by your wallet. The root hash is your permanent proof of when the analysis was created.',
  },
  {
    label: '0G Chain',
    title: 'Verifiable timestamps',
    body: 'Every upload is timestamped on-chain at the block level. Your research history is not just stored, it is provably ordered in time.',
  },
]

/**
 * Judge-facing 0G infrastructure proof section.
 */
export function WhyZeroG() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <p className="font-body text-xs uppercase tracking-widest text-[var(--text-muted)]">Why 0G</p>
        <h2 className="mb-16 mt-3 max-w-lg font-display text-3xl text-[var(--text-primary)]">
          0G is not a feature. It is the infrastructure Argus is built on.
        </h2>
        <div className="grid gap-8 lg:grid-cols-3">
          {pillars.map((pillar, index) => (
            <FadeIn key={pillar.label} delay={index * 0.12}>
              <article>
                <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--accent-dim)]">
                  {pillar.label}
                </p>
                <h3 className="mb-4 font-display text-xl text-[var(--text-primary)]">{pillar.title}</h3>
                <div className="mb-6 h-px w-8 bg-[var(--border-default)]" />
                <p className="font-body text-sm leading-relaxed text-[var(--text-secondary)]">{pillar.body}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
