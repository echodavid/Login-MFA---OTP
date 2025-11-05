import React from 'react';

interface InputFieldProps {
  label: string;
  name?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  helperText,
  placeholder,
}) => {
  return (
    <div style={styles.container}>
      <label style={styles.label}>{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          ...styles.input,
          borderColor: error ? '#ef4444' : '#d1d5db',
        }}
        className="input-field"
      />
      {helperText && <span style={{ ...styles.helperText, color: error ? '#ef4444' : '#6b7280' }}>{helperText}</span>}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    backgroundColor: '#ffffff',
    color: '#1f2937',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
  },
  helperText: {
    fontSize: '0.75rem',
  },
};

export default InputField;
