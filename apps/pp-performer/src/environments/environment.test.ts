// Test environment configuration - used by Jest
// This file is mapped via Jest's moduleNameMapper to avoid import.meta.env issues

export const environment = {
  production: false,
  supabase: {
    url: 'https://test.supabase.co',
    anonKey: 'test-anon-key',
  },
};
