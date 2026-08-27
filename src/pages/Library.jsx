// src/pages/Library.jsx
import React, { useCallback, useEffect, useState } from 'react'
import { FaMusic, FaFileAudio, FaImage, FaCompactDisc } from 'react-icons/fa'
import { listSongsByUser, insertSong, updateSong } from '../lib/dataApi'
import { uploadAudio, uploadCover } from '../lib/cloudinary'
import { useAuth } from '../context/AuthContext'

const Library = () => {
  const { user } = useAuth()
  const [songs, setSongs] = useState([])
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [file, setFile] = useState(null)
  const [image, setImage] = useState(null)
  const [subscription, setSubscription] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  const fetchSongs = useCallback(async () => {
    if (!user) return
    try {
      setSongs(await listSongsByUser(user.id))
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }, [user])

  useEffect(() => {
    fetchSongs()
  }, [fetchSongs])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!user || !file) return

    setLoading(true)
    setError(null)
    try {
      setStatus('Uploading audio…')
      const fileUrl = await uploadAudio(file)

      let imageUrl = ''
      if (image) {
        setStatus('Uploading cover art…')
        imageUrl = await uploadCover(image)
      }

      setStatus('Saving…')
      await insertSong({
        user_id: user.id,
        title,
        artist,
        file_url: fileUrl,
        image_url: imageUrl,
        subscription,
      })

      setTitle('')
      setArtist('')
      setFile(null)
      setImage(null)
      setSubscription(false)
      e.target.reset()
      await fetchSongs()
      setStatus('Song added.')
    } catch (err) {
      // The previous version only console.error'd these, so a failed upload
      // looked identical to a successful one.
      setError(err.message)
      setStatus(null)
    } finally {
      setLoading(false)
    }
  }

  const toggleSubscription = async (songId, currentSub) => {
    setTogglingId(songId)
    try {
      await updateSong(songId, { subscription: !currentSub })
      await fetchSongs()
    } catch (err) {
      setError(err.message)
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div className="library">
      {error && <div className="auth-error" role="alert">{error}</div>}
      {status && !error && <div className="alert alert-success">{status}</div>}

      <div className="panel">
        <h2 className="panel-title">Upload a Track</h2>
        <p className="panel-subtitle">Add a new song to your library.</p>

        <form onSubmit={handleUpload}>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Song title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="field">
              <label htmlFor="artist">Artist</label>
              <input
                id="artist"
                type="text"
                placeholder="Artist name"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="field-grid">
            <label className="file-drop" htmlFor="audio-file">
              <div className="file-drop-icon"><FaFileAudio /></div>
              <span className="file-drop-text">
                {file ? <strong>{file.name}</strong> : 'Choose an audio file'}
              </span>
            </label>
            <input
              id="audio-file"
              type="file"
              accept="audio/*"
              onChange={(e) => setFile(e.target.files[0])}
              required
              disabled={loading}
              style={{ display: 'none' }}
            />

            <label className="file-drop" htmlFor="cover-file">
              <div className="file-drop-icon"><FaImage /></div>
              <span className="file-drop-text">
                {image ? <strong>{image.name}</strong> : 'Choose cover art (optional)'}
              </span>
            </label>
            <input
              id="cover-file"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              disabled={loading}
              style={{ display: 'none' }}
            />
          </div>

          <div className="checkbox-row">
            <input
              id="subscription"
              type="checkbox"
              checked={subscription}
              onChange={(e) => setSubscription(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="subscription" style={{ margin: 0 }}>Subscription required to play</label>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? 'Uploading…' : 'Add Song'}
          </button>
        </form>
      </div>

      <div className="panel">
        <h2 className="panel-title">Your Songs</h2>
        <p className="panel-subtitle">Toggle subscription access per track.</p>

        {songs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FaCompactDisc /></div>
            <p>No songs yet. Upload your first track above.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Subscription</th>
                  <th></th>
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
                          <div className="track-artist">{song.artist}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${song.subscription ? 'badge-on' : 'badge-off'}`}>
                        {song.subscription ? 'Required' : 'Free'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`switch ${song.subscription ? 'on' : ''}`}
                        onClick={() => toggleSubscription(song.id, song.subscription)}
                        disabled={togglingId === song.id}
                        aria-label={song.subscription ? 'Disable subscription' : 'Enable subscription'}
                        title={song.subscription ? 'Disable subscription' : 'Enable subscription'}
                      >
                        <span className="switch-knob" />
                      </button>
                    </td>
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

export default Library
