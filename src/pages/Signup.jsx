// src/pages/Signup.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import supabase from '../supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const Signup = () => {
  const navigate = useNavigate()

  return (
    <div className="auth-page">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        view="sign_up"  // For signup
      />
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}

// Custom:
// const [email, setEmail] = useState('')
// const [password, setPassword] = useState('')
// const [error, setError] = useState(null)

// const handleSignup = async (e) => {
//   e.preventDefault()
//   const { error } = await supabase.auth.signUp({ email, password })
//   if (error) setError(error.message)
//   else navigate('/login')  // Or verify email
// }

export default Signup