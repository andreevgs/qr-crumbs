import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X } from 'lucide-react';
import styles from './ScreenshotModal.module.css';

export interface ScreenshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  stepBadge?: string;
  printNote?: string;
}

type CardSize = 240 | 300 | 360;

export const ScreenshotModal: React.FC<ScreenshotModalProps> = ({
  isOpen,
  onClose,
  url,
  stepBadge,
  printNote,
}) => {
  const [size, setSize] = useState<CardSize>(300);
  const [showControls, setShowControls] = useState<boolean>(true);
  const hideTimerRef = useRef<number | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Fade out controls after 2s of inactivity
  useEffect(() => {
    if (!isOpen) return;

    const resetTimer = () => {
      setShowControls(true);
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
      hideTimerRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 2000);
    };

    resetTimer();

    const handleActivity = () => {
      resetTimer();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        // Exit when clicking the backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Floating control bar */}
      <div
        className={`${styles.floatingControls} ${
          !showControls ? styles.hiddenControls : ''
        }`}
      >
        <div className={styles.sizeButtons}>
          <button
            type="button"
            className={`${styles.sizeBtn} ${size === 240 ? styles.sizeBtnActive : ''}`}
            onClick={() => setSize(240)}
          >
            S (240)
          </button>
          <button
            type="button"
            className={`${styles.sizeBtn} ${size === 300 ? styles.sizeBtnActive : ''}`}
            onClick={() => setSize(300)}
          >
            M (300)
          </button>
          <button
            type="button"
            className={`${styles.sizeBtn} ${size === 360 ? styles.sizeBtnActive : ''}`}
            onClick={() => setSize(360)}
          >
            L (360)
          </button>
        </div>

        <button type="button" className={styles.closeBtn} onClick={onClose}>
          <X size={16} />
          <span>Закрыть (Esc)</span>
        </button>
      </div>

      {/* Aesthetic printable card strictly in center */}
      <div
        className={styles.printCard}
        style={{ width: `${size + 56}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with step badge and/or local print note */}
        {(stepBadge || printNote) && (
          <div className={styles.cardHeader}>
            {stepBadge && <div className={styles.badge}>{stepBadge}</div>}
            {printNote && (
              <div className={styles.printNote}>
                📌 {printNote}
              </div>
            )}
          </div>
        )}

        {/* QR Code */}
        <div className={styles.qrWrapper}>
          <QRCodeSVG
            value={url}
            size={size}
            level="M"
            fgColor="#141218"
            bgColor="#FFFFFF"
          />
        </div>

        {/* Footer info */}
        <div className={styles.cardFooter}>
          <span className={styles.scanInstruction}>Отсканируй камерой телефона</span>
          <span className={styles.appName}>QR Quest</span>
        </div>
      </div>

      {/* Subdued bottom tip */}
      <div
        className={`${styles.bottomTip} ${
          !showControls ? styles.hiddenControls : ''
        }`}
      >
        Сделай скриншот (Win+Shift+S / Ножницы) или нажми Esc для выхода
      </div>
    </div>
  );
};
