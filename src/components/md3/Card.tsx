import React from 'react';
import styles from './Card.module.css';

export type CardVariant = 'elevated' | 'filled' | 'filledHigh' | 'outlined';
export type CardRadius = 'medium' | 'large' | 'extraLarge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  radius?: CardRadius;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'filled',
  radius = 'extraLarge',
  className = '',
  ...props
}) => {
  const radiusClass =
    radius === 'medium'
      ? styles.radiusMedium
      : radius === 'large'
      ? styles.radiusLarge
      : styles.radiusExtraLarge;

  const classNames = [
    styles.card,
    styles[variant],
    radiusClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
};
