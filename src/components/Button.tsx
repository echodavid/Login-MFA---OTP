import React from 'react';

interface CustomButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  type = 'button',
  onClick,
  disabled,
  variant = 'primary',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles.base,
        ...(variant === 'primary' ? styles.primary : styles.secondary),
        ...(disabled ? styles.disabled : {}),
      }}
      className="custom-button"
    >
      {children}
    </button>
  );
};

const styles = {
  base: {
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s, opacity 0.2s',
    border: 'none',
    outline: 'none',
    width: '100%',
  },
  primary: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
  },
  secondary: {
    backgroundColor: 'transparent',
    color: '#3b82f6',
    border: '1px solid #3b82f6',
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

export default CustomButton;
