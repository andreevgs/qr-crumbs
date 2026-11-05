import React from 'react';
import { Icon } from './Icon';
import styles from './Fab.module.css';

export interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string | React.ReactNode;
  label?: string;
  fixedBottomRight?: boolean;
}

export const Fab: React.FC<FabProps> = ({
  icon,
  label,
  fixedBottomRight = false,
  className = '',
  ...props
}) => {
  const isExtended = Boolean(label);

  return (
    <button
      type="button"
      className={`${styles.fab} ${isExtended ? styles.extended : ''} ${
        fixedBottomRight ? styles.fixedBottomRight : ''
      } ${className}`}
      {...props}
    >
      {typeof icon === 'string' ? <Icon name={icon} size={24} /> : icon}
      {label && <span>{label}</span>}
    </button>
  );
};
