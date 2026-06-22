import type { JsonRpcSigner } from 'ethers'

/**
 * Returns the current block number for timestamp proof.
 */
export async function getCurrentBlockNumber(signer?: JsonRpcSigner | null): Promise<number> {
  try {
    if (signer?.provider) {
      return await signer.provider.getBlockNumber()
    }

    const rpcUrl = import.meta.env.VITE_ZEROG_RPC
    if (!rpcUrl) return 0

    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
    })
    const data = (await response.json()) as { result?: string }
    return data.result ? Number.parseInt(data.result, 16) : 0
  } catch {
    return 0
  }
}
