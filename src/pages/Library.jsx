// src/pages/Library.jsx
import React, { useCallback, useEffect, useState } from 'react'
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
    try {
      await updateSong(songId, { subscription: !currentSub })
      await fetchSongs()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="library">
      <h1>Library</h1>

      {error && <div className="auth-error" role="alert">{error}</div>}
      {status && !error && <p>{status}</p>}

      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
          disabled={loading}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          disabled={loading}
        />
        <label>
          Subscription Required:
          <input
            type="checkbox"
            checked={subscription}
            onChange={(e) => setSubscription(e.target.checked)}
            disabled={loading}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading…' : 'Add Song'}
        </button>
      </form>

      <h2>Your Songs</h2>
      {songs.length === 0 ? (
        <p>No songs yet.</p>
      ) : (
        <ul>
          {songs.map((song) => (
            <li key={song.id}>
              {song.title} by {song.artist}
              <button onClick={() => toggleSubscription(song.id, song.subscription)}>
                {song.subscription ? 'Disable Subscription' : 'Enable Subscription'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Library
