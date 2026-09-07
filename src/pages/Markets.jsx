import React, { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import TradeDrawer from '../components/TradeDrawer'
import Avatar from '../components/Avatar'
import { IconArrowRight } from '../components/Icons'
import { priceOf, fmtNum, fmtUSD, bpsToPct } from '../engine'
import { QUOTE, MARKET_SEED } from '../data/markets'

function feePill(pool) {
  if (pool.feeModel === 'flat') return <span className="pill">{bpsToPct(pool.buyFeeBps)} · Flat</span>
  if (pool.feeModel === 'calendar') return <span className="pill pill-lime">{bpsToPct(pool.buyFeeBps)} in · {bpsToPct(pool.sellFeeBps)} out · Calendar</span>
  return (
    <span className="pill">
      <span className="fee-buy">{bpsToPct(pool.buyFeeBps)}</span> / <span className="fee-sell">{bpsToPct(pool.sellFeeBps)}</span> · Directional
    </span>
  )
}

export default function Markets() {
  const { pools, voteAllocations, totalVotesAllocated } = useStore()
  const [tradeSymbol, setTradeSymbol] = useState(null)
  const list = useMemo(() => Object.values(pools), [pools])

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div>
            <h1>Every market sets<br /><em>its own fee.</em></h1>
            <p>Hook-native ve(3,3) exchange on Uniswap v4. Autonomous, session-aware, direction-aware fees, live on Robinhood Chain.</p>
          </div>
        </div>
      </section>

      <div className="ticker-bar">
        <div className="ticker-track">
          {[...list, ...list].map((p, i) => (
            <div className="ticker-item" key={p.symbol + i}>
              <b>{p.symbol}</b> ${fmtNum(priceOf(p), 2)} <span className="chg">{bpsToPct(p.buyFeeBps)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="page">
        <div className="page-header">
          <div>
            <div className="page-title">Markets</div>
            <div className="page-sub">{list.length} pools · quoted in {QUOTE}</div>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pool</th>
                <th>Price</th>
                <th>TVL</th>
                <th>Reserves</th>
                <th>Volume</th>
                <th>Fee · buy/sell</th>
                <th>ve weight</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map(p => {
                const price = priceOf(p)
                const tvl = p.reserveQuote * 2
                const votePct = totalVotesAllocated > 0 ? ((voteAllocations[p.symbol] || 0) / totalVotesAllocated) * 100 : 0
                return (
                  <tr key={p.symbol}>
                    <td>
                      <div className="asset-cell">
                        <Avatar symbol={p.symbol} />
                        <div>
                          <div className="asset-name">{p.symbol}/{QUOTE}</div>
                          <div className="asset-sub">
                            <span className="asset-sub-name">{p.name}</span>
                            <span className="pill">{p.category}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>${fmtNum(price, price < 10 ? 4 : 2)}</td>
                    <td>{fmtUSD(tvl)}</td>
                    <td style={{ color: 'var(--text-dim)' }}>{fmtNum(p.reserveBase, 2)} · {fmtNum(p.reserveQuote, 0)} {QUOTE}</td>
                    <td>{fmtUSD(p.volumeUSD)}</td>
                    <td>{feePill(p)}</td>
                    <td>
                      <span className="weight-bar"><span className="weight-bar-fill" style={{ width: votePct + '%' }} /></span>
                      {votePct.toFixed(0)}%
                    </td>
                    <td><button className="btn btn-primary btn-sm" onClick={() => setTradeSymbol(p.symbol)}>Trade <IconArrowRight width={13} height={13} /></button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {tradeSymbol && <TradeDrawer symbol={tradeSymbol} onClose={() => setTradeSymbol(null)} />}
    </>
  )
}