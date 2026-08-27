// src/pages/Payout.jsx
import React, { useCallback, useEffect, useState } from 'react'
import { FaWallet } from 'react-icons/fa'
import { listSongsByUser } from '../lib/dataApi'
import { useAuth } from '../context/AuthContext'

const RATE_PER_UNIQUE_PLAY = 0.4 * 5000

const Payout = () => {
  const { user } = useAuth()
  const [payout, setPayout] = useState(0)
  const [uniquePlays, setUniquePlays] = useState(0)
  const [error, setError] = useState(null)

  const calculatePayout = useCallback(async () => {
    if (!user) return
    try {
      const songs = await listSongsByUser(user.id)
      const totalUnique = songs.reduce((acc, s) => acc + (s.unique_plays || 0), 0)
      setUniquePlays(totalUnique)
      setPayout(totalUnique * RATE_PER_UNIQUE_PLAY)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }, [user])

  useEffect(() => {
    calculatePayout()
  }, [calculatePayout])

  return (
    <div className="payout">
      {error && <div className="auth-error" role="alert">{error}</div>}

      <div className="hero-card">
        <span className="hero-label">Estimated Payout</span>
        <div className="hero-value">{payout.toLocaleString()} RWF</div>
        <p className="hero-sub">Based on {uniquePlays.toLocaleString()} unique plays</p>
      </div>

      <div className="panel">
        <h2 className="panel-title">How this is calculated</h2>
        <p className="panel-subtitle">Your payout scales with how many unique listeners you reach.</p>
        <div className="stat-grid" style={{ marginBottom: 0 }}>
          <div className="stat-card">
            <div className="stat-icon"><FaWallet /></div>
            <span className="stat-label">Rate per unique play</span>
            <span className="stat-value">{RATE_PER_UNIQUE_PLAY.toLocaleString()} RWF</span>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><FaWallet /></div>
            <span className="stat-label">Unique plays</span>
            <span className="stat-value">{uniquePlays.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payout
