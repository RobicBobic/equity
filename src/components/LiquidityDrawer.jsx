import React, { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { priceOf, fmtNum } from '../engine'
import { QUOTE } from '../data/markets'
import Avatar from './Avatar'
import { IconClose } from './Icons'

export default function LiquidityDrawer({ symbol, onClose }) {
  const { pools, positions, balances, addLiquidity, removeLiquidity, wallet, openWalletModal } = useStore()
  const pool = pools[symbol]
  const pos = positions[symbol]
  const [mode, setMode] = useState('deposit')
  const [quoteAmount, setQuoteAmount] = useState('')
  const [burnPct, setBurnPct] = useState(100)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  const price = priceOf(pool)
  const baseNeeded = quoteAmount ? parseFloat(quoteAmount) / price : 0
  const poolShareValue = pos ? (pos.shares / pool.totalShares) * pool.reserveQuote * 2 : 0

  function handleDeposit() {
    setError(''); setOk('')
    if (!wallet) { openWalletModal(); return }
    const r = addLiquidity(symbol, parseFloat(quoteAmount))
    if (!r.ok) setError(r.error || 'Deposit failed.')
    else { setOk('Liquidity added.'); setQuoteAmount('') }
  }

  function handleWithdraw() {
    setError(''); setOk('')
    if (!pos) return
    const shares = pos.shares * (burnPct / 100)
    const r = removeLiquidity(symbol, shares)
    if (!r.ok) setError(r.error || 'Withdraw failed.')
    else setOk(`Withdrew ${fmtNum(r.outQuote, 2)} ${QUOTE} + ${fmtNum(r.outBase, 4)} ${symbol}.`)
  }

  return (
    <div className="drawer-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="drawer">
        <div className="drawer-header">
          <div className="drawer-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar symbol={symbol} size={28} />
            {symbol}/{QUOTE} liquidity
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><IconClose width={14} height={14} /> Close</button>
        </div>

        <div className="side-toggle">
          <button className={mode === 'deposit' ? 'active' : ''} onClick={() => setMode('deposit')}>Deposit</button>
          <button className={mode === 'withdraw' ? 'active' : ''} onClick={() => setMode('withdraw')}>Withdraw</button>
        </div>

        {mode === 'deposit' ? (
          <>
            <div className="field">
              <label>Deposit ({QUOTE}, paired 1:1 by value)</label>
              <input type="number" min="0" placeholder="0.0" value={quoteAmount} onChange={e => setQuoteAmount(e.target.value)} />
            </div>
            <div className="summary-row"><span>Balance</span><b>{fmtNum(balances[QUOTE] || 0, 2)} {QUOTE}</b></div>
            <div className="summary-row"><span>Paired {symbol} required</span><b>{fmtNum(baseNeeded, 4)} {symbol}</b></div>
            <div className="summary-row"><span>Your {symbol} balance</span><b>{fmtNum(balances[symbol] || 0, 4)}</b></div>
            {error && <div className="err-msg">{error}</div>}
            {ok && <div className="ok-msg">{ok}</div>}
            <button className="btn btn-primary btn-block" onClick={handleDeposit} disabled={!quoteAmount || parseFloat(quoteAmount) <= 0}>
              {wallet ? 'Deposit' : 'Connect wallet'}
            </button>
          </>
        ) : (
          <>
            <div className="summary-row"><span>Your shares</span><b>{fmtNum(pos?.shares || 0, 4)}</b></div>
            <div className="summary-row"><span>Est. value</span><b>${fmtNum(poolShareValue, 2)}</b></div>
            <div className="field">
              <label>Withdraw {burnPct}%</label>
              <input type="range" min="1" max="100" value={burnPct} onChange={e => setBurnPct(+e.target.value)} />
            </div>
            {error && <div className="err-msg">{error}</div>}
            {ok && <div className="ok-msg">{ok}</div>}
            <button className="btn btn-primary btn-block" onClick={handleWithdraw} disabled={!pos || pos.shares <= 0}>
              Withdraw
            </button>
          </>
        )}
      </div>
    </div>
  )
}
