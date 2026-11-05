import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QuestStep } from '../../types';
import { QuestViewerCard } from '../QuestViewerCard';
import { Button, SegmentedButton, Icon } from '../md3';
import styles from './PreviewAndQrPane.module.css';

export interface PreviewAndQrPaneProps {
  step: QuestStep;
  viewerUrl: string;
  printNote?: string;
  mobileTab: 'editor' | 'preview' | 'qr';
  desktopPaneTab: 'preview' | 'qr';
  onDesktopPaneTabChange: (tab: 'preview' | 'qr') => void;
  onOpenScreenshot: () => void;
  onCopyLink: () => void;
  isCopied: boolean;
  className?: string;
}

export const PreviewAndQrPane: React.FC<PreviewAndQrPaneProps> = ({
  step,
  viewerUrl,
  printNote,
  mobileTab,
  desktopPaneTab,
  onDesktopPaneTabChange,
  onOpenScreenshot,
  onCopyLink,
  isCopied,
  className = '',
}) => {
  const [previewResetKey, setPreviewResetKey] = useState<number>(0);

  return (
    <section className={`${styles.previewColumn} ${className}`}>
      {/* Desktop compact switch: Live Preview vs QR Code */}
      <div className={styles.desktopPreviewSwitch}>
        <SegmentedButton
          options={[
            { value: 'preview', label: 'Живое превью', icon: 'visibility' },
            { value: 'qr', label: 'QR-код для печати', icon: 'qr_code_2' },
          ]}
          value={desktopPaneTab}
          onChange={(val) => onDesktopPaneTabChange(val as 'preview' | 'qr')}
        />
      </div>

      {/* 1. Live Interactive Preview with Smartphone Podium */}
      <div
        className={`${styles.previewWrapperCard} ${
          mobileTab !== 'preview' ? styles.hideOnMobile : ''
        } ${desktopPaneTab !== 'preview' ? styles.hideOnDesktop : ''}`}
      >
        <div className={styles.previewHeader}>
          <div className={styles.previewTitleGroup}>
            <span className={styles.previewHeaderIcon}>
              <Icon name="smartphone" size={20} />
            </span>
            <span>Интерактивное превью</span>
          </div>
          <Button
            variant="text"
            icon="restart_alt"
            onClick={() => setPreviewResetKey((k) => k + 1)}
            style={{ height: '32px', padding: '0 8px', fontSize: '13px' }}
          >
            Сбросить
          </Button>
        </div>

        <div className={styles.phonePodium}>
          <QuestViewerCard step={step} resetKey={previewResetKey} />
        </div>
      </div>

      {/* 2. QR Code for Print */}
      <div
        className={`${styles.qrCard} ${
          mobileTab !== 'qr' ? styles.hideOnMobile : ''
        } ${desktopPaneTab !== 'qr' ? styles.hideOnDesktop : ''}`}
      >
        <div className={styles.qrContainer}>
          <QRCodeSVG
            value={viewerUrl}
            size={190}
            level="M"
            fgColor="#141218"
            bgColor="#FFFFFF"
          />
        </div>

        {printNote && (
          <div
            style={{
              fontSize: '13px',
              color: 'var(--md-sys-color-on-surface-variant)',
            }}
          >
            📌 {printNote}
          </div>
        )}

        {isCopied && (
          <div className={styles.copiedToast}>
            <Icon name="check" size={16} />
            <span>Ссылка скопирована в буфер обмена!</span>
          </div>
        )}

        <div className={styles.qrButtons}>
          <Button
            variant="filled"
            icon="qr_code_scanner"
            onClick={onOpenScreenshot}
          >
            Режим скриншота
          </Button>

          <Button
            variant="tonal"
            icon="content_copy"
            onClick={onCopyLink}
          >
            {isCopied ? 'Скопировано!' : 'Копировать'}
          </Button>

          <Button
            variant="outlined"
            icon="open_in_new"
            onClick={() => window.open(viewerUrl, '_blank')}
            title="Проверить в новой вкладке"
          >
            Проверить
          </Button>
        </div>
      </div>
    </section>
  );
};
