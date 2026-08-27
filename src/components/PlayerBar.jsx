// src/components/PlayerBar.jsx
import React from 'react'
import { FaPlay, FaPause, FaTimes, FaMusic } from 'react-icons/fa'
import { usePlayer } from '../context/PlayerContext'

const formatTime = (s) => {
  if (!isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

const PlayerBar = () => {
  const { current, isPlaying, progress, duration, togglePlay, seek, closePlayer } = usePlayer()

  if (!current) return null

  const pct = duration ? (progress / duration) * 100 : 0

  const handleSeek = (e) => {
    if (!duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    seek(ratio * duration)
  }

  return (
    <div className="player-bar">
      <div className="player-bar-track" onClick={handleSeek}>
        <div className="player-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="player-bar-inner">
        <div className="player-bar-info">
          {current.image_url ? (
            <img className="player-bar-cover" src={current.image_url} alt="" />
          ) : (
            <div className="player-bar-cover-fallback"><FaMusic /></div>
          )}
          <div className="player-bar-text">
            <div className="player-bar-title">{current.title}</div>
            {current.artist && <div className="player-bar-artist">{current.artist}</div>}
          </div>
        </div>

        <div className="player-bar-controls">
          <span className="player-bar-time">{formatTime(progress)} / {formatTime(duration)}</span>
          <button
            className="player-bar-play"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button
            className="player-bar-close"
            onClick={closePlayer}
            aria-label="Close player"
            title="Close player"
          >
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlayerBar
