import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Layout from '../components/Layout';
import Button from '../components/Button';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout>
      <h2 style={styles.title}>Panel de Control</h2>
      <p style={styles.text}>¡Bienvenido! Has iniciado sesión.</p>
      <Button onClick={handleLogout} variant="secondary">Cerrar Sesión</Button>
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
  text: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '1rem',
  },
};

export default Dashboard;
