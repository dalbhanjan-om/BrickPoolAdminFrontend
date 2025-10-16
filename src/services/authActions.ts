import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setLoading, loginSuccess, logout as logoutAction } from '../store/authSlice';
import { loginUser, type LoginRequest } from './authService';

// Custom hook for authentication actions
export const useAuthActions = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);

  const login = async (credentials: { phoneNumber: string; password: string }) => {
    dispatch(setLoading(true));
    
    try {
      const loginData: LoginRequest = {
        phoneNumber: credentials.phoneNumber,
        password: credentials.password
      };
      
      const response = await loginUser(loginData);
      
      // Dispatch login success action to Redux store
      dispatch(loginSuccess(response));
    } catch (error) {
      dispatch(setLoading(false));
      throw error;
    }
  };

  const logout = () => {
    // Clear localStorage (cleanup)
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    
    // Dispatch logout action to Redux store
    dispatch(logoutAction());
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout
  };
};
