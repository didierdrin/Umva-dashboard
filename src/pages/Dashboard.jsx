// src/pages/Dashboard.jsx
import React, { useCallback, useEffect, useState } from 'react'
import { FaPlay, FaUsers, FaMusic, FaCompactDisc } from 'react-icons/fa'
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
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon"><FaPlay /></div>
          <span className="stat-label">Total Plays</span>
          <span className="stat-value">{totalPlays.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaUsers /></div>
          <span className="stat-label">Unique Plays</span>
          <span className="stat-value">{totalUnique.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaMusic /></div>
          <span className="stat-label">Songs</span>
          <span className="stat-value">{songs.length}</span>
        </div>
      </div>

      {error && <div className="auth-error" role="alert">{error}</div>}

      <div className="panel">
        <h2 className="panel-title">Your Songs</h2>
        <p className="panel-subtitle">Performance across everything you've published.</p>

        {loading ? (
          <div className="table-wrap">
            <div className="skeleton" style={{ height: 44, margin: 14 }} />
            <div className="skeleton" style={{ height: 44, margin: 14 }} />
            <div className="skeleton" style={{ height: 44, margin: 14 }} />
          </div>
        ) : songs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FaCompactDisc /></div>
            <p>No songs yet. Add one from the Library page.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
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
                    <td>
                      <div className="track-cell">
                        {song.image_url ? (
                          <img className="track-cover" src={song.image_url} alt="" />
                        ) : (
                          <div className="track-cover-fallback"><FaMusic /></div>
                        )}
                        <div>
                          <div className="track-title">{song.title}</div>
                          {song.artist && <div className="track-artist">{song.artist}</div>}
                        </div>
                      </div>
                    </td>
                    <td>{song.total_plays || 0}</td>
                    <td>{song.unique_plays || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
