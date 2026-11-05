import { Icon } from './Icon';
import styles from './NavigationBar.module.css';

export interface NavigationItem<T extends string> {
  id: T;
  label: string;
  icon: string;
}

export interface NavigationBarProps<T extends string> {
  items: NavigationItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
  className?: string;
}

export function NavigationBar<T extends string>({
  items,
  activeId,
  onChange,
  className = '',
}: NavigationBarProps<T>) {
  return (
    <nav className={`${styles.navBar} ${className}`} role="navigation">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            className={styles.navItem}
            onClick={() => onChange(item.id)}
            aria-selected={isActive}
          >
            <div className={`${styles.pill} ${isActive ? styles.pillActive : ''}`}>
              <Icon name={item.icon} size={24} filled={isActive} />
            </div>
            <span className={`${styles.label} ${isActive ? styles.labelActive : ''}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
