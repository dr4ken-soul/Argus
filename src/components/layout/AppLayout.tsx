import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { AppNav } from './AppNav'
import { WalletButton } from './WalletButton'

const routeOrder = ['/app', '/app/research', '/app/vault', '/app/journal']

/**
 * Shared layout for app interior routes.
 */
export function AppLayout() {
  const { isConnected } = useAccount()
  const location = useLocation()
  const outlet = useOutlet()
  const previousIndex = useRef(routeOrder.indexOf(location.pathname))
  const currentIndex = routeOrder.indexOf(location.pathname)
  const direction = currentIndex >= previousIndex.current ? 1 : -1

  useEffect(() => {
    previousIndex.current = currentIndex
  }, [currentIndex])

  return (
    <div className="app-bg min-h-screen">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <AppNav />
      <main id="main-content">
        {!isConnected ? (
          <section className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
            <p className="font-body text-xs uppercase tracking-widest text-[var(--text-muted)]">Wallet required</p>
            <h1 className="mt-4 font-display text-4xl leading-tight tracking-tight text-[var(--text-primary)]">
              Connect your wallet to open Argus
            </h1>
            <p className="mt-4 max-w-lg font-body text-sm leading-relaxed text-[var(--text-secondary)]">
              Your dashboard, vault and journal are tied to your wallet address. Connect first and Argus will open
              the dashboard.
            </p>
            <div className="mt-8">
              <WalletButton label="Connect wallet" strong navigateOnConnect />
            </div>
          </section>
        ) : (
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={location.pathname}
              custom={direction}
              variants={{
                enter: (travelDirection: number) => ({
                  x: travelDirection > 0 ? 40 : -40,
                  opacity: 0,
                  filter: 'blur(6px)',
                }),
                centre: { x: 0, opacity: 1, filter: 'blur(0px)' },
                exit: (travelDirection: number) => ({
                  x: travelDirection > 0 ? -40 : 40,
                  opacity: 0,
                  filter: 'blur(4px)',
                }),
              }}
              initial="enter"
              animate="centre"
              exit="exit"
              transition={{ duration: 0.45 }}
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  )
}
