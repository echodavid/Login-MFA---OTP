// API client functions for frontend

import type {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ProtectedResponse,
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

    const token = await response.text(); // Backend returns plain string
    return { token };
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

  // Helper function to store/retrieve token from localStorage
  tokenStorage: {
    set: (token: string) => localStorage.setItem('authToken', token),
    get: (): string | null => localStorage.getItem('authToken'),
    remove: () => localStorage.removeItem('authToken'),
  },
};

export default api;
