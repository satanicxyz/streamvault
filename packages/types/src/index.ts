export type ContentType = 'MOVIE' | 'TV_SERIES' | 'MINI_SERIES' | 'MICRO_DRAMA' | 'VERTICAL_DRAMA' | 'SHORT';
export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';
export type SubscriptionTier = 'FREE' | 'PREMIUM' | 'VIP';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'TRIAL';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
export type PaymentProvider = 'MIDTRANS' | 'XENDIT' | 'STRIPE' | 'QRIS';

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: UserRole;
}

export interface Content {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  type: ContentType;
  status: ContentStatus;
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  releaseYear: number | null;
  rating: number;
  ratingCount: number;
  duration: number | null;
  isVertical: boolean;
  isFree: boolean;
  isPremium: boolean;
  viewCount: number;
  tags: string[];
}

export interface Episode {
  id: string;
  contentId: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string | null;
  description: string | null;
  duration: number | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  hlsUrl: string | null;
  isLocked: boolean;
  isFree: boolean;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

export interface WatchHistory {
  id: string;
  userId: string;
  contentId: string;
  episodeId: string | null;
  progress: number;
  duration: number;
  completed: boolean;
  watchedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  trialDays: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
