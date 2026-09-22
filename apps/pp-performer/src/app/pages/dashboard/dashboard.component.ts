import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  host: { class: 'block min-h-screen bg-background' },
  template: `
    <div class="min-h-screen flex flex-col">
      <header
        class="border-b border-white/10 bg-card/50 backdrop-blur-md sticky top-0 z-10"
      >
        <div
          class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between"
        >
          <img src="/new_logo_lg.png" alt="Princess Prods" class="h-10" />

          <div class="flex items-center gap-4">
            @if (authService.user(); as user) {
              <div class="flex items-center gap-3">
                @if (user.user_metadata['avatar_url']) {
                  <img
                    [src]="user.user_metadata['avatar_url']"
                    alt="Profile"
                    class="w-8 h-8 rounded-full"
                  />
                }
                <span class="text-foreground/70 text-sm hidden sm:block">
                  {{ user.email }}
                </span>
              </div>
            }

            <button
              (click)="signOut()"
              class="px-4 py-2 rounded-lg bg-white/10 text-foreground/70 hover:bg-white/20 hover:text-foreground transition-colors text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main class="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
        <h1 class="font-display text-3xl font-semibold text-foreground mb-2">
          Welcome to your Dashboard
        </h1>
        <p class="text-foreground/60 mb-8">
          Your performer application portal
        </p>

        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            class="p-6 rounded-xl bg-card/50 border border-white/10 backdrop-blur-sm"
          >
            <h3 class="font-semibold text-foreground mb-2">
              Application Status
            </h3>
            <p class="text-foreground/60 text-sm">Not yet submitted</p>
          </div>

          <div
            class="p-6 rounded-xl bg-card/50 border border-white/10 backdrop-blur-sm"
          >
            <h3 class="font-semibold text-foreground mb-2">Age Verification</h3>
            <p class="text-foreground/60 text-sm">Pending verification</p>
          </div>

          <div
            class="p-6 rounded-xl bg-card/50 border border-white/10 backdrop-blur-sm"
          >
            <h3 class="font-semibold text-foreground mb-2">Next Steps</h3>
            <p class="text-foreground/60 text-sm">Complete your profile</p>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class DashboardComponent {
  authService = inject(AuthService);

  async signOut(): Promise<void> {
    await this.authService.signOut();
  }
}
