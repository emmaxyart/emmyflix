# Emmflix

Emmflix is a modern streaming platform for movies and TV shows preview built with Next.js 15 and React 19.

## Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router for server components and routing
- **React 19**: UI library with latest features
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for smooth transitions
- **next-themes**: Dark/light mode support
- **react-hot-toast**: Toast notifications

### Backend & API
- **Next.js API Routes**: Server-side API endpoints
- **NextAuth.js**: Authentication with multiple providers
- **Prisma**: Type-safe ORM for database access
- **PostgreSQL**: Relational database
- **Upstash Redis**: Rate limiting and caching
- **AWS S3/CloudFront**: Media storage and CDN delivery

### DevOps & Tooling
- **ESLint**: Code linting
- **TypeScript**: Static type checking
- **Vercel**: Deployment and hosting

## Features

- User authentication and profiles
- Movie and TV show browsing with categories
- Video streaming with multiple quality options
- Progressive Web App (PWA) support
- Dark/light mode
- Responsive design for all devices

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# TMDB API Configuration
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_API_KEY=your_tmdb_api_key_here

# For client-side usage
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here

# Streaming Service Configuration
CLOUDFRONT_DOMAIN=your-cloudfront-domain.com
CLOUDFRONT_KEY_PAIR_ID=your-key-pair-id
CLOUDFRONT_PRIVATE_KEY=your-private-key
S3_BUCKET_NAME=your-bucket-name

# Upstash Redis Configuration
UPSTASH_REDIS_URL=https://your-instance.upstash.io
UPSTASH_REDIS_TOKEN=your-redis-token

# AWS Configuration
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region

# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/emmflix?schema=public"
```

## Project Structure

```
emmflix/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── api/        # API routes
│   │   ├── (routes)/   # App routes
│   │   └── layout.tsx  # Root layout
│   ├── components/     # Reusable components
│   ├── lib/            # Utility functions
│   ├── providers/      # React context providers
│   └── services/       # Service layer
├── prisma/             # Prisma schema and migrations
├── .env.example        # Example environment variables
├── next.config.ts      # Next.js configuration
└── tailwind.config.ts  # Tailwind CSS configuration
```

## PWA Support

Emmflix is configured as a Progressive Web App (PWA) with:

- Web App Manifest (`public/manifest.json`)
- Service Worker for offline support
- Installable on mobile and desktop devices

## Deployment

The easiest way to deploy Emmflix is to use the [Vercel Platform](https://vercel.com/new).

## Contact

- Developer: Emmanuel Edobor
- Email: emmanueledobor34@gmail.com

## License

[MIT](LICENSE)
