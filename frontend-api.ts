// API client functions for frontend

import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ProtectedResponse,
  OtpRequest,
  OtpVerifyRequest,
  OtpResponse,
  OtpVerifyResponse,
} from './frontend-dtos';

const API_BASE_URL = 'http://localhost:8080'; // Adjust as needed

export const api = {
  // Register a new user
  register: async (user: RegisterRequest): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    return response.json(); // Backend returns JSON {message}
  },

  // Access protected endpoint
  getProtected: async (token: string): Promise<ProtectedResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/protected`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Access denied: ${response.statusText}`);
    }

    const message = await response.text(); // Backend returns plain string
    return { message };
  },

  // OTP endpoints
  requestOtp: async (otpRequest: OtpRequest): Promise<OtpResponse> => {
    const response = await fetch(`${API_BASE_URL}/otp/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(otpRequest),
    });

    if (!response.ok) {
      throw new Error(`OTP request failed: ${response.statusText}`);
    }

    return response.json();
  },

  verifyOtp: async (otpVerify: OtpVerifyRequest): Promise<OtpVerifyResponse> => {
    const response = await fetch(`${API_BASE_URL}/otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(otpVerify),
    });

    if (!response.ok) {
      throw new Error(`OTP verification failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Helper function to store/retrieve token from localStorage
  tokenStorage: {
    set: (token: string) => localStorage.setItem('authToken', token),
    get: (): string | null => localStorage.getItem('authToken'),
    remove: () => localStorage.removeItem('authToken'),
  },
};
