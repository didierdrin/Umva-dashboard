// src/context/AuthContext.jsx
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getSession, signOut as apiSignOut } from '../lib/authClient'

const AuthContext = createContext({
  user: null,
  loading: true,
  refresh: async () => {},
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  // Starts true so routing waits for the session check. Without this, a signed-in
  // user is redirected to /login on first render before getSession() resolves.
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const session = await getSession()
    setUser(session?.user ?? null)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const signOut = useCallback(async () => {
    try {
      await apiSignOut()
    } finally {
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, refresh, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
