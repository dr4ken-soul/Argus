import { Link } from 'react-router-dom'
import { WalletButton } from './WalletButton'

/**
 * Landing navigation bar.
 */
export function Nav() {
  return (
    <nav className="fixed inset-x-0 top-4 z-50 px-4 md:top-6 md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to="/" className="font-display text-xl tracking-tight text-[var(--text-primary)]">
          Argus
        </Link>
        <WalletButton compact navigateOnConnect />
      </div>
    </nav>
  )
}
