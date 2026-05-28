export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
    timeout: 30000,
  },
  auth: {
    tokenKey: 'streamvault-auth',
    refreshThreshold: 5 * 60 * 1000,
  },
  streaming: {
    defaultQuality: '720p',
    bufferSize: 30,
    maxRetries: 3,
  },
  pagination: {
    defaultPage: 1,
    defaultLimit: 20,
  },
} as const;
