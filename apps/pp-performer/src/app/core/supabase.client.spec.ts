import { getSupabase } from './supabase.client';

// Mock the createClient function
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  }),
}));

describe('Supabase Client', () => {
  beforeEach(() => {
    // Reset the singleton for each test
    jest.resetModules();
  });

  it('should create a supabase client', () => {
    const client = getSupabase();
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
  });

  it('should return the same instance on subsequent calls', () => {
    const client1 = getSupabase();
    const client2 = getSupabase();
    expect(client1).toBe(client2);
  });
});
