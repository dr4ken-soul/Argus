import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { shortenHash } from '../../lib/utils'

interface WalletButtonProps {
  compact?: boolean
  label?: string
  strong?: boolean
  navigateOnConnect?: boolean
}

/**
 * Connects the active wallet and opens an account menu after connection.
 */
export function WalletButton({
  compact = false,
  label = 'Connect wallet',
  strong = false,
  navigateOnConnect = false,
}: WalletButtonProps) {
  const { address, isConnected } = useAccount()
  const { connectors, connectAsync, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'confirming' | 'opening'>('idle')
  const menuRef = useRef<HTMLDivElement>(null)
  const connector = connectors.find((item) => item.id === 'injected') ?? connectors[0]

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  /**
   * Starts wallet connection and opens the dashboard after success.
   */
  async function handleConnect() {
    if (!connector || isPending) return

    setPhase('confirming')
    try {
      await connectAsync({ connector })
      setPhase('opening')
      if (navigateOnConnect) {
        window.setTimeout(() => navigate('/app'), 350)
      }
    } catch {
      setPhase('idle')
    }
  }

  /**
   * Disconnects from the wallet menu.
   */
  function handleDisconnect() {
    disconnect()
    setIsOpen(false)
    setPhase('idle')
  }

  if (isConnected) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
          className={`liquid-glass rounded-full font-mono text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] ${
            compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-xs'
          }`}
        >
          {shortenHash(address)}
        </button>
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0, filter: 'blur(8px)', y: 8 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, filter: 'blur(6px)', y: 6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="liquid-glass-dark absolute right-0 top-[calc(100%+0.75rem)] z-50 w-72 rounded-2xl p-4 text-left"
            >
              <p className="font-body text-xs uppercase tracking-widest text-[var(--text-muted)]">Connected wallet</p>
              <p className="mt-3 font-mono text-sm text-[var(--text-primary)]">{shortenHash(address, 8, 6)}</p>
              <div className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs text-[var(--text-muted)]">Network</span>
                  <span className="font-body text-xs text-[var(--accent)]">0G Galileo</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-body text-xs text-[var(--text-muted)]">Status</span>
                  <span className="font-body text-xs text-emerald-400">Active</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDisconnect}
                className="mt-4 w-full rounded-xl border border-[var(--border-default)] px-4 py-3 font-body text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                Disconnect
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    )
  }

  const text = phase === 'confirming' ? 'Confirm in wallet' : phase === 'opening' ? 'Opening dashboard' : label
  const buttonClass = strong
    ? 'liquid-glass-strong rounded-full font-body text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]'
    : 'liquid-glass rounded-full font-body text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]'

  return (
    <div className="relative">
      <button
        type="button"
        disabled={!connector || isPending || phase === 'opening'}
        onClick={handleConnect}
        className={`${buttonClass} ${compact ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'}`}
      >
        {text}
      </button>
      <AnimatePresence>
        {phase !== 'idle' ? (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(8px)', y: 8 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(6px)', y: 6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="liquid-glass-dark absolute right-0 top-[calc(100%+0.75rem)] z-50 w-56 rounded-2xl px-4 py-3"
          >
            <p className="font-body text-sm text-[var(--text-primary)]">{text}</p>
            <p className="mt-1 font-body text-xs text-[var(--text-muted)]">
              {phase === 'confirming' ? 'Approve the request in your wallet' : 'Taking you to Argus'}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
