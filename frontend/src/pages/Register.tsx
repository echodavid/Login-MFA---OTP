import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import InputField from '../components/InputField';
import Button from '../components/Button';
import api from '../services/api';
import type { RegisterRequest } from '../services/frontend-dtos';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2, 'El nombre debe tener al menos 2 caracteres').required('El nombre es obligatorio'),
      lastname: Yup.string().min(2, 'El apellido debe tener al menos 2 caracteres').required('El apellido es obligatorio'),
      email: Yup.string().email('Correo electrónico inválido').required('El correo electrónico es obligatorio'),
      password: Yup.string().required('La contraseña es obligatoria'),
      confirmPassword: Yup.string().required('Confirmar contraseña es obligatorio').test('passwords-match', 'Las contraseñas deben coincidir', function(value) {
        return this.parent.password === value;
      }),
    }),
    onSubmit: async (values) => {
      try {
        const registerData: RegisterRequest = {
          name: values.name,
          lastname: values.lastname,
          email: values.email,
          password: values.password,
        };
        await api.register(registerData);
        toast.success('¡Registro exitoso! Por favor inicia sesión.');
        navigate('/login');
      } catch (error: any) {
        console.log(error);
        toast.error(error.error || 'Registro fallido');
      }
    },
  });

  return (
    <Layout>
      <h2 style={styles.title}>Registrarse</h2>
      <form onSubmit={formik.handleSubmit} style={styles.form}>
        <InputField
          label="Nombre"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && !!formik.errors.name}
          helperText={formik.touched.name ? formik.errors.name : undefined}
        />
        <InputField
          label="Apellido"
          name="lastname"
          value={formik.values.lastname}
          onChange={formik.handleChange}
          error={formik.touched.lastname && !!formik.errors.lastname}
          helperText={formik.touched.lastname ? formik.errors.lastname : undefined}
        />
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
        <InputField
          label="Confirmar Contraseña"
          name="confirmPassword"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          error={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
          helperText={formik.touched.confirmPassword ? formik.errors.confirmPassword : undefined}
        />
        <Button type="submit">Registrarse</Button>
      </form>
      <p style={styles.link}>
        ¿Ya tienes una cuenta? <a href="/login" style={styles.linkText}>Inicia Sesión</a>
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

export default Register;
