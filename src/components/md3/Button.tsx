import React from 'react';
import { Icon } from './Icon';
import styles from './Button.module.css';

export type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: string | React.ReactNode;
  iconTrailing?: string | React.ReactNode;
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
  const hasLeadingIcon = Boolean(icon);
  const classNames = [
    styles.button,
    styles[variant],
    hasLeadingIcon ? styles.hasIcon : '',
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const renderIcon = (ic: string | React.ReactNode) => {
    if (typeof ic === 'string') {
      return <Icon name={ic} size={18} />;
    }
    return ic;
  };

  return (
    <button className={classNames} {...props}>
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{renderIcon(icon)}</span>}
      {children && <span>{children}</span>}
      {iconTrailing && (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>{renderIcon(iconTrailing)}</span>
      )}
    </button>
  );
};
