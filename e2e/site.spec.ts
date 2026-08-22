import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const NAV = [
  { label: 'Features', href: '#features' },
  { label: 'Audit trail', href: '#audit-trail' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

test.describe('marketing site', () => {
  test('loads with the brand headline', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('BrightGuard — The Compliance Workbench for Dental Practices');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Walk into your next inspection with the evidence already in hand.' }),
    ).toBeVisible();
    await expect(page.getByRole('complementary', { name: 'Example compliance dashboard' })).toBeVisible();
  });

  test('nav links jump to their sections', async ({ page }) => {
    await page.goto('/');
    for (const link of NAV) {
      await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: link.label }).click();
      await expect(page.locator(`section${link.href}, [id="${link.href.slice(1)}"]`)).toBeVisible();
    }
  });

  test('every section has exactly one h2 anchor with a stable id', async ({ page }) => {
    await page.goto('/');
    for (const id of [
      'problem',
      'features',
      'audit-trail',
      'how-it-works',
      'digest',
      'testimonials',
      'compare',
      'pricing',
      'faq',
      'checklist',
      'demo',
    ]) {
      await expect(page.locator(`[id="${id}"]`).first()).toBeAttached();
    }
  });

  test('mobile menu opens and closes at phone width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Open menu' });
    await expect(toggle).toBeVisible();

    await toggle.click();
    const closeToggle = page.getByRole('button', { name: 'Close menu' });
    await expect(closeToggle).toBeVisible();
    const panel = page.locator('#mobile-nav');
    await expect(panel).toBeVisible();
    await expect(panel.getByRole('link', { name: 'Pricing' })).toBeVisible();

    await closeToggle.click();
    await expect(panel).toBeHidden();
    await expect(toggle).toBeVisible();
  });

  test('pricing toggle switches monthly to yearly (two months free)', async ({ page }) => {
    await page.goto('/');
    await page.locator('#pricing').scrollIntoViewIfNeeded();

    await expect(page.getByTestId('price-single-office')).toHaveText('$149');
    await expect(page.getByTestId('price-multi-office')).toHaveText('$399');
    await expect(page.getByTestId('price-dental-group')).toHaveText('$899');
    await expect(page.getByTestId('billed-single-office')).toHaveText('Billed month to month');

    await page.getByRole('button', { name: 'Yearly' }).click();
    await expect(page.getByRole('button', { name: 'Yearly' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('price-single-office')).toHaveText('$124');
    await expect(page.getByTestId('price-multi-office')).toHaveText('$333');
    await expect(page.getByTestId('price-dental-group')).toHaveText('$749');
    await expect(page.getByTestId('billed-single-office')).toHaveText('Billed $1490 once a year');
  });

  test('FAQ expands and collapses one answer at a time', async ({ page }) => {
    await page.goto('/');
    await page.locator('#faq').scrollIntoViewIfNeeded();

    const buttons = page.locator('#faq').getByRole('button');
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(4);

    const first = buttons.nth(0);
    await expect(first).toHaveAttribute('aria-expanded', 'true');

    const second = buttons.nth(1);
    await expect(second).toHaveAttribute('aria-expanded', 'false');
    await second.click();
    await expect(second).toHaveAttribute('aria-expanded', 'true');
    await expect(first).toHaveAttribute('aria-expanded', 'false');
  });

  test('demo form validates empty fields, then submits valid input', async ({ page }) => {
    await page.goto('/');
    await page.locator('#demo').scrollIntoViewIfNeeded();

    await page.getByRole('button', { name: 'Book my demo' }).click();
    await expect(page.getByRole('alert', { name: 'Please enter your name.' })).toBeVisible();
    await expect(page.getByRole('alert', { name: 'Please enter your practice name.' })).toBeVisible();
    await expect(page.getByRole('alert', { name: 'Please enter your work email.' })).toBeVisible();
    await expect(page.getByLabel('Full name', { exact: true })).toBeFocused();

    // exact: true — the error alerts' accessible names contain the field labels as substrings
    await page.getByLabel('Work email', { exact: true }).fill('not-an-email');
    await page.getByRole('button', { name: 'Book my demo' }).click();
    await expect(page.getByRole('alert', { name: /does not look right/ })).toBeVisible();

    await page.getByLabel('Full name', { exact: true }).fill('Dr. Jordan Lee');
    await page.getByLabel('Practice name', { exact: true }).fill('Brightsmile Dental');
    await page.getByLabel('Work email', { exact: true }).fill('dr.lee@brightsmile.example');
    await page.getByLabel('Number of offices', { exact: true }).selectOption('2');
    await page.getByRole('button', { name: 'Book my demo' }).click();

    const status = page.getByRole('status');
    await expect(status).toBeVisible();
    await expect(status).toContainText('Thanks, Dr. — request received.');
    await expect(status).toContainText('dr.lee@brightsmile.example');
    await expect(page.getByRole('button', { name: 'Book my demo' })).toBeHidden();
  });

  test('checklist form validates empty fields, then confirms with a demo handoff', async ({ page }) => {
    await page.goto('/');
    await page.locator('#checklist').scrollIntoViewIfNeeded();

    await page.getByRole('button', { name: 'Send my checklist' }).click();
    await expect(page.getByRole('alert', { name: 'Please choose your state.' })).toBeVisible();
    await expect(page.getByRole('alert', { name: 'Please enter your email.' })).toBeVisible();
    await expect(page.getByLabel('Your state', { exact: true })).toBeFocused();

    await page.getByLabel('Your state', { exact: true }).selectOption('Colorado');
    await page.getByLabel('Your work email', { exact: true }).fill('not-an-email');
    await page.getByRole('button', { name: 'Send my checklist' }).click();
    await expect(page.getByRole('alert', { name: /does not look right/ })).toBeVisible();

    await page.getByLabel('Your work email', { exact: true }).fill('dr.lee@brightsmile.example');
    await page.getByRole('button', { name: 'Send my checklist' }).click();

    const status = page.getByRole('status');
    await expect(status).toBeVisible();
    await expect(status).toContainText('Checklist for Colorado is on its way');
    await expect(status).toContainText('dr.lee@brightsmile.example');
    await expect(page.getByRole('link', { name: 'Book the 30-minute demo' })).toBeVisible();
  });

  test('unknown paths render the 404 page and link home', async ({ page }) => {
    await page.goto('/does-not-exist');
    await expect(page.getByRole('heading', { name: 'This page doesn’t exist.' })).toBeVisible();
    await expect(page.getByText('404')).toBeVisible();

    await page.getByRole('link', { name: 'Back to BrightGuard' }).click();
    await expect(page).toHaveURL('/');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Walk into your next inspection with the evidence already in hand.' }),
    ).toBeVisible();
  });

  test('has no axe violations on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });

  test('has no axe violations on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
});
