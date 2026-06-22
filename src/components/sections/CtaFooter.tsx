import { FadeIn } from '../ui/FadeIn'
import { WalletButton } from '../layout/WalletButton'

/**
 * Landing call-to-action footer.
 */
export function CtaFooter() {
  return (
    <section className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-24 md:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 text-center md:px-8">
        <FadeIn delay={0.2}>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight text-[var(--text-primary)]">
            Your research lives on-chain forever.
          </h2>
        </FadeIn>
        <FadeIn delay={0.5}>
          <WalletButton label="Connect wallet" strong navigateOnConnect />
        </FadeIn>
      </div>
      <div className="mx-auto mt-16 flex max-w-6xl items-center justify-between border-t border-[var(--border-subtle)] px-6 pt-8 md:px-8">
        <p className="font-display text-sm text-[var(--text-muted)]">Argus</p>
        <p className="font-body text-xs text-[var(--text-muted)]">Built for the 0G Zero Cup 2026</p>
      </div>
    </section>
  )
}
