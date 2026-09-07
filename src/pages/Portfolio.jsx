import React, { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import LiquidityDrawer from '../components/LiquidityDrawer'
import Avatar from '../components/Avatar'
import { IconReset } from '../components/Icons'
import { fmtUSD, fmtNum, priceOf } from '../engine'
import { QUOTE, GOV_TOKEN } from '../data/markets'

export default function Portfolio() {
  const { wallet, balances, positions, pools, veWeight, lock, openWalletModal, resetDemo } = useStore()
  const [liqSymbol, setLiqSymbol] = useState(null)

  const holdings = useMemo(() => {
    if (!wallet) return []
    return Object.entries(balances)
      .filter(([, amt]) => amt > 0)
      .map(([token, amt]) => {
        const price = token === QUOTE ? 1 : token === GOV_TOKEN ? 0.05 : priceOf(pools[token] || {})
        return { token, amt, valueUSD: amt * price }
      })
      .sort((a, b) => b.valueUSD - a.valueUSD)
  }, [wallet, balances, pools])

  const totalHoldingsUSD = holdings.reduce((a, h) => a + h.valueUSD, 0)

  const lpRows = useMemo(() => {
    return Object.entries(positions).map(([symbol, pos]) => {
      const pool = pools[symbol]
      const poolPct = pool.totalShares > 0 ? (pos.shares / pool.totalShares) * 100 : 0
      const valueUSD = pool.totalShares > 0 ? (pos.shares / pool.totalShares) * pool.reserveQuote * 2 : 0
      const pendingFees = Math.max(0, valueUSD - pos.costBasisUSD)
      return { symbol, pos, poolPct, valueUSD, pendingFees }
    })
  }, [positions, pools])

  const totalLpValue = lpRows.reduce((a, r) => a + r.valueUSD, 0)
  const totalPendingFees = lpRows.reduce((a, r) => a + r.pendingFees, 0)

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Portfolio</div>
        {wallet && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { if (window.confirm('Reset all local demo data? This clears your wallet, balances, positions, locks and votes.')) resetDemo() }}
          >
            <IconReset width={14} height={14} /> Reset demo
          </button>
        )}
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">{GOV_TOKEN}</div>
          <div className="stat-value">{fmtNum(balances[GOV_TOKEN] || 0, 0)}</div>
          <div className="stat-foot">{fmtNum(veWeight, 0)} ve weight</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">LP value</div>
          <div className="stat-value">{fmtUSD(totalLpValue)}</div>
          <div className="stat-foot">{lpRows.length} positions</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Unclaimed fees</div>
          <div className="stat-value">≈ {fmtUSD(totalPendingFees)}</div>
          <div className="stat-foot">{QUOTE} + asset legs</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Locked {GOV_TOKEN}</div>
          <div className="stat-value">{fmtNum(lock?.amount || 0, 0)}</div>
          <div className="stat-foot">{lock ? new Date(lock.unlockTime).toLocaleDateString() : 'no active lock'}</div>
        </div>
      </div>

      {!wallet && (
        <div className="empty-panel">
          Connect a wallet to see your holdings and liquidity.
          <div style={{ marginTop: 14 }}>
            <button className="btn btn-primary" onClick={openWalletModal}>Connect wallet</button>
          </div>
        </div>
      )}

      {wallet && (
        <>
          <div className="section-header">
            <div className="section-title">Holdings ≈ {fmtUSD(totalHoldingsUSD)}</div>
          </div>
          {holdings.length === 0 ? (
            <div className="empty-panel">Nothing held yet; trades settle straight to your wallet.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Token</th><th>Balance</th><th>Value</th></tr></thead>
                <tbody>
                  {holdings.map(h => (
                    <tr key={h.token}>
                      <td><div className="asset-cell"><Avatar symbol={h.token} /><div className="asset-name">{h.token}</div></div></td>
                      <td>{fmtNum(h.amt, 4)}</td>
                      <td>{fmtUSD(h.valueUSD)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="section-header">
            <div className="section-title">Your liquidity</div>
            <select
              className="btn btn-sm"
              defaultValue=""
              onChange={e => { if (e.target.value) { setLiqSymbol(e.target.value); e.target.value = '' } }}
            >
              <option value="" disabled>+ Add liquidity to a market</option>
              {Object.keys(pools).map(s => <option key={s} value={s}>{s}/{QUOTE}</option>)}
            </select>
          </div>
          {lpRows.length === 0 ? (
            <div className="empty-panel">
              No positions yet. Open a market from the Markets page and add liquidity to start earning fees.
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Pool</th><th>Shares</th><th>Pool %</th><th>Value</th><th>Pending fees</th><th></th></tr></thead>
                <tbody>
                  {lpRows.map(r => (
                    <tr key={r.symbol}>
                      <td><div className="asset-cell"><Avatar symbol={r.symbol} /><div className="asset-name">{r.symbol}/{QUOTE}</div></div></td>
                      <td>{fmtNum(r.pos.shares, 4)}</td>
                      <td>{r.poolPct.toFixed(2)}%</td>
                      <td>{fmtUSD(r.valueUSD)}</td>
                      <td style={{ color: 'var(--lime)' }}>≈ {fmtUSD(r.pendingFees)}</td>
                      <td><button className="btn btn-sm" onClick={() => setLiqSymbol(r.symbol)}>Manage</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {liqSymbol && <LiquidityDrawer symbol={liqSymbol} onClose={() => setLiqSymbol(null)} />}
    </div>
  )
}
