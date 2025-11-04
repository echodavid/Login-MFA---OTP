import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext';
import Layout from '../components/Layout';
import InputField from '../components/InputField';
import Button from '../components/Button';
import api from '../services/api';
import type { LoginRequest } from '../services/frontend-dtos';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Correo electrónico inválido').required('El correo electrónico es obligatorio'),
      password: Yup.string().required('La contraseña es obligatoria'),
    }),
    onSubmit: async (values) => {
      try {
        const loginData: LoginRequest = {
          email: values.email,
          password: values.password,
        };
  const response = await api.login(loginData);
  // backend sends OTP to email; save pending email and navigate to verification
  localStorage.setItem('pendingEmail', values.email);
  toast.success(response.message || 'OTP enviado al correo');
  navigate('/verify-otp');
      } catch (error: any) {
        toast.error(error.message || 'Inicio de sesión fallido');
      }
    },
  });

  return (
    <Layout>
      <h2 style={styles.title}>Iniciar Sesión</h2>
      <form onSubmit={formik.handleSubmit} style={styles.form}>
        <InputField
          label="Correo Electrónico"
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && !!formik.errors.email}
          helperText={formik.touched.email ? formik.errors.email : undefined}
        />
        <InputField
          label="Contraseña"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && !!formik.errors.password}
          helperText={formik.touched.password ? formik.errors.password : undefined}
        />
        <Button type="submit">Iniciar Sesión</Button>
      </form>
      <p style={styles.link}>
        ¿No tienes una cuenta? <a href="/register" style={styles.linkText}>Regístrate</a>
      </p>
    </Layout>
  );
};

const styles = {
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    marginBottom: '1rem',
  },
  link: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  linkText: {
    color: '#3b82f6',
    textDecoration: 'none',
  },
};

export default Login;
