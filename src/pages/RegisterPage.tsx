import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { JSX, FormEvent } from 'react'

export function RegisterPage(): JSX.Element {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      navigate('/blogs', { replace: true })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleRegister}
        className="
  bg-white/10 
  backdrop-blur-lg 
  border border-white/20 
  rounded-xl 
  p-8 
  shadow-xl
">
        <h1 className="text-2xl font-bold">Register</h1>

        {error && <p className="text-red-600">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
console.log(import.meta.env.VITE_SUPABASE_URL)