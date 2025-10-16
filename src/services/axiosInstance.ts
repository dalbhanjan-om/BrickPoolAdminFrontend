import axios from "axios";
import { store } from "../store";

// Base URL for your Spring Boot backend
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    withCredentials: "true",
  },
});

// Request interceptor to add auth token from Redux store
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401/403 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Dispatch logout action to clear Redux store
      store.dispatch({ type: 'auth/clearAuth' });
      
      // Clean up localStorage as well
      try {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("authToken");
      } catch {}
      
      const current = window.location.pathname + window.location.search;
      if (!window.location.pathname.startsWith("/auth/login")) {
        window.location.href = `/auth/login?r=${encodeURIComponent(current)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
