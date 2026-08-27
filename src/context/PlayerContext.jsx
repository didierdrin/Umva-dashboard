// src/context/PlayerContext.jsx
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const PlayerContext = createContext(null)

export const usePlayer = () => useContext(PlayerContext)

// Lives at the dashboard-layout level (not inside a route) so a song keeps
// playing across page navigation, mirroring the mobile app's mini-player.
export function PlayerProvider({ children }) {
  const audioRef = useRef(null)
  if (!audioRef.current) audioRef.current = new Audio()

  const [current, setCurrent] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    const onTime = () => setProgress(audio.currentTime)
    const onLoaded = () => setDuration(audio.duration || 0)
    const onEnd = () => setIsPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended', onEnd)
    }
  }, [])

  const playSong = useCallback((song) => {
    const audio = audioRef.current
    setCurrent((prevCurrent) => {
      if (prevCurrent?.id === song.id) {
        if (audio.paused) {
          audio.play()
          setIsPlaying(true)
        } else {
          audio.pause()
          setIsPlaying(false)
        }
        return prevCurrent
      }
      audio.src = song.file_url
      audio.play()
      setIsPlaying(true)
      setProgress(0)
      return song
    })
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio.src) return
    if (audio.paused) {
      audio.play()
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }, [])

  const seek = useCallback((time) => {
    const audio = audioRef.current
    audio.currentTime = time
    setProgress(time)
  }, [])

  const closePlayer = useCallback(() => {
    const audio = audioRef.current
    audio.pause()
    audio.removeAttribute('src')
    setCurrent(null)
    setIsPlaying(false)
    setProgress(0)
    setDuration(0)
  }, [])

  return (
    <PlayerContext.Provider value={{ current, isPlaying, progress, duration, playSong, togglePlay, seek, closePlayer }}>
      {children}
    </PlayerContext.Provider>
  )
}
