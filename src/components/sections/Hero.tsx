import { motion } from 'framer-motion'
import { BlurText } from '../ui/BlurText'
import { FadeIn } from '../ui/FadeIn'
import { WalletButton } from '../layout/WalletButton'

/**
 * Landing hero with split copy and provided product image.
 */
export function Hero() {
  return (
    <section className="relative grid min-h-screen overflow-hidden lg:grid-cols-2">
      <div className="flex flex-col justify-center bg-[var(--bg-primary)] px-6 py-32 md:px-10 lg:px-16">
        <FadeIn delay={0.4} className="liquid-glass w-fit rounded-full px-4 py-2">
          <span className="mr-3 font-body text-xs font-semibold text-[var(--accent)]">Built on 0G</span>
          <span className="font-body text-sm text-[var(--text-secondary)]">
            Trading research, permanent and on-chain
          </span>
        </FadeIn>
        <BlurText
          text="Every thesis. Every signal. On-chain forever."
          delay={0.5}
          className="mt-8 max-w-2xl font-display text-[clamp(2.8rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em] text-[var(--text-primary)]"
        />
        <FadeIn delay={0.8}>
          <p className="mt-6 max-w-md font-body text-base leading-relaxed text-[var(--text-secondary)]">
            Argus stores your full research history on 0G Storage and uses 0G Compute to challenge your
            reasoning before you trade.
          </p>
        </FadeIn>
        <FadeIn delay={1.1}>
          <div className="mt-8 w-fit">
            <WalletButton label="Connect wallet to start" strong navigateOnConnect />
          </div>
        </FadeIn>
      </div>
      <motion.div
        initial={{ opacity: 0, filter: 'blur(12px)', x: 20 }}
        animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative min-h-[42rem] overflow-hidden lg:min-h-screen"
      >
        <div className="absolute left-1/2 top-1/2 -z-10 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-glow)] blur-[80px]" />
        <img
          src="/images/hero-right.webp"
          alt=""
          width="2752"
          height="1536"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0 hidden lg:block"
          style={{ background: 'linear-gradient(to right, var(--bg-primary) 0%, transparent 35%)' }}
        />
        <div
          className="absolute inset-x-0 top-0 h-24 lg:hidden"
          style={{ background: 'linear-gradient(to bottom, var(--bg-primary) 0%, transparent 90%)' }}
        />
      </motion.div>
    </section>
  )
}
