import { appRoutes } from './app.routes';

describe('appRoutes', () => {
  it('should have a default route', () => {
    const defaultRoute = appRoutes.find((route) => route.path === '');
    expect(defaultRoute).toBeDefined();
  });

  it('should lazy load WelcomeComponent for default route', async () => {
    const defaultRoute = appRoutes.find((route) => route.path === '');
    expect(defaultRoute?.loadComponent).toBeDefined();

    // Test that the lazy load function works
    const module = await defaultRoute!.loadComponent!();
    expect(module).toBeDefined();
  });

  it('should have login route', () => {
    const loginRoute = appRoutes.find((route) => route.path === 'login');
    expect(loginRoute).toBeDefined();
    expect(loginRoute?.loadComponent).toBeDefined();
  });

  it('should have auth callback route', () => {
    const callbackRoute = appRoutes.find(
      (route) => route.path === 'auth/callback'
    );
    expect(callbackRoute).toBeDefined();
  });

  it('should have protected dashboard route', () => {
    const dashboardRoute = appRoutes.find(
      (route) => route.path === 'dashboard'
    );
    expect(dashboardRoute).toBeDefined();
    expect(dashboardRoute?.canActivate).toBeDefined();
  });
});
