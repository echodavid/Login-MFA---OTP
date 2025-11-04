// API client functions for frontend

import type {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ProtectedResponse,
  OtpRequest,
  OtpResponse,
  OtpVerifyRequest,
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

  // Request/resend OTP
  requestOtp: async (data: { email: string; machine?: string }): Promise<OtpResponse> => {
    const response = await fetch(`${API_BASE_URL}/otp/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let body = null;
      try { body = await response.json(); } catch (e) { /* ignore */ }
      throw new Error(body?.error || `OTP request failed: ${response.statusText}`);
    }
    return response.json();
  },

  // Verify OTP and receive token
  verifyOtp: async (data: { email: string; code: string; machine?: string }): Promise<{ token: string }> => {
    const response = await fetch(`${API_BASE_URL}/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let body = null;
      try { body = await response.json(); } catch (e) { /* ignore */ }
      throw new Error(body?.error || `OTP verify failed: ${response.statusText}`);
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
  let body = null;
  try { body = await response.json(); } catch (e) { /* ignore */ }
  throw new Error(body?.error || `Login failed: ${response.statusText}`);
    }

    // Backend returns a message confirming OTP sent
    return response.json();
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
      let body = null;
      try { body = await response.json(); } catch (e) { /* ignore */ }
      throw new Error(body?.error || `Access denied: ${response.statusText}`);
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

export default api;
