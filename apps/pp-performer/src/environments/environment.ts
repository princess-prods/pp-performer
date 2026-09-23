// Environment configuration - values injected at build time via @ngx-env/builder
// In development, values come from .env file
// In CI/production, values come from environment variables
// Note: Jest uses environment.test.ts via moduleNameMapper to avoid import.meta issues

export const environment = {
  production: false,
  supabase: {
    url: import.meta.env['NG_APP_SUPABASE_URL'] ?? '',
    anonKey: import.meta.env['NG_APP_SUPABASE_ANON_KEY'] ?? '',
  },
};
