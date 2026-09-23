import { appRoutes } from './app.routes';

describe('appRoutes', () => {
  it('should have a default route', () => {
    const defaultRoute = appRoutes.find((route) => route.path === '');
    expect(defaultRoute).toBeDefined();
  });

  it('should lazy load WelcomeComponent for default route', async () => {
    const defaultRoute = appRoutes.find((route) => route.path === '');
    expect(defaultRoute?.loadComponent).toBeDefined();

    const module = await defaultRoute!.loadComponent!();
    expect(module).toBeDefined();
  });

  it('should lazy load VerifyComponent for verify route', async () => {
    const verifyRoute = appRoutes.find((route) => route.path === 'verify');
    expect(verifyRoute).toBeDefined();
    expect(verifyRoute?.loadComponent).toBeDefined();

    const module = await verifyRoute!.loadComponent!();
    expect(module).toBeDefined();
  });

  it('should lazy load LoginComponent for login route', async () => {
    const loginRoute = appRoutes.find((route) => route.path === 'login');
    expect(loginRoute).toBeDefined();
    expect(loginRoute?.loadComponent).toBeDefined();

    const module = await loginRoute!.loadComponent!();
    expect(module).toBeDefined();
  });

  it('should lazy load AuthCallbackComponent for auth callback route', async () => {
    const callbackRoute = appRoutes.find(
      (route) => route.path === 'auth/callback'
    );
    expect(callbackRoute).toBeDefined();
    expect(callbackRoute?.loadComponent).toBeDefined();

    const module = await callbackRoute!.loadComponent!();
    expect(module).toBeDefined();
  });

  it('should lazy load DashboardComponent for dashboard route', async () => {
    const dashboardRoute = appRoutes.find(
      (route) => route.path === 'dashboard'
    );
    expect(dashboardRoute).toBeDefined();
    expect(dashboardRoute?.loadComponent).toBeDefined();
    expect(dashboardRoute?.canActivate).toBeDefined();

    const module = await dashboardRoute!.loadComponent!();
    expect(module).toBeDefined();
  });
});
