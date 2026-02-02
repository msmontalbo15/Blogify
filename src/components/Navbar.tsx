import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { supabase } from '../lib/supabase'
import type { RootState } from '../store/store'
import { setUser } from '../store/authSlice'
import type { JSX } from 'react'
import logo from "../assets/logo.webp";


export default function Navbar(): JSX.Element {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)


  const handleLogout = async () => {
    await supabase.auth.signOut()
    dispatch(setUser(null))
    navigate('/login', { replace: true })
  }


  return (
    <nav className="fixed top-0 px-6 py-3 flex justify-between items-centerfixed top-0 w-full z-50
      bg-white/10 backdrop-blur-xl
      border-b border-white/20
    ">

      <Link to="/" className="text-white font-bold text-xl">
      <img src={logo} alt="Logo" className="h-8 border rounded" />
      </Link>
      <div className="flex items-center gap-6 text-white">
        {user && (
          <>
            <button
              onClick={() => navigate('/create')}
              className="text-sm font-medium bg-blue-600 text-white px-3 py-1 rounded "
            >
              Create Blog
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}


        {!user && (
          <>
            <Link to="/login" className="hover:text-blue-400">Login</Link>
            <Link to="/register" className="bg-blue-600 px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
              >Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}