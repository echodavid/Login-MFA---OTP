# Auth System: React Frontend + Spring Boot Backend

## Descripción del Proyecto

Este proyecto implementa un sistema de autenticación completo con registro de usuarios, login y verificación OTP (One-Time Password). Consiste en dos partes principales:

- **Frontend**: Aplicación React con TypeScript, usando Vite para el desarrollo. Incluye páginas para registro, login, verificación OTP y dashboard. El diseño está inspirado en Shadcn, con estilos CSS puros para una interfaz moderna y responsive.

- **Backend**: API REST desarrollada en Spring Boot con Java. Maneja la lógica de autenticación, generación de tokens JWT, envío de OTP y persistencia de datos en una base de datos (configurada para PostgreSQL o similar).

El sistema permite a los usuarios registrarse, iniciar sesión y verificar su identidad mediante OTP enviado por email (simulado en desarrollo). Está diseñado para ser seguro, escalable y fácil de usar.

## Tecnologías Utilizadas

### Frontend
- React 18+ con TypeScript
- Vite (para desarrollo rápido)
- React Router DOM (navegación)
- Axios (llamadas API)
- Formik + Yup (formularios y validación)
- React Toastify (notificaciones)
- CSS puro (estilos Shadcn-like)

### Backend
- Spring Boot 3.x
- Spring Security (autenticación JWT)
- Spring Data JPA (persistencia)
- PostgreSQL (base de datos)
- Maven (gestión de dependencias)
- Java 17+

## Requisitos Previos

Antes de ejecutar el sistema, asegúrate de tener instalados:

- **Node.js** (versión 18 o superior) y **npm** para el frontend.
- **Java JDK** (versión 17 o superior) para el backend.
- **Maven** (versión 3.6+) para construir el backend.
- **PostgreSQL** (o una base de datos compatible) para persistencia. (Opcional en desarrollo, ya que el frontend usa mocks).

## Instalación y Ejecución

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd practica1
```

### 2. Configurar el Backend (Spring Boot)

1. Navega al directorio del backend:
   ```bash
   cd InitializrSpringbootProject
   ```

2. Configura la base de datos en `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/auth_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```

3. Ejecuta el backend:
   ```bash
   mvn spring-boot:run
   ```
   El backend estará disponible en `http://localhost:8080` (o el puerto configurado).

### 3. Configurar el Frontend (React)

1. Navega al directorio del frontend:
   ```bash
   cd ../react-auth-frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Ejecuta el frontend en modo desarrollo:
   ```bash
   npm run dev
   ```
   El frontend estará disponible en `http://localhost:5173`.

### 4. Ejecutar Ambos Simultáneamente

- Abre dos terminales: una para el backend y otra para el frontend.
- Asegúrate de que el backend esté corriendo antes de usar el frontend, ya que las llamadas API apuntan a `http://localhost:8080` (ajusta en `src/services/api.ts` si es necesario).

## Ejemplo de Flujo de Login + OTP

1. **Registro**:
   - Ve a `http://localhost:5173/register`.
   - Completa el formulario: Username, Email, Password, Confirm Password.
   - Haz clic en "Register". Recibirás una notificación de éxito y serás redirigido a login.

2. **Login**:
   - Ve a `http://localhost:5173/login`.
   - Ingresa tu email y password (ejemplo: email `user@example.com`, password `password` para mocks).
   - Haz clic en "Login". Si es exitoso, serás redirigido a la verificación OTP.

3. **Verificación OTP**:
   - En la página de OTP, verás 6 cuadritos para ingresar el código.
   - Ingresa el OTP (en desarrollo, usa `123456` para simular).
   - El foco se mueve automáticamente al siguiente cuadrito al ingresar un dígito.
   - Haz clic en "Verificar OTP". Si es correcto, accederás al dashboard.

4. **Dashboard**:
   - Página de bienvenida con opción de logout.
   - Haz clic en "Logout" para cerrar sesión y volver a login.

### Notas sobre el Flujo
- En desarrollo, el frontend usa datos mockeados para simular el backend (sin necesidad de ejecutar el backend real).
- Para producción, conecta el frontend al backend real ajustando la URL en `api.ts`.
- Los errores se muestran como notificaciones toast (ej. credenciales inválidas, OTP incorrecto).

## Estructura del Proyecto

```
practica1/
├── react-auth-frontend/          # Frontend React
│   ├── src/
│   │   ├── components/           # Componentes reutilizables (Button, InputField, Layout)
│   │   ├── pages/                # Páginas (Register, Login, OTPVerification, Dashboard)
│   │   ├── services/             # API service (Axios con mocks)
│   │   ├── AuthContext.tsx       # Contexto de autenticación
│   │   └── App.tsx               # Enrutamiento principal
│   └── package.json
├── InitializrSpringbootProject/  # Backend Spring Boot
│   ├── src/main/java/auth/auth/  # Código Java (Controllers, Services, etc.)
│   ├── src/main/resources/       # Configuración (application.properties)
│   └── pom.xml                   # Dependencias Maven
└── README.md                     # Este archivo
```

## Contribución

1. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
2. Haz commits siguiendo Conventional Commits: `feat: add new feature`
3. Push y crea un Pull Request.

## Licencia

Este proyecto es para fines educativos. Asegúrate de cumplir con las políticas de seguridad al manejar datos sensibles.

## Contacto

Si tienes preguntas, abre un issue en el repositorio o contacta al maintainer.
