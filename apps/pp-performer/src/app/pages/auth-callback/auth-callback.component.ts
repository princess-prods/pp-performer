import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { getSupabase } from '../../core/supabase.client';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  host: { class: 'block min-h-screen bg-background' },
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div
          class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"
        ></div>
        <p class="text-foreground/70">Completing sign in...</p>
      </div>
    </div>
  `,
})
export class AuthCallbackComponent implements OnInit {
  private router = inject(Router);

  async ngOnInit(): Promise<void> {
    try {
      // Supabase handles the OAuth callback automatically via URL hash
      const supabase = getSupabase();
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Auth callback error:', error.message);
        this.router.navigate(['/login'], {
          queryParams: { error: 'auth_failed' },
        });
        return;
      }

      if (data.session) {
        // Successfully authenticated
        this.router.navigate(['/dashboard']);
      } else {
        // No session, redirect to login
        this.router.navigate(['/login']);
      }
    } catch (err) {
      console.error('Unexpected error during auth callback:', err);
      this.router.navigate(['/login'], {
        queryParams: { error: 'unexpected' },
      });
    }
  }
}
