# API Documentation - Spring Boot Auth Service

Esta documentación describe todos los endpoints, DTOs y guías de integración para el servicio de autenticación con JWT y OTP por email.

## Endpoints Disponibles

### 1. Registro de Usuario
- **Método**: `POST`
- **Ruta**: `/users/register`
- **Request Body**: `RegisterRequest` (JSON)
- **Response**: `User` (JSON) - Usuario creado (sin password).
- **Ejemplo Request**:
  ```json
  {
    "name": "Juan",
    "lastname": "Pérez",
    "email": "juan@example.com",
    "password": "miPassword123"
  }
  ```
- **Ejemplo Response**:
  ```json
  {
    "id": 1,
    "name": "Juan",
    "lastname": "Pérez",
    "email": "juan@example.com",
    "creationDate": "2025-11-03T15:00:00",
    "active": true
  }
  ```
- **Errores**: 400 si email ya existe (`{"error": "Email already exists"}`).

### 2. Login (Envía OTP)
- **Método**: `POST`
- **Ruta**: `/users/login`
- **Request Body**: `LoginRequest` (JSON)
- **Response**: `LoginResponse` (JSON) - Mensaje de envío de OTP.
- **Ejemplo Request**:
  ```json
  {
    "email": "juan@example.com",
    "password": "miPassword123"
  }
  ```
- **Ejemplo Response**:
  ```json
  {
    "message": "OTP sent to your email"
  }
  ```
- **Errores**: 400 si credenciales inválidas (`{"error": "Invalid credentials"}`).

### 3. Ruta Protegida (Requiere Token JWT)
- **Método**: `GET`
- **Ruta**: `/users/protected`
- **Headers**: `Authorization: Bearer <jwt-token>`
- **Request Body**: Ninguno
- **Response**: `ProtectedResponse` (string) - Mensaje de éxito.
- **Ejemplo Response**:
  ```json
  {
    "message": "Hello, authenticated user!"
  }
  ```
- **Errores**: 401 si token inválido o faltante.

### 4. Solicitar OTP (Opcional, ya integrado en login)
- **Método**: `POST`
- **Ruta**: `/otp/request`
- **Request Body**: `OtpRequest` (JSON)
- **Response**: `OtpResponse` (JSON) - Confirmación de envío.
- **Ejemplo Request**:
  ```json
  {
    "email": "juan@example.com",
    "machine": "mi-pc"  // Opcional
  }
  ```
- **Ejemplo Response**:
  ```json
  {
    "message": "OTP sent to your email"
  }
  ```
- **Errores**: 400 si email inválido.

### 5. Verificar OTP (Obtiene Token JWT)
- **Método**: `POST`
- **Ruta**: `/otp/verify`
- **Request Body**: `OtpVerifyRequest` (JSON)
- **Response**: `OtpVerifyResponse` (JSON) - Token JWT.
- **Ejemplo Request**:
  ```json
  {
    "email": "juan@example.com",
    "code": "123456",
    "machine": "mi-pc"  // Opcional, debe coincidir con request
  }
  ```
- **Ejemplo Response**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Errores**: 400 si OTP inválido/expirado (`{"error": "Invalid or expired OTP"}`).

## DTOs (Interfaces TypeScript)

```typescript
export interface User {
  id?: number;
  name: string;
  lastname: string;
  email: string;
  password?: string;  // Solo en request, no en response
  creationDate?: string;  // ISO date string
  active?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;  // "OTP sent to your email"
}

export interface RegisterRequest {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

export interface ProtectedResponse {
  message: string;  // "Hello, authenticated user!"
}

export interface OtpRequest {
  email: string;
  machine?: string;  // Opcional, para rastreo
}

export interface OtpVerifyRequest {
  email: string;
  code: string;
  machine?: string;  // Debe coincidir con OtpRequest
}

export interface OtpResponse {
  message: string;  // "OTP sent to your email"
}

export interface OtpVerifyResponse {
  token: string;  // JWT token
}
```

## Guía de Integración al Frontend

### Configuración Base
- **Base URL**: `http://localhost:8080` (cambia si es diferente).
- Usa `fetch` o Axios para requests.
- Maneja errores con `try/catch` y revisa `response.ok`.

### Flujo Típico de Usuario
1. **Registro**: Llama `api.register(user)` -> Guarda email para login.
2. **Login**: Llama `api.login({email, password})` -> Muestra mensaje "OTP enviado".
3. **Verificar OTP**: Llama `api.verifyOtp({email, code})` -> Guarda token con `api.tokenStorage.set(token)`.
4. **Acceder Protegido**: Llama `api.getProtected(token)` con header Bearer.

### Manejo de Errores
- Siempre parsea JSON en responses.
- Si `response.ok` es false, lanza error con `response.statusText`.
- Para login/OTP: Si falla, muestra mensaje de error al usuario.

### Ejemplo de Uso en Frontend (React/Vue)
```typescript
import { api } from './frontend-api';

// Registro
const handleRegister = async (user: RegisterRequest) => {
  try {
    const result = await api.register(user);
    console.log('Usuario registrado:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Login
const handleLogin = async (email: string, password: string) => {
  try {
    const result = await api.login({ email, password });
    alert(result.message);  // "OTP sent..."
  } catch (error) {
    alert('Login falló: ' + error.message);
  }
};

// Verificar OTP
const handleVerifyOtp = async (email: string, code: string) => {
  try {
    const result = await api.verifyOtp({ email, code });
    api.tokenStorage.set(result.token);
    // Redirigir a dashboard
  } catch (error) {
    alert('OTP inválido: ' + error.message);
  }
};

// Acceder protegido
const getProtectedData = async () => {
  const token = api.tokenStorage.get();
  if (!token) return;
  try {
    const result = await api.getProtected(token);
    console.log(result.message);
  } catch (error) {
    // Token expirado, redirigir a login
  }
};
```

### Notas Adicionales
- **CORS**: El backend permite `http://localhost:5173` y `http://localhost:3000`. Si usas otro puerto, agrega en `SecurityConfig.java`.
- **Token Storage**: Usa `localStorage` como en `frontend-api.ts`. Borra con `api.tokenStorage.remove()` en logout.
- **Validaciones**: Frontend valida campos requeridos antes de enviar.
- **Testing**: Usa Postman para probar endpoints antes de integrar.
