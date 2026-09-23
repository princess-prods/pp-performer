import { Injectable, inject, signal, computed } from '@angular/core';
import { environment } from '../../environments/environment';

export interface YotiSession {
  sessionId: string;
  clientSessionToken: string;
  clientSessionTokenTtl: number;
}

export interface VerificationResult {
  verified: boolean;
  dateOfBirth?: string;
  reason?: string;
}

export type VerificationState =
  | 'idle'
  | 'creating-session'
  | 'verifying'
  | 'completed'
  | 'failed';

@Injectable({
  providedIn: 'root',
})
export class YotiService {
  private readonly apiUrl = '/api/trpc';

  // State signals
  private readonly stateSignal = signal<VerificationState>('idle');
  private readonly sessionSignal = signal<YotiSession | null>(null);
  private readonly errorSignal = signal<string | null>(null);
  private readonly verificationResultSignal =
    signal<VerificationResult | null>(null);

  // Public computed signals
  readonly state = this.stateSignal.asReadonly();
  readonly session = this.sessionSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly verificationResult = this.verificationResultSignal.asReadonly();

  readonly isVerifying = computed(
    () =>
      this.stateSignal() === 'creating-session' ||
      this.stateSignal() === 'verifying'
  );

  readonly isVerified = computed(
    () =>
      this.stateSignal() === 'completed' &&
      this.verificationResultSignal()?.verified === true
  );

  /**
   * Creates a new Yoti IDV session
   */
  async createSession(
    successUrl: string,
    errorUrl: string
  ): Promise<YotiSession> {
    this.stateSignal.set('creating-session');
    this.errorSignal.set(null);

    try {
      const response = await fetch(`${this.apiUrl}/yoti.createSession`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          successUrl,
          errorUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create verification session');
      }

      const result = await response.json();
      const session = result.result.data as YotiSession;

      this.sessionSignal.set(session);
      this.stateSignal.set('verifying');

      return session;
    } catch (error) {
      this.stateSignal.set('failed');
      this.errorSignal.set(
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Gets the iframe URL for Yoti verification
   */
  getIframeUrl(session: YotiSession): string {
    return `https://api.yoti.com/idverify/v1/web/index.html?sessionID=${session.sessionId}&sessionToken=${session.clientSessionToken}`;
  }

  /**
   * Handles post message events from the Yoti iframe
   */
  handleIframeMessage(event: MessageEvent): void {
    // Only accept messages from Yoti
    if (!event.origin.includes('yoti.com')) {
      return;
    }

    const data = event.data;

    // Success - no eventCode means success
    if (!data.eventCode) {
      this.stateSignal.set('completed');
      this.verifyAge();
      return;
    }

    // Handle error codes
    switch (data.eventCode) {
      case 'CANCELLED':
        this.stateSignal.set('idle');
        this.errorSignal.set('Verification was cancelled');
        break;
      case 'ERROR':
        this.stateSignal.set('failed');
        this.errorSignal.set('An error occurred during verification');
        break;
      default:
        console.log('Yoti iframe event:', data.eventCode);
    }
  }

  /**
   * Verifies the age from a completed session
   */
  async verifyAge(): Promise<VerificationResult> {
    const session = this.sessionSignal();
    if (!session) {
      throw new Error('No active session');
    }

    try {
      const response = await fetch(
        `${this.apiUrl}/yoti.verifyAge?input=${encodeURIComponent(
          JSON.stringify({ sessionId: session.sessionId })
        )}`
      );

      if (!response.ok) {
        throw new Error('Failed to verify age');
      }

      const result = await response.json();
      const verification = result.result.data as VerificationResult;

      this.verificationResultSignal.set(verification);

      if (verification.verified) {
        this.stateSignal.set('completed');
      } else {
        this.stateSignal.set('failed');
        this.errorSignal.set(verification.reason || 'Age verification failed');
      }

      return verification;
    } catch (error) {
      this.stateSignal.set('failed');
      this.errorSignal.set(
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Resets the service state for a new verification attempt
   */
  reset(): void {
    this.stateSignal.set('idle');
    this.sessionSignal.set(null);
    this.errorSignal.set(null);
    this.verificationResultSignal.set(null);
  }

  // ============ Mock Mode for Development ============

  private mockMode = !environment.production;

  /**
   * Creates a mock session for development/testing
   */
  async createMockSession(): Promise<YotiSession> {
    this.stateSignal.set('creating-session');
    this.errorSignal.set(null);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockSession: YotiSession = {
      sessionId: 'mock-session-' + Date.now(),
      clientSessionToken: 'mock-token-' + Math.random().toString(36).slice(2),
      clientSessionTokenTtl: 600,
    };

    this.sessionSignal.set(mockSession);
    this.stateSignal.set('verifying');

    return mockSession;
  }

  /**
   * Simulates successful verification in mock mode
   */
  async mockVerifySuccess(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.verificationResultSignal.set({
      verified: true,
      dateOfBirth: '1990-01-15',
    });
    this.stateSignal.set('completed');
  }

  /**
   * Simulates failed verification in mock mode
   */
  async mockVerifyFailure(reason: string = 'User is under 18'): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.verificationResultSignal.set({
      verified: false,
      reason,
    });
    this.stateSignal.set('failed');
    this.errorSignal.set(reason);
  }

  /**
   * Check if running in mock mode
   */
  isMockMode(): boolean {
    return this.mockMode;
  }
}
