import React, { useMemo, useEffect } from 'react';
import { decodeQuestStep } from '../utils/codec';
import { QuestViewerCard } from '../components/QuestViewerCard';
import { Button } from '../components/md3/Button';
import { Icon } from '../components/md3/Icon';
import styles from './ViewerView.module.css';

export interface ViewerViewProps {
  payload: string;
  onNavigate: (path: string) => void;
}

export const ViewerView: React.FC<ViewerViewProps> = ({ payload, onNavigate }) => {
  const questStep = useMemo(() => {
    return decodeQuestStep(payload);
  }, [payload]);

  useEffect(() => {
    if (questStep) {
      document.title = `${questStep.title} — QR crumbs`;
    } else {
      document.title = 'Ошибка — QR crumbs';
    }
  }, [questStep]);

  return (
    <main className={styles.viewerPage} data-theme={questStep?.theme || 'violet'}>
      <div className={styles.cardArea}>
        {questStep ? (
          <QuestViewerCard step={questStep} />
        ) : (
          <div className={styles.errorCard}>
            <div className={styles.errorIconWrapper}>
              <Icon name="error" size={36} filled />
            </div>
            <h1 className={styles.errorTitle}>Подсказка не найдена</h1>
            <p className={styles.errorDescription}>
              Ссылка повреждена или QR-код был отсканирован с ошибкой. Попробуй
              отсканировать код ещё раз или создай свой квест.
            </p>
            <Button
              variant="filled"
              icon="add_circle"
              onClick={() => onNavigate('#/create')}
            >
              Конструктор квеста
            </Button>
          </div>
        )}

        <footer className={styles.footer}>
          <span>QR crumbs</span>
          <span>•</span>
          <a
            href="#/create"
            className={styles.footerLink}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('#/create');
            }}
          >
            Собрать свой квест
          </a>
        </footer>
      </div>
    </main>
  );
};
