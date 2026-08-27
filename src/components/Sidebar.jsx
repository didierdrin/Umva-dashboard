// src/components/Sidebar.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaHeadphonesAlt, FaHome, FaMusic, FaMoneyBillWave, FaCog, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: FaHome },
  { to: '/library', label: 'Library', icon: FaMusic },
  { to: '/payout', label: 'Payout', icon: FaMoneyBillWave },
  { to: '/settings', label: 'Settings', icon: FaCog },
]

const Sidebar = () => {
  const { user, signOut } = useAuth()
  const initial = (user?.name || user?.email || '?').trim().charAt(0).toUpperCase()

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">
          <FaHeadphonesAlt />
        </div>
        <div>
          <div className="sidebar-brand-text">Umva</div>
          <div className="sidebar-brand-tagline">Artist Studio</div>
        </div>
      </div>

      <ul>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      {user && (
        <div className="sidebar-footer">
          <div className="sidebar-avatar">{initial}</div>
          <div className="sidebar-user">
            <div className="sidebar-user-email" title={user.email}>{user.name || user.email}</div>
          </div>
          <button className="sidebar-logout" onClick={signOut} aria-label="Sign out" title="Sign out">
            <FaSignOutAlt />
          </button>
        </div>
      )}
    </div>
  )
}

export default Sidebar
