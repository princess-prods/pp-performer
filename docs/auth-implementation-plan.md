# Authentication Implementation Plan

## Overview

This document outlines the complete authentication and authorization workflow for the performer recruitment application. The workflow prioritizes age verification before any account creation, ensuring legal compliance and user privacy.

## Authentication Flow

```
Landing Page → Age Verification → Authentication → Protected App
```

### Why Age Verification First?

1. **Legal compliance** - WV law requires age verification before collecting personal information
2. **Privacy protection** - Don't collect user data before confirming eligibility
3. **Reduced liability** - No PII stored for users who don't pass verification
4. **Better UX** - Users know upfront if they qualify before creating accounts

---

## Phase 1: Age Verification Gate

> See [age-verification.md](./age-verification.md) for detailed provider comparison

### Implementation

1. **Age Gate Component** (`/verify-age`)
   - Modal or full-page gate
   - "You must be 18+ to continue"
   - "Verify My Age" button → Yoti widget

2. **Yoti Integration**
   ```typescript
   // Environment variables
   YOTI_CLIENT_SDK_ID=xxx
   YOTI_SCENARIO_ID=xxx
   YOTI_PEM_KEY=xxx
   ```

3. **Verification State**
   - Store in sessionStorage/localStorage temporarily
   - Cookie with verification token (short TTL)
   - Server validates before allowing auth

4. **Database Schema**
   ```typescript
   // age_verifications table
   {
     id: uuid,
     verification_provider: 'yoti' | 'veriff',
     provider_reference_id: string,
     verified_at: timestamp,
     expires_at: timestamp,  // Optional: re-verification policy
   }
   ```

---

## Phase 2: Authentication

After age verification succeeds, users can create an account or sign in.

### Option A: Auth0

**Pros:**
- Industry standard, battle-tested
- Extensive documentation
- Built-in MFA, passwordless, social logins
- Enterprise features (RBAC, Organizations)

**Cons:**
- 7,500 MAU free tier (may need paid plan sooner)
- More complex setup
- Separate service to manage

**Implementation:**
```typescript
// auth0.config.ts
export const auth0Config = {
  domain: process.env['AUTH0_DOMAIN'],
  clientId: process.env['AUTH0_CLIENT_ID'],
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: process.env['AUTH0_AUDIENCE'],
  },
};
```

### Option B: Supabase Auth

**Pros:**
- 50,000 MAU free tier
- 30+ social providers (Google, Apple, Facebook, Twitter, Discord, etc.)
- Works seamlessly with any PostgreSQL (including Neon)
- Simple SDK, great DX
- Built-in email/password, magic links, phone auth
- Row Level Security (RLS) integration

**Cons:**
- Newer than Auth0
- Fewer enterprise features
- Using auth separately from Supabase DB adds complexity

**Implementation with Neon:**
```typescript
// supabase-auth.config.ts
import { createClient } from '@supabase/supabase-js';

// Supabase project for AUTH ONLY (not database)
const supabaseAuth = createClient(
  process.env['SUPABASE_URL']!,
  process.env['SUPABASE_ANON_KEY']!
);

// Your app still uses Neon for data
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env['DATABASE_URL']!);
```

**Social Providers Available:**
- Google, Apple, Microsoft, GitHub
- Facebook, Twitter/X, Discord, Twitch
- LinkedIn, Slack, Spotify
- And 20+ more

### Recommendation

For this project, **Supabase Auth** is recommended because:
1. Higher free tier (50k vs 7.5k MAU)
2. Simpler integration
3. Native support for all major social providers
4. Can use auth-only without migrating from Neon

---

## Phase 3: Protected Routes

### Angular Route Guards

```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);

  // Check age verification first
  if (!authService.isAgeVerified()) {
    return router.createUrlTree(['/verify-age']);
  }

  // Then check authentication
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
```

### Route Configuration

```typescript
// app.routes.ts
export const appRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/welcome/welcome.component') },
  { path: 'verify-age', loadComponent: () => import('./pages/verify-age/verify-age.component') },
  { path: 'login', loadComponent: () => import('./pages/login/login.component') },
  {
    path: 'apply',
    loadComponent: () => import('./pages/apply/apply.component'),
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component'),
    canActivate: [authGuard],
  },
];
```

---

## Phase 4: User Profile & Onboarding

### Database Schema

```typescript
// users table (Drizzle schema)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  authProviderId: text('auth_provider_id').notNull().unique(), // Auth0/Supabase ID
  email: text('email').notNull(),
  emailVerified: boolean('email_verified').default(false),
  ageVerificationId: uuid('age_verification_id').references(() => ageVerifications.id),
  profileStatus: text('profile_status').default('incomplete'), // incomplete | pending | approved | rejected
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const performerProfiles = pgTable('performer_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  displayName: text('display_name'),
  bio: text('bio'),
  // Additional profile fields...
  submittedAt: timestamp('submitted_at'),
  reviewedAt: timestamp('reviewed_at'),
  reviewedBy: uuid('reviewed_by'),
});
```

### User Creation Flow

```typescript
// After successful authentication
async function handleAuthCallback(authUser: AuthUser) {
  // Check if user exists
  let user = await db.query.users.findFirst({
    where: eq(users.authProviderId, authUser.sub),
  });

  if (!user) {
    // Create new user with age verification reference
    const ageVerificationId = getAgeVerificationFromSession();

    user = await db.insert(users).values({
      authProviderId: authUser.sub,
      email: authUser.email,
      emailVerified: authUser.email_verified,
      ageVerificationId,
    }).returning();
  }

  return user;
}
```

---

## Implementation Checklist

### Phase 1: Age Verification
- [ ] Create Yoti developer account
- [ ] Configure Yoti scenario for age verification
- [ ] Create `VerifyAgeComponent` with Yoti widget
- [ ] Create `age_verifications` table migration
- [ ] Implement verification callback handler
- [ ] Add verification state to session

### Phase 2: Authentication
- [ ] Set up Auth0 OR Supabase project
- [ ] Configure social providers
- [ ] Create `AuthService` Angular service
- [ ] Create login/signup components
- [ ] Implement auth callback handler
- [ ] Link auth user to age verification

### Phase 3: Protected Routes
- [ ] Implement `authGuard`
- [ ] Implement `ageVerificationGuard`
- [ ] Update route configuration
- [ ] Add loading states for auth checks

### Phase 4: User Profile
- [ ] Create database migrations
- [ ] Create user profile components
- [ ] Implement profile submission flow
- [ ] Add admin review queue (future)

---

## Environment Variables

```env
# Age Verification (Yoti)
YOTI_CLIENT_SDK_ID=
YOTI_SCENARIO_ID=
YOTI_PEM_KEY=

# Auth - Option A: Auth0
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_AUDIENCE=

# Auth - Option B: Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database (Neon)
DATABASE_URL=
```

---

## Security Considerations

1. **Age verification must complete before authentication** - Enforced at route level
2. **Store minimal verification data** - Boolean + reference ID only
3. **Validate verification server-side** - Don't trust client state alone
4. **Use secure cookies** - HttpOnly, Secure, SameSite=Strict
5. **Implement CSRF protection** - Standard for all auth flows
6. **Rate limit verification attempts** - Prevent abuse
7. **Log verification events** - Audit trail for compliance

---

## Timeline Considerations

This implementation should be done in phases:

1. **Phase 1** - Age verification gate (blocking for all other work)
2. **Phase 2** - Basic authentication (email/password minimum)
3. **Phase 3** - Protected routes (enables real app functionality)
4. **Phase 4** - User profiles and onboarding (iterative)

Social login providers can be added incrementally after basic auth is working.
