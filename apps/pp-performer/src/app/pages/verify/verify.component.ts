import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
  computed,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YotiService } from '../../core/yoti.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block min-h-screen bg-background' },
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <header
        class="border-b border-white/10 bg-card/50 backdrop-blur-md sticky top-0 z-10"
      >
        <div class="max-w-6xl mx-auto px-4 py-4 flex items-center">
          <img src="/new_logo_lg.png" alt="Princess Prods" class="h-10" />
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col">
        @switch (yotiService.state()) {
          <!-- Idle State - Show Start Button -->
          @case ('idle') {
            <div
              class="flex-1 flex flex-col items-center justify-center px-4 py-12"
            >
              <div class="max-w-md w-full text-center">
                <div
                  class="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <svg
                    class="w-10 h-10 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>

                <h1
                  class="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-4"
                >
                  Age Verification Required
                </h1>

                <p class="text-foreground/60 mb-8">
                  To continue, we need to verify that you're 18 or older. This
                  is a quick and secure process using your government-issued
                  ID.
                </p>

                <div
                  class="bg-card/50 border border-white/10 rounded-xl p-6 mb-8 text-left"
                >
                  <h3 class="font-semibold text-foreground mb-3">
                    What you'll need:
                  </h3>
                  <ul class="space-y-2 text-foreground/70 text-sm">
                    <li class="flex items-start gap-2">
                      <svg
                        class="w-5 h-5 text-primary shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      A valid government-issued ID (passport, driver's license)
                    </li>
                    <li class="flex items-start gap-2">
                      <svg
                        class="w-5 h-5 text-primary shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      A device with a camera
                    </li>
                    <li class="flex items-start gap-2">
                      <svg
                        class="w-5 h-5 text-primary shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      About 2-3 minutes of your time
                    </li>
                  </ul>
                </div>

                <button
                  (click)="startVerification()"
                  class="w-full py-4 px-6 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Start Verification
                </button>

                @if (yotiService.isMockMode()) {
                  <p class="mt-4 text-xs text-foreground/40">
                    Development mode: Mock verification available
                  </p>
                }
              </div>
            </div>
          }

          <!-- Creating Session -->
          @case ('creating-session') {
            <div
              class="flex-1 flex flex-col items-center justify-center px-4 py-12"
            >
              <div class="animate-spin w-12 h-12 mb-4">
                <svg
                  class="text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <p class="text-foreground/60">Preparing verification...</p>
            </div>
          }

          <!-- Verifying - Show Iframe or Mock UI -->
          @case ('verifying') {
            @if (yotiService.isMockMode()) {
              <!-- Mock Verification UI -->
              <div
                class="flex-1 flex flex-col items-center justify-center px-4 py-12"
              >
                <div class="max-w-md w-full">
                  <div
                    class="bg-card/50 border border-white/10 rounded-xl p-8 text-center"
                  >
                    <div
                      class="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/10 flex items-center justify-center"
                    >
                      <svg
                        class="w-8 h-8 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>

                    <h2 class="text-xl font-semibold text-foreground mb-2">
                      Mock Verification Mode
                    </h2>
                    <p class="text-foreground/60 text-sm mb-6">
                      This is a development simulation. In production, the Yoti
                      verification iframe would appear here.
                    </p>

                    <div class="space-y-3">
                      <button
                        (click)="mockSuccess()"
                        class="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Simulate Success (Age 18+)
                      </button>
                      <button
                        (click)="mockFailure()"
                        class="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        Simulate Failure (Under 18)
                      </button>
                      <button
                        (click)="cancel()"
                        class="w-full py-3 px-4 bg-white/10 text-foreground/70 rounded-lg font-medium hover:bg-white/20 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            } @else {
              <!-- Real Yoti Iframe -->
              <div class="flex-1 flex flex-col">
                @if (iframeUrl()) {
                  <iframe
                    #yotiIframe
                    [src]="iframeUrl()"
                    allow="camera"
                    class="flex-1 w-full border-0"
                    title="Age Verification"
                  ></iframe>
                }
              </div>
            }
          }

          <!-- Completed Successfully -->
          @case ('completed') {
            <div
              class="flex-1 flex flex-col items-center justify-center px-4 py-12"
            >
              <div class="max-w-md w-full text-center">
                <div
                  class="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center"
                >
                  <svg
                    class="w-10 h-10 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h1
                  class="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-4"
                >
                  Verification Complete
                </h1>

                <p class="text-foreground/60 mb-8">
                  Your age has been verified. You can now continue with your
                  application.
                </p>

                <button
                  (click)="continueToLogin()"
                  class="w-full py-4 px-6 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Continue to Sign In
                </button>
              </div>
            </div>
          }

          <!-- Failed -->
          @case ('failed') {
            <div
              class="flex-1 flex flex-col items-center justify-center px-4 py-12"
            >
              <div class="max-w-md w-full text-center">
                <div
                  class="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center"
                >
                  <svg
                    class="w-10 h-10 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>

                <h1
                  class="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-4"
                >
                  Verification Failed
                </h1>

                <p class="text-foreground/60 mb-4">
                  {{ yotiService.error() || 'We were unable to verify your age.' }}
                </p>

                <p class="text-foreground/40 text-sm mb-8">
                  You must be 18 or older to use this service.
                </p>

                <button
                  (click)="tryAgain()"
                  class="w-full py-4 px-6 bg-white/10 text-foreground rounded-xl font-semibold hover:bg-white/20 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          }
        }
      </main>

      <!-- Footer -->
      <footer class="border-t border-white/10 py-4 px-4">
        <div class="max-w-6xl mx-auto text-center">
          <p class="text-foreground/40 text-xs">
            Verification powered by Yoti. Your data is handled securely.
          </p>
        </div>
      </footer>
    </div>
  `,
})
export class VerifyComponent implements OnInit, OnDestroy {
  yotiService = inject(YotiService);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  @ViewChild('yotiIframe') iframeRef!: ElementRef<HTMLIFrameElement>;

  // Computed signal for safe iframe URL
  iframeUrl = computed<SafeResourceUrl | null>(() => {
    const session = this.yotiService.session();
    if (!session) return null;
    const url = this.yotiService.getIframeUrl(session);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  private messageHandler = (event: MessageEvent) => {
    this.yotiService.handleIframeMessage(event);
  };

  ngOnInit(): void {
    // Listen for messages from Yoti iframe
    window.addEventListener('message', this.messageHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.messageHandler);
  }

  async startVerification(): Promise<void> {
    const currentUrl = window.location.origin;
    const successUrl = `${currentUrl}/verify?status=success`;
    const errorUrl = `${currentUrl}/verify?status=error`;

    if (this.yotiService.isMockMode()) {
      await this.yotiService.createMockSession();
    } else {
      await this.yotiService.createSession(successUrl, errorUrl);
    }
  }

  async mockSuccess(): Promise<void> {
    await this.yotiService.mockVerifySuccess();
  }

  async mockFailure(): Promise<void> {
    await this.yotiService.mockVerifyFailure('User is under 18 years old');
  }

  cancel(): void {
    this.yotiService.reset();
  }

  tryAgain(): void {
    this.yotiService.reset();
  }

  continueToLogin(): void {
    this.router.navigate(['/login']);
  }
}
