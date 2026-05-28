# StreamVault

Production-grade streaming platform for Movies, TV Series, Mini Series, Micro Drama, Vertical Drama, and short-form premium episodic content.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS, Framer Motion, Zustand, React Query
- **Backend**: NestJS, TypeScript, Prisma ORM
- **Database**: PostgreSQL, Redis
- **Video**: HLS Streaming (.m3u8), Adaptive bitrate
- **Auth**: JWT, OAuth (Google), Session management
- **Infrastructure**: Docker, NGINX, GitHub Actions CI/CD

## Project Structure

```
streamvault/
├── apps/
│   ├── web/          # Next.js frontend (port 3000)
│   ├── api/          # NestJS backend (port 4000)
│   └── admin/        # Admin panel (port 3001)
├── packages/
│   ├── ui/           # Shared UI components
│   ├── config/       # Shared configurations
│   ├── types/        # Shared TypeScript types
│   └── shared/       # Shared utilities
├── services/
│   ├── transcoder/           # Video transcoding pipeline
│   ├── recommendation-engine/ # AI recommendations
│   ├── notification-service/  # Push/email notifications
│   └── analytics-service/     # Analytics processing
├── infrastructure/
│   ├── docker/       # Dockerfiles
│   ├── nginx/        # NGINX config
│   └── kubernetes/   # K8s manifests
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Docker & Docker Compose (optional)

### Quick Start with Docker

```bash
# Start all services
docker compose up -d

# Run database migrations
docker compose exec api npx prisma migrate deploy
```

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env

# Start PostgreSQL and Redis (via Docker)
docker compose up postgres redis -d

# Generate Prisma client
cd apps/api && npx prisma generate

# Run database migrations
cd apps/api && npx prisma migrate dev

# Start all apps in dev mode
npm run dev
```

### Environment Variables

Copy `apps/api/.env.example` to `apps/api/.env` and configure:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `CDN_BASE_URL` | CDN base URL for streaming |
| `STREAMING_SECRET` | Secret for signed streaming URLs |

## API Documentation

Once the API is running, visit `http://localhost:4000/api/docs` for the Swagger documentation.

## Features

### Core
- User authentication (email/password, Google OAuth)
- Content management (movies, series, micro dramas)
- Episode management with lock/premium system
- HLS video streaming with signed URLs
- Subscription system (Free/Premium/VIP tiers)
- Watch history & continue watching
- Search with suggestions

### Platform
- Dark cinematic UI design
- Mobile-first responsive layout
- Custom video player (HLS, PiP, keyboard shortcuts)
- Micro drama vertical scroll feed
- Admin CMS dashboard
- Real-time analytics

## Deployment

### Production (Docker)

```bash
docker compose -f docker-compose.yml up -d --build
```

### CI/CD

GitHub Actions workflows handle:
- Lint & typecheck on every PR
- Docker image builds on main branch
- Automated deployment (configure in workflow)

## License

Private - All rights reserved.
