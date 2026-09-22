import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { getSupabase } from './supabase.client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);

  private userSignal = signal<User | null>(null);
  private sessionSignal = signal<Session | null>(null);
  private loadingSignal = signal(true);

  readonly user = this.userSignal.asReadonly();
  readonly session = this.sessionSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.userSignal());

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    const supabase = getSupabase();

    // Get initial session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    this.sessionSignal.set(session);
    this.userSignal.set(session?.user ?? null);
    this.loadingSignal.set(false);

    // Listen for auth changes
    supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        this.sessionSignal.set(session);
        this.userSignal.set(session?.user ?? null);

        if (event === 'SIGNED_IN') {
          this.router.navigate(['/dashboard']);
        } else if (event === 'SIGNED_OUT') {
          this.router.navigate(['/']);
        }
      }
    );
  }

  async signInWithGoogle(): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error.message);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error.message);
      throw error;
    }
  }

  async getSession(): Promise<Session | null> {
    const supabase = getSupabase();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  }
}
