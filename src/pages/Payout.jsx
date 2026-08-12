// src/pages/Payout.jsx
import React, { useCallback, useEffect, useState } from 'react'
import { listSongsByUser } from '../lib/dataApi'
import { useAuth } from '../context/AuthContext'

const RATE_PER_UNIQUE_PLAY = 0.4 * 5000

const Payout = () => {
  const { user } = useAuth()
  const [payout, setPayout] = useState(0)
  const [error, setError] = useState(null)

  const calculatePayout = useCallback(async () => {
    if (!user) return
    try {
      const songs = await listSongsByUser(user.id)
      const totalUnique = songs.reduce((acc, s) => acc + (s.unique_plays || 0), 0)
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
      <h1>Payout</h1>
      {error && <div className="auth-error" role="alert">{error}</div>}
      <p>Your estimated payout: {payout.toLocaleString()} RWF</p>
      <p>Calculation: Unique plays * (40% of 5000 RWF)</p>
    </div>
  )
}

export default Payout
