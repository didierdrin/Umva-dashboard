// src/components/Topbar.jsx
import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { FaSun, FaMoon } from 'react-icons/fa'
import ThemeContext from '../context/ThemeContext'

const TITLES = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Your plays at a glance' },
  '/library': { title: 'Library', subtitle: 'Upload and manage your tracks' },
  '/payout': { title: 'Payout', subtitle: 'Track what you have earned' },
  '/settings': { title: 'Settings', subtitle: 'Manage your account' },
}

const Topbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const { pathname } = useLocation()
  const { title, subtitle } = TITLES[pathname] || TITLES['/dashboard']

  return (
    <div className="topbar">
      <div>
        <div className="topbar-title">{title}</div>
        <p className="topbar-subtitle">{subtitle}</p>
      </div>
      <div className="topbar-actions">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="theme-toggle-knob">
            {theme === 'dark' ? <FaMoon /> : <FaSun />}
          </span>
        </button>
      </div>
    </div>
  )
}

export default Topbar
