import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AppUser {
  id: string
  email: string | null
  full_name: string | null
}

interface AuthState {
  user: AppUser | null
  loading: boolean
}

const initialState: AuthState = {
  user: null,
  loading: true
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AppUser | null>) {
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
