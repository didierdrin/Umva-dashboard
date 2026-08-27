// src/pages/Dashboard.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FaPlay, FaUsers, FaMusic, FaCompactDisc, FaFire } from 'react-icons/fa'
import { listSongsByUser } from '../lib/dataApi'
import { useAuth } from '../context/AuthContext'
import AnimatedNumber from '../components/AnimatedNumber'

const greetingFor = (hour) => {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

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

  const topSongs = useMemo(
    () => [...songs].sort((a, b) => (b.total_plays || 0) - (a.total_plays || 0)).slice(0, 5),
    [songs]
  )
  const maxPlays = topSongs[0]?.total_plays || 1

  const displayName = user?.name || user?.email?.split('@')[0] || 'there'
  const today = new Date()

  return (
    <div className="dashboard">
      <div className="dashboard-greeting">
        <h1>{greetingFor(today.getHours())}, {displayName}</h1>
        <p>{today.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon"><FaPlay /></div>
          <span className="stat-label">Total Plays</span>
          <span className="stat-value"><AnimatedNumber value={totalPlays} /></span>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaUsers /></div>
          <span className="stat-label">Unique Plays</span>
          <span className="stat-value"><AnimatedNumber value={totalUnique} /></span>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaMusic /></div>
          <span className="stat-label">Songs</span>
          <span className="stat-value"><AnimatedNumber value={songs.length} /></span>
        </div>
      </div>

      {error && <div className="auth-error" role="alert">{error}</div>}

      {!loading && topSongs.length > 0 && (
        <div className="panel">
          <h2 className="panel-title"><FaFire style={{ color: 'var(--primary)', marginRight: 8 }} />Top Tracks</h2>
          <p className="panel-subtitle">Your best performing songs by total plays.</p>
          <div className="chart-list">
            {topSongs.map((song, i) => (
              <div className="chart-row" key={song.id}>
                <span className={`chart-rank${i === 0 ? ' chart-rank-lead' : ''}`}>{i + 1}</span>
                <div className="chart-info">
                  <div className="chart-track-name">{song.title}</div>
                  <div className="chart-bar-track">
                    <div
                      className="chart-bar-fill"
                      style={{
                        width: `${Math.max(4, ((song.total_plays || 0) / maxPlays) * 100)}%`,
                        animationDelay: `${i * 0.08}s`,
                      }}
                    />
                  </div>
                </div>
                <span className="chart-value">{(song.total_plays || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
                {songs.map((song, i) => (
                  <tr key={song.id} style={{ animation: `fadeInUp 0.4s var(--ease) backwards`, animationDelay: `${Math.min(i, 8) * 0.04}s` }}>
                    <td>
                      <div className="track-cell">
                        <span className="row-rank">{i + 1}</span>
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
                    <td>{(song.total_plays || 0).toLocaleString()}</td>
                    <td>{(song.unique_plays || 0).toLocaleString()}</td>
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
