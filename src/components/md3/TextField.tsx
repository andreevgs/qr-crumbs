import React, { useState, useId } from 'react';
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
  value = '',
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
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;
  const hasValue = String(value).length > 0;
  const isFloated = isFocused || hasValue;

  return (
    <div className={`${styles.container} ${className}`}>
      <div
        className={`${styles.fieldWrapper} ${multiline ? styles.isMultiline : ''} ${
          isError ? styles.hasError : ''
        }`}
      >
        {label && (
          <label
            htmlFor={inputId}
            className={`${styles.floatingLabel} ${
              isFloated ? styles.floatingLabelFloated : ''
            }`}
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
            placeholder={isFloated ? placeholder : undefined}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
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
            placeholder={isFloated ? placeholder : undefined}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={onChange}
            onKeyDown={onKeyDown}
            autoFocus={autoFocus}
          />
        )}

        {/* Semantic Fieldset with Notch Legend */}
        <fieldset className={styles.outlineFieldset} aria-hidden="true">
          {label && (
            <legend
              className={`${styles.outlineLegend} ${
                isFloated ? styles.outlineLegendOpen : ''
              }`}
            >
              <span>{label}</span>
            </legend>
          )}
        </fieldset>
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
