// src/components/DashboardLayout.jsx
import { Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar'
import Dashboard from '../pages/Dashboard'
import Library from '../pages/Library'
import Payout from '../pages/Payout'
import Settings from '../pages/Settings'

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/library" element={<Library />} />
          <Route path="/payout" element={<Payout />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Dashboard />} />  // Default to dashboard
        </Routes>
      </main>
    </div>
  )
}

export default DashboardLayout