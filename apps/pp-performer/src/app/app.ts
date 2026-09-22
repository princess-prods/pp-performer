import { Component, inject } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private router = inject(Router);

  protected currentYear = new Date().getFullYear();

  // Routes that should use full-screen layout (no shell)
  private fullScreenRoutes = ['/login', '/auth/callback', '/dashboard'];

  protected isFullScreen = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => e as NavigationEnd),
      map((e) => this.fullScreenRoutes.some((r) => e.urlAfterRedirects.startsWith(r)))
    ),
    { initialValue: this.fullScreenRoutes.some((r) => this.router.url.startsWith(r)) }
  );
}
