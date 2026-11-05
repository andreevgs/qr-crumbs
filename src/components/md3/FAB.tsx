import React from 'react';
import styles from './FAB.module.css';

export interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  variant?: 'primary' | 'secondary' | 'surface';
  className?: string;
}

export const FAB: React.FC<FABProps> = ({
  icon,
  label,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const isExtended = Boolean(label);

  const classNames = [
    styles.fab,
    isExtended ? styles.extended : styles.standard,
    variant !== 'primary' ? styles[variant] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classNames} {...props}>
      <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>
      {label && <span>{label}</span>}
    </button>
  );
};
