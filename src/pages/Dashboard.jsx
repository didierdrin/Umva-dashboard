// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react'
import supabase from '../supabaseClient'

const Dashboard = () => {
  const [songs, setSongs] = useState([])
  const [totalPlays, setTotalPlays] = useState(0)
  const [totalUnique, setTotalUnique] = useState(0)

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
    else {
      setSongs(data)
      const totalP = data.reduce((acc, song) => acc + song.total_plays, 0)
      const totalU = data.reduce((acc, song) => acc + song.unique_plays, 0)
      setTotalPlays(totalP)
      setTotalUnique(totalU)
    }
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Total Plays: {totalPlays}</p>
      <p>Total Unique Plays: {totalUnique}</p>
      <h2>Your Songs</h2>
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
    </div>
  )
}

export default Dashboard