import { test, expect } from '@playwright/test';

const SITE = '/_/';
const PHONE = { width: 390, height: 844 };

test('loads under /_/ with no page errors and no failed requests', async ({ page }) => {
  const errors = [];
  const failed = [];
  const offsite = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    if (!r.url().startsWith('http://localhost:4173/')) offsite.push(r.url());
  });
  page.on('requestfailed', (r) => failed.push(r.url() + ' ' + (r.failure() || {}).errorText));
  page.on('response', (r) => {
    if (r.status() >= 400) failed.push(r.url() + ' ' + r.status());
  });
  await page.goto(SITE, { waitUntil: 'load' });
  // Let the intro run to completion and the animation loop tick.
  await expect(page.locator('#intro')).toHaveCount(0, { timeout: 5000 });
  await expect(page.locator('#shelf-row .slot')).toHaveCount(6);
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
  // Fonts are self-hosted, so nothing is fetched from another host.
  expect(offsite).toEqual([]);
  expect(await page.evaluate(() => document.fonts.check('500 16px "Inter Tight"'))).toBe(true);
});

test('Review Focus 2: script and stylesheet URLs work under the /_/ subpath', async ({ page }) => {
  await page.goto(SITE);
  const urls = await page.evaluate(() => [
    ...[...document.querySelectorAll('script[src]')].map((s) => s.getAttribute('src')),
    ...[...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute('href')),
  ]);
  expect(urls.length).toBeGreaterThanOrEqual(2);
  for (const u of urls) {
    expect(u.startsWith('/_/'), u).toBe(true);
  }
  // The built bundle must actually be in use (not the dev /src/ paths).
  expect(urls.some((u) => u.startsWith('/_/assets/') && u.endsWith('.js'))).toBe(true);
  expect(urls.some((u) => u.startsWith('/_/assets/') && u.endsWith('.css'))).toBe(true);
});

test.describe('phone 390x844', () => {
  test.use({ viewport: PHONE });

  test('Review Focus 1: the page stays at the top after load', async ({ page }) => {
    await page.goto(SITE);
    await page.waitForTimeout(3500);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test('Review Focus 5: no sideways scroll', async ({ page }) => {
    await page.goto(SITE);
    await expect(page.locator('#intro')).toHaveCount(0, { timeout: 5000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  });
});

test('Review Focus 3: story lines are fully visible once scrolled into view', async ({ page }) => {
  await page.goto(SITE);
  await expect(page.locator('#intro')).toHaveCount(0, { timeout: 5000 });
  const lines = page.locator('.story-row p');
  await expect(lines).toHaveCount(8); // "A short story." + 7 chapters
  for (let i = 0; i < 8; i++) {
    const p = lines.nth(i);
    await p.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    // Opacity of the line itself, and the effective opacity through its
    // ancestors (the reveal animation sits on the .rv row, not the <p>).
    await expect
      .poll(
        () =>
          p.evaluate((el) => {
            const own = getComputedStyle(el).opacity;
            let eff = 1;
            for (let n = el; n; n = n.parentElement) eff *= Number(getComputedStyle(n).opacity);
            return own + '/' + eff.toFixed(3);
          }),
        { timeout: 3000 },
      )
      .toBe('1/1.000');
  }
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('Review Focus 4: no intro, hero name visible', async ({ page }) => {
    await page.goto(SITE, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#intro')).toHaveCount(0, { timeout: 100 });
    const name = page.locator('h1.hero-name');
    await expect(name).toBeVisible();
    await expect(name).toContainText('Korouhanba Khuman');
    await expect(name).toBeInViewport();
  });
});

test('Shelf: clicking the third book shows Murmur', async ({ page }) => {
  await page.goto(SITE);
  await expect(page.locator('#intro')).toHaveCount(0, { timeout: 5000 });
  await expect(page.locator('#d-title')).toHaveText('Churn');
  const third = page.locator('#shelf-row .slot').nth(2).locator('button');
  await third.click();
  await expect(page.locator('#d-title')).toHaveText('Murmur');
  await expect(third).toHaveAttribute('aria-pressed', 'true');
});
