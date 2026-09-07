import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { MARKET_SEED, QUOTE, GOV_TOKEN, SEED_BASE_UNITS, TOKENOMICS_SEED } from '../data/markets'
import {
  quoteFeeBps, simulateSwap, liveVeWeight, weeklyEmission,
  MAX_LOCK_MS, randomAddress,
} from '../engine'
import { initWalletDiscovery, subscribeWallets } from '../wallet'

const STORAGE_KEY = 'equity_state_v2'

function freshState() {
  const pools = {}
  MARKET_SEED.forEach(m => {
    pools[m.symbol] = {
      ...m,
      reserveBase: SEED_BASE_UNITS,
      reserveQuote: SEED_BASE_UNITS * m.price,
      totalShares: SEED_BASE_UNITS * m.price, // shares minted 1:1 with quote-equivalent liquidity units
      volumeUSD: 0,
      lastTradeAt: null,
      override: null,
    }
  })
  return {
    wallet: null,
    balances: {},
    positions: {}, // symbol -> { shares, costBasisUSD, depositedAt }
    lock: null, // { amount, unlockTime, lockedAt }
    voteAllocations: {}, // symbol -> points spent this epoch
    pools,
    trades: [], // { symbol, side, amountIn, amountOut, feeBps, at, trader }
    liquidityEvents: [], // { symbol, trader, type, at }
    voteEvents: [], // { trader, at, points }
    tokenomics: { ...TOKENOMICS_SEED, epochStart: Date.now() },
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return freshState()
    const parsed = JSON.parse(raw)
    const fresh = freshState()
    const validSymbols = new Set(Object.keys(fresh.pools))

    // Only keep saved data for tickers that still exist in the current market
    // list. Without this, a ticker that got renamed or removed in an update
    // (e.g. an old build's 'SPX' before it was corrected to 'SPCX') would
    // stick around forever alongside the new one, showing as a duplicate.
    const pools = {}
    validSymbols.forEach(symbol => {
      pools[symbol] = parsed.pools?.[symbol]
        ? { ...fresh.pools[symbol], ...parsed.pools[symbol] }
        : fresh.pools[symbol]
    })

    const positions = {}
    Object.entries(parsed.positions || {}).forEach(([symbol, pos]) => {
      if (validSymbols.has(symbol)) positions[symbol] = pos
    })

    const voteAllocations = {}
    Object.entries(parsed.voteAllocations || {}).forEach(([symbol, pts]) => {
      if (validSymbols.has(symbol)) voteAllocations[symbol] = pts
    })

    const balances = {}
    Object.entries(parsed.balances || {}).forEach(([token, amt]) => {
      if (token === QUOTE || token === GOV_TOKEN || validSymbols.has(token)) balances[token] = amt
    })

    return {
      ...fresh,
      ...parsed,
      pools,
      positions,
      voteAllocations,
      balances,
      tokenomics: { ...fresh.tokenomics, ...parsed.tokenomics },
    }
  } catch {
    return freshState()
  }
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, setState] = useState(loadState)
  const [toast, setToast] = useState(null)
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const providerRef = useRef(null) // the live EIP-1193 provider object; never persisted (not serializable)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const notify = useCallback((msg, kind = 'info') => {
    setToast({ msg, kind, id: Math.random() })
  }, [])

  const requireWallet = useCallback(() => {
    if (!state.wallet) {
      notify('Connect a wallet first.', 'error')
      setWalletModalOpen(true)
      return false
    }
    return true
  }, [state.wallet, notify])

  const seedDemoBalances = useCallback((balances) => {
    const next = { ...balances }
    if (next[QUOTE] === undefined) next[QUOTE] = 25000
    if (next[GOV_TOKEN] === undefined) next[GOV_TOKEN] = 5000
    MARKET_SEED.forEach(m => {
      if (next[m.symbol] === undefined) next[m.symbol] = Math.round((5000 / m.price) * 100) / 100
    })
    return next
  }, [])

  // ---------------- wallet -----------------------------------------------

  const detachProviderListeners = useCallback(() => {
    const provider = providerRef.current
    if (provider && provider.removeListener) {
      provider.removeListener('accountsChanged', providerRef.current.__onAccountsChanged)
      provider.removeListener('chainChanged', providerRef.current.__onChainChanged)
    }
    providerRef.current = null
  }, [])

  // real connection to an injected wallet (MetaMask, OKX Wallet, or anything
  // else discovered via EIP-6963 / legacy window.ethereum)
  const connectInjectedWallet = useCallback(async (walletDetail) => {
    const provider = walletDetail.provider
    const accounts = await provider.request({ method: 'eth_requestAccounts' })
    if (!accounts || accounts.length === 0) throw new Error('No account returned by wallet.')
    const chainIdHex = await provider.request({ method: 'eth_chainId' })
    const chainId = parseInt(chainIdHex, 16)
    const address = accounts[0]

    const onAccountsChanged = (accts) => {
      if (!accts || accts.length === 0) {
        detachProviderListeners()
        setState(s => ({ ...s, wallet: null }))
        notify('Wallet disconnected.', 'info')
      } else {
        setState(s => (s.wallet ? { ...s, wallet: { ...s.wallet, address: accts[0] } } : s))
      }
    }
    const onChainChanged = (hexId) => {
      setState(s => (s.wallet ? { ...s, wallet: { ...s.wallet, chainId: parseInt(hexId, 16) } } : s))
    }

    detachProviderListeners()
    provider.__onAccountsChanged = onAccountsChanged
    provider.__onChainChanged = onChainChanged
    provider.on?.('accountsChanged', onAccountsChanged)
    provider.on?.('chainChanged', onChainChanged)
    providerRef.current = provider

    setState(s => ({
      ...s,
      balances: seedDemoBalances(s.balances),
      wallet: {
        address,
        chainId,
        kind: 'injected',
        rdns: walletDetail.info?.rdns || null,
        name: walletDetail.info?.name || 'Wallet',
        connectedAt: Date.now(),
      },
    }))
    notify(`${walletDetail.info?.name || 'Wallet'} connected.`, 'success')
  }, [detachProviderListeners, notify, seedDemoBalances])

  // fallback for trying the app without a browser wallet installed
  const connectDemoWallet = useCallback(() => {
    detachProviderListeners()
    setState(s => {
      if (s.wallet) return s
      const address = randomAddress()
      return {
        ...s,
        balances: seedDemoBalances(s.balances),
        wallet: { address, kind: 'demo', name: 'Demo wallet', connectedAt: Date.now() },
      }
    })
    notify('Demo wallet connected.', 'success')
  }, [detachProviderListeners, notify, seedDemoBalances])

  const disconnectWallet = useCallback(() => {
    detachProviderListeners()
    setState(s => ({ ...s, wallet: null }))
  }, [detachProviderListeners])

  // On page load, if a real wallet was connected last session, try to silently
  // re-establish it (eth_accounts never prompts) so change listeners work
  // again without forcing the user to click Connect a second time.
  useEffect(() => {
    if (state.wallet?.kind !== 'injected') return
    let cancelled = false
    initWalletDiscovery()
    const unsub = subscribeWallets(async (list) => {
      if (cancelled || providerRef.current) return
      const match = list.find(d => d.info?.rdns === state.wallet.rdns) || list[0]
      if (!match) return
      try {
        const accounts = await match.provider.request({ method: 'eth_accounts' })
        if (cancelled) return
        if (!accounts || accounts.length === 0) {
          setState(s => ({ ...s, wallet: null }))
          return
        }
        const onAccountsChanged = (accts) => {
          if (!accts || accts.length === 0) {
            detachProviderListeners()
            setState(s => ({ ...s, wallet: null }))
            notify('Wallet disconnected.', 'info')
          } else {
            setState(s => (s.wallet ? { ...s, wallet: { ...s.wallet, address: accts[0] } } : s))
          }
        }
        const onChainChanged = (hexId) => {
          setState(s => (s.wallet ? { ...s, wallet: { ...s.wallet, chainId: parseInt(hexId, 16) } } : s))
        }
        match.provider.__onAccountsChanged = onAccountsChanged
        match.provider.__onChainChanged = onChainChanged
        match.provider.on?.('accountsChanged', onAccountsChanged)
        match.provider.on?.('chainChanged', onChainChanged)
        providerRef.current = match.provider
        setState(s => (s.wallet ? { ...s, wallet: { ...s.wallet, address: accounts[0] } } : s))
      } catch {
        // silent reconnect failed; leave persisted wallet as-is, user can reconnect manually
      }
    })
    return () => { cancelled = true; unsub() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // kept for any old call sites; routes to the demo wallet
  const connectWallet = connectDemoWallet

  // ---------------- trading ------------------------------------------------

  const swap = useCallback((symbol, side, amountIn) => {
    if (!requireWallet()) return { ok: false }
    if (!amountIn || amountIn <= 0) return { ok: false, error: 'Enter an amount.' }
    let result = { ok: false }
    setState(s => {
      const pool = s.pools[symbol]
      const zeroForOne = side === 'buy'
      const feeBps = quoteFeeBps(pool, zeroForOne)
      const inputToken = side === 'buy' ? QUOTE : symbol
      const bal = s.balances[inputToken] || 0
      if (bal < amountIn) {
        result = { ok: false, error: `Insufficient ${inputToken} balance.` }
        return s
      }
      const { amountOut, newReserveBase, newReserveQuote } = simulateSwap(pool, side, amountIn, feeBps)
      if (!(amountOut > 0)) {
        result = { ok: false, error: 'Trade too small or pool too shallow.' }
        return s
      }
      const outputToken = side === 'buy' ? symbol : QUOTE
      const balances = { ...s.balances }
      balances[inputToken] = +(balances[inputToken] - amountIn).toFixed(6)
      balances[outputToken] = +((balances[outputToken] || 0) + amountOut).toFixed(6)
      const notionalUSD = side === 'buy' ? amountIn : amountOut
      const trade = { symbol, side, amountIn, amountOut, feeBps, notionalUSD, at: Date.now(), trader: s.wallet.address }
      result = { ok: true, amountOut, feeBps }
      return {
        ...s,
        balances,
        trades: [trade, ...s.trades].slice(0, 500),
        pools: {
          ...s.pools,
          [symbol]: {
            ...pool,
            reserveBase: newReserveBase,
            reserveQuote: newReserveQuote,
            volumeUSD: pool.volumeUSD + notionalUSD,
            lastTradeAt: Date.now(),
          },
        },
      }
    })
    return result
  }, [requireWallet])

  // ---------------- liquidity ----------------------------------------------

  const addLiquidity = useCallback((symbol, quoteAmount) => {
    if (!requireWallet()) return { ok: false }
    if (!quoteAmount || quoteAmount <= 0) return { ok: false, error: 'Enter an amount.' }
    let result = { ok: false }
    setState(s => {
      const pool = s.pools[symbol]
      const price = pool.reserveQuote / pool.reserveBase
      const baseAmount = quoteAmount / price
      const quoteBal = s.balances[QUOTE] || 0
      const baseBal = s.balances[symbol] || 0
      if (quoteBal < quoteAmount || baseBal < baseAmount) {
        result = { ok: false, error: `Need ${quoteAmount.toFixed(2)} ${QUOTE} and ${baseAmount.toFixed(4)} ${symbol}.` }
        return s
      }
      const sharesMinted = (quoteAmount / pool.reserveQuote) * pool.totalShares
      const balances = { ...s.balances }
      balances[QUOTE] = +(balances[QUOTE] - quoteAmount).toFixed(6)
      balances[symbol] = +(balances[symbol] - baseAmount).toFixed(6)
      const existing = s.positions[symbol] || { shares: 0, costBasisUSD: 0, depositedAt: Date.now() }
      result = { ok: true, sharesMinted }
      return {
        ...s,
        balances,
        positions: {
          ...s.positions,
          [symbol]: {
            shares: existing.shares + sharesMinted,
            costBasisUSD: existing.costBasisUSD + quoteAmount * 2,
            depositedAt: existing.shares > 0 ? existing.depositedAt : Date.now(),
          },
        },
        liquidityEvents: [{ symbol, trader: s.wallet.address, type: 'deposit', at: Date.now() }, ...s.liquidityEvents].slice(0, 500),
        pools: {
          ...s.pools,
          [symbol]: {
            ...pool,
            reserveBase: pool.reserveBase + baseAmount,
            reserveQuote: pool.reserveQuote + quoteAmount,
            totalShares: pool.totalShares + sharesMinted,
          },
        },
      }
    })
    return result
  }, [requireWallet])

  const removeLiquidity = useCallback((symbol, sharesToBurn) => {
    if (!requireWallet()) return { ok: false }
    let result = { ok: false }
    setState(s => {
      const pos = s.positions[symbol]
      if (!pos || sharesToBurn > pos.shares) {
        result = { ok: false, error: 'Not enough shares.' }
        return s
      }
      const pool = s.pools[symbol]
      const fracOfPool = sharesToBurn / pool.totalShares
      const outBase = pool.reserveBase * fracOfPool
      const outQuote = pool.reserveQuote * fracOfPool
      const balances = { ...s.balances }
      balances[symbol] = +((balances[symbol] || 0) + outBase).toFixed(6)
      balances[QUOTE] = +((balances[QUOTE] || 0) + outQuote).toFixed(6)
      const remainingShares = pos.shares - sharesToBurn
      const positions = { ...s.positions }
      if (remainingShares <= 1e-9) {
        delete positions[symbol]
      } else {
        positions[symbol] = { ...pos, shares: remainingShares, costBasisUSD: pos.costBasisUSD * (remainingShares / pos.shares) }
      }
      result = { ok: true, outBase, outQuote }
      return {
        ...s,
        balances,
        positions,
        liquidityEvents: [{ symbol, trader: s.wallet.address, type: 'withdraw', at: Date.now() }, ...s.liquidityEvents].slice(0, 500),
        pools: {
          ...s.pools,
          [symbol]: {
            ...pool,
            reserveBase: pool.reserveBase - outBase,
            reserveQuote: pool.reserveQuote - outQuote,
            totalShares: pool.totalShares - sharesToBurn,
          },
        },
      }
    })
    return result
  }, [requireWallet])

  // ---------------- lock & vote --------------------------------------------

  const lockTokens = useCallback((amount, days) => {
    if (!requireWallet()) return { ok: false }
    let result = { ok: false }
    setState(s => {
      const bal = s.balances[GOV_TOKEN] || 0
      if (amount > bal) {
        result = { ok: false, error: `Insufficient ${GOV_TOKEN} balance.` }
        return s
      }
      if (days < 7 || days > 730) {
        result = { ok: false, error: 'Lock duration must be 7-730 days.' }
        return s
      }
      const now = Date.now()
      const newUnlock = now + days * 24 * 60 * 60 * 1000
      const prior = s.lock
      const unlockTime = prior ? Math.max(prior.unlockTime, newUnlock) : newUnlock
      const lockedAmount = (prior ? prior.amount : 0) + amount
      result = { ok: true }
      return {
        ...s,
        balances: { ...s.balances, [GOV_TOKEN]: +(bal - amount).toFixed(6) },
        lock: { amount: lockedAmount, unlockTime, lockedAt: prior ? prior.lockedAt : now },
      }
    })
    return result
  }, [requireWallet])

  const withdrawLock = useCallback(() => {
    if (!requireWallet()) return { ok: false }
    let result = { ok: false }
    setState(s => {
      if (!s.lock || s.lock.unlockTime > Date.now()) {
        result = { ok: false, error: 'Lock has not matured yet.' }
        return s
      }
      const amount = s.lock.amount
      result = { ok: true, amount }
      return {
        ...s,
        balances: { ...s.balances, [GOV_TOKEN]: (s.balances[GOV_TOKEN] || 0) + amount },
        lock: null,
        voteAllocations: {},
      }
    })
    return result
  }, [requireWallet])

  const vote = useCallback((symbol, points) => {
    if (!requireWallet()) return { ok: false }
    let result = { ok: false }
    setState(s => {
      const weight = liveVeWeight(s.lock)
      const currentTotal = Object.entries(s.voteAllocations).reduce((a, [k, v]) => a + (k === symbol ? 0 : v), 0)
      if (points < 0 || currentTotal + points > weight + 1e-6) {
        result = { ok: false, error: `You only have ${weight.toFixed(0)} ve weight; leave headroom for decay.` }
        return s
      }
      result = { ok: true }
      return {
        ...s,
        voteAllocations: { ...s.voteAllocations, [symbol]: points },
        voteEvents: [{ trader: s.wallet.address, at: Date.now(), symbol, points }, ...s.voteEvents].slice(0, 500),
      }
    })
    return result
  }, [requireWallet])

  const resetDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState(freshState())
    notify('Demo state reset.', 'info')
  }, [notify])

  // ---------------- derived --------------------------------------------------

  const veWeight = useMemo(() => liveVeWeight(state.lock), [state.lock])
  const totalVotesAllocated = useMemo(
    () => Object.values(state.voteAllocations).reduce((a, b) => a + b, 0),
    [state.voteAllocations]
  )
  const weeklyEmissionTotal = useMemo(
    () => weeklyEmission(state.tokenomics.tail, state.tokenomics.weeklyBps),
    [state.tokenomics]
  )

  const value = {
    ...state,
    veWeight,
    totalVotesAllocated,
    weeklyEmissionTotal,
    toast,
    clearToast: () => setToast(null),
    walletModalOpen,
    openWalletModal: () => setWalletModalOpen(true),
    closeWalletModal: () => setWalletModalOpen(false),
    connectWallet,
    connectInjectedWallet,
    connectDemoWallet,
    disconnectWallet,
    swap,
    addLiquidity,
    removeLiquidity,
    lockTokens,
    withdrawLock,
    vote,
    resetDemo,
    notify,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}