import { FadeIn } from '../ui/FadeIn'

const steps = [
  {
    title: 'Connect your wallet',
    body: 'Open Argus and connect your wallet. Your research history is tied to your address and lives on 0G Storage.',
  },
  {
    title: 'Run your thesis through the AI',
    body: 'Describe your setup. The AI powered by 0G Compute challenges your reasoning, asks questions and surfaces similar past analyses from your vault.',
  },
  {
    title: 'Your research lives on-chain',
    body: 'Every session is stored permanently on 0G Storage with a verifiable on-chain timestamp. Nothing is lost. Nothing can be changed.',
  },
]

/**
 * Landing explanation section.
 */
export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <p className="mb-12 font-body text-xs uppercase tracking-widest text-[var(--text-muted)]">How it works</p>
        <div className="grid gap-12 lg:grid-cols-3">
          {steps.map((step, index) => (
            <FadeIn key={step.title} delay={index * 0.15}>
              <article>
                <p className="mb-4 font-mono text-xs text-[var(--accent-dim)]">0{index + 1}</p>
                <h2 className="mb-2 font-display text-xl text-[var(--text-primary)]">{step.title}</h2>
                <p className="font-body text-sm leading-relaxed text-[var(--text-secondary)]">{step.body}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
