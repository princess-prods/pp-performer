import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import * as supabaseClient from './supabase.client';

describe('AuthService', () => {
  let service: AuthService;
  let router: Router;
  let mockSupabase: {
    auth: {
      getSession: jest.Mock;
      onAuthStateChange: jest.Mock;
      signInWithOAuth: jest.Mock;
      signOut: jest.Mock;
    };
  };
  let authStateCallback: (event: string, session: unknown) => void;

  beforeEach(() => {
    mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
        onAuthStateChange: jest.fn().mockImplementation((callback) => {
          authStateCallback = callback;
          return { data: { subscription: { unsubscribe: jest.fn() } } };
        }),
        signInWithOAuth: jest.fn().mockResolvedValue({ error: null }),
        signOut: jest.fn().mockResolvedValue({ error: null }),
      },
    };

    jest
      .spyOn(supabaseClient, 'getSupabase')
      .mockReturnValue(mockSupabase as unknown as ReturnType<typeof supabaseClient.getSupabase>);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
      ],
    });

    router = TestBed.inject(Router);
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with no user', async () => {
    await Promise.resolve();
    expect(service.user()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should set loading to false after initialization', async () => {
    await Promise.resolve();
    expect(service.loading()).toBe(false);
  });

  describe('initialization with existing session', () => {
    it('should initialize with session if present', async () => {
      const mockSession = {
        user: { id: '123', email: 'test@test.com' },
        access_token: 'token',
      };

      // Reset modules and reconfigure mock before creating service
      jest.restoreAllMocks();

      const newMockSupabase = {
        auth: {
          getSession: jest.fn().mockResolvedValue({
            data: { session: mockSession },
          }),
          onAuthStateChange: jest.fn().mockImplementation(() => {
            return { data: { subscription: { unsubscribe: jest.fn() } } };
          }),
          signInWithOAuth: jest.fn().mockResolvedValue({ error: null }),
          signOut: jest.fn().mockResolvedValue({ error: null }),
        },
      };

      jest
        .spyOn(supabaseClient, 'getSupabase')
        .mockReturnValue(newMockSupabase as unknown as ReturnType<typeof supabaseClient.getSupabase>);

      // Reset TestBed and inject fresh service
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          AuthService,
          {
            provide: Router,
            useValue: { navigate: jest.fn() },
          },
        ],
      });

      const newService = TestBed.inject(AuthService);

      // Wait for async initialization to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(newService.user()).toEqual(mockSession.user);
      expect(newService.isAuthenticated()).toBe(true);
    });
  });

  it('should handle SIGNED_IN event', async () => {
    await Promise.resolve();
    const mockSession = {
      user: { id: '123', email: 'test@test.com' },
    };

    authStateCallback('SIGNED_IN', mockSession);

    expect(service.user()).toEqual(mockSession.user);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should handle SIGNED_OUT event', async () => {
    await Promise.resolve();
    authStateCallback('SIGNED_OUT', null);

    expect(service.user()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  describe('signInWithGoogle', () => {
    it('should call signInWithOAuth with google provider', async () => {
      await service.signInWithGoogle();

      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.stringContaining('/auth/callback'),
        },
      });
    });

    it('should throw error if sign in fails', async () => {
      const error = { message: 'Sign in failed' };
      mockSupabase.auth.signInWithOAuth.mockResolvedValue({ error });

      await expect(service.signInWithGoogle()).rejects.toEqual(error);
    });
  });

  describe('signOut', () => {
    it('should call supabase signOut', async () => {
      await service.signOut();

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });

    it('should throw error if sign out fails', async () => {
      const error = { message: 'Sign out failed' };
      mockSupabase.auth.signOut.mockResolvedValue({ error });

      await expect(service.signOut()).rejects.toEqual(error);
    });
  });

  describe('getSession', () => {
    it('should return session from supabase', async () => {
      const mockSession = { user: { id: '123' }, access_token: 'token' };
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
      });

      const session = await service.getSession();

      expect(session).toEqual(mockSession);
    });

    it('should return null if no session', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      const session = await service.getSession();

      expect(session).toBeNull();
    });
  });
});
