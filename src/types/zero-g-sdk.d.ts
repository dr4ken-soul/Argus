declare module '@0glabs/0g-ts-sdk' {
  export class ZgFile {
    constructor(content: Buffer | Uint8Array | Blob | File, name: string, type?: string)
    merkleTree(): Promise<[unknown, Error | null]>
  }

  export class Indexer {
    constructor(url: string)
    upload(file: ZgFile, signerOrRpc?: unknown, maybeSigner?: unknown): Promise<[unknown, Error | null]>
    download?(rootHash: string): Promise<[unknown, Error | null]>
  }
}
