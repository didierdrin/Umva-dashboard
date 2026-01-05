// src/pages/Login.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import supabase from '../supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const Login = () => {
  const navigate = useNavigate()

  const handleLogin = async () => {
    // Auth UI handles it, but for custom, see below
  }

  return (
    <div className="auth-page">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}  // Disable social if not needed
        view="sign_in"  // For login
      />
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
  )
}

// Alternative custom form for email/password
// const [email, setEmail] = useState('')
// const [password, setPassword] = useState('')
// const [error, setError] = useState(null)

// const handleLogin = async (e) => {
//   e.preventDefault()
//   const { error } = await supabase.auth.signInWithPassword({ email, password })
//   if (error) setError(error.message)
//   else navigate('/dashboard')
// }

export default Login