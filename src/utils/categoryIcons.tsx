import React from 'react';

/**
 * Category Icon & Emoji Resolution Utility
 * Logic: Priority to custom icon URL/image if available.
 * If custom icon image is missing or fails to load (onerror), automatically fallback to relevant category emoji.
 */

export const CATEGORY_EMOJIS: Record<string, string> = {
  Makanan: '🍲',
  Kuliner: '🍲',
  Pangan: '🍰',
  Kerajinan: '🎨',
  Craft: '🏺',
  Fashion: '👗',
  Tekstil: '👗',
  Pakaian: '👕',
  Jasa: '🛠️',
  Layanan: '🛠️',
  Perdagangan: '🛒',
  Retail: '🛍️',
  Lainnya: '🏪',
};

/**
 * Returns the relevant emoji based on category name
 */
export function getCategoryEmoji(namaKategori?: string | null): string {
  if (!namaKategori) return '🏪';
  const name = namaKategori.trim().toLowerCase();

  for (const key of Object.keys(CATEGORY_EMOJIS)) {
    if (name.includes(key.toLowerCase())) {
      return CATEGORY_EMOJIS[key];
    }
  }
  return '🏪';
}

/**
 * Returns custom icon image path if present
 */
export function getCategoryCustomIconPath(namaKategori?: string | null): string | null {
  if (!namaKategori) return '/icons/lainnya.svg';
  const key = namaKategori.trim().toLowerCase();

  if (key.includes('makanan') || key.includes('kuliner') || key.includes('pangan')) return '/icons/makanan.svg';
  if (key.includes('fashion') || key.includes('tekstil') || key.includes('pakaian')) return '/icons/fashion.svg';
  if (key.includes('kerajinan') || key.includes('craft') || key.includes('kriya')) return '/icons/kerajinan.svg';
  if (key.includes('jasa') || key.includes('layanan')) return '/icons/jasa.svg';
  if (key.includes('perdagangan') || key.includes('retail')) return '/icons/perdagangan.svg';

  return '/icons/lainnya.svg';
}

interface CategoryIconProps {
  namaKategori?: string | null;
  customIconUrl?: string | null;
  className?: string;
  emojiSize?: string | number;
  iconStyle?: React.CSSProperties;
}

/**
 * React Component for Category Icon
 * Renders custom image icon first with onError fallback to emoji span
 */
export const CategoryIcon: React.FC<CategoryIconProps> = ({
  namaKategori,
  customIconUrl,
  className = 'category-icon',
  emojiSize = 24,
  iconStyle,
}) => {
  const iconPath = customIconUrl || getCategoryCustomIconPath(namaKategori);
  const emoji = getCategoryEmoji(namaKategori);

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        ...iconStyle,
      }}
    >
      {iconPath && (
        <img
          src={iconPath}
          alt={namaKategori || 'Kategori'}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          onError={(e) => {
            const img = e.currentTarget;
            img.style.display = 'none';
            if (img.nextElementSibling) {
              (img.nextElementSibling as HTMLElement).style.display = 'inline';
            }
          }}
        />
      )}
      <span
        style={{
          display: iconPath ? 'none' : 'inline',
          fontSize: typeof emojiSize === 'number' ? `${emojiSize}px` : emojiSize,
          lineHeight: 1,
        }}
      >
        {emoji}
      </span>
    </div>
  );
};

interface CustomIconProps {
  iconPath?: string | null;
  fallbackEmoji: string;
  alt?: string;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * General UI Custom Icon Component
 * Priority to custom image/SVG icon, with automatic onerror fallback to emoji
 */
export const CustomIcon: React.FC<CustomIconProps> = ({
  iconPath,
  fallbackEmoji,
  alt = 'Icon',
  size = 18,
  className = 'custom-ui-icon',
  style,
}) => {
  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dimension,
        height: dimension,
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style,
      }}
    >
      {iconPath ? (
        <img
          src={iconPath}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          onError={(e) => {
            const img = e.currentTarget;
            img.style.display = 'none';
            if (img.nextElementSibling) {
              (img.nextElementSibling as HTMLElement).style.display = 'inline';
            }
          }}
        />
      ) : null}
      <span
        style={{
          display: iconPath ? 'none' : 'inline',
          fontSize: dimension,
          lineHeight: 1,
        }}
      >
        {fallbackEmoji}
      </span>
    </span>
  );
};
