import React, { useId } from 'react';
import styles from './TextField.module.css';

export interface TextFieldProps {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  multiline?: boolean;
  rows?: number;
  value?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  autoFocus?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  helperText,
  error,
  multiline = false,
  rows = 3,
  value,
  placeholder,
  type = 'text',
  disabled = false,
  className = '',
  onChange,
  onKeyDown,
  autoFocus = false,
}) => {
  const generatedId = useId();
  const inputId = `field-${generatedId}`;
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={`${styles.inputWrapper} ${isError ? styles.hasError : ''}`}>
        <div className={styles.contentBox}>
          {label && (
            <label htmlFor={inputId} className={styles.label}>
              {label}
            </label>
          )}

          {multiline ? (
            <textarea
              id={inputId}
              className={styles.textarea}
              rows={rows}
              value={value}
              placeholder={placeholder}
              disabled={disabled}
              onChange={onChange}
              onKeyDown={onKeyDown}
              autoFocus={autoFocus}
            />
          ) : (
            <input
              id={inputId}
              type={type}
              className={styles.input}
              value={value}
              placeholder={placeholder}
              disabled={disabled}
              onChange={onChange}
              onKeyDown={onKeyDown}
              autoFocus={autoFocus}
            />
          )}
        </div>
      </div>

      {(errorMessage || helperText) && (
        <span className={`${styles.helperText} ${isError ? styles.errorText : ''}`}>
          {errorMessage || helperText}
        </span>
      )}
    </div>
  );
};
