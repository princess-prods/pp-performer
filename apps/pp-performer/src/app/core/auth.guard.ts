import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for auth to initialize if still loading
  if (authService.loading()) {
    // Give it a moment to load
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

export const publicOnlyGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for auth to initialize if still loading
  if (authService.loading()) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Already authenticated, redirect to dashboard
  return router.createUrlTree(['/dashboard']);
};
