import React, { useState, useMemo, useCallback } from 'react';
import { QuestStep } from '../types';
import { encodeQuestStep, buildViewerUrl } from '../utils/codec';
import { TopAppBar } from '../components/creator/TopAppBar';
import { EditorForm } from '../components/creator/EditorForm';
import { PreviewAndQrPane } from '../components/creator/PreviewAndQrPane';
import { NavigationBar } from '../components/md3';
import { ScreenshotModal } from '../components/ScreenshotModal';
import styles from './CreatorView.module.css';

const DEMO_STEP: QuestStep = {
  stepBadge: 'Шаг 1',
  title: 'Первая зацепка 🎁',
  message:
    'Загляни туда, где всегда холоднее, чем в комнате, но хранятся самые вкусные секреты!',
  secretHint: 'Внимание на нижнюю полку рядом с йогуртами.',
  theme: 'violet',
  icon: 'redeem',
  layout: 'blur',
  unlockCode: '',
};

export const CreatorView: React.FC = () => {
  const [step, setStep] = useState<QuestStep>(DEMO_STEP);
  const [printNote, setPrintNote] = useState<string>('Спрятать в холодильник');
  const [isScreenshotOpen, setIsScreenshotOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview' | 'qr'>('editor');
  const [desktopPaneTab, setDesktopPaneTab] = useState<'preview' | 'qr'>('preview');

  // Compute encoded string and URL
  const encodedPayload = useMemo(() => encodeQuestStep(step), [step]);
  const viewerUrl = useMemo(() => buildViewerUrl(encodedPayload), [encodedPayload]);

  // QR Density analysis
  const urlLength = viewerUrl.length;
  const densityInfo = useMemo(() => {
    if (urlLength <= 250) {
      return { label: 'Отличная читаемость', color: '#6CDBAC' };
    }
    if (urlLength <= 450) {
      return { label: 'Средняя плотность', color: '#FFB951' };
    }
    return { label: 'Высокая плотность', color: '#F2B8B5' };
  }, [urlLength]);

  const progressPercent = Math.min(100, Math.round((urlLength / 600) * 100));

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(viewerUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, [viewerUrl]);

  // Create clean new step for rapid authoring with auto-incrementing step number
  const handleNewStep = () => {
    let nextBadge = 'Шаг 2';
    const match = (step.stepBadge || '').trim().match(/^Шаг\s*(\d+)$/i);
    if (match) {
      const currentNum = parseInt(match[1], 10);
      nextBadge = `Шаг ${currentNum + 1}`;
    } else if (step.stepBadge && step.stepBadge.trim().length > 0) {
      nextBadge = step.stepBadge.trim();
    }

    setStep((prev) => ({
      ...prev,
      stepBadge: nextBadge,
      title: '',
      message: '',
      secretHint: '',
      unlockCode: '',
    }));
    setPrintNote('');
  };

  const handleLoadExample = () => {
    setStep(DEMO_STEP);
    setPrintNote('Спрятать в холодильник');
  };

  return (
    <div className={styles.container} data-theme={step.theme}>
      {/* 1. Top App Bar with persistent URL Metric & Header Actions */}
      <TopAppBar
        urlLength={urlLength}
        densityLabel={densityInfo.label}
        densityColor={densityInfo.color}
        progressPercent={progressPercent}
        onNewStep={handleNewStep}
        onLoadExample={handleLoadExample}
        onOpenLink={() => window.open(viewerUrl, '_blank')}
        onOpenScreenshot={() => setIsScreenshotOpen(true)}
      />

      {/* 2. Main Two-Pane Content */}
      <main className={styles.mainContent}>
        <EditorForm
          step={step}
          printNote={printNote}
          onStepChange={setStep}
          onPrintNoteChange={setPrintNote}
          className={mobileTab !== 'editor' ? styles.hideOnMobile : ''}
        />

        <PreviewAndQrPane
          step={step}
          viewerUrl={viewerUrl}
          printNote={printNote}
          mobileTab={mobileTab}
          desktopPaneTab={desktopPaneTab}
          onDesktopPaneTabChange={setDesktopPaneTab}
          onOpenScreenshot={() => setIsScreenshotOpen(true)}
          onCopyLink={handleCopyLink}
          isCopied={isCopied}
          className={mobileTab === 'editor' ? styles.hideOnMobile : ''}
        />
      </main>

      {/* 3. Mobile MD3 Bottom Navigation Bar */}
      <NavigationBar
        items={[
          { id: 'editor', label: 'Редактор', icon: 'edit' },
          { id: 'preview', label: 'Превью', icon: 'visibility' },
          { id: 'qr', label: 'QR-код', icon: 'qr_code_2' },
        ]}
        activeId={mobileTab}
        onChange={(tab) => setMobileTab(tab as 'editor' | 'preview' | 'qr')}
        className={styles.mobileNav}
      />

      {/* 4. Screenshot Mode Fullscreen Overlay */}
      <ScreenshotModal
        isOpen={isScreenshotOpen}
        onClose={() => setIsScreenshotOpen(false)}
        url={viewerUrl}
        stepBadge={step.stepBadge}
        printNote={printNote}
      />
    </div>
  );
};
