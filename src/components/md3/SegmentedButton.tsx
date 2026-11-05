import React from 'react';
import styles from './SegmentedButton.module.css';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedButtonProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedButton<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: SegmentedButtonProps<T>) {
  return (
    <div className={`${styles.group} ${className}`} role="radiogroup">
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={`${styles.segment} ${isSelected ? styles.selected : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.icon && <span className={styles.iconWrapper}>{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
