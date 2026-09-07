// Wallet discovery and connection using the raw EIP-1193 / EIP-6963 APIs every
// browser extension wallet already implements. No ethers/web3 dependency needed.
//
// EIP-6963 ("Multi Injected Provider Discovery") lets every installed wallet
// announce itself with its own name, icon and a stable rdns id, which is how
// modern MetaMask and OKX Wallet both expose themselves. We fall back to the
// legacy window.ethereum / window.okxwallet injection points for older
// extensions that don't support EIP-6963 yet.

const discovered = new Map() // rdns -> { info: {uuid, name, icon, rdns}, provider }
const listeners = new Set()
let initialized = false

function notify() {
  const list = Array.from(discovered.values())
  listeners.forEach(fn => fn(list))
}

export function initWalletDiscovery() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  window.addEventListener('eip6963:announceProvider', (event) => {
    const detail = event.detail
    if (detail?.info?.rdns && detail?.provider) {
      discovered.set(detail.info.rdns, detail)
      notify()
    }
  })

  window.dispatchEvent(new Event('eip6963:requestProvider'))

  // legacy fallback for wallets that predate EIP-6963 (older MetaMask/OKX builds)
  setTimeout(() => {
    if (discovered.size > 0) return
    if (window.okxwallet) {
      discovered.set('com.okex.wallet.legacy', {
        info: { rdns: 'com.okex.wallet.legacy', name: 'OKX Wallet', icon: null },
        provider: window.okxwallet,
      })
    }
    if (window.ethereum && !discovered.has('io.metamask')) {
      const isMetaMask = !!window.ethereum.isMetaMask
      discovered.set('legacy.window.ethereum', {
        info: {
          rdns: 'legacy.window.ethereum',
          name: isMetaMask ? 'MetaMask' : 'Injected Wallet',
          icon: null,
        },
        provider: window.ethereum,
      })
    }
    notify()
  }, 350)
}

export function subscribeWallets(fn) {
  listeners.add(fn)
  fn(Array.from(discovered.values()))
  return () => listeners.delete(fn)
}

export function getDiscoveredWallets() {
  return Array.from(discovered.values())
}

export async function connectProvider(provider) {
  const accounts = await provider.request({ method: 'eth_requestAccounts' })
  if (!accounts || accounts.length === 0) throw new Error('No account returned by wallet.')
  const chainIdHex = await provider.request({ method: 'eth_chainId' })
  return { address: accounts[0], chainId: parseInt(chainIdHex, 16) }
}

export const CHAIN_NAMES = {
  1: 'Ethereum',
  10: 'Optimism',
  56: 'BNB Chain',
  137: 'Polygon',
  8453: 'Base',
  42161: 'Arbitrum',
  43114: 'Avalanche',
  4663: 'Robinhood Chain',
  11155111: 'Sepolia',
}

export function chainName(chainId) {
  return CHAIN_NAMES[chainId] || `Chain ${chainId}`
}
