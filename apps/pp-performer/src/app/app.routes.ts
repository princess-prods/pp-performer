import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/welcome/welcome.component').then((m) => m.WelcomeComponent),
  },
];
