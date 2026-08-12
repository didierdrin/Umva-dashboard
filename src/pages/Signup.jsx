// src/pages/Signup.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../lib/authClient'
import { useAuth } from '../context/AuthContext'

const MIN_PASSWORD = 8

const Signup = () => {
  const navigate = useNavigate()
  const { refresh } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Validated before hitting the network so the user gets an instant answer
  // instead of a round trip for something we already know is wrong.
  const localError = (() => {
    if (password && password.length < MIN_PASSWORD) {
      return `Password must be at least ${MIN_PASSWORD} characters.`
    }
    if (confirm && password !== confirm) {
      return 'Passwords do not match.'
    }
    return null
  })()

  const canSubmit =
    !loading && name.trim() && email.trim() && password && confirm && !localError

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setError(null)
    setLoading(true)
    try {
      await signUp({ name: name.trim(), email: email.trim(), password })
      // Email verification is disabled on this project, so the account is
      // usable immediately and sign-up already establishes a session.
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
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start publishing your music on Umva.</p>

        {(error || localError) && (
          <div className="auth-error" role="alert">
            {error || localError}
          </div>
        )}

        <label className="auth-label" htmlFor="name">Name</label>
        <input
          id="name"
          className="auth-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your artist or label name"
          autoComplete="name"
          required
          disabled={loading}
        />

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
            placeholder={`At least ${MIN_PASSWORD} characters`}
            autoComplete="new-password"
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

        <label className="auth-label" htmlFor="confirm">Confirm password</label>
        <input
          id="confirm"
          className="auth-input"
          type={showPassword ? 'text' : 'password'}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          required
          disabled={loading}
        />

        <button className="auth-submit" type="submit" disabled={!canSubmit}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        <p className="auth-alt">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  )
}

export default Signup
