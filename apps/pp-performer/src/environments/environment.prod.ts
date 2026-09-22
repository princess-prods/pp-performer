// Production environment
// These values should be set via CI/CD environment variables or deployment config

export const environment = {
  production: true,
  supabase: {
    url: 'https://your-project.supabase.co',
    anonKey: 'your-anon-key',
  },
};
