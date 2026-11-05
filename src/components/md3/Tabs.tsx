import { Icon } from './Icon';
import styles from './Tabs.module.css';

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon?: string;
}

export interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  className?: string;
}

export function Tabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className = '',
}: TabsProps<T>) {
  return (
    <nav className={`${styles.tabsContainer} ${className}`} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.icon && <Icon name={tab.icon} size={20} filled={isActive} />}
            <span>{tab.label}</span>
            {isActive && <div className={styles.indicator} />}
          </button>
        );
      })}
    </nav>
  );
}
