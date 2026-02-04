import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { supabase } from './lib/supabase'
import { setUser } from './store/authSlice'
import type { JSX } from 'react'

// Pages
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { BlogListPage } from './pages/BlogListPage'
import { ViewBlogPage } from './pages/ViewBlogPage'
import { CreateEditBlogPage } from './pages/CreateEditBlogPage'

// Components
import ProtectedRoute from './components/ProtectedRoute'

export default function App(): JSX.Element {
  const dispatch = useDispatch()

  
  // 🔐 Sync Supabase auth → Redux
useEffect(() => {
  const syncUser = async () => {
    const { data } = await supabase.auth.getSession()
    const supaUser = data.session?.user ?? null

    if (supaUser) {
      dispatch(setUser({
        id: supaUser.id,
        email: supaUser.user_metadata?.email ?? null,
        full_name: supaUser.user_metadata?.full_name ?? null
      }))
    } else {
      dispatch(setUser(null))
    }
  }

  syncUser()

  const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      const supaUser = session?.user ?? null
      if (supaUser) {
        dispatch(setUser({
          id: supaUser.id,
          email: supaUser.user_metadata?.email ?? null,
          full_name: supaUser.user_metadata?.full_name ?? null
        }))
      } else {
        dispatch(setUser(null))
      }
    }
  )

  return () => listener.subscription.unsubscribe()
}, [dispatch])


  return (
     
    <Routes>
      {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/blogs" element={<BlogListPage />} />
          <Route path="/blogs/:id" element={<ViewBlogPage />} />
          <Route path="/create" element={<CreateEditBlogPage />} />
          <Route path="/edit-blog/:id" element={<CreateEditBlogPage />} />
        </Route>
        {/* Default */}
        <Route path="/" element={<Navigate to="/blogs" replace />} />
        <Route path="*" element={<Navigate to="/blogs" replace />} />
      </Routes>
  )
}
// test update