// src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import DashboardLayout from './components/DashboardLayout'

function AppRoutes() {
  const { user, loading } = useAuth()

  // Render nothing decisive until the session check finishes, otherwise a
  // signed-in user is bounced to /login for a frame on every page load.
  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-form-panel" style={{ gridColumn: '1 / -1' }}>
          <span className="spinner spinner-dark" style={{ width: 28, height: 28, borderWidth: 3 }} />
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/dashboard" replace /> : <Signup />}
      />
      <Route
        path="/*"
        element={user ? <DashboardLayout /> : <Navigate to="/login" replace />}
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
