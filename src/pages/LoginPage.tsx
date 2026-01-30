import { supabase } from '../lib/supabase'
import type { ChangeEvent, JSX, FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


export function LoginPage(): JSX.Element {
  const navigate = useNavigate()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.session) {
      // Redux user state will be synced by App.tsx listener
      navigate('/blogs', { replace: true })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="
  bg-white/10 
  backdrop-blur-lg 
  border border-white/20 
  rounded-xl 
  p-8 
  shadow-xl
">
        <h1 className="text-2xl font-bold">Login</h1>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <input
          type="email"
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          required
        />

        <input
          type="password"
          className="w-full border p-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-sm text-center">
          No account?{' '}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}
