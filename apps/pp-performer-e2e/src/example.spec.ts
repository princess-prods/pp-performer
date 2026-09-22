import { test, expect } from '@playwright/test';

test('landing page loads with hero section', async ({ page }) => {
  await page.goto('/');

  // Expect hero headline to be visible
  await expect(page.locator('h1')).toContainText('Interested in Performing?');
});

test('landing page has CTA link', async ({ page }) => {
  await page.goto('/');

  // Expect Get Started link to be visible (styled as a button)
  await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible();
});

test('footer displays age verification notice', async ({ page }) => {
  await page.goto('/');

  // Expect 18+ notice in footer
  await expect(page.locator('footer')).toContainText('18+ only');
});
