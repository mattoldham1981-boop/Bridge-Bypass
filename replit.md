# ClearHeight - Hot Shot Trucking Routes

## Overview

ClearHeight is a route planning application designed for hot shot truckers. It helps drivers avoid low bridges and restricted routes by displaying clearance data on an interactive map. The application allows users to create vehicle profiles with specific height dimensions and plan routes that account for overhead clearance restrictions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and data fetching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with custom CSS variables for theming (industrial dark mode theme)
- **Maps**: Leaflet with React Leaflet for interactive mapping functionality

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript compiled with tsx for development, esbuild for production
- **API Design**: RESTful endpoints under `/api` prefix
- **Build Process**: Custom build script that bundles server dependencies to reduce cold start times

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit handles schema migrations (`db:push` command)
- **Tables**:
  - `users` - User accounts with Stripe integration fields
  - `bridges` - Low clearance bridge data with location coordinates
  - `vehicleProfiles` - Vehicle dimension profiles per user
  - `routes` - Saved route data with start/end coordinates

### Payment Integration
- **Provider**: Stripe for subscription payments
- **Sync Library**: `stripe-replit-sync` for webhook handling and data synchronization
- **Features**: Checkout sessions, customer portal, product/price management

### Project Structure
```
├── client/           # React frontend application
│   ├── src/
│   │   ├── components/   # UI components including shadcn/ui
│   │   ├── pages/        # Route page components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and API functions
├── server/           # Express backend
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database access layer
│   └── db.ts         # Database connection
├── shared/           # Shared types and schema
│   └── schema.ts     # Drizzle ORM schema definitions
```

### Key Design Patterns
- **Shared Schema**: The `shared/` directory contains code used by both client and server, including database schemas and Zod validation schemas generated via `drizzle-zod`
- **Storage Interface**: Database operations abstracted through `IStorage` interface in `storage.ts`
- **Path Aliases**: TypeScript path aliases (`@/`, `@shared/`) for clean imports

## External Dependencies

### Database
- PostgreSQL database (required, connection via `DATABASE_URL` environment variable)

### Third-Party Services
- **Stripe**: Payment processing for subscription plans
  - Uses Replit Connectors for credential management
  - Webhook endpoint at `/api/stripe/webhook`
  - Products and prices synced from Stripe to local database

### External APIs
- **Leaflet/OpenStreetMap**: Map tiles and rendering
- **Google Fonts**: Chakra Petch and Inter font families

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `stripe` / `stripe-replit-sync`: Payment integration
- `react-leaflet` / `leaflet`: Map functionality
- `@tanstack/react-query`: Data fetching and caching
- `zod`: Runtime validation
- `wouter`: Client-side routing