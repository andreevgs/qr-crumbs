import React, { useState, useMemo, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QuestStep, ThemeSeed, StepLayout } from '../types';
import { encodeQuestStep, buildViewerUrl } from '../utils/codec';
import { QuestViewerCard } from '../components/QuestViewerCard';
import { ScreenshotModal } from '../components/ScreenshotModal';
import {
  Button,
  IconButton,
  Fab,
  TextField,
  SegmentedButton,
  Icon,
  Tabs,
  ICON_OPTIONS,
} from '../components/md3';
import styles from './CreatorView.module.css';

const DEFAULT_STEP: QuestStep = {
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

const THEMES: { id: ThemeSeed; name: string; color: string }[] = [
  { id: 'violet', name: 'Фиолетовый', color: '#D0BCFF' },
  { id: 'rose', name: 'Розовый', color: '#FFB1C8' },
  { id: 'amber', name: 'Янтарный', color: '#FFB951' },
  { id: 'emerald', name: 'Изумрудный', color: '#6CDBAC' },
  { id: 'cyan', name: 'Бирюзовый', color: '#4FD8EB' },
];

const LAYOUT_OPTIONS: { value: StepLayout; label: string; icon: string }[] = [
  { value: 'standard', label: 'Обычный', icon: 'feed' },
  { value: 'blur', label: 'Скретч-блюр', icon: 'blur_on' },
  { value: 'codeLock', label: 'Пароль', icon: 'lock' },
];

export const CreatorView: React.FC = () => {
  const [step, setStep] = useState<QuestStep>(DEFAULT_STEP);
  const [printNote, setPrintNote] = useState<string>('Спрятать в холодильник');
  const [isScreenshotOpen, setIsScreenshotOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview' | 'qr'>('editor');

  // Compute encoded string and URL
  const encodedPayload = useMemo(() => encodeQuestStep(step), [step]);
  const viewerUrl = useMemo(() => buildViewerUrl(encodedPayload), [encodedPayload]);

  // QR Density analysis
  const urlLength = viewerUrl.length;
  const densityInfo = useMemo(() => {
    if (urlLength <= 250) {
      return {
        label: 'Отличная читаемость',
        className: styles.densityGreen,
        barColor: '#6CDBAC',
      };
    }
    if (urlLength <= 450) {
      return {
        label: 'Средняя плотность',
        className: styles.densityAmber,
        barColor: '#FFB951',
      };
    }
    return {
      label: 'Высокая плотность (печатать крупнее)',
      className: styles.densityRed,
      barColor: '#F2B8B5',
    };
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

  const handleResetForm = () => {
    if (window.confirm('Сбросить все поля формы к начальным настройкам?')) {
      setStep(DEFAULT_STEP);
      setPrintNote('');
    }
  };

  return (
    <div className={styles.container} data-theme={step.theme}>
      {/* MD3 Small Top App Bar (strictly 64px, canonical branding) */}
      <header className={styles.topBar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <Icon name="cookie" size={24} />
          </div>
          <h1 className={styles.brandTitle}>QR crumbs</h1>
        </div>

        {/* Desktop actions (>= 768px) */}
        <div className={styles.desktopActions}>
          <IconButton
            icon="restart_alt"
            variant="standard"
            onClick={handleResetForm}
            title="Сбросить форму"
          />
          <Button
            variant="outlined"
            icon="open_in_new"
            onClick={() => window.open(viewerUrl, '_blank')}
          >
            Проверить
          </Button>
          <Button
            variant="filled"
            icon="qr_code_scanner"
            onClick={() => setIsScreenshotOpen(true)}
          >
            Режим скриншота
          </Button>
        </div>

        {/* Mobile top action (< 768px: single restart button) */}
        <div className={styles.mobileTopActions}>
          <IconButton
            icon="restart_alt"
            variant="standard"
            onClick={handleResetForm}
            title="Сбросить"
          />
        </div>
      </header>

      {/* Mobile MD3 Primary Tabs (< 768px) */}
      <div className={styles.mobileTabsWrapper}>
        <Tabs
          tabs={[
            { id: 'editor', label: 'Конструктор', icon: 'edit' },
            { id: 'preview', label: 'Превью', icon: 'visibility' },
            { id: 'qr', label: 'QR-код', icon: 'qr_code_2' },
          ]}
          activeTab={mobileTab}
          onChange={(tab) => setMobileTab(tab as 'editor' | 'preview' | 'qr')}
        />
      </div>

      {/* Main Grid Content */}
      <main className={styles.mainContent}>
        {/* LEFT COLUMN: EDITOR */}
        <section
          className={`${styles.editorColumn} ${
            mobileTab !== 'editor' ? styles.hideOnMobile : ''
          }`}
        >
          {/* Section: Content */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <Icon name="description" size={20} />
              <span>Текст и загадка</span>
            </div>

            <div className={styles.formGrid}>
              <TextField
                label="Номер / Бейдж шага"
                placeholder="Шаг 1, Финал..."
                value={step.stepBadge || ''}
                onChange={(e) =>
                  setStep((prev) => ({ ...prev, stepBadge: e.target.value }))
                }
                helperText="Короткая надпись в верхней части карточки"
              />

              <TextField
                label="Заголовок карточки"
                placeholder="Первая зацепка 🎁"
                value={step.title}
                onChange={(e) =>
                  setStep((prev) => ({ ...prev, title: e.target.value }))
                }
              />

              <TextField
                label="Основной текст подсказки / загадки"
                placeholder="Напиши загадку или указание, где искать следующий QR-код..."
                value={step.message}
                onChange={(e) =>
                  setStep((prev) => ({ ...prev, message: e.target.value }))
                }
                multiline
                rows={4}
                helperText="Поддерживает переносы строк и эмодзи"
              />

              <TextField
                label="Секретная наводка (под спойлером)"
                placeholder="Посмотри в кастрюле на верхней полке"
                value={step.secretHint || ''}
                onChange={(e) =>
                  setStep((prev) => ({ ...prev, secretHint: e.target.value }))
                }
                multiline
                rows={2}
                helperText="Опционально. Появится кнопка «Нужна наводка?»"
              />
            </div>
          </div>

          {/* Section: Opening Mechanic */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <Icon name="lock" size={20} />
              <span>Механика открытия карточки</span>
            </div>

            <div className={styles.formGrid}>
              <SegmentedButton
                options={LAYOUT_OPTIONS}
                value={step.layout}
                onChange={(val) => setStep((prev) => ({ ...prev, layout: val }))}
              />

              {step.layout === 'codeLock' && (
                <TextField
                  label="Секретный код разблокировки"
                  placeholder="например: 1234 или ЧУДО"
                  value={step.unlockCode || ''}
                  onChange={(e) =>
                    setStep((prev) => ({ ...prev, unlockCode: e.target.value }))
                  }
                  helperText="Регистронезависимо. Игрок должен ввести это слово для открытия."
                  autoFocus
                />
              )}
            </div>
          </div>

          {/* Section: Themes & Material Symbols Icons */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <Icon name="palette" size={20} />
              <span>Цветовой акцент и иконка</span>
            </div>

            <div className={styles.formGrid}>
              <label className={styles.densityTitle}>Цветовая тема (MD3):</label>
              <div className={styles.swatchGrid}>
                {THEMES.map((th) => {
                  const isSelected = step.theme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      className={`${styles.swatchBtn} ${
                        isSelected ? styles.swatchSelected : ''
                      }`}
                      style={{ backgroundColor: th.color }}
                      onClick={() => setStep((prev) => ({ ...prev, theme: th.id }))}
                      title={th.name}
                    >
                      {isSelected && (
                        <Icon name="check" size={20} className={styles.swatchCheck} />
                      )}
                    </button>
                  );
                })}
              </div>

              <label className={styles.densityTitle} style={{ marginTop: '12px' }}>
                Иконка шага (Material Symbols):
              </label>
              <div className={styles.iconGrid}>
                {ICON_OPTIONS.map((opt) => {
                  const isSelected = step.icon === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`${styles.iconBtn} ${
                        isSelected ? styles.iconBtnSelected : ''
                      }`}
                      onClick={() => setStep((prev) => ({ ...prev, icon: opt.id }))}
                      title={opt.label}
                    >
                      <Icon name={opt.id} size={24} filled={isSelected} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section: Technical Print Note */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <Icon name="label" size={20} />
              <span>Техническая пометка для печати</span>
            </div>

            <TextField
              label="Пометка для автора (не зашивается в ссылку)"
              placeholder="Спрятать в микроволновку / QR #1"
              value={printNote}
              onChange={(e) => setPrintNote(e.target.value)}
              helperText="Отобразится на карточке в режиме скриншота, чтобы не перепутать распечатки"
            />
          </div>
        </section>

        {/* RIGHT COLUMN: PREVIEW & QR */}
        <section className={styles.previewColumn}>
          {/* Live Interactive Preview Card */}
          <div
            className={`${styles.stickySide} ${
              mobileTab === 'qr' ? styles.hideOnMobile : ''
            }`}
          >
            <QuestViewerCard step={step} isPreview />
          </div>

          {/* QR Code and Density Information Card */}
          <div
            className={`${styles.stickySide} ${
              mobileTab === 'preview' ? styles.hideOnMobile : ''
            }`}
          >
            {/* Density Widget */}
            <div className={styles.densityCard}>
              <div className={styles.densityRow}>
                <span className={styles.densityTitle}>
                  Размер ссылки: <strong>{urlLength}</strong> симв.
                </span>
                <span
                  className={`${styles.densityBadge} ${densityInfo.className}`}
                >
                  {densityInfo.label}
                </span>
              </div>
              <div className={styles.densityProgressBar}>
                <div
                  className={styles.densityProgressFill}
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: densityInfo.barColor,
                  }}
                />
              </div>
            </div>

            {/* QR Card */}
            <div className={styles.qrCard}>
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
                  onClick={() => setIsScreenshotOpen(true)}
                >
                  Режим скриншота
                </Button>

                <Button
                  variant="tonal"
                  icon="content_copy"
                  onClick={handleCopyLink}
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
          </div>
        </section>
      </main>

      {/* Canonical MD3 Extended FAB for Mobile */}
      <Fab
        icon="qr_code_scanner"
        label="Скриншот QR"
        fixedBottomRight
        className={styles.mobileFab}
        onClick={() => setIsScreenshotOpen(true)}
      />

      {/* Screenshot Mode Fullscreen Overlay */}
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
