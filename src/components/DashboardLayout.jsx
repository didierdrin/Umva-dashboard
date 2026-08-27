// src/components/DashboardLayout.jsx
import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Dashboard from '../pages/Dashboard'
import Library from '../pages/Library'
import Payout from '../pages/Payout'
import Settings from '../pages/Settings'

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
    <div className={`dashboard-layout${collapsed ? ' sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      <div className="dashboard-main">
        <Topbar />
        <main className="dashboard-content">
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
    </div>
  )
}

export default DashboardLayout
