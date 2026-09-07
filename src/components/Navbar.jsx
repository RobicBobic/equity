import React from 'react'
import { NavLink } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { shortAddr } from '../engine'
import { chainName } from '../wallet'
import { IconMarkets, IconPortfolio, IconTrophy, IconVote, IconDocs, IconWallet } from './Icons'

const links = [
  { to: '/', label: 'Markets', Icon: IconMarkets, end: true },
  { to: '/portfolio', label: 'Portfolio', Icon: IconPortfolio },
  { to: '/leaderboard', label: 'Leaderboard', Icon: IconTrophy },
  { to: '/vote', label: 'Vote', Icon: IconVote },
  { to: '/docs', label: 'Docs', Icon: IconDocs },
]

export default function Navbar() {
  const { wallet, disconnectWallet, openWalletModal } = useStore()

  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        <img src="/logo.png" alt="" className="brand-mark" />
        Equity
      </NavLink>

      <nav className="nav-links">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          >
            <l.Icon width={15} height={15} />{l.label}
          </NavLink>
        ))}
      </nav>

      {wallet ? (
        <button className="wallet-pill" onClick={disconnectWallet} title="Click to disconnect">
          <span className="wallet-dot" />
          {shortAddr(wallet.address)}
          {wallet.kind === 'injected' && wallet.chainId && (
            <span className="wallet-chain">{chainName(wallet.chainId)}</span>
          )}
        </button>
      ) : (
        <button className="btn btn-primary" onClick={openWalletModal}>
          <IconWallet width={15} height={15} /> Connect wallet
        </button>
      )}
    </header>
  )
}