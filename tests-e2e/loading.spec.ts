import { test, expect } from '@playwright/test';

test.describe('Loading Overlay', () => {
  test('blendet nach Initialisierung aus', async ({ page }) => {
    await page.goto('/');

    const loading = page.locator('#loading');
    await expect(loading).toBeVisible();

    // Warte bis App-Shell sichtbar ist
    const app = page.locator('#app');
    await expect(app).toBeVisible({ timeout: 10000 });

    // Lade-Overlay sollte verschwinden (hidden class oder display:none)
    await expect(loading).toHaveClass(/hidden/);
  });
});


