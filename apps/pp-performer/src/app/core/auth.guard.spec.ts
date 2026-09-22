import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authGuard, publicOnlyGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { signal } from '@angular/core';

describe('Auth Guards', () => {
  let router: Router;
  let mockAuthService: {
    loading: ReturnType<typeof signal<boolean>>;
    isAuthenticated: ReturnType<typeof signal<boolean>>;
  };
  let mockUrlTree: UrlTree;

  beforeEach(() => {
    mockUrlTree = {} as UrlTree;
    mockAuthService = {
      loading: signal(false),
      isAuthenticated: signal(false),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            createUrlTree: jest.fn().mockReturnValue(mockUrlTree),
          },
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    });

    router = TestBed.inject(Router);
  });

  describe('authGuard', () => {
    it('should return true when user is authenticated', async () => {
      mockAuthService.isAuthenticated.set(true);

      const result = await TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

      expect(result).toBe(true);
    });

    it('should redirect to login when user is not authenticated', async () => {
      mockAuthService.isAuthenticated.set(false);

      const result = await TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

      expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
      expect(result).toBe(mockUrlTree);
    });

    it('should wait for loading to complete before checking auth', async () => {
      mockAuthService.loading.set(true);
      mockAuthService.isAuthenticated.set(false);

      // Start the guard execution
      const resultPromise = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

      // The guard should wait ~100ms
      const result = await resultPromise;

      expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
      expect(result).toBe(mockUrlTree);
    });
  });

  describe('publicOnlyGuard', () => {
    it('should return true when user is not authenticated', async () => {
      mockAuthService.isAuthenticated.set(false);

      const result = await TestBed.runInInjectionContext(() => publicOnlyGuard({} as never, {} as never));

      expect(result).toBe(true);
    });

    it('should redirect to dashboard when user is authenticated', async () => {
      mockAuthService.isAuthenticated.set(true);

      const result = await TestBed.runInInjectionContext(() => publicOnlyGuard({} as never, {} as never));

      expect(router.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
      expect(result).toBe(mockUrlTree);
    });

    it('should wait for loading to complete before checking auth', async () => {
      mockAuthService.loading.set(true);
      mockAuthService.isAuthenticated.set(true);

      const result = await TestBed.runInInjectionContext(() => publicOnlyGuard({} as never, {} as never));

      expect(router.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
      expect(result).toBe(mockUrlTree);
    });
  });
});
