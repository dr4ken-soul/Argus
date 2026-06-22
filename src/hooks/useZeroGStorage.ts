import { Buffer } from 'buffer'
import type { Signer } from 'ethers'
import { createLocalRootHash } from '../lib/utils'

const zeroGSdkPackage = '@0glabs/0g-ts-sdk'

interface StoredPayload {
  id?: string
  storageHash?: string
}

/**
 * Hook for reading and writing JSON payloads through 0G Storage.
 */
export function useZeroGStorage() {
  /**
   * Uploads a JSON object to 0G Storage or local demo storage.
   * @param data - The payload to persist
   * @param signer - Ethers signer from the connected wallet
   */
  async function upload(data: object, signer?: Signer): Promise<string> {
    const content = JSON.stringify(data)
    const localHash = await createLocalRootHash(content)
    const indexerUrl = import.meta.env.VITE_ZEROG_INDEXER_URL
    const rpcUrl = import.meta.env.VITE_ZEROG_RPC

    if (!indexerUrl || !signer) {
      localStorage.setItem(`argus:file:${localHash}`, content)
      return localHash
    }

    try {
      const { Indexer, ZgFile } = await import(/* @vite-ignore */ zeroGSdkPackage)
      const payload = data as StoredPayload
      const fileName = `${payload.id ?? crypto.randomUUID()}.json`
      const file = new ZgFile(Buffer.from(content), fileName, 'application/json')
      const [tree, treeError] = await file.merkleTree()

      if (treeError) {
        throw treeError
      }

      const indexer = new Indexer(indexerUrl)
      const [, uploadError] = await indexer.upload(file, signer)

      if (uploadError) {
        const [, retryError] = await indexer.upload(file, rpcUrl, signer)
        if (retryError) throw retryError
      }

      const rootHash =
        tree && typeof (tree as { rootHash?: () => string }).rootHash === 'function'
          ? (tree as { rootHash: () => string }).rootHash()
          : localHash

      localStorage.setItem(`argus:file:${rootHash}`, content)
      return rootHash
    } catch {
      localStorage.setItem(`argus:file:${localHash}`, content)
      return localHash
    }
  }

  /**
   * Retrieves parsed JSON by root hash.
   * @param rootHash - The root hash returned by upload
   */
  async function retrieve(rootHash: string): Promise<object> {
    const local = localStorage.getItem(`argus:file:${rootHash}`)
    if (local) {
      return JSON.parse(local) as object
    }

    const indexerUrl = import.meta.env.VITE_ZEROG_INDEXER_URL
    if (!indexerUrl) {
      throw new Error('Could not connect to 0G Storage. Check your wallet connection and try again')
    }

    const { Indexer } = await import(/* @vite-ignore */ zeroGSdkPackage)
    const indexer = new Indexer(indexerUrl)

    if (!indexer.download) {
      throw new Error('Could not retrieve from 0G Storage. The SDK download method is unavailable')
    }

    const [file, error] = await indexer.download(rootHash)
    if (error) throw error

    if (typeof file === 'string') return JSON.parse(file) as object
    if (file instanceof Blob) return JSON.parse(await file.text()) as object

    return file as object
  }

  return { upload, retrieve }
}
