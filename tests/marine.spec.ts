import { test, expect } from '@playwright/test';

const creatures = ['Jellyfish', 'Squid', 'Octopus', 'Crab', 'Lobster', 'Seahorse'];

test('marine studio renders and all presets remain interactive', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  expect(await canvas.evaluate((node) => node.getBoundingClientRect().width)).toBeGreaterThan(100);

  for (const name of creatures) {
    await page.getByRole('button', { name }).click();
    await expect(page.locator('footer')).toContainText('TOPOLOGY');
  }

  const speed = page.locator('input[type="range"]').first();
  await speed.fill('1.75');
  await expect(speed).toHaveValue('1.75');

  await page.getByRole('button', { name: 'Pause' }).click();
  await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
  await page.screenshot({ path: 'test-results/marine-desktop.png', fullPage: true });
});

test('marine studio remains usable on a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Jellyfish' })).toBeVisible();
  await page.getByRole('button', { name: 'Octopus' }).click();
  await page.screenshot({ path: 'test-results/marine-mobile.png', fullPage: true });
});
