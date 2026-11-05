import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'tonal' | 'outline';
  size?: 'normal' | 'small';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'normal',
  className = '',
  ...props
}) => {
  const classNames = [
    styles.badge,
    variant === 'tonal' ? styles.tonal : variant === 'outline' ? styles.outline : '',
    size === 'small' ? styles.small : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classNames} {...props}>
      {children}
    </span>
  );
};
