import React from 'react';
import {
  Gift,
  Flame,
  Snowflake,
  Search,
  Heart,
  Key,
  Coffee,
  Sparkles,
  LucideProps,
} from 'lucide-react';
import { StepIcon } from '../../types';

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: StepIcon;
}

export const ICON_MAP: Record<StepIcon, React.ComponentType<LucideProps>> = {
  gift: Gift,
  flame: Flame,
  snowflake: Snowflake,
  search: Search,
  heart: Heart,
  key: Key,
  coffee: Coffee,
  sparkles: Sparkles,
};

export const ICON_LABELS: Record<StepIcon, string> = {
  gift: 'Подарок',
  flame: 'Огонь / Тепло',
  snowflake: 'Холодно / Снежинка',
  search: 'Поиск / Лупа',
  heart: 'Сердце / Любовь',
  key: 'Ключ',
  coffee: 'Кофе / Кухня',
  sparkles: 'Магия / Финал',
};

export const Icon: React.FC<IconProps> = ({ name, size = 24, ...props }) => {
  const Component = ICON_MAP[name] || Gift;
  return <Component size={size} {...props} />;
};
