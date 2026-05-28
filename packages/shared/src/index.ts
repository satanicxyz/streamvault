export const APP_NAME = 'StreamVault';
export const API_VERSION = 'v1';

export const CONTENT_TYPES = {
  MOVIE: 'Movie',
  TV_SERIES: 'TV Series',
  MINI_SERIES: 'Mini Series',
  MICRO_DRAMA: 'Micro Drama',
  VERTICAL_DRAMA: 'Vertical Drama',
  SHORT: 'Short',
} as const;

export const SUBSCRIPTION_TIERS = {
  FREE: { name: 'Free', maxQuality: '480p', adsEnabled: true },
  PREMIUM: { name: 'Premium', maxQuality: '1080p', adsEnabled: false },
  VIP: { name: 'VIP', maxQuality: '4K', adsEnabled: false },
} as const;

export const VIDEO_QUALITIES = ['240p', '360p', '480p', '720p', '1080p', '4k'] as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatCurrency(amount: number, currency = 'IDR'): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency }).format(amount);
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) return then.toLocaleDateString();
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMinutes > 0) return `${diffMinutes}m ago`;
  return 'just now';
}
