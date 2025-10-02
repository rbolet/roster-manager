import { test, expect } from '@playwright/test';

/**
 * Example E2E test - demonstrates testing pattern
 * Replace with actual tests
 */

test.describe('Roster Manager App', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Roster Manager')).toBeVisible();
  });

  test('should have the correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Roster Manager/);
  });
});
