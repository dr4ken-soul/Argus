import { Archive, BookOpen, LayoutDashboard, MessageSquare } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { WalletButton } from './WalletButton'

const tabs = [
  { label: 'Dashboard', to: '/app', icon: LayoutDashboard },
  { label: 'Research', to: '/app/research', icon: MessageSquare },
  { label: 'Vault', to: '/app/vault', icon: Archive },
  { label: 'Journal', to: '/app/journal', icon: BookOpen },
]

/**
 * App interior navigation with desktop tabs and mobile bottom tabs.
 */
export function AppNav() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-8">
          <NavLink to="/" className="font-display text-lg tracking-tight text-[var(--text-primary)]">
            Argus
          </NavLink>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="App navigation">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.to === '/app'}
                className={({ isActive }) =>
                  `border-b-2 py-5 font-body text-sm transition-colors ${
                    isActive
                      ? 'border-[var(--accent)] text-[var(--text-primary)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
          <WalletButton compact />
        </div>
      </header>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 grid h-16 grid-cols-4 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] lg:hidden"
        aria-label="Mobile app navigation"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/app'}
              aria-label={tab.label}
              className={({ isActive }) =>
                `flex min-h-11 flex-col items-center justify-center gap-1 font-body text-[10px] uppercase tracking-wide ${
                  isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                }`
              }
            >
              <Icon size={20} aria-hidden="true" />
              <span>{tab.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </>
  )
}
