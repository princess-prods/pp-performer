import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto text-center">
      <!-- Hero Section -->
      <div class="mb-6 md:mb-12 animate-fade-in-up">
        <h1 class="hero-headline">
          Interested in Performing?
        </h1>
        <p class="text-base md:text-xl text-muted-foreground mt-3 md:mt-4">
          We're currently accepting inquiries from adults 18+ interested in
          paid adult-content production.
        </p>
      </div>

      <!-- Value Props -->
      <div class="value-props-card animate-fade-in-up animation-delay-200">
        <h2 class="card-header">What We Offer</h2>
        <ul class="space-y-2 md:space-y-4">
          <li class="flex items-start gap-4 value-prop-item">
            <span class="value-prop-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
              </svg>
            </span>
            <span>Paid production opportunities</span>
          </li>
          <li class="flex items-start gap-4 value-prop-item">
            <span class="value-prop-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
            </span>
            <span>Professional, private production environment</span>
          </li>
          <li class="flex items-start gap-4 value-prop-item">
            <span class="value-prop-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
              </svg>
            </span>
            <span>Flexible scheduling</span>
          </li>
          <li class="flex items-start gap-4 value-prop-item">
            <span class="value-prop-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </span>
            <span>New & experienced performers welcome</span>
          </li>
          <li class="flex items-start gap-4 value-prop-item">
            <span class="value-prop-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
            </span>
            <span>Clear compensation & agreements</span>
          </li>
          <li class="flex items-start gap-4 value-prop-item">
            <span class="value-prop-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
            </span>
            <span>Content-sharing/licensing opportunities available</span>
          </li>
        </ul>
      </div>

      <!-- CTA -->
      <div class="space-y-4 animate-fade-in-up animation-delay-400">
        <a routerLink="/login" class="cta-button inline-block">
          Get Started
        </a>
        <p class="text-sm text-muted-foreground">
          No obligation to participate. Ask questions first and decide whether
          the opportunity is right for you.
        </p>
        <p class="trust-line">Trusted by performers since 2017</p>
      </div>

      <!-- Age Notice -->
      <div class="mt-12 p-4 bg-muted/80 backdrop-blur-sm rounded-lg animate-fade-in-up animation-delay-600">
        <p class="text-sm text-muted-foreground">
          <strong>18+ only.</strong> Government-issued ID and age verification required.
        </p>
      </div>
    </div>
  `,
})
export class WelcomeComponent {}
