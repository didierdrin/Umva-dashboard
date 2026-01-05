// src/pages/Settings.jsx
import { useContext } from 'react'
import ThemeContext from '../context/ThemeContext'
import supabase from '../supabaseClient'

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error(error)
    // Navigate to login handled by App
  }

  return (
    <div className="settings">
      <h1>Settings</h1>
      <label>
        Dark Mode:
        <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
      </label>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Settings