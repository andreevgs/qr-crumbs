import React from 'react';
import { Icon } from './Icon';
import styles from './IconButton.module.css';

export type IconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outlined';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string | React.ReactNode;
  variant?: IconButtonVariant;
  size?: number;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'standard',
  size = 24,
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      className={`${styles.iconButton} ${styles[variant]} ${className}`}
      {...props}
    >
      {typeof icon === 'string' ? <Icon name={icon} size={size} /> : icon}
    </button>
  );
};
