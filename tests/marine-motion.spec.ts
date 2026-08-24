import { test, expect } from '@playwright/test';

const creatures = ['Jellyfish', 'Squid', 'Octopus', 'Crab', 'Lobster', 'Seahorse'];

test('WebGL canvas initializes and all presets are interactive', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('canvas')).toHaveCount(1);
  await expect(page.locator('canvas')).toBeVisible();
  for (const creature of creatures) {
    await page.getByRole('button', { name: creature, exact: true }).click();
    await expect(page.locator('footer')).toContainText(creature === 'Jellyfish' ? 'BELL' : creature === 'Squid' ? 'MANTLE' : creature === 'Octopus' ? 'RADIAL' : creature === 'Crab' ? 'CARAPACE' : creature === 'Lobster' ? 'SEGMENTED' : 'CURVED');
  }
  await page.screenshot({ path: 'test-results/desktop-all-presets.png', fullPage: true });
});

test('live controls, pause and reset respond', async ({ page }) => {
  await page.goto('/');
  const speed = page.locator('input[type="range"]').first();
  await speed.fill('2');
  await expect(speed).toHaveValue('2');
  const pause = page.getByRole('button', { name: 'Pause', exact: true });
  await pause.click();
  await expect(page.getByRole('button', { name: 'Play', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.locator('input[type="range"]').first()).toHaveValue('1');
});

test('mobile layout retains canvas and controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByText('Creature', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
});
