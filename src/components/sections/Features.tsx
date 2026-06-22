import { motion } from 'framer-motion'

const features = [
  {
    label: 'Research',
    title: 'Challenge your thesis',
    body: 'Run any market setup through the AI before you enter. 0G Compute asks the questions a trading partner would ask.',
  },
  {
    label: 'Vault',
    title: 'Every analysis on-chain',
    body: 'Your full research history stored permanently on 0G Storage. Searchable, immutable, signed by your wallet.',
  },
  {
    label: 'Journal',
    title: 'AI-reviewed signal entries',
    body: 'Log a structured pre-trade entry. The AI reviews your reasoning and returns approved, flagged or rejected.',
  },
  {
    label: 'Recall',
    title: 'Your history, surfaced',
    body: 'When you open a new session the AI retrieves relevant past analyses and brings them into the conversation.',
  },
]

/**
 * Landing feature grid.
 */
export function Features() {
  return (
    <section className="bg-[var(--bg-secondary)] py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <p className="font-body text-xs uppercase tracking-widest text-[var(--text-muted)]">What Argus does</p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '50px' }}
          variants={{ visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } } }}
          className="mt-12 grid gap-4 md:grid-cols-2"
        >
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              variants={{
                hidden: { opacity: 0, filter: 'blur(8px)', y: 20 },
                visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
              }}
              transition={{ duration: 0.7 }}
              className="liquid-glass-dark rounded-2xl p-8 transition-shadow duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
              <p className="mb-4 font-body text-xs uppercase tracking-widest text-[var(--accent-dim)]">
                {feature.label}
              </p>
              <h2 className="mb-3 font-display text-xl text-[var(--text-primary)]">{feature.title}</h2>
              <p className="font-body text-sm leading-relaxed text-[var(--text-secondary)]">{feature.body}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
