import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { supabase } from '../lib/supabase'
import type { RootState } from '../store/store'
import { setUser } from '../store/authSlice'
import { useEffect, useState } from 'react'
import logo from '../assets/logo.webp'

export default function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)

  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark'
    if (saved) {
      setTheme(saved)
      document.documentElement.classList.toggle('dark', saved === 'dark')
    }
  }, [])

    // Fetch user once on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: supaUser } } = await supabase.auth.getUser()
      if (supaUser) {
        dispatch(setUser({
          id: supaUser.id,
          email: supaUser.user_metadata?.email ?? null,
          full_name: supaUser.user_metadata?.full_name ?? null
        }))
      }
    }
    fetchUser()
  }, [dispatch])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', next)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    dispatch(setUser(null))
    navigate('/login', { replace: true })
  }


  const displayName = user?.full_name ?? 'User'

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
      <div className="flex items-center justify-between px-6 py-3">

        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" className="h-8 rounded" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4 text-white">
          {user && (
            <>
              <span className="text-sm opacity-80">
                Hi, {displayName}
              </span>

              <button
                onClick={() => navigate('/create')}
                className="bg-blue-600 px-3 py-1 rounded"
              >
                Create Blog
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}

          <button
            onClick={toggleTheme}
            className="bg-gray-800 px-3 py-1 rounded"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link
                to="/register"
                className="bg-blue-600 px-4 py-1.5 rounded"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${menuOpen ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'}
        `}
      >
        <div className="flex flex-col gap-3 px-6 pb-4 text-white">
          {user && (
            <>
              <span className="text-sm opacity-80">
                Hi, {displayName}
              </span>

              <button
                onClick={() => {
                  navigate('/create')
                  setMenuOpen(false)
                }}
                className="bg-blue-600 px-3 py-2 rounded"
              >
                Create Blog
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-2 rounded"
              >
                Logout
              </button>
            </>
          )}

          <button
            onClick={toggleTheme}
            className="bg-gray-800 px-3 py-1 rounded"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {!user && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="bg-blue-600 px-4 py-2 rounded"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
