// src/pages/Login.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaHeadphonesAlt } from 'react-icons/fa'
import { signIn } from '../lib/authClient'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { refresh } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signIn({ email: email.trim(), password })
      // Load the new session into context before routing, or the guard in
      // AppRoutes still sees user === null and sends us back to /login.
      await refresh()
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-brand-panel">
        <div className="auth-brand-mark">
          <FaHeadphonesAlt />
        </div>
        <h2>Your music, your numbers.</h2>
        <p>Track plays, manage your library, and see exactly what you've earned — all in one place.</p>
      </div>

      <div className="auth-form-panel">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to manage your music.</p>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <label className="auth-label" htmlFor="email">Email</label>
        <input
          id="email"
          className="auth-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
          disabled={loading}
        />

        <label className="auth-label" htmlFor="password">Password</label>
        <div className="auth-password-wrap">
          <input
            id="password"
            className="auth-input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            required
            disabled={loading}
          />
          <button
            type="button"
            className="auth-reveal"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={loading}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <button
          className="auth-submit"
          type="submit"
          disabled={loading || !email || !password}
        >
          {loading && <span className="spinner" />}
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="auth-alt">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
      </div>
    </div>
  )
}

export default Login
