import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
}

const initialState: AuthState = {
  user: null,
  loading: true // IMPORTANT: start as true
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setUser(state, action) {
  state.user = action.payload
  state.loading = false
},
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    logout(state) {
      state.user = null
      state.loading = false
    }
    
  }
})

export const { setUser, setLoading, logout } = authSlice.actions
export default authSlice.reducer