// src/pages/Dashboard.jsx
import React, { useCallback, useEffect, useState } from 'react'
import { listSongsByUser } from '../lib/dataApi'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()
  const [songs, setSongs] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchSongs = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      setSongs(await listSongsByUser(user.id))
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchSongs()
  }, [fetchSongs])

  const totalPlays = songs.reduce((acc, s) => acc + (s.total_plays || 0), 0)
  const totalUnique = songs.reduce((acc, s) => acc + (s.unique_plays || 0), 0)

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {error && <div className="auth-error" role="alert">{error}</div>}

      <p>Total Plays: {totalPlays}</p>
      <p>Total Unique Plays: {totalUnique}</p>

      <h2>Your Songs</h2>
      {loading ? (
        <p>Loading…</p>
      ) : songs.length === 0 ? (
        <p>No songs yet. Add one from the Library page.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Plays</th>
              <th>Unique Plays</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr key={song.id}>
                <td>{song.title}</td>
                <td>{song.total_plays}</td>
                <td>{song.unique_plays}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Dashboard
