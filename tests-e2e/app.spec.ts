import { test, expect } from '@playwright/test';

test.describe('Event Timer App', () => {
  test('lädt Settings und Events und rendert Grid', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#app')).toBeVisible();

    // Tabellen-Header sichtbar
    await expect(page.getByText('Event')).toBeVisible();
    await expect(page.getByText('Startzeit')).toBeVisible();
    await expect(page.getByText('Dauer')).toBeVisible();
    await expect(page.getByText('Status')).toBeVisible();
  });

  test('Footer zeigt Build-Zeit', async ({ page }) => {
    await page.goto('/');
    const buildInfo = page.locator('#buildInfo');
    await expect(buildInfo).toBeVisible();
    await expect(buildInfo).toContainText('Zuletzt aktualisiert am:');
  });
});


