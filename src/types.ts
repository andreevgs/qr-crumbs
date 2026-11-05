export type ThemeSeed = 'violet' | 'rose' | 'amber' | 'emerald' | 'cyan';

export type StepIcon =
  | 'redeem'
  | 'cake'
  | 'favorite'
  | 'celebration'
  | 'local_fire_department'
  | 'ac_unit'
  | 'water_drop'
  | 'search'
  | 'vpn_key'
  | 'lock'
  | 'coffee'
  | 'restaurant'
  | 'kitchen'
  | 'weekend'
  | 'bed'
  | 'bathtub'
  | 'checkroom'
  | 'menu_book'
  | 'potted_plant'
  | 'pets'
  | 'directions_car'
  | 'extension'
  | 'lightbulb'
  | 'music_note'
  | 'photo_camera'
  | string;

export type StepLayout = 'standard' | 'blur' | 'codeLock';

export interface QuestStep {
  stepBadge?: string;     // Например: "Шаг 1", "Финал", "Бонус"
  title: string;          // Заголовок карточки
  message: string;        // Основной текст загадки / наводки
  secretHint?: string;    // Опциональная подсказка под спойлером ("Сдаюсь, нужна наводка")
  theme: ThemeSeed;       // Цветовая схема MD3
  icon: StepIcon;         // Главная иконка карточки (Material Symbols)
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
