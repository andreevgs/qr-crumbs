import React, { useId, useState } from 'react';
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
  onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  autoFocus?: boolean;
  surfaceBg?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  helperText,
  error,
  multiline = false,
  rows = 3,
  value = '',
  placeholder,
  type = 'text',
  disabled = false,
  className = '',
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  autoFocus = false,
  surfaceBg,
}) => {
  const generatedId = useId();
  const inputId = `field-${generatedId}`;
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;

  const [isFocused, setIsFocused] = useState<boolean>(false);

  const hasValue = String(value).length > 0;
  // Label floats if focused, has value, or has placeholder
  const isFloating = isFocused || hasValue || Boolean(placeholder);

  const containerClasses = [
    styles.outlinedContainer,
    multiline ? styles.multilineContainer : '',
    isFocused ? styles.focused : '',
    isError ? styles.hasError : '',
    disabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  const labelClasses = [
    styles.label,
    isFloating ? styles.labelFloating : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={containerClasses}>
        {label && (
          <label
            htmlFor={inputId}
            className={labelClasses}
            style={surfaceBg ? { backgroundColor: surfaceBg } : undefined}
          >
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
            onFocus={handleFocus}
            onBlur={handleBlur}
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
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoFocus={autoFocus}
          />
        )}
      </div>

      {(errorMessage || helperText) && (
        <span
          className={`${styles.supportingText} ${isError ? styles.errorText : ''}`}
        >
          {errorMessage || helperText}
        </span>
      )}
    </div>
  );
};
