// src/pages/Library.jsx
import { useEffect, useState } from 'react'
import supabase from '../supabaseClient'

const Library = () => {
  const [songs, setSongs] = useState([])
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [file, setFile] = useState(null)
  const [image, setImage] = useState(null)
  const [subscription, setSubscription] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSongs()
  }, [])

  const fetchSongs = async () => {
    const { data: session } = await supabase.auth.getSession()
    if (!session) return

    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('user_id', session.session.user.id)

    if (error) console.error(error)
    else setSongs(data)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data: session } = await supabase.auth.getSession()
    if (!session) {
      setLoading(false)
      return
    }

    // Upload file to storage
    const filePath = `${session.session.user.id}/${file.name}`
    const { error: fileError } = await supabase.storage
      .from('audio_files')
      .upload(filePath, file)

    if (fileError) {
      console.error(fileError)
      setLoading(false)
      return
    }

    const fileUrl = supabase.storage.from('audio_files').getPublicUrl(filePath).data.publicUrl

    // Upload image if provided
    let imageUrl = ''
    if (image) {
      const imagePath = `${session.session.user.id}/${image.name}`
      const { error: imageError } = await supabase.storage
        .from('cover_images')
        .upload(imagePath, image)

      if (imageError) console.error(imageError)
      else imageUrl = supabase.storage.from('cover_images').getPublicUrl(imagePath).data.publicUrl
    }

    // Insert metadata to DB
    const { error } = await supabase
      .from('songs')
      .insert({
        user_id: session.session.user.id,
        title,
        artist,
        file_url: fileUrl,
        image_url: imageUrl,
        subscription,
        total_plays: 0,
        unique_plays: 0
      })

    if (error) console.error(error)
    else {
      fetchSongs()
      setTitle('')
      setArtist('')
      setFile(null)
      setImage(null)
      setSubscription(false)
    }
    setLoading(false)
  }

  const toggleSubscription = async (songId, currentSub) => {
    const { error } = await supabase
      .from('songs')
      .update({ subscription: !currentSub })
      .eq('id', songId)

    if (error) console.error(error)
    else fetchSongs()
  }

  return (
    <div className="library">
      <h1>Library</h1>
      <form onSubmit={handleUpload}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Artist" value={artist} onChange={(e) => setArtist(e.target.value)} required />
        <input type="file" accept="audio/*,video/*" onChange={(e) => setFile(e.target.files[0])} required />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        <label>
          Subscription Required:
          <input type="checkbox" checked={subscription} onChange={(e) => setSubscription(e.target.checked)} />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Add Song'}</button>
      </form>
      <h2>Your Songs</h2>
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
    </div>
  )
}

export default Library