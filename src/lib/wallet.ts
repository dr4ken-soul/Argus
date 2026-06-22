import { QueryClient } from '@tanstack/react-query'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { createConfig, http } from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'
import type { Chain, WalletClient } from 'viem'

export const zeroGTestnet = {
  id: 16602,
  name: '0G Galileo Testnet',
  nativeCurrency: {
    decimals: 18,
    name: '0G',
    symbol: '0G',
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_ZEROG_RPC || 'https://evmrpc-testnet.0g.ai'],
    },
  },
} as const satisfies Chain

const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

export const queryClient = new QueryClient()

export const wagmiConfig = createConfig({
  chains: [zeroGTestnet],
  connectors: [
    injected(),
    ...(walletConnectProjectId ? [walletConnect({ projectId: walletConnectProjectId })] : []),
  ],
  transports: {
    [zeroGTestnet.id]: http(zeroGTestnet.rpcUrls.default.http[0]),
  },
})

/**
 * Converts a wagmi wallet client into an ethers signer.
 */
export function walletClientToSigner(walletClient: WalletClient): JsonRpcSigner {
  const { account, chain, transport } = walletClient
  if (!account) {
    throw new Error('Wallet account is not available')
  }

  const provider = new BrowserProvider(transport as never, {
    chainId: chain?.id ?? zeroGTestnet.id,
    name: chain?.name ?? zeroGTestnet.name,
  })

  return new JsonRpcSigner(provider, account.address)
}
