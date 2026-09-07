import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Toast from './components/Toast'
import WalletModal from './components/WalletModal'
import { useStore } from './context/StoreContext'
import Markets from './pages/Markets'
import Portfolio from './pages/Portfolio'
import Leaderboard from './pages/Leaderboard'
import Vote from './pages/Vote'
import Docs from './pages/Docs'

export default function App() {
  const { walletModalOpen, closeWalletModal } = useStore()

  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<Markets />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
      <Footer />
      <Toast />
      {walletModalOpen && <WalletModal onClose={closeWalletModal} />}
    </div>
  )
}
