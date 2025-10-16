import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LoginResponse } from '../services/authService';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: LoginResponse | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.token = action.payload.token;
      state.isLoading = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.isLoading = false;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.isLoading = false;
    },
  },
});

export const { setLoading, loginSuccess, logout, clearAuth } = authSlice.actions;
export default authSlice.reducer;
