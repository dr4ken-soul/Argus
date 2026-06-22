import type { FormEvent, ReactNode } from 'react'
import { useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { ReviewBadge } from '../components/ui/ReviewBadge'
import { useZeroGCompute } from '../hooks/useZeroGCompute'
import { useZeroGStorage } from '../hooks/useZeroGStorage'
import { getCurrentBlockNumber } from '../lib/chain'
import { createId, toVaultEntry } from '../lib/utils'
import { walletClientToSigner } from '../lib/wallet'
import { useAppStore } from '../store/useAppStore'
import type { JournalEntry } from '../types'

type Direction = 'long' | 'short'
type ReviewStatus = 'approved' | 'flagged' | 'rejected'

/**
 * Structured signal journal page.
 */
export default function Journal() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const vaultEntries = useAppStore((state) => state.vaultEntries)
  const addVaultEntry = useAppStore((state) => state.addVaultEntry)
  const { reviewSignal } = useZeroGCompute()
  const { upload } = useZeroGStorage()
  const [asset, setAsset] = useState('')
  const [direction, setDirection] = useState<Direction>('long')
  const [entryTrigger, setEntryTrigger] = useState('')
  const [stopLevel, setStopLevel] = useState('')
  const [thesis, setThesis] = useState('')
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [review, setReview] = useState('')
  const [status, setStatus] = useState<ReviewStatus>('flagged')
  const [isReviewing, setIsReviewing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedHash, setSavedHash] = useState('')
  const [error, setError] = useState('')

  function handleUseDemoEntry() {
    setAsset('BTC')
    setDirection('long')
    setEntryTrigger('Price reclaimed the 68,000 resistance area and held the retest with rising volume.')
    setStopLevel('66,800 or a clean close back below the reclaimed resistance.')
    setThesis(
      'BTC spent several days consolidating under resistance, then reclaimed the level with stronger volume. I want to long the retest because buyers are defending the breakout and funding is not overheated. The idea is invalid if price loses the reclaimed level and closes back inside the old range.',
    )
    setConfidence(3)
    setReview('')
    setSavedHash('')
    setError('')
  }

  /**
   * Sends the signal to 0G Compute for AI review.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsReviewing(true)
    setSavedHash('')
    setError('')

    try {
      const payload = [
        `Asset: ${asset}`,
        `Direction: ${direction}`,
        `Entry trigger: ${entryTrigger}`,
        `Stop level: ${stopLevel}`,
        `Thesis: ${thesis}`,
        `Confidence: ${confidence}/5`,
      ].join('\n')
      const result = await reviewSignal(payload, vaultEntries)
      setReview(result.review)
      setStatus(result.status)
    } catch {
      setError('Could not reach 0G Compute. Check the endpoint and try again')
    } finally {
      setIsReviewing(false)
    }
  }

  /**
   * Saves the reviewed journal entry to 0G Storage.
   */
  async function handleSave() {
    if (!review || isSaving) return

    setIsSaving(true)
    setError('')

    try {
      const signer = walletClient ? walletClientToSigner(walletClient) : null
      const blockNumber = await getCurrentBlockNumber(signer)
      const entry: JournalEntry = {
        id: createId(),
        walletAddress: address ?? 'demo-wallet',
        createdAt: Date.now(),
        blockNumber,
        asset,
        direction,
        entryTrigger,
        stopLevel,
        thesis,
        confidence,
        aiReview: review,
        reviewStatus: status,
        storageHash: '',
      }
      const storageHash = await upload(entry, signer ?? undefined)
      const storedEntry = { ...entry, storageHash }
      addVaultEntry(toVaultEntry(storedEntry, 'journal'))
      setSavedHash(storageHash)
    } catch {
      setError('Could not connect to 0G Storage. Check your wallet connection and try again')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-4 pb-24 pt-24 md:px-8 lg:pb-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-[var(--text-primary)]">Signal journal</h1>
          <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-[var(--text-muted)]">
            Write the trade like evidence. Argus checks whether the setup has a clear trigger, invalidation, and reason before it enters the vault.
          </p>
        </div>
        <button
          type="button"
          onClick={handleUseDemoEntry}
          className="w-fit rounded-full border border-[var(--border-default)] px-5 py-2 font-body text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-dim)] hover:text-[var(--text-primary)]"
        >
          Use demo BTC entry
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Field label="Asset" id="asset" hint="The market you are journaling, like BTC, ETH, SOL, or a ticker you trade.">
          <input
            id="asset"
            value={asset}
            onChange={(event) => setAsset(event.target.value)}
            required
            placeholder="BTC, ETH, SOL..."
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 font-body text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-dim)]"
          />
        </Field>

        <div>
          <p className="mb-2 font-body text-sm text-[var(--text-secondary)]">Direction</p>
          <p className="mb-3 font-body text-xs leading-relaxed text-[var(--text-muted)]">
            Long means you expect price to rise. Short means you expect price to fall.
          </p>
          <div className="flex gap-3">
            {(['long', 'short'] as Direction[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDirection(item)}
                className={`min-h-11 rounded-lg border px-6 py-2.5 font-body text-sm capitalize transition-colors ${
                  direction === item
                    ? item === 'long'
                      ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                      : 'border-red-500/30 bg-red-500/15 text-red-400'
                    : 'border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-muted)]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <Field
          label="Entry trigger"
          id="entry-trigger"
          hint="The exact condition that makes you enter. Good triggers are observable, like a breakout, retest, volume spike, or reclaim."
        >
          <textarea
            id="entry-trigger"
            value={entryTrigger}
            onChange={(event) => setEntryTrigger(event.target.value)}
            required
            rows={3}
            placeholder="What triggered this entry"
            className="w-full resize-none rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 font-body text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-dim)]"
          />
        </Field>

        <Field
          label="Stop level"
          id="stop-level"
          hint="The price or condition that proves the trade idea is wrong. This is your invalidation, not your target."
        >
          <input
            id="stop-level"
            value={stopLevel}
            onChange={(event) => setStopLevel(event.target.value)}
            required
            placeholder="Price level for invalidation"
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 font-body text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-dim)]"
          />
        </Field>

        <Field
          label="Thesis"
          id="thesis"
          hint="Your full reason for taking the trade: setup, evidence, risk, and what would make you change your mind."
        >
          <textarea
            id="thesis"
            value={thesis}
            onChange={(event) => setThesis(event.target.value)}
            required
            rows={5}
            placeholder="Your full reasoning for this trade"
            className="w-full resize-none rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 font-body text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-dim)]"
          />
        </Field>

        <div>
          <p className="mb-2 font-body text-sm text-[var(--text-secondary)]">Confidence</p>
          <p className="mb-3 font-body text-xs leading-relaxed text-[var(--text-muted)]">
            Pick one score only: 1 is cautious, 3 is moderate conviction, and 5 is very high conviction.
          </p>
          <div className="flex gap-2">
            {([1, 2, 3, 4, 5] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setConfidence(value)}
                aria-label={`Set confidence to ${value}`}
                className={`h-11 w-11 rounded-full border font-mono text-sm transition-colors ${
                  value === confidence
                    ? 'border-[var(--accent-dim)] bg-[var(--accent-glow)] text-[var(--accent)]'
                    : 'border-[var(--border-default)] text-[var(--text-muted)]'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isReviewing}
          className="w-full rounded-xl bg-[var(--accent)] px-6 py-3 font-body text-sm font-medium text-[var(--bg-primary)] transition-colors hover:bg-[var(--accent-hover)]"
        >
          {isReviewing ? 'Reviewing' : 'Submit for AI review'}
        </button>
      </form>

      {error ? <p className="mt-6 font-body text-sm text-red-400">{error}</p> : null}
      {isReviewing ? (
        <div className="mt-8 space-y-2 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6">
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-10/12 rounded" />
          <div className="skeleton h-4 w-7/12 rounded" />
        </div>
      ) : null}
      {review ? (
        <div className="mt-8 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--accent-dim)]">AI review</p>
          <p className="whitespace-pre-wrap font-body text-sm leading-relaxed text-[var(--text-secondary)]">{review}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <ReviewBadge status={status} />
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || Boolean(savedHash)}
              className="liquid-glass rounded-full px-5 py-2 font-body text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              {savedHash ? 'Saved to vault' : isSaving ? 'Saving' : 'Save to vault'}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}

interface FieldProps {
  label: string
  id: string
  hint?: string
  children: ReactNode
}

/**
 * Form field wrapper with visible label.
 */
function Field({ label, id, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-body text-sm text-[var(--text-secondary)]">
        {label}
      </label>
      {hint ? <p className="mb-3 font-body text-xs leading-relaxed text-[var(--text-muted)]">{hint}</p> : null}
      {children}
    </div>
  )
}
