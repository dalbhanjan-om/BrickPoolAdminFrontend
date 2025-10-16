import axiosInstance from "./axiosInstance";

// Login Request/Response DTOs
export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  username: string;
  email: string;
  phoneNumber: string;
  cityName: string;
  dateOfBirth: string;
  referralCode?: string;
  role: "BUYER" | "BROKER" | "ADMIN";
  buyerId?: string;
  brokerId?: string | null;
  message?: string;
}

// Login API
export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post("/auth/login", data);
  
  // Note: Token and user data will be stored in Redux store via the AuthContext
  return response.data;
};
