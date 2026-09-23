// Production environment configuration - values injected at build time via @ngx-env/builder
// Values come from CI environment variables (GitHub secrets)
// Note: Jest uses environment.test.ts via moduleNameMapper to avoid import.meta issues

export const environment = {
  production: true,
  supabase: {
    url: import.meta.env['NG_APP_SUPABASE_URL'] ?? '',
    anonKey: import.meta.env['NG_APP_SUPABASE_ANON_KEY'] ?? '',
  },
};
