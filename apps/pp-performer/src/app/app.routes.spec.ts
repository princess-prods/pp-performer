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
});
