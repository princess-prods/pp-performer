# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

**pp-performer** is a recruitment stepper application for adult video performers. The app collects interest information from potential performers through a multi-step form flow.

### Mobile-First Design
This app is primarily accessed via mobile (QR code scans from recruitment cards). All UI work should be developed mobile-first.

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

# E2E tests (requires Playwright browsers)
npx playwright install         # Install browsers (first time only)
npx nx e2e pp-performer-e2e    # Run e2e tests
```

## Development Workflow

### Before Creating PRs
**Always run `/pre-pr` before creating a pull request.** This command will:
- Analyze changed files and create/update unit tests
- Run lint and fix issues
- Run the build
- Run tests with coverage and add tests if below thresholds
- Run E2E tests
- Report readiness for PR

This ensures CI will pass and coverage requirements are met.

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

### Yoti Age Verification (In Progress)
**Status**: Backend and frontend integration complete. Awaiting Yoti SDK credentials.

**What's implemented:**
- Backend: `libs/api/src/services/yoti.service.ts` - IDV session management
- Backend: `libs/api/src/routers/yoti.ts` - tRPC endpoints (createSession, getSession, verifyAge)
- Frontend: `apps/pp-performer/src/app/core/yoti.service.ts` - Session state management
- Frontend: `apps/pp-performer/src/app/pages/verify/` - Verification UI with mock mode
- Route: `/verify` - Age verification page (first step before login)

**To complete when credentials arrive:**
1. Add `YOTI_CLIENT_SDK_ID` to `.env` file
2. Place PEM key at `keys/yoti.pem` (directory is gitignored)
3. Add `YOTI_CLIENT_SDK_ID` and `YOTI_PEM_KEY_BASE64` to GitHub secrets
4. Add same secrets to Netlify environment variables
5. Test real Yoti iframe flow

**Environment variables:**
- `YOTI_CLIENT_SDK_ID` - From Yoti Hub
- `YOTI_PEM_KEY_PATH` - Local path to PEM file (dev)
- `YOTI_PEM_KEY_BASE64` - Base64-encoded PEM content (CI/production)

The verification flow requires users to complete age verification BEFORE registration/login.

Do NOT store government IDs, SSNs, or other sensitive identity documents.

## Documentation

See `/docs` folder for:
- Product requirements and UX flows
- Branding and copy guidelines
- Database schema documentation
