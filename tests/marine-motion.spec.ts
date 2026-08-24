import { test, expect } from '@playwright/test';

const creatures = ['Jellyfish', 'Squid', 'Octopus', 'Crab', 'Lobster', 'Seahorse'];
const topology = {
  Jellyfish: 'BELL', Squid: 'MANTLE', Octopus: 'RADIAL',
  Crab: 'CARAPACE', Lobster: 'SEGMENTED', Seahorse: 'CURVED',
};

test('exactly one WebGL canvas initializes and all presets are interactive', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const canvas = page.locator('.stage canvas[data-marine-renderer="true"]');
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toBeVisible();
  expect(await canvas.evaluate((node) => node.getBoundingClientRect().width)).toBeGreaterThan(100);

  for (const creature of creatures) {
    await page.getByRole('button', { name: creature, exact: true }).click();
    await expect(page.locator('footer')).toContainText(topology[creature as keyof typeof topology]);
  }
  await page.screenshot({ path: 'test-results/desktop-all-presets.png', fullPage: true });
});

test('live controls, pause and reset respond', async ({ page }) => {
  await page.goto('/');
  const speed = page.locator('input[type="range"]').first();
  await speed.fill('2');
  await expect(speed).toHaveValue('2');
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Play', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(speed).toHaveValue('1');
});

test('mobile layout retains a single canvas and controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const canvas = page.locator('.stage canvas[data-marine-renderer="true"]');
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toBeVisible();
  await expect(page.getByText('Creature', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
});
