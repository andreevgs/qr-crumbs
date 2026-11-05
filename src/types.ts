export type ThemeSeed = 'violet' | 'rose' | 'amber' | 'emerald' | 'cyan';
export type StepIcon = 'gift' | 'flame' | 'snowflake' | 'search' | 'heart' | 'key' | 'coffee' | 'sparkles';
export type StepLayout = 'standard' | 'blur' | 'codeLock';

export interface QuestStep {
  stepBadge?: string;     // Например: "Шаг 1", "Финал", "Бонус"
  title: string;          // Заголовок карточки
  message: string;        // Основной текст загадки / наводки
  secretHint?: string;    // Опциональная подсказка под спойлером ("Сдаюсь, нужна наводка")
  theme: ThemeSeed;       // Цветовая схема MD3
  icon: StepIcon;         // Главная иконка карточки
  layout: StepLayout;     // Механика открытия карточки
  unlockCode?: string;    // Код разблокировки (только если layout === 'codeLock')
}

// Сжатая DTO-структура для упаковки в JSON перед lz-string
export interface CompactPayload {
  b?: string; // stepBadge
  t: string;  // title
  m: string;  // message
  h?: string; // secretHint
  c: ThemeSeed; // theme
  i: StepIcon;  // icon
  l: StepLayout;// layout
  u?: string;   // unlockCode
}
