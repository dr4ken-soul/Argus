import type { Message, VaultEntry } from '../types'

/**
 * Hook for calling 0G Compute AI inference.
 */
export function useZeroGCompute() {
  /**
   * Sends a research message to 0G Compute and returns the AI response.
   * @param message - The user's current message
   * @param history - Prior messages in the active session
   * @param vaultContext - Relevant past vault entries
   */
  async function query(message: string, history: Message[], vaultContext: VaultEntry[]): Promise<string> {
    const model = import.meta.env.VITE_ZEROG_COMPUTE_MODEL || 'qwen2.5-omni'
    const system = buildSystemPrompt(vaultContext)

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch('/api/og-compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          {
            model,
            messages: [
              { role: 'system', content: system },
              ...history.map((item) => ({ role: item.role, content: item.content })),
              { role: 'user', content: message },
            ],
            temperature: 0.7,
            max_tokens: 900,
            stream: false,
          },
        ),
        signal: controller.signal,
      })

      if (!response.ok) {
        const details = (await response.text()).slice(0, 240)
        if (details.includes('0G Compute is not configured')) {
          return buildLocalCritique(message, history, vaultContext)
        }
        throw new Error(details || 'Could not reach 0G Compute. Check the endpoint and try again')
      }

      const data = (await response.json()) as {
        content?: string
        message?: string
        text?: string
        choices?: { message?: { content?: string } }[]
      }
      return (
        data.choices?.[0]?.message?.content ??
        data.content ??
        data.message ??
        data.text ??
        buildLocalCritique(message, history, vaultContext)
      )
    } finally {
      window.clearTimeout(timeout)
    }
  }

  /**
   * Reviews a structured signal entry.
   * @param payload - The journal form payload
   * @param vaultContext - Relevant past vault entries
   */
  async function reviewSignal(payload: string, vaultContext: VaultEntry[]): Promise<{ review: string; status: 'approved' | 'flagged' | 'rejected' }> {
    const review = await query(payload, [], vaultContext)
    const lowered = review.toLowerCase()
    const status = lowered.includes('reject') ? 'rejected' : lowered.includes('flag') ? 'flagged' : 'approved'

    return { review, status }
  }

  return { query, reviewSignal }
}

/**
 * Builds the system prompt used by Argus AI reviews.
 */
function buildSystemPrompt(vaultContext: VaultEntry[]): string {
  const history = vaultContext
    .slice(0, 5)
    .map((entry) => `- ${entry.type}: ${entry.summary}`)
    .join('\n')

  return `You are Argus, a trading research reviewer running on 0G Compute. Challenge reasoning, ask direct questions, flag missing invalidation, risk and evidence. Use British English. Relevant vault history:\n${history || 'No prior history'}`
}

/**
 * Returns a local critique when a compute endpoint is not configured.
 */
function buildLocalCritique(message: string, history: Message[], vaultContext: VaultEntry[]): string {
  const hasRisk = /stop|invalid|risk|loss/i.test(message)
  const hasTrigger = /break|reclaim|support|resistance|volume|trend|entry/i.test(message)
  const past = vaultContext.find((entry) => message.toLowerCase().includes(entry.summary.split(' ')[0]?.toLowerCase() ?? ''))

  const lines = [
    'I would not enter this yet without tightening the evidence.',
    hasTrigger
      ? 'Your trigger is visible, but define the exact condition that proves the setup is active'
      : 'The entry trigger is vague. Name the market condition that must happen before you act',
    hasRisk
      ? 'Risk is present in the thesis. Make sure the stop is placed where the idea is invalidated, not where the loss feels comfortable'
      : 'There is no clear invalidation. Add a stop level and the reason that level breaks the thesis',
    history.length > 0
      ? 'Compare this with your recent vault entries before sizing the trade'
      : 'No prior vault history is available yet, so treat this as your baseline record',
  ]

  if (past) {
    lines.push(`Pattern recall: this resembles "${past.summary.slice(0, 80)}" from your vault`)
  }

  return lines.join('\n\n')
}
