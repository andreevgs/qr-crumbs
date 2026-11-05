import React from 'react';
import { Icon, Button, IconButton } from '../md3';
import styles from './TopAppBar.module.css';

export interface TopAppBarProps {
  urlLength: number;
  densityLabel: string;
  densityColor: string;
  progressPercent: number;
  onNewStep: () => void;
  onLoadExample: () => void;
  onOpenLink: () => void;
  onOpenScreenshot: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  urlLength,
  densityLabel,
  densityColor,
  progressPercent,
  onNewStep,
  onLoadExample,
  onOpenLink,
  onOpenScreenshot,
}) => {
  return (
    <header className={styles.topBar}>
      <div className={styles.brand}>
        <div className={styles.brandIcon}>
          <Icon name="cookie" size={24} />
        </div>
        <h1 className={styles.brandTitle}>QR crumbs</h1>
      </div>

      {/* Persistent URL Metric in Top App Bar */}
      <div className={styles.centerMetric}>
        <span
          className={styles.metricDot}
          style={{ backgroundColor: densityColor }}
        />
        <span>
          {urlLength} симв. • {densityLabel}
        </span>
      </div>

      {/* Desktop Actions (>= 768px) */}
      <div className={styles.desktopActions}>
        <Button
          variant="tonal"
          icon="note_add"
          onClick={onNewStep}
          title="Очистить поля и перейти к следующему шагу"
        >
          Новый шаг
        </Button>
        <IconButton
          icon="science"
          variant="standard"
          onClick={onLoadExample}
          title="Загрузить пример квеста"
        />
        <Button variant="outlined" icon="open_in_new" onClick={onOpenLink}>
          Проверить
        </Button>
        <Button variant="filled" icon="qr_code_scanner" onClick={onOpenScreenshot}>
          Режим скриншота
        </Button>
      </div>

      {/* Mobile Actions (< 768px) */}
      <div className={styles.mobileActions}>
        <IconButton
          icon="note_add"
          variant="standard"
          onClick={onNewStep}
          title="Новый шаг"
        />
        <IconButton
          icon="science"
          variant="standard"
          onClick={onLoadExample}
          title="Пример"
        />
      </div>

      {/* Persistent Thin 3px Progress Indicator */}
      <div className={styles.topProgressBar}>
        <div
          className={styles.topProgressFill}
          style={{
            width: `${progressPercent}%`,
            backgroundColor: densityColor,
          }}
        />
      </div>
    </header>
  );
};
