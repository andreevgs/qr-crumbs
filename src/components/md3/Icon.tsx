import React from 'react';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  filled?: boolean;
  size?: number;
}

export interface IconOption {
  id: string;
  label: string;
}

export const ICON_OPTIONS: IconOption[] = [
  { id: 'redeem', label: 'Подарок' },
  { id: 'cake', label: 'Торт' },
  { id: 'celebration', label: 'Праздник' },
  { id: 'favorite', label: 'Сердце' },
  { id: 'local_fire_department', label: 'Огонь / Тепло' },
  { id: 'ac_unit', label: 'Снежинка / Мороз' },
  { id: 'search', label: 'Поиск / Лупа' },
  { id: 'vpn_key', label: 'Ключ' },
  { id: 'lock', label: 'Замок' },
  { id: 'coffee', label: 'Кофе' },
  { id: 'restaurant', label: 'Тарелка / Еда' },
  { id: 'kitchen', label: 'Холодильник' },
  { id: 'weekend', label: 'Диван' },
  { id: 'bed', label: 'Кровать' },
  { id: 'bathtub', label: 'Ванная' },
  { id: 'checkroom', label: 'Шкаф' },
  { id: 'menu_book', label: 'Книга' },
  { id: 'potted_plant', label: 'Растение' },
  { id: 'pets', label: 'Лапка / Питомец' },
  { id: 'directions_car', label: 'Машина' },
  { id: 'extension', label: 'Пазл' },
  { id: 'lightbulb', label: 'Лампочка' },
  { id: 'music_note', label: 'Музыка' },
  { id: 'photo_camera', label: 'Камера' },
];

export const ICON_LABELS: Record<string, string> = ICON_OPTIONS.reduce(
  (acc, item) => ({ ...acc, [item.id]: item.label }),
  {}
);

export const Icon: React.FC<IconProps> = ({
  name,
  filled = false,
  size = 24,
  className = '',
  style,
  ...props
}) => {
  return (
    <span
      className={`material-symbols-rounded ${className}`}
      style={{
        fontSize: `${size}px`,
        width: `${size}px`,
        height: `${size}px`,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
};
