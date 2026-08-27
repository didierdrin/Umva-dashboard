// src/pages/Settings.jsx
import React, { useContext } from 'react'
import { FaMoon, FaSun, FaSignOutAlt } from 'react-icons/fa'
import ThemeContext from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const { user, signOut } = useAuth()
  const initial = (user?.name || user?.email || '?').trim().charAt(0).toUpperCase()

  return (
    <div className="settings">
      <div className="panel">
        <h2 className="panel-title">Profile</h2>
        <p className="panel-subtitle">Your account details.</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="sidebar-avatar" style={{ width: 46, height: 46, fontSize: '1.1rem' }}>
            {initial}
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>{user?.name || 'Umva Artist'}</div>
            {user && <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{user.email}</div>}
          </div>
        </div>
      </div>

      <div className="panel">
        <h2 className="panel-title">Appearance</h2>
        <p className="panel-subtitle">Switch between light and dark mode.</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {theme === 'dark' ? <FaMoon color="var(--primary)" /> : <FaSun color="var(--primary)" />}
            <span style={{ fontWeight: 600 }}>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
          </div>
          <button
            className={`switch ${theme === 'dark' ? 'on' : ''}`}
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            <span className="switch-knob" />
          </button>
        </div>
      </div>

      <div className="panel">
        <h2 className="panel-title">Session</h2>
        <p className="panel-subtitle">Sign out of your account on this device.</p>
        <button className="btn btn-danger" onClick={signOut}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  )
}

export default Settings
