# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

**pp-performer** is a recruitment stepper application for adult video performers. The app collects interest information from potential performers through a multi-step form flow.

### Tech Stack
- **Frontend**: Angular 22+ (Nx monorepo)
- **Backend**: Neon Functions (serverless PostgreSQL)
- **API**: tRPC for end-to-end type safety
- **ORM**: Drizzle ORM
- **Database**: Neon PostgreSQL

## Build & Development Commands

```bash
# Install dependencies
npm install

# Run local development
npx nx serve pp-performer      # Frontend (port 4200)
npx nx serve api               # Backend API (port 3000)

# Database commands
npx nx run api:db:generate     # Generate migrations from schema changes
npx nx run api:db:migrate      # Run pending migrations
npx nx run api:db:push         # Push schema directly (dev only)
npx nx run api:db:studio       # Open Drizzle Studio
npx nx run api:db:seed         # Seed lookup tables

# Quality checks
npx nx run-many -t lint        # Lint all projects
npx nx run-many -t test        # Run unit tests
npx nx run-many -t build       # Build all projects
npx nx run-many -t e2e         # Run e2e tests
```

## Development Workflow

### Before Creating PRs
Run the full CI suite locally to catch failures before pushing:
```bash
npx nx run-many -t lint test build e2e
```

### Branch Strategy
- `main` is protected; all changes require PRs
- Create feature branches from `main`
- Each working branch should strive for 100% unit test coverage

### Code Coverage
- Project target: 70% minimum
- Patch target: 80% (new code must be well-tested)
- Run tests with coverage: `npx nx run-many -t test --coverage`

## Architecture

### Monorepo Structure
```
apps/
  pp-performer/          # Angular frontend application
  pp-performer-e2e/      # Playwright e2e tests
libs/
  api/                   # tRPC API library
    src/
      db/                # Drizzle schema and migrations
      routers/           # tRPC route handlers
      schemas/           # Zod validation + enum definitions
      trpc/              # tRPC initialization
```

### Key Patterns
- **Enums**: Defined in `libs/api/src/schemas/` with ID constants, labels, and TypeScript types
- **Database**: Drizzle schema in `libs/api/src/db/schema.ts`
- **API Routes**: tRPC routers in `libs/api/src/routers/`
- **Validation**: Zod schemas for all API inputs

### Shared Types
Frontend and backend share types via the api library exports:
```typescript
import { Gender, ActCategory, ActFrequency, type AppRouter } from '@pp-performer/api';
```

## Third-Party Integrations

### Age Verification (Required)
The app must use third-party age verification before collecting any personal information. This is a compliance requirement. The verification provider should return only:
- `age_verified: boolean`
- `verification_timestamp`
- `verification_id`

Do NOT store government IDs, SSNs, or other sensitive identity documents.

## Documentation

See `/docs` folder for:
- Product requirements and UX flows
- Branding and copy guidelines
- Database schema documentation
