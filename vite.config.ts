import type { IncomingMessage } from 'node:http'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Reads a JSON request body from Vite middleware.
 */
async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = []
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  const body = Buffer.concat(chunks).toString('utf8')
  return body ? JSON.parse(body) : {}
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'argus-og-compute-dev-proxy',
        configureServer(server) {
          server.middlewares.use('/api/og-compute', async (request, response) => {
            if (request.method !== 'POST') {
              response.statusCode = 405
              response.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            const endpoint = env.VITE_ZEROG_COMPUTE_URL?.replace(/\/$/, '')
            const apiKey = env.VITE_ZEROG_COMPUTE_API_KEY

            if (!endpoint || !apiKey) {
              response.statusCode = 500
              response.end(JSON.stringify({ error: '0G Compute is not configured' }))
              return
            }

            try {
              const body = await readJsonBody(request)
              const upstream = await fetch(`${endpoint}/chat/completions`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify(body),
              })

              response.statusCode = upstream.status
              response.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/json')
              response.end(await upstream.text())
            } catch (error) {
              response.statusCode = 500
              response.setHeader('Content-Type', 'application/json')
              response.end(
                JSON.stringify({
                  error: error instanceof Error ? error.message : 'Could not reach 0G Compute',
                }),
              )
            }
          })
        },
      },
    ],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['buffer'],
  },
  }
})
