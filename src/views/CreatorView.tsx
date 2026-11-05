import React, { useState, useMemo, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QuestStep, ThemeSeed, StepIcon, StepLayout } from '../types';
import { encodeQuestStep, buildViewerUrl } from '../utils/codec';
import { QuestViewerCard } from '../components/QuestViewerCard';
import { ScreenshotModal } from '../components/ScreenshotModal';
import {
  Button,
  TextField,
  SegmentedButton,
  Icon,
  ICON_LABELS,
  FAB,
} from '../components/md3';
import styles from './CreatorView.module.css';

const DEFAULT_STEP: QuestStep = {
  stepBadge: 'Шаг 1',
  title: 'Первая зацепка 🎁',
  message:
    'Загляни туда, где всегда холоднее, чем в комнате, но хранятся самые вкусные секреты!',
  secretHint: 'Внимание на нижнюю полку рядом с йогуртами.',
  theme: 'violet',
  icon: 'gift',
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

const ICONS: StepIcon[] = [
  'gift',
  'flame',
  'snowflake',
  'search',
  'heart',
  'key',
  'coffee',
  'sparkles',
];

const LAYOUT_OPTIONS: { value: StepLayout; label: string }[] = [
  { value: 'standard', label: 'Обычный' },
  { value: 'blur', label: 'Скретч-блюр' },
  { value: 'codeLock', label: 'Пароль' },
];

export const CreatorView: React.FC = () => {
  const [step, setStep] = useState<QuestStep>(DEFAULT_STEP);
  const [printNote, setPrintNote] = useState<string>('Спрятать в холодильник');
  const [isScreenshotOpen, setIsScreenshotOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'preview' | 'qr'>('editor');

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
      {/* Top Application Bar */}
      <header className={styles.topBar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <Icon name="qr_code_2" size={24} />
          </div>
          <h1 className={styles.brandTitle}>QR crumbs</h1>
        </div>

        {/* Desktop Header Actions */}
        <div className={styles.desktopActions}>
          <Button
            variant="tonal"
            icon={<Icon name="restart_alt" size={18} />}
            onClick={handleResetForm}
            title="Сбросить форму"
          >
            Сброс
          </Button>
          <Button
            variant="filled"
            icon={<Icon name="photo_camera" size={18} />}
            onClick={() => setIsScreenshotOpen(true)}
          >
            Режим скриншота
          </Button>
        </div>

        {/* Mobile Header Quick Reset Action */}
        <button
          type="button"
          className={styles.mobileTopAction}
          onClick={handleResetForm}
          title="Сбросить форму"
        >
          <Icon name="restart_alt" size={22} />
        </button>
      </header>

      {/* Main Content Layout */}
      <main className={styles.mainContent}>
        {/* LEFT COLUMN: EDITOR */}
        <section
          className={`${styles.editorColumn} ${
            activeMobileTab !== 'editor' ? styles.hideOnMobile : ''
          }`}
        >
          {/* Section: Text Content */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>
                <Icon name="auto_awesome" size={20} />
              </span>
              <span>Текст и загадка</span>
            </div>

            <div className={styles.formGrid}>
              <TextField
                label="Номер / Бейдж шага"
                placeholder="например: Шаг 1 или Финал"
                value={step.stepBadge || ''}
                onChange={(e) =>
                  setStep((prev) => ({ ...prev, stepBadge: e.target.value }))
                }
                helperText="Короткая плашка в верхней части карточки"
              />

              <TextField
                label="Заголовок карточки"
                placeholder="например: Первая зацепка 🎁"
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
                placeholder="например: Посмотри в кастрюле на верхней полке"
                value={step.secretHint || ''}
                onChange={(e) =>
                  setStep((prev) => ({ ...prev, secretHint: e.target.value }))
                }
                multiline
                rows={2}
                helperText="Опционально. Появится раскрывающийся спойлер «Нужна наводка?»"
              />
            </div>
          </div>

          {/* Section: Mechanics & Lock */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>
                <Icon name="tune" size={20} />
              </span>
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
                  label="Секретный код / пароль разблокировки"
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

          {/* Section: Theme & Icon */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>
                <Icon name="palette" size={20} />
              </span>
              <span>Оформление и тема</span>
            </div>

            <div className={styles.formGrid}>
              <label className={styles.densityTitle}>Цветовой акцент MD3:</label>
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
                      {isSelected && <Icon name="check" size={20} className={styles.swatchCheck} />}
                    </button>
                  );
                })}
              </div>

              <label className={styles.densityTitle} style={{ marginTop: '12px' }}>
                Иконка шага:
              </label>
              <div className={styles.iconGrid}>
                {ICONS.map((iconName) => {
                  const isSelected = step.icon === iconName;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      className={`${styles.iconBtn} ${
                        isSelected ? styles.iconBtnSelected : ''
                      }`}
                      onClick={() =>
                        setStep((prev) => ({ ...prev, icon: iconName }))
                      }
                      title={ICON_LABELS[iconName]}
                    >
                      <Icon name={iconName} size={24} />
                      <span className={styles.iconBtnLabel}>
                        {ICON_LABELS[iconName].split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section: Print helper note (not in URL) */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>
                <Icon name="push_pin" size={20} />
              </span>
              <span>Пометка для печати</span>
            </div>

            <TextField
              label="Пометка для автора (не зашивается в ссылку)"
              placeholder="например: Спрятать в микроволновку / QR #1"
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
              activeMobileTab === 'qr' ? styles.hideOnMobile : ''
            }`}
          >
            <QuestViewerCard step={step} isPreview />
          </div>

          {/* QR Code and Density Information Card */}
          <div
            className={`${styles.stickySide} ${
              activeMobileTab === 'preview' ? styles.hideOnMobile : ''
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
                  <Icon name="done_all" size={16} />
                  <span>Ссылка скопирована в буфер обмена!</span>
                </div>
              )}

              <div className={styles.qrButtons}>
                <Button
                  variant="filled"
                  icon={<Icon name="photo_camera" size={18} />}
                  onClick={() => setIsScreenshotOpen(true)}
                >
                  Режим скриншота
                </Button>

                <Button
                  variant="tonal"
                  icon={<Icon name="content_copy" size={18} />}
                  onClick={handleCopyLink}
                >
                  {isCopied ? 'Скопировано!' : 'Копировать'}
                </Button>

                <Button
                  variant="outlined"
                  icon={<Icon name="open_in_new" size={18} />}
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

      {/* Floating Action Button (M3 FAB) on Mobile */}
      <FAB
        icon={<Icon name="photo_camera" size={24} />}
        label="Скриншот"
        onClick={() => setIsScreenshotOpen(true)}
        className={styles.mobileFab}
      />

      {/* M3 Mobile Bottom Navigation Bar */}
      <nav className={styles.bottomNav} aria-label="Навигация по разделам">
        <div className={styles.bottomNavItems}>
          <button
            type="button"
            className={`${styles.navItem} ${
              activeMobileTab === 'editor' ? styles.navItemActive : ''
            }`}
            onClick={() => setActiveMobileTab('editor')}
          >
            <div className={styles.navPill}>
              <Icon name="edit_note" size={24} />
            </div>
            <span>Редактор</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${
              activeMobileTab === 'preview' ? styles.navItemActive : ''
            }`}
            onClick={() => setActiveMobileTab('preview')}
          >
            <div className={styles.navPill}>
              <Icon name="visibility" size={24} />
            </div>
            <span>Превью</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${
              activeMobileTab === 'qr' ? styles.navItemActive : ''
            }`}
            onClick={() => setActiveMobileTab('qr')}
          >
            <div className={styles.navPill}>
              <Icon name="qr_code_2" size={24} />
            </div>
            <span>QR-код</span>
          </button>
        </div>
      </nav>

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
