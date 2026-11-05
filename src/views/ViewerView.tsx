import React, { useMemo, useEffect } from 'react';
import { AlertCircle, PlusCircle } from 'lucide-react';
import { decodeQuestStep } from '../utils/codec';
import { QuestViewerCard } from '../components/QuestViewerCard';
import { Button } from '../components/md3/Button';
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
      document.title = `${questStep.title} — QR Quest`;
    } else {
      document.title = 'Ошибка — QR Quest';
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
              <AlertCircle size={36} />
            </div>
            <h1 className={styles.errorTitle}>Подсказка не найдена</h1>
            <p className={styles.errorDescription}>
              Ссылка повреждена или QR-код был отсканирован с ошибкой. Попробуй
              отсканировать код ещё раз или создай свой квест.
            </p>
            <Button
              variant="filled"
              icon={<PlusCircle size={18} />}
              onClick={() => onNavigate('#/create')}
            >
              Конструктор квеста
            </Button>
          </div>
        )}

        <footer className={styles.footer}>
          <span>Serverless QR Quest</span>
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
