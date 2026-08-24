import { test, expect } from '@playwright/test';

const creatures = ['Jellyfish', 'Squid', 'Octopus', 'Crab', 'Lobster', 'Seahorse'] as const;
const topology = {
  Jellyfish: 'BELL', Squid: 'MANTLE', Octopus: 'RADIAL',
  Crab: 'CARAPACE', Lobster: 'SEGMENTED', Seahorse: 'CURVED',
} as const;

const canvasSelector = '.stage canvas[data-marine-renderer="true"]';

async function expectRenderer(page: import('@playwright/test').Page) {
  const canvas = page.locator(canvasSelector);
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toBeVisible();
  expect(await canvas.evaluate((node) => node.getBoundingClientRect().width)).toBeGreaterThan(100);
}

async function setLightDensity(page: import('@playwright/test').Page) {
  const density = page.locator('input[type="range"]').nth(6);
  await density.fill('10000');
  await expect(density).toHaveValue('10000');
}

test.describe('creature presets', () => {
  for (const creature of creatures) {
    test(`${creature} switches to its topology`, async ({ page }) => {
      await page.goto('/');
      await setLightDensity(page);
      await expectRenderer(page);
      await page.getByRole('button', { name: creature, exact: true }).click({ timeout: 10000 });
      await expect(page.locator('footer')).toContainText(topology[creature], { timeout: 5000 });
    });
  }
});

test('renderer initializes exactly once', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expectRenderer(page);
});

test('live controls, pause and reset respond', async ({ page }) => {
  await page.goto('/');
  await setLightDensity(page);
  const speed = page.locator('input[type="range"]').first();
  await speed.fill('2');
  await expect(speed).toHaveValue('2');
  await page.getByRole('button', { name: 'Pause', exact: true }).click({ timeout: 10000 });
  await expect(page.getByRole('button', { name: 'Play', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reset', exact: true }).click({ timeout: 10000 });
  await expect(speed).toHaveValue('1');
});

test('desktop visual checkpoint', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expectRenderer(page);
  await page.screenshot({ path: 'test-results/desktop-jellyfish.png' });
});

test('mobile layout retains a single canvas and controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expectRenderer(page);
  await expect(page.getByText('Creature', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'test-results/mobile.png' });
});

test('50k particle baseline stays responsive', async ({ page }) => {
  await page.goto('/');
  await expectRenderer(page);
  await page.waitForTimeout(250);
  const elapsed = await page.evaluate(async () => new Promise<number>((resolve) => {
    const start = performance.now();
    requestAnimationFrame(() => requestAnimationFrame(() => resolve(performance.now() - start)));
  }));
  expect(elapsed).toBeLessThan(1000);
});
