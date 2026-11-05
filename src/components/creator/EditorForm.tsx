import React from 'react';
import { QuestStep, ThemeSeed, StepLayout } from '../../types';
import {
  TextField,
  SegmentedButton,
  Icon,
  ICON_OPTIONS,
} from '../md3';
import styles from './EditorForm.module.css';

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

export interface EditorFormProps {
  step: QuestStep;
  printNote: string;
  onStepChange: React.Dispatch<React.SetStateAction<QuestStep>>;
  onPrintNoteChange: (val: string) => void;
  className?: string;
}

export const EditorForm: React.FC<EditorFormProps> = ({
  step,
  printNote,
  onStepChange,
  onPrintNoteChange,
  className = '',
}) => {
  return (
    <section className={`${styles.editorColumn} ${className}`}>
      {/* 1. Content Section */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionHeaderIcon}>
            <Icon name="description" size={20} />
          </span>
          <span>Текст и загадка</span>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.badgeAndTitleRow}>
            <TextField
              label="Бейдж шага"
              placeholder="Шаг 1, Финал..."
              value={step.stepBadge || ''}
              onChange={(e) =>
                onStepChange((prev) => ({ ...prev, stepBadge: e.target.value }))
              }
              helperText="Например: Шаг 1"
            />

            <TextField
              label="Заголовок карточки"
              placeholder="Первая зацепка 🎁"
              value={step.title}
              onChange={(e) =>
                onStepChange((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <TextField
            label="Основной текст подсказки / загадки"
            placeholder="Напиши загадку или указание, где искать следующий QR-код..."
            value={step.message}
            onChange={(e) =>
              onStepChange((prev) => ({ ...prev, message: e.target.value }))
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
              onStepChange((prev) => ({ ...prev, secretHint: e.target.value }))
            }
            multiline
            rows={2}
            helperText="Опционально. Появится кнопка «Нужна наводка?»"
          />
        </div>
      </div>

      {/* 2. Opening Mechanic */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionHeaderIcon}>
            <Icon name="lock" size={20} />
          </span>
          <span>Механика открытия карточки</span>
        </div>

        <div className={styles.formGrid}>
          <SegmentedButton
            options={LAYOUT_OPTIONS}
            value={step.layout}
            onChange={(val) => onStepChange((prev) => ({ ...prev, layout: val }))}
          />

          {step.layout === 'codeLock' && (
            <TextField
              label="Секретный код разблокировки"
              placeholder="например: 1234 или ЧУДО"
              value={step.unlockCode || ''}
              onChange={(e) =>
                onStepChange((prev) => ({ ...prev, unlockCode: e.target.value }))
              }
              helperText="Регистронезависимо. Игрок должен ввести это слово для открытия."
              autoFocus
            />
          )}
        </div>
      </div>

      {/* 3. Themes & Icons */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionHeaderIcon}>
            <Icon name="palette" size={20} />
          </span>
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
                  onClick={() =>
                    onStepChange((prev) => ({ ...prev, theme: th.id }))
                  }
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
                  onClick={() =>
                    onStepChange((prev) => ({ ...prev, icon: opt.id }))
                  }
                  title={opt.label}
                >
                  <Icon name={opt.id} size={24} filled={isSelected} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Technical Print Note */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionHeaderIcon}>
            <Icon name="label" size={20} />
          </span>
          <span>Техническая пометка для печати</span>
        </div>

        <TextField
          label="Пометка для автора (не зашивается в ссылку)"
          placeholder="Спрятать в микроволновку / QR #1"
          value={printNote}
          onChange={(e) => onPrintNoteChange(e.target.value)}
          helperText="Отобразится на карточке в режиме скриншота, чтобы не перепутать распечатки"
        />
      </div>
    </section>
  );
};
