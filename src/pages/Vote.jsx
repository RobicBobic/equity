import React, { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import Avatar from '../components/Avatar'
import { fmtNum } from '../engine'
import { GOV_TOKEN } from '../data/markets'

export default function Vote() {
  const {
    wallet, balances, lock, veWeight, voteAllocations, totalVotesAllocated,
    weeklyEmissionTotal, tokenomics, lockTokens, withdrawLock, vote, openWalletModal,
    pools,
  } = useStore()

  const [amount, setAmount] = useState('1000')
  const [days, setDays] = useState('365')
  const [error, setError] = useState('')
  const [voteInputs, setVoteInputs] = useState({})
  const [voteMsg, setVoteMsg] = useState({})

  const epochLength = tokenomics.epochLengthMs
  const elapsed = Date.now() - tokenomics.epochStart
  const epochsPassed = Math.floor(elapsed / epochLength)
  const intoEpoch = elapsed - epochsPassed * epochLength
  const remainingMs = epochLength - intoEpoch
  const remainingDays = Math.floor(remainingMs / (24 * 60 * 60 * 1000))
  const remainingHours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  const epochProgressPct = (intoEpoch / epochLength) * 100

  const liquidBalance = balances[GOV_TOKEN] || 0
  const canWithdraw = lock && lock.unlockTime <= Date.now()

  function handleLock() {
    setError('')
    if (!wallet) { openWalletModal(); return }
    const r = lockTokens(parseFloat(amount), parseInt(days, 10))
    if (!r.ok) setError(r.error)
  }

  function handleWithdraw() {
    setError('')
    const r = withdrawLock()
    if (!r.ok) setError(r.error)
  }

  function handleVote(symbol) {
    const pts = parseFloat(voteInputs[symbol])
    const r = vote(symbol, isNaN(pts) ? 0 : pts)
    setVoteMsg(m => ({ ...m, [symbol]: r.ok ? 'Vote recorded.' : r.error }))
  }

  const rows = useMemo(() => Object.values(pools), [pools])

  return (
    <div className="page">
      <div className="epoch-bar">
        <div style={{ fontSize: 12, color: 'var(--text-dimmer)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Epoch {epochsPassed} · to next distribution
        </div>
        <div className="epoch-progress"><div className="epoch-progress-fill" style={{ width: epochProgressPct + '%' }} /></div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 20 }}>{remainingDays}d {remainingHours}h</div>
      </div>

      <div className="vote-layout">
        <div className="lock-panel">
          <h3 style={{ margin: '0 0 6px', fontSize: 18, fontFamily: 'var(--serif)' }}>Lock {GOV_TOKEN} → ve{GOV_TOKEN}</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: 13.5, margin: '0 0 4px' }}>
            Weight decays linearly to zero at unlock. Weekly emissions: {fmtNum(weeklyEmissionTotal / 1000, 1)}k {GOV_TOKEN}.
          </p>

          <div className="lock-stat-grid">
            <div className="lock-stat"><div className="stat-label">Liquid {GOV_TOKEN}</div><div className="stat-value">{fmtNum(liquidBalance, 0)}</div></div>
            <div className="lock-stat"><div className="stat-label">Locked</div><div className="stat-value">{fmtNum(lock?.amount || 0, 0)}</div></div>
            <div className="lock-stat"><div className="stat-label">ve weight</div><div className="stat-value">{fmtNum(veWeight, 0)}</div></div>
            <div className="lock-stat"><div className="stat-label">Unlocks</div><div className="stat-value" style={{ fontSize: 15 }}>{lock ? new Date(lock.unlockTime).toLocaleDateString() : '-'}</div></div>
          </div>

          <div className="field">
            <label>Amount ({GOV_TOKEN})</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div className="field" style={{ marginTop: 10 }}>
            <label>Lock (days, 7-730)</label>
            <input type="number" min="7" max="730" value={days} onChange={e => setDays(e.target.value)} />
          </div>

          {error && <div className="err-msg" style={{ marginTop: 10 }}>{error}</div>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
            <button className="btn btn-primary btn-block" onClick={handleLock}>
              {wallet ? 'Lock' : 'Connect wallet'}
            </button>
            <button className="btn btn-block" onClick={handleWithdraw} disabled={!canWithdraw}>
              Withdraw matured lock
            </button>
          </div>
        </div>

        <div className="emissions-panel">
          <h3 style={{ margin: '0 0 6px', fontSize: 18, fontFamily: 'var(--serif)' }}>Direct emissions</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '10px 0 4px' }}>
            <div className="weight-bar" style={{ width: 120 }}><div className="weight-bar-fill" style={{ width: '100%' }} /></div>
            <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{fmtNum(weeklyEmissionTotal, 0)} {GOV_TOKEN}/week</span>
          </div>
          <p style={{ color: 'var(--text-dimmer)', fontSize: 12.5, margin: '0 0 16px' }}>
            Your weight: {fmtNum(veWeight, 0)} total · {fmtNum(totalVotesAllocated, 0)} committed · {fmtNum(Math.max(0, veWeight - totalVotesAllocated), 0)} free this epoch.
          </p>

          <div>
            {rows.map(p => {
              const allocated = voteAllocations[p.symbol] || 0
              const pct = totalVotesAllocated > 0 ? (allocated / totalVotesAllocated) * 100 : 0
              const estEmission = weeklyEmissionTotal * (pct / 100)
              return (
                <div className="vote-row" key={p.symbol}>
                  <Avatar symbol={p.symbol} size={30} />
                  <div className="info">
                    <div className="name">{p.symbol}/USDG</div>
                    <div className="emission-est">≈ {fmtNum(estEmission, 0)} {GOV_TOKEN}/epoch</div>
                    {voteMsg[p.symbol] && <div style={{ fontSize: 11.5, color: voteMsg[p.symbol].includes('recorded') ? 'var(--lime)' : 'var(--red)' }}>{voteMsg[p.symbol]}</div>}
                  </div>
                  <span className="weight-bar"><span className="weight-bar-fill" style={{ width: pct + '%' }} /></span>
                  <span style={{ fontSize: 12, width: 34, textAlign: 'right' }}>{pct.toFixed(0)}%</span>
                  <input
                    placeholder="weight"
                    value={voteInputs[p.symbol] ?? ''}
                    onChange={e => setVoteInputs(v => ({ ...v, [p.symbol]: e.target.value }))}
                  />
                  <button className="btn btn-sm" onClick={() => handleVote(p.symbol)}>Vote</button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
