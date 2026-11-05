import React from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  iconTrailing?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'filled',
  icon,
  iconTrailing,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const classNames = [
    styles.button,
    styles[variant],
    icon ? styles.hasIcon : '',
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classNames} {...props}>
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
      {iconTrailing && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{iconTrailing}</span>}
    </button>
  );
};
