import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import Button from '../components/Button';
import api from '../services/api';

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Solo un dígito por input
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Foco automático al siguiente input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Por favor, ingresa el código OTP completo.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/verify-otp', { otp: otpCode });
      toast.success('OTP verificado exitosamente.');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al verificar OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await api.post('/resend-otp');
      toast.success('OTP reenviado.');
    } catch (error: any) {
      toast.error('Error al reenviar OTP.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Layout>
      <h2 style={styles.title}>Verificación OTP</h2>
      <p style={styles.subtitle}>Ingresa el código de 6 dígitos enviado a tu email.</p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.otpContainer}>
          {otp.map((digit: string, index: number) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength={1}
              style={styles.otpInput}
              className="otp-input"
            />
          ))}
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Verificando...' : 'Verificar OTP'}
        </Button>
      </form>
      <Button onClick={handleResend} disabled={resendLoading} variant="secondary">
        {resendLoading ? 'Reenviando...' : 'Reenviar OTP'}
      </Button>
    </Layout>
  );
};

const styles = {
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  otpContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  otpInput: {
    width: '3rem',
    height: '3rem',
    textAlign: 'center' as const,
    fontSize: '1.25rem',
    fontWeight: '600',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#1f2937',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
  },
};

export default OTPVerification;
