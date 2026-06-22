interface VercelRequest {
  method?: string
  body?: unknown
}

interface VercelResponse {
  status: (code: number) => VercelResponse
  setHeader: (name: string, value: string) => void
  json: (body: unknown) => void
  send: (body: string) => void
}

/**
 * Vercel serverless proxy for 0G Compute.
 */
export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' })
    return
  }

  const endpoint = process.env.VITE_ZEROG_COMPUTE_URL?.replace(/\/$/, '')
  const apiKey = process.env.VITE_ZEROG_COMPUTE_API_KEY

  if (!endpoint || !apiKey) {
    response.status(500).json({ error: '0G Compute is not configured' })
    return
  }

  try {
    const upstream = await fetch(`${endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(request.body ?? {}),
    })

    response.status(upstream.status)
    response.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/json')
    response.send(await upstream.text())
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : 'Could not reach 0G Compute' })
  }
}
