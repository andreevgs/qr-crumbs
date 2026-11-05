import React, { useState, useEffect } from 'react';
import { QuestStep } from '../types';
import { Icon } from './md3/Icon';
import { Badge } from './md3/Badge';
import { Button } from './md3/Button';
import { TextField } from './md3/TextField';
import styles from './QuestViewerCard.module.css';

export interface QuestViewerCardProps {
  step: QuestStep;
  isPreview?: boolean;
}

export const QuestViewerCard: React.FC<QuestViewerCardProps> = ({
  step,
  isPreview = false,
}) => {
  const [isBlurred, setIsBlurred] = useState<boolean>(step.layout === 'blur');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(step.layout !== 'codeLock');
  const [codeInput, setCodeInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isHintOpen, setIsHintOpen] = useState<boolean>(false);

  // Sync state when step layout or unlockCode changes
  useEffect(() => {
    setIsBlurred(step.layout === 'blur');
    setIsUnlocked(step.layout !== 'codeLock');
    setCodeInput('');
    setErrorMessage('');
    setIsHintOpen(false);
  }, [step.layout, step.unlockCode]);

  const handleResetPreview = () => {
    setIsBlurred(step.layout === 'blur');
    setIsUnlocked(step.layout !== 'codeLock');
    setCodeInput('');
    setErrorMessage('');
    setIsHintOpen(false);
  };

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const expected = (step.unlockCode || '').trim().toLowerCase();
    const actual = codeInput.trim().toLowerCase();

    if (expected.length === 0 || actual === expected) {
      setIsUnlocked(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Неверный код. Попробуй ещё раз!');
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 450);
    }
  };

  const isRevealed =
    step.layout === 'standard' ||
    (step.layout === 'blur' && !isBlurred) ||
    (step.layout === 'codeLock' && isUnlocked);

  return (
    <div className={styles.cardContainer} data-theme={step.theme}>
      <div className={styles.cardInner}>
        {/* Preview badge indicator */}
        {isPreview && (
          <div className={styles.previewBadgeBar}>
            <span className={styles.previewLabel}>Интерактивное превью</span>
            <Button
              variant="text"
              onClick={handleResetPreview}
              icon={<Icon name="restart_alt" size={16} />}
              style={{ height: '32px', padding: '0 8px', fontSize: '12px' }}
            >
              Сброс
            </Button>
          </div>
        )}

        {/* Header Icon with Glow */}
        <div className={styles.headerWrapper}>
          <div className={styles.glow} />
          <div className={styles.iconSquircle}>
            <Icon name={step.icon} size={36} />
          </div>

          {step.stepBadge && step.stepBadge.trim().length > 0 && (
            <div className={styles.badgeWrapper}>
              <Badge>{step.stepBadge.trim()}</Badge>
            </div>
          )}
        </div>

        {/* Card Title */}
        <h2 className={styles.title}>{step.title}</h2>

        {/* Content Area Based on Layout */}
        <div className={styles.contentArea}>
          {/* STANDARD LAYOUT */}
          {step.layout === 'standard' && (
            <div className={styles.messageBox}>{step.message}</div>
          )}

          {/* BLUR LAYOUT */}
          {step.layout === 'blur' && (
            <div className={styles.blurWrapper}>
              <div
                className={`${styles.messageBox} ${styles.blurContent} ${
                  isBlurred ? styles.blurred : ''
                }`}
              >
                {step.message}
              </div>

              {isBlurred && (
                <div
                  className={styles.blurOverlay}
                  onClick={() => setIsBlurred(false)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setIsBlurred(false);
                    }
                  }}
                >
                  <Icon name="visibility" size={32} />
                  <span className={styles.blurHintText}>
                    Нажми, чтобы открыть подсказку
                  </span>
                </div>
              )}
            </div>
          )}

          {/* CODE LOCK LAYOUT */}
          {step.layout === 'codeLock' && (
            <>
              {!isUnlocked ? (
                <div className={`${styles.lockBox} ${isShaking ? 'animate-shake' : ''}`}>
                  <div className={styles.lockIconWrap}>
                    <Icon name="lock" size={24} />
                  </div>
                  <p className={styles.lockDescription}>
                    Эта подсказка закрыта кодовым замком. Введи пароль для разблокировки:
                  </p>

                  <form className={styles.lockForm} onSubmit={handleUnlock}>
                    <TextField
                      placeholder="Введи секретный код"
                      value={codeInput}
                      onChange={(e) => {
                        setCodeInput(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      error={errorMessage}
                      autoFocus={!isPreview}
                    />
                    <Button
                      type="submit"
                      variant="filled"
                      icon={<Icon name="lock_open" size={18} />}
                      fullWidth
                    >
                      Разблокировать
                    </Button>
                  </form>
                </div>
              ) : (
                <div className={`${styles.messageBox} animate-fade-in`}>
                  {step.message}
                </div>
              )}
            </>
          )}
        </div>

        {/* SECRET HINT ACCORDION (Only rendered if configured and main riddle is revealed) */}
        {step.secretHint && step.secretHint.trim().length > 0 && isRevealed && (
          <div className={styles.hintSection}>
            <button
              type="button"
              className={styles.hintToggle}
              onClick={() => setIsHintOpen((prev) => !prev)}
              aria-expanded={isHintOpen}
            >
              <span className={styles.hintToggleTitle}>
                <Icon name="help" size={18} />
                <span>Нужна наводка?</span>
              </span>
              <Icon
                name={isHintOpen ? 'expand_less' : 'expand_more'}
                size={20}
              />
            </button>

            {isHintOpen && (
              <div className={styles.hintBody}>{step.secretHint}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
