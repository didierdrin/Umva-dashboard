// src/pages/Settings.jsx
import React, { useContext } from 'react'
import ThemeContext from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const { user, signOut } = useAuth()

  return (
    <div className="settings">
      <h1>Settings</h1>
      {user && <p>Signed in as {user.email}</p>}
      <label>
        Dark Mode:
        <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
      </label>
      {/* Clearing the user in context flips AppRoutes back to /login. */}
      <button onClick={signOut}>Logout</button>
    </div>
  )
}

export default Settings
