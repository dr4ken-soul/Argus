import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  ArrowUp,
  Clock,
  Cpu,
  FileText,
  Globe,
  MessageSquare,
  Paperclip,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react'
import { useAccount, useWalletClient } from 'wagmi'
import { useZeroGCompute } from '../hooks/useZeroGCompute'
import { useZeroGStorage } from '../hooks/useZeroGStorage'
import { getCurrentBlockNumber } from '../lib/chain'
import { createId, summariseMessages, toVaultEntry } from '../lib/utils'
import { walletClientToSigner } from '../lib/wallet'
import { useAppStore } from '../store/useAppStore'
import type { Message, ResearchSession } from '../types'

const promptSuggestions = [
  'Review my BTC breakout thesis',
  'Stress-test this ETH short setup',
  'Find missing risk in my SOL entry',
]

const draftKey = 'argus:research-drafts'

interface ResearchDraft {
  id: string
  title: string
  updatedAt: number
  messages: Message[]
}

/**
 * Active AI research session page.
 */
export default function Research() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const vaultEntries = useAppStore((state) => state.vaultEntries)
  const addVaultEntry = useAppStore((state) => state.addVaultEntry)
  const { query } = useZeroGCompute()
  const { upload } = useZeroGStorage()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedHash, setSavedHash] = useState('')
  const [error, setError] = useState('')
  const [activeDraftId, setActiveDraftId] = useState('')
  const [drafts, setDrafts] = useState<ResearchDraft[]>([])
  const computeModel = import.meta.env.VITE_ZEROG_COMPUTE_MODEL || 'qwen2.5-omni'

  const hasAssistantResponse = messages.some((message) => message.role === 'assistant')
  const sessionSummary = useMemo(() => summariseMessages(messages), [messages])

  useEffect(() => {
    const raw = localStorage.getItem(draftKey)
    if (!raw) return

    try {
      setDrafts(JSON.parse(raw) as ResearchDraft[])
    } catch {
      setDrafts([])
    }
  }, [])

  /**
   * Persists draft chat history locally.
   */
  function persistDraft(nextMessages: Message[], draftId = activeDraftId): string {
    if (nextMessages.length === 0) return draftId

    const id = draftId || createId()
    const title = summariseMessages(nextMessages)
    const draft: ResearchDraft = {
      id,
      title,
      updatedAt: Date.now(),
      messages: nextMessages,
    }

    setActiveDraftId(id)
    setDrafts((currentDrafts) => {
      const nextDrafts = [draft, ...currentDrafts.filter((item) => item.id !== id)].slice(0, 12)
      localStorage.setItem(draftKey, JSON.stringify(nextDrafts))
      return nextDrafts
    })

    return id
  }

  /**
   * Starts a fresh research draft.
   */
  function handleNewChat() {
    if (messages.length > 0) {
      persistDraft(messages)
    }

    setMessages([])
    setInput('')
    setError('')
    setSavedHash('')
    setActiveDraftId('')
  }

  /**
   * Opens a local draft chat.
   */
  function handleOpenDraft(draft: ResearchDraft) {
    setMessages(draft.messages)
    setActiveDraftId(draft.id)
    setInput('')
    setError('')
    setSavedHash('')
  }

  /**
   * Sends the current message to 0G Compute.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const content = input.trim()
    if (!content || isThinking) return

    const userMessage: Message = { role: 'user', content, timestamp: Date.now() }
    const nextMessages = [...messages, userMessage]
    const draftId = persistDraft(nextMessages)
    setMessages(nextMessages)
    setInput('')
    setError('')
    setIsThinking(true)

    try {
      const response = await query(content, messages, vaultEntries)
      const assistantMessage: Message = { role: 'assistant', content: response, timestamp: Date.now() }
      const completedMessages = [...nextMessages, assistantMessage]
      setMessages(completedMessages)
      persistDraft(completedMessages, draftId)
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Could not reach 0G Compute. Check the endpoint and try again')
    } finally {
      setIsThinking(false)
    }
  }

  /**
   * Saves the active research session to 0G Storage.
   */
  async function handleSave() {
    if (!hasAssistantResponse || isSaving) return

    setIsSaving(true)
    setError('')

    try {
      const signer = walletClient ? walletClientToSigner(walletClient) : null
      const blockNumber = await getCurrentBlockNumber(signer)
      const session: ResearchSession = {
        id: createId(),
        walletAddress: address ?? 'demo-wallet',
        createdAt: Date.now(),
        blockNumber,
        thesis: messages.find((message) => message.role === 'user')?.content ?? sessionSummary,
        messages,
        storageHash: '',
        patternMatches: vaultEntries.slice(0, 3).map((entry) => entry.id),
      }
      const storageHash = await upload(session, signer ?? undefined)
      const storedSession = { ...session, storageHash }
      addVaultEntry(toVaultEntry(storedSession, 'session'))
      setSavedHash(storageHash)
    } catch {
      setError('Could not connect to 0G Storage. Check your wallet connection and try again')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="mx-auto flex h-screen max-w-[100rem] flex-col px-4 pb-24 pt-20 md:px-8 lg:pb-6">
      <h1 className="sr-only">Research</h1>
      <div className="liquid-glass-dark mb-3 flex flex-col gap-3 rounded-2xl px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 font-body text-sm text-[var(--text-primary)]">
            <FileText size={16} aria-hidden="true" />
            Research session
          </span>
          <span className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 font-body text-sm text-[var(--text-primary)]">
            <Cpu size={16} aria-hidden="true" />
            {computeModel}
          </span>
          <span className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 font-body text-sm text-emerald-400">
            <ShieldCheck size={16} aria-hidden="true" />
            0G Compute
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
          <span>Router</span>
          <span className="h-1 w-1 rounded-full bg-[var(--accent-dim)]" />
          <span>Private</span>
          <span className="h-1 w-1 rounded-full bg-[var(--accent-dim)]" />
          <span>128K context</span>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[16rem_minmax(0,1fr)_18rem]">
        <aside className="liquid-glass-dark hidden min-h-0 rounded-2xl p-4 lg:flex lg:flex-col">
          <button
            type="button"
            onClick={handleNewChat}
            className="mb-5 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 font-body text-sm font-medium text-[var(--bg-primary)] transition-colors hover:bg-[var(--accent-hover)]"
          >
            <Plus size={16} aria-hidden="true" />
            New chat
          </button>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-body text-xs uppercase tracking-widest text-[var(--text-muted)]">Recent chats</p>
            <Clock size={14} className="text-[var(--text-muted)]" aria-hidden="true" />
          </div>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {drafts.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[var(--border-default)] p-4 font-body text-sm leading-relaxed text-[var(--text-muted)]">
                Draft chats appear here after your first message.
              </p>
            ) : (
              drafts.map((draft) => (
                <button
                  key={draft.id}
                  type="button"
                  onClick={() => handleOpenDraft(draft)}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition-colors ${
                    draft.id === activeDraftId
                      ? 'border-[var(--accent-dim)] bg-[var(--accent-glow)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-default)]'
                  }`}
                >
                  <span className="flex items-start gap-2">
                    <MessageSquare size={15} className="mt-0.5 shrink-0 text-[var(--accent-dim)]" aria-hidden="true" />
                    <span>
                      <span className="line-clamp-2 block font-body text-sm leading-snug text-[var(--text-secondary)]">
                        {draft.title}
                      </span>
                      <span className="mt-2 block font-mono text-[10px] text-[var(--text-muted)]">
                        {new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(
                          new Date(draft.updatedAt),
                        )}
                      </span>
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
          <p className="mt-4 border-t border-[var(--border-subtle)] pt-4 font-body text-xs leading-relaxed text-[var(--text-muted)]">
            Drafts stay local. Save to vault when the analysis is ready for the permanent record.
          </p>
        </aside>

        <div className="liquid-glass-dark flex min-h-0 flex-col rounded-2xl">
          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 md:px-8">
            {messages.length === 0 ? (
              <div className="mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center text-center">
                <div className="liquid-glass mb-5 flex h-16 w-16 items-center justify-center rounded-2xl">
                  <Cpu size={28} className="text-[var(--accent)]" aria-hidden="true" />
                </div>
                <p className="font-body text-xs uppercase tracking-widest text-[var(--accent-dim)]">Argus research</p>
                <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight text-[var(--text-primary)]">
                  Stress-test a thesis before you trade
                </h2>
                <p className="mt-4 max-w-lg font-body text-sm leading-relaxed text-[var(--text-secondary)]">
                  Send a market setup. Argus will challenge the trigger, invalidation, evidence and risk using
                  0G Compute.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {promptSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setInput(suggestion)}
                      className="min-h-11 rounded-full border border-[var(--border-default)] px-4 font-body text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) =>
                message.role === 'user' ? (
                  <article key={`${message.timestamp}-${index}`} className="ml-auto flex max-w-4xl items-start gap-3">
                    <div className="rounded-2xl rounded-tr-sm border border-[var(--border-default)] bg-[var(--bg-elevated)] px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
                      <p className="font-body text-base leading-relaxed text-[var(--text-primary)]">{message.content}</p>
                    </div>
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] font-mono text-xs text-[var(--bg-primary)]">
                      You
                    </div>
                  </article>
                ) : (
                  <article key={`${message.timestamp}-${index}`} className="flex max-w-5xl items-start gap-4">
                    <div className="liquid-glass mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                      <Cpu size={16} className="text-[var(--accent)]" aria-hidden="true" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 py-5">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <p className="font-mono text-xs text-[var(--accent-dim)]">Argus</p>
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-body text-[11px] text-emerald-400">
                          0G Compute
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap font-body text-base leading-8 text-[var(--text-secondary)]">
                        {message.content}
                      </p>
                    </div>
                  </article>
                ),
              )
            )}
            {isThinking ? <ResearchSkeleton /> : null}
          </div>

          <div className="border-t border-[var(--border-subtle)] p-3 md:p-4">
            <div className="mb-2 flex min-h-9 items-center justify-between gap-3">
              {hasAssistantResponse ? (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || Boolean(savedHash)}
                  className="liquid-glass rounded-full px-5 py-2 font-body text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                >
                  {savedHash ? 'Saved to vault' : isSaving ? 'Saving' : 'Save to vault'}
                </button>
              ) : (
                <span />
              )}
              {savedHash ? <p className="font-mono text-xs text-[var(--text-muted)]">{savedHash.slice(0, 14)}...</p> : null}
            </div>
            {error ? <p className="mb-3 font-body text-sm text-red-400">{error}</p> : null}
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
            >
              <label htmlFor="research-message" className="sr-only">
                Describe your thesis or ask a question
              </label>
              <textarea
                id="research-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Describe your thesis or ask a question"
                rows={2}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    event.currentTarget.form?.requestSubmit()
                  }
                }}
                className="min-h-14 w-full resize-none bg-transparent px-2 py-2 font-body text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
              <div className="flex items-center justify-between gap-3 border-t border-[var(--border-subtle)] px-1 pt-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Web context"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                  >
                    <Globe size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Attach note"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                  >
                    <Paperclip size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Research controls"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                  >
                    <SlidersHorizontal size={18} aria-hidden="true" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[var(--text-muted)]">{input.length} / 128K</span>
                  <button
                    type="submit"
                    aria-label="Send message"
                    disabled={isThinking || !input.trim()}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg-primary)] transition-colors hover:bg-[var(--accent-hover)]"
                  >
                    <ArrowUp size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <aside className="hidden min-h-0 flex-col gap-4 lg:flex">
          <div className="liquid-glass-dark rounded-2xl p-5">
            <p className="mb-4 font-body text-xs uppercase tracking-widest text-[var(--text-muted)]">Session summary</p>
            <p className="font-body text-sm leading-relaxed text-[var(--text-secondary)]">{sessionSummary}</p>
          </div>
          <div className="liquid-glass-dark rounded-2xl p-5">
            <p className="mb-3 font-body text-xs uppercase tracking-widest text-[var(--text-muted)]">Pattern recall</p>
            {vaultEntries.length === 0 ? (
              <p className="font-body text-sm text-[var(--text-muted)]">No vault history yet</p>
            ) : (
              <ul className="space-y-3">
                {vaultEntries.slice(0, 3).map((entry) => (
                  <li key={entry.id} className="font-body text-sm leading-snug text-[var(--text-secondary)]">
                    {entry.summary}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="liquid-glass-dark rounded-2xl p-5">
            <p className="mb-4 font-body text-xs uppercase tracking-widest text-[var(--text-muted)]">0G route</p>
            <div className="space-y-3">
              <InfoRow label="Model" value={computeModel} />
              <InfoRow label="Mode" value="Router" />
              <InfoRow label="Privacy" value="Private" />
              <InfoRow label="Status" value="Ready" />
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

/**
 * Skeleton loading state for compute responses.
 */
function ResearchSkeleton() {
  return (
    <div className="flex max-w-3xl items-start gap-3">
      <div className="liquid-glass mt-1 h-9 w-9 shrink-0 rounded-full" />
      <div className="flex-1 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton mt-2 h-4 w-11/12 rounded" />
        <div className="skeleton mt-2 h-4 w-2/3 rounded" />
      </div>
    </div>
  )
}

interface InfoRowProps {
  label: string
  value: string
}

/**
 * Displays a compact research metadata row.
 */
function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-body text-xs text-[var(--text-muted)]">{label}</span>
      <span className="font-mono text-xs text-[var(--text-secondary)]">{value}</span>
    </div>
  )
}
