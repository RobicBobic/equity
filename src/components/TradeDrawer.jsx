import React, { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { quoteFeeBps, priceOf, fmtNum } from '../engine'
import { QUOTE } from '../data/markets'
import Avatar from './Avatar'
import { IconClose } from './Icons'

export default function TradeDrawer({ symbol, onClose }) {
  const { pools, balances, wallet, swap, openWalletModal } = useStore()
  const pool = pools[symbol]
  const [side, setSide] = useState('buy')
  const [amount, setAmount] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const price = priceOf(pool)
  const feeBps = quoteFeeBps(pool, side === 'buy')
  const inputToken = side === 'buy' ? QUOTE : symbol
  const outputToken = side === 'buy' ? symbol : QUOTE
  const balance = balances[inputToken] || 0

  const estOut = useMemo(() => {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) return 0
    const feeMult = 1 - feeBps / 10000
    const amtAfterFee = amt * feeMult
    const k = pool.reserveBase * pool.reserveQuote
    if (side === 'buy') {
      const newQuote = pool.reserveQuote + amtAfterFee
      const newBase = k / newQuote
      return pool.reserveBase - newBase
    } else {
      const newBase = pool.reserveBase + amtAfterFee
      const newQuote = k / newBase
      return pool.reserveQuote - newQuote
    }
  }, [amount, feeBps, pool, side])

  function setMax() {
    setAmount(String(balance))
  }

  function handleSwap() {
    setError('')
    setResult(null)
    if (!wallet) { openWalletModal(); return }
    const amt = parseFloat(amount)
    const r = swap(symbol, side, amt)
    if (!r.ok) setError(r.error || 'Trade failed.')
    else {
      setResult(r)
      setAmount('')
    }
  }

  return (
    <div className="drawer-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="drawer">
        <div className="drawer-header">
          <div className="drawer-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar symbol={symbol} size={28} />
            {symbol}/{QUOTE}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><IconClose width={14} height={14} /> Close</button>
        </div>

        <div className="summary-row"><span>Price</span><b>${fmtNum(price, 2)}</b></div>

        <div className="side-toggle">
          <button className={side === 'buy' ? 'active' : ''} onClick={() => { setSide('buy'); setAmount('') }}>Buy {symbol}</button>
          <button className={'sell' + (side === 'sell' ? ' active' : '')} onClick={() => { setSide('sell'); setAmount('') }}>Sell {symbol}</button>
        </div>

        <div className="field">
          <label>You pay ({inputToken})</label>
          <input
            type="number"
            min="0"
            placeholder="0.0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <div className="max-btn" onClick={setMax}>MAX · {fmtNum(balance, 4)}</div>
        </div>

        <div className="summary-row">
          <span>You receive (est.)</span>
          <b>{fmtNum(estOut, 6)} {outputToken}</b>
        </div>
        <div className="summary-row">
          <span>Fee ({pool.feeModel})</span>
          <b>{(feeBps / 100).toFixed(2)}%</b>
        </div>
        <div className="summary-row">
          <span>Min received (2% slippage)</span>
          <b>{fmtNum(estOut * 0.98, 6)} {outputToken}</b>
        </div>

        {error && <div className="err-msg">{error}</div>}
        {result && <div className="ok-msg">Swapped — received {fmtNum(result.amountOut, 6)} {outputToken}.</div>}

        <button className="btn btn-primary btn-block" onClick={handleSwap} disabled={!amount || parseFloat(amount) <= 0}>
          {wallet ? `Swap ${inputToken} → ${outputToken}` : 'Connect wallet to trade'}
        </button>
      </div>
    </div>
  )
}
