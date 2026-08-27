// src/components/DashboardLayout.jsx
import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import PlayerBar from './PlayerBar'
import { PlayerProvider, usePlayer } from '../context/PlayerContext'
import Dashboard from '../pages/Dashboard'
import Library from '../pages/Library'
import Payout from '../pages/Payout'
import Settings from '../pages/Settings'

const DashboardLayoutInner = ({ collapsed, onToggleCollapsed }) => {
  const { current } = usePlayer()

  return (
    <div className={`dashboard-layout${collapsed ? ' sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} onToggleCollapsed={onToggleCollapsed} />
      <div className="dashboard-main">
        <Topbar />
        <main className={`dashboard-content${current ? ' has-player' : ''}`}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/library" element={<Library />} />
            <Route path="/payout" element={<Payout />} />
            <Route path="/settings" element={<Settings />} />
            {/* Default to dashboard */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
      <PlayerBar />
    </div>
  )
}

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true')

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('sidebarCollapsed', String(next))
      return next
    })
  }

  return (
    <PlayerProvider>
      <DashboardLayoutInner collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
    </PlayerProvider>
  )
}

export default DashboardLayout
