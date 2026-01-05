// src/pages/Payout.jsx
import React, { useEffect, useState } from 'react'
import supabase from '../supabaseClient'

const Payout = () => {
  const [payout, setPayout] = useState(0)

  useEffect(() => {
    calculatePayout()
  }, [])

  const calculatePayout = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data, error } = await supabase
      .from('songs')
      .select('unique_plays')
      .eq('user_id', session.user.id)

    if (error) console.error(error)
    else {
      const totalUnique = data.reduce((acc, song) => acc + song.unique_plays, 0)
      const amount = totalUnique * (0.4 * 5000)
      setPayout(amount)
    }
  }

  return (
    <div className="payout">
      <h1>Payout</h1>
      <p>Your estimated payout: {payout} RWF</p>
      <p>Calculation: Unique plays * (40% of 5000 RWF)</p>
    </div>
  )
}

export default Payout