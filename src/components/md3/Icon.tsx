import React from 'react';
import { StepIcon } from '../../types';

export const STEP_ICON_SYMBOLS: Record<StepIcon, string> = {
  gift: 'redeem',
  flame: 'local_fire_department',
  snowflake: 'ac_unit',
  search: 'search',
  heart: 'favorite',
  key: 'key',
  coffee: 'local_cafe',
  sparkles: 'auto_awesome',
};

export const ICON_LABELS: Record<StepIcon, string> = {
  gift: 'Подарок',
  flame: 'Огонь / Тепло',
  snowflake: 'Снежинка / Холод',
  search: 'Поиск / Лупа',
  heart: 'Сердце / Любовь',
  key: 'Ключ',
  coffee: 'Кухня / Кофе',
  sparkles: 'Магия / Финал',
};

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: number;
  fill?: boolean;
  weight?: number;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  fill = false,
  weight = 400,
  className = '',
  style,
  ...props
}) => {
  // If `name` matches a StepIcon key, map it to the corresponding Material Symbol name
  const symbol = (STEP_ICON_SYMBOLS as Record<string, string>)[name] || name;

  return (
    <span
      className={`material-symbols-rounded ${className}`}
      style={{
        fontSize: `${size}px`,
        width: `${size}px`,
        height: `${size}px`,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    >
      {symbol}
    </span>
  );
};
