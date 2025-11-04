// TypeScript interfaces for frontend DTOs

export interface User {
  id?: number;
  name: string;
  lastname: string;
  email: string;
  password?: string; // Optional for responses
  creationDate?: string; // ISO date string
  active?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
}

export interface RegisterRequest {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

export interface ProtectedResponse {
  message: string;
}

// OTP interfaces
export interface OtpRequest {
  email: string;
  machine?: string;
}

export interface OtpVerifyRequest {
  email: string;
  code: string;
  machine?: string;
}

export interface OtpResponse {
  message: string;
}

export interface OtpVerifyResponse {
  token: string;
}
