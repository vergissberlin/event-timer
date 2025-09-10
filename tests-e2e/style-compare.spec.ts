import { test, expect } from '@playwright/test';

async function captureStyles(page) {
  // Erfasse ein Set relevanter Styles für Kernelemente
  const metrics = await page.evaluate(() => {
    const get = (sel) => document.querySelector(sel);
    const styles = (el) => el ? getComputedStyle(el) : null;

    const loading = get('#loading');
    const app = get('#app');
    const title = get('#appTitle');
    const footer = get('footer');
    const table = get('#eventGrid');

    const pick = (cs, keys) => cs ? Object.fromEntries(keys.map(k => [k, cs.getPropertyValue(k)])) : null;

    return {
      loading: pick(styles(loading), ['display', 'background-color', 'color']),
      app: pick(styles(app), ['background-color', 'color']),
      title: pick(styles(title), ['font-size', 'font-weight', 'color']),
      footer: pick(styles(footer), ['background-color', 'backdrop-filter', 'border-top-color']),
      table: pick(styles(table), ['background-color', 'border-color'])
    };
  });
  return metrics;
}

test.describe('Style-Vergleich Dev vs Preview', () => {
  test('vergleicht wesentliche Styles', async ({ page, browserName, project }) => {
    // 1) Dev
    await page.goto('/');
    const devMetrics = await captureStyles(page);

    // 2) Preview in zweitem Kontext
    const context2 = await page.context().browser().newContext({ baseURL: 'http://localhost:4173' });
    const page2 = await context2.newPage();
    await page2.goto('/');
    const previewMetrics = await captureStyles(page2);

    // Erwartung: Kernwerte sollten nicht fundamental abweichen
    expect(previewMetrics.title?.['font-size']).toBe(devMetrics.title?.['font-size']);
    expect(previewMetrics.app?.['background-color']).toBe(devMetrics.app?.['background-color']);
  });
});


