import React, { useEffect, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { initWalletDiscovery, subscribeWallets } from '../wallet'
import { IconClose, IconWallet } from './Icons'

// Known wallets we specifically call out even before they're detected, so the
// picker still explains what to install if nothing is found yet.
const FEATURED = [
  { rdns: 'io.metamask', name: 'MetaMask', installUrl: 'https://metamask.io/download' },
  { rdns: 'com.okex.wallet', name: 'OKX Wallet', installUrl: 'https://www.okx.com/web3' },
]

function WalletRow({ detail, busy, error, onConnect }) {
  const name = detail.info?.name || 'Wallet'
  return (
    <button className="wallet-row" onClick={() => onConnect(detail)} disabled={busy}>
      <span className="wallet-row-icon">
        {detail.info?.icon ? <img src={detail.info.icon} alt="" /> : <IconWallet width={18} height={18} />}
      </span>
      <span className="wallet-row-name">{name}</span>
      <span className="wallet-row-action">{busy ? 'Connecting…' : 'Connect'}</span>
    </button>
  )
}

export default function WalletModal({ onClose }) {
  const { connectInjectedWallet, connectDemoWallet } = useStore()
  const [wallets, setWallets] = useState([])
  const [busyRdns, setBusyRdns] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    initWalletDiscovery()
    return subscribeWallets(setWallets)
  }, [])

  const detectedRdns = new Set(wallets.map(w => w.info?.rdns))
  const notYetDetected = FEATURED.filter(f => !detectedRdns.has(f.rdns))

  async function handleConnect(detail) {
    setError('')
    setBusyRdns(detail.info?.rdns)
    try {
      await connectInjectedWallet(detail)
      onClose()
    } catch (e) {
      setError(e?.message?.includes('rejected') ? 'Connection request was rejected.' : (e?.message || 'Failed to connect.'))
    } finally {
      setBusyRdns(null)
    }
  }

  function handleDemo() {
    connectDemoWallet()
    onClose()
  }

  return (
    <div className="drawer-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="drawer wallet-modal">
        <div className="drawer-header">
          <div className="drawer-title">Connect a wallet</div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><IconClose width={14} height={14} /> Close</button>
        </div>

        {wallets.length === 0 && (
          <div className="wallet-empty">Looking for installed wallets…</div>
        )}

        <div className="wallet-list">
          {wallets.map(detail => (
            <WalletRow
              key={detail.info?.rdns}
              detail={detail}
              busy={busyRdns === detail.info?.rdns}
              onConnect={handleConnect}
            />
          ))}
        </div>

        {notYetDetected.length > 0 && (
          <div className="wallet-install-list">
            {notYetDetected.map(f => (
              <a key={f.rdns} className="wallet-row wallet-row-install" href={f.installUrl} target="_blank" rel="noreferrer">
                <span className="wallet-row-icon"><IconWallet width={18} height={18} /></span>
                <span className="wallet-row-name">{f.name}</span>
                <span className="wallet-row-action">Not detected · Install</span>
              </a>
            ))}
          </div>
        )}

        {error && <div className="err-msg">{error}</div>}

        <div className="wallet-divider"><span>or</span></div>

        <button className="btn btn-block" onClick={handleDemo}>
          Continue with a demo wallet
        </button>
        <p className="wallet-note">
          A demo wallet needs no extension — it creates a local mock address so you can try every
          feature without installing anything.
        </p>
      </div>
    </div>
  )
}
