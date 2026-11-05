import React from 'react';
import { Icon } from './Icon';
import styles from './SegmentedButton.module.css';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: string | React.ReactNode;
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
            {isSelected ? (
              <span className={styles.checkIcon}>
                <Icon name="check" size={18} />
              </span>
            ) : opt.icon ? (
              <span className={styles.checkIcon}>
                {typeof opt.icon === 'string' ? <Icon name={opt.icon} size={18} /> : opt.icon}
              </span>
            ) : null}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
