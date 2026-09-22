import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-2xl mx-auto text-center">
      <!-- Hero Section -->
      <div class="mb-12">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">
          Interested in Performing?
        </h1>
        <p class="text-lg text-muted-foreground">
          We're currently accepting inquiries from adults 18+ interested in
          paid adult-content production.
        </p>
      </div>

      <!-- Value Props -->
      <div class="bg-card border rounded-lg p-6 md:p-8 mb-8 text-left">
        <h2 class="text-xl font-semibold mb-4 text-center">What We Offer</h2>
        <ul class="space-y-3">
          <li class="flex items-start gap-3">
            <span class="text-primary mt-1">&#10003;</span>
            <span>Paid production opportunities</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary mt-1">&#10003;</span>
            <span>Professional, private production environment</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary mt-1">&#10003;</span>
            <span>Flexible scheduling</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary mt-1">&#10003;</span>
            <span>New & experienced performers welcome</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary mt-1">&#10003;</span>
            <span>Clear compensation & agreements</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary mt-1">&#10003;</span>
            <span>Content-sharing/licensing opportunities available</span>
          </li>
        </ul>
      </div>

      <!-- CTA -->
      <div class="space-y-4">
        <button
          class="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Get Started
        </button>
        <p class="text-sm text-muted-foreground">
          No obligation to participate. Ask questions first and decide whether
          the opportunity is right for you.
        </p>
      </div>

      <!-- Age Notice -->
      <div class="mt-12 p-4 bg-muted rounded-lg">
        <p class="text-sm text-muted-foreground">
          <strong>18+ only.</strong> Government-issued ID and age verification required.
        </p>
      </div>
    </div>
  `,
})
export class WelcomeComponent {}
