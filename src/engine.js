// Pure functions modelling the on-chain mechanics described in the docs.
// Nothing here touches storage; it just turns state + an action into a new state.

export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000
export const MAX_LOCK_MS = 730 * 24 * 60 * 60 * 1000
export const MIN_LOCK_DAYS = 7
export const MAX_LOCK_DAYS = 730

// ---- fee engine -----------------------------------------------------------

function inSession(date) {
  // Mon-Fri 14:00-21:00 UTC
  const day = date.getUTCDay() // 0 Sun .. 6 Sat
  const hour = date.getUTCHours()
  const isWeekday = day >= 1 && day <= 5
  return isWeekday && hour >= 14 && hour < 21
}

export function quoteFeeBps(market, zeroForOne, now = new Date()) {
  const { feeModel, buyFeeBps, sellFeeBps, floorBps, capBps, override } = market
  let fee
  if (override && override.expiresAt > now.getTime()) {
    fee = override.feeBps
  } else if (feeModel === 'flat') {
    fee = buyFeeBps
  } else if (feeModel === 'directional') {
    fee = zeroForOne ? buyFeeBps : sellFeeBps
  } else if (feeModel === 'calendar') {
    fee = inSession(now) ? buyFeeBps : sellFeeBps
  } else {
    fee = buyFeeBps
  }
  return Math.min(Math.max(fee, floorBps), capBps)
}

export function bpsToPct(bps) {
  return (bps / 100).toFixed(2) + '%'
}

// ---- constant product AMM --------------------------------------------------
// reserveBase = units of the asset token, reserveQuote = units of USDG

export function priceOf(pool) {
  if (!pool.reserveBase) return 0
  return pool.reserveQuote / pool.reserveBase
}

// exact-in swap. side 'buy' spends USDG for the asset, 'sell' spends the asset for USDG.
export function simulateSwap(pool, side, amountIn, feeBps) {
  const feeMult = 1 - feeBps / 10000
  const amountInAfterFee = amountIn * feeMult
  let amountOut, newReserveBase, newReserveQuote
  if (side === 'buy') {
    // in = quote, out = base
    const k = pool.reserveBase * pool.reserveQuote
    newReserveQuote = pool.reserveQuote + amountInAfterFee
    const newBase = k / newReserveQuote
    amountOut = pool.reserveBase - newBase
    newReserveBase = pool.reserveBase - amountOut
    // fee stays in the pool -> add the fee portion too
    newReserveQuote += amountIn - amountInAfterFee
  } else {
    const k = pool.reserveBase * pool.reserveQuote
    newReserveBase = pool.reserveBase + amountInAfterFee
    const newQuote = k / newReserveBase
    amountOut = pool.reserveQuote - newQuote
    newReserveQuote = pool.reserveQuote - amountOut
    newReserveBase += amountIn - amountInAfterFee
  }
  return { amountOut, newReserveBase, newReserveQuote }
}

// ---- ve(3,3) ----------------------------------------------------------------

export function liveVeWeight(lock, now = Date.now()) {
  if (!lock || !lock.amount) return 0
  const remaining = lock.unlockTime - now
  if (remaining <= 0) return 0
  return lock.amount * (Math.min(remaining, MAX_LOCK_MS) / MAX_LOCK_MS)
}

export function weeklyEmission(tail, weeklyBps) {
  return (tail * weeklyBps) / 10000
}

export function fmtUSD(n) {
  if (n === undefined || n === null || Number.isNaN(n)) return '$0.00'
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M'
  if (abs >= 1_000) return '$' + (n / 1_000).toFixed(2) + 'K'
  return '$' + n.toFixed(2)
}

export function fmtNum(n, decimals = 2) {
  if (n === undefined || n === null || Number.isNaN(n)) return '0'
  return n.toLocaleString(undefined, { maximumFractionDigits: decimals })
}

export function shortAddr(addr) {
  if (!addr) return ''
  return addr.slice(0, 6) + '...' + addr.slice(-4)
}

export function randomAddress() {
  const hex = '0123456789abcdef'
  let s = '0x'
  for (let i = 0; i < 40; i++) s += hex[Math.floor(Math.random() * 16)]
  return s
}

// deterministic, pleasant background color per symbol — used for the generated
// "pfp" badge so every market gets a distinct, stable identity color.
export function avatarColor(symbol) {
  let hash = 0
  for (let i = 0; i < symbol.length; i++) hash = (hash * 31 + symbol.charCodeAt(i)) >>> 0
  const hue = hash % 360
  return `hsl(${hue}, 46%, 38%)`
}

export function avatarLabel(symbol) {
  return symbol.length <= 4 ? symbol : symbol.slice(0, 4)
}
