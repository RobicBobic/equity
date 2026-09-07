import React, { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { fmtUSD, fmtNum, shortAddr } from '../engine'

export default function Leaderboard() {
  const { trades, liquidityEvents, positions, lock, veWeight, wallet, pools } = useStore()
  const [tab, setTab] = useState('traders')

  const totalVolume = trades.reduce((a, t) => a + t.notionalUSD, 0)
  const totalLpValue = Object.entries(positions).reduce((a, [sym, pos]) => {
    const pool = pools[sym]
    return a + (pool.totalShares > 0 ? (pos.shares / pool.totalShares) * pool.reserveQuote * 2 : 0)
  }, 0)
  const totalFeesClaimed = 0 // fees compound into pool value in this demo rather than a separate claim

  const traderRows = useMemo(() => {
    if (!wallet || trades.length === 0) return []
    const vol = trades.reduce((a, t) => a + t.notionalUSD, 0)
    return [{ address: wallet.address, volume: vol, count: trades.length }]
  }, [wallet, trades])

  const lpRows = useMemo(() => {
    if (!wallet || Object.keys(positions).length === 0) return []
    return [{ address: wallet.address, value: totalLpValue, pools: Object.keys(positions).length }]
  }, [wallet, positions, totalLpValue])

  const voterRows = useMemo(() => {
    if (!wallet || !lock) return []
    return [{ address: wallet.address, weight: veWeight, locked: lock.amount, unlocks: new Date(lock.unlockTime).toLocaleDateString() }]
  }, [wallet, lock, veWeight])

  return (
    <div className="page">
      <div className="page-header"><div className="page-title">Leaderboard<span className="dot">.</span></div></div>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Volume</div><div className="stat-value">{fmtUSD(totalVolume)}</div><div className="stat-foot">{traderRows.length} traders</div></div>
        <div className="stat-card"><div className="stat-label">LP value</div><div className="stat-value">{fmtUSD(totalLpValue)}</div><div className="stat-foot">{lpRows.length} providers</div></div>
        <div className="stat-card"><div className="stat-label">Fees claimed</div><div className="stat-value">≈ {fmtUSD(totalFeesClaimed)}</div><div className="stat-foot">lifetime</div></div>
        <div className="stat-card"><div className="stat-label">ve locked</div><div className="stat-value">{fmtNum(veWeight, 0)}</div><div className="stat-foot">{voterRows.length} voters</div></div>
      </div>

      <div style={{ marginBottom: 6, color: 'var(--text-dim)', fontSize: 15 }}>
        swap volume across all markets, since deploy
      </div>

      <div className="tab-row" style={{ marginTop: 16 }}>
        <button className={'tab-btn' + (tab === 'traders' ? ' active' : '')} onClick={() => setTab('traders')}>Traders</button>
        <button className={'tab-btn' + (tab === 'liquidity' ? ' active' : '')} onClick={() => setTab('liquidity')}>Liquidity</button>
        <button className={'tab-btn' + (tab === 'voters' ? ' active' : '')} onClick={() => setTab('voters')}>Voters</button>
      </div>

      {tab === 'traders' && (
        traderRows.length === 0 ? <div className="empty-panel">No swaps yet.</div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Address</th><th>Volume</th><th>Trades</th></tr></thead>
              <tbody>{traderRows.map((r, i) => (
                <tr key={r.address}><td>{i + 1}</td><td>{shortAddr(r.address)}</td><td>{fmtUSD(r.volume)}</td><td>{r.count}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )
      )}

      {tab === 'liquidity' && (
        lpRows.length === 0 ? <div className="empty-panel">No liquidity providers yet.</div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Address</th><th>LP value</th><th>Pools</th></tr></thead>
              <tbody>{lpRows.map((r, i) => (
                <tr key={r.address}><td>{i + 1}</td><td>{shortAddr(r.address)}</td><td>{fmtUSD(r.value)}</td><td>{r.pools}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )
      )}

      {tab === 'voters' && (
        voterRows.length === 0 ? <div className="empty-panel">No swaps yet.</div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Address</th><th>ve weight</th><th>Locked {`CAP`}</th><th>Unlocks</th></tr></thead>
              <tbody>{voterRows.map((r, i) => (
                <tr key={r.address}><td>{i + 1}</td><td>{shortAddr(r.address)}</td><td>{fmtNum(r.weight, 0)}</td><td>{fmtNum(r.locked, 0)}</td><td>{r.unlocks}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )
      )}
    </div>
  )
}
