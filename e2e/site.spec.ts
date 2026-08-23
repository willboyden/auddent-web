import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

declare global {
  interface Window {
    __trackedEvents?: string[];
  }
}

// The real plausible snippet is aborted in e2e, so record events ourselves.
async function recordEvents(page: Page) {
  await page.addInitScript(() => {
    window.__trackedEvents = [];
    window.plausible = (name) => {
      window.__trackedEvents?.push(name);
    };
  });
}

// Root-absolute section hrefs: the shared header/footer render on every
// prerendered page, so `#pricing` must navigate to `/#pricing` from
// `/resources` (a bare hash would resolve against the current path).
const NAV = [
  { label: 'Features', href: '/#features' },
  { label: 'Audit trail', href: '/#audit-trail' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' },
];

const sectionId = (href: string) => href.slice(href.indexOf('#') + 1);

// keep e2e deterministic and offline-safe: the marketing snippet must never hit the network
test.beforeEach(async ({ context }) => {
  await context.route('https://plausible.io/**', (route) => route.abort());
});

test.describe('marketing site', () => {
  test('loads with the brand headline', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('AudDent — The Compliance Workbench for Dental Practices');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Walk into your next inspection with the evidence already in hand.' }),
    ).toBeVisible();
    await expect(page.getByRole('complementary', { name: 'Example compliance dashboard' })).toBeVisible();
  });

  test('nav links jump to their sections', async ({ page }) => {
    await page.goto('/');
    for (const link of NAV) {
      await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: link.label }).click();
      await expect(page.locator(`[id="${sectionId(link.href)}"]`)).toBeVisible();
    }
  });

  test('nav links work from other pages (root-absolute anchors)', async ({ page }) => {
    // trailing-slash forms: static hosts (nginx, DO App Platform) canonicalize
    // directory URLs to these via 301 — the client router must not collapse
    // them into the 404 page
    for (const from of ['/resources/', '/resources/dental-inspection-prep/', '/privacy/']) {
      await page.goto(from);
      await expect(page.getByRole('navigation', { name: 'Main' })).toBeAttached();
      await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Pricing' }).click();
      await expect(page).toHaveURL(/\/#pricing$/);
      // and actually scroll to the section, not land at the top
      await expect
        .poll(async () => page.evaluate(() => window.scrollY), { timeout: 5000 })
        .toBeGreaterThan(1000);
      // and the footer CTA comes back too
      await page.getByRole('contentinfo').getByRole('link', { name: 'Book a demo' }).click();
      await expect(page).toHaveURL(/\/#demo$/);
    }
  });

  test('every section has exactly one h2 anchor with a stable id', async ({ page }) => {
    await page.goto('/');
    for (const id of [
      'problem',
      'features',
      'audit-trail',
      'data',
      'how-it-works',
      'digest',
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
    await recordEvents(page);
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
    await expect(status).toContainText('Thanks, Dr. — one more step.');
    await expect(status).toContainText('dr.lee@brightsmile.example');
    await expect(page.getByRole('button', { name: 'Book my demo' })).toBeHidden();

    await page.waitForFunction(() => window.__trackedEvents?.includes('demo_request') === true);
  });

  test('checklist form validates empty fields, then confirms with a demo handoff', async ({ page }) => {
    await recordEvents(page);
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
    await expect(status).toContainText('One more step to get the Colorado checklist');
    await expect(status).toContainText('dr.lee@brightsmile.example');
    await expect(page.getByRole('link', { name: 'Book the 30-minute demo' })).toBeVisible();

    await page.waitForFunction(() => window.__trackedEvents?.includes('checklist_request') === true);
  });

  test('resources hub lists the guides and opens a full article', async ({ page }) => {
    await page.goto('/resources');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Inspection prep, without the guesswork' }),
    ).toBeVisible();

    await expect(page.locator('a[href^="/resources/"]')).toHaveCount(4);

    await page.getByRole('link', { name: 'How to prepare for a state dental board inspection' }).click();
    await expect(page).toHaveURL('/resources/dental-inspection-prep');
    await expect(
      page.getByRole('heading', { level: 1, name: 'How to prepare for a state dental board inspection' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'The 30-day countdown' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Get the state checklist' })).toBeVisible();

    await page.goto('/resources/no-such-guide');
    await expect(page.getByRole('heading', { name: 'This page doesn’t exist.' })).toBeVisible();
  });

  test('serves the resources RSS feed with every guide', async ({ request }) => {
    const response = await request.get('/rss.xml');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('xml');

    const xml = await response.text();
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('https://www.auditdent.example/resources');
    expect(xml.match(/<item>/g)).toHaveLength(4);
    for (const slug of [
      'dental-inspection-prep',
      'sterilization-what-inspectors-check',
      'osha-300-dental-practices',
      'dental-waterline-standards',
    ]) {
      expect(xml).toContain(`https://www.auditdent.example/resources/${slug}`);
    }
  });

  test('prerendered resources pages ship crawler-facing meta', async ({ request }) => {
    const hub = await request.get('/resources');
    expect(hub.status()).toBe(200);
    const hubHtml = await hub.text();
    expect(hubHtml).toContain('<title>Resources — Inspection prep guides | AudDent</title>');
    expect(hubHtml).toContain('<link rel="canonical" href="https://www.auditdent.example/resources" />');
    expect(hubHtml).toContain('og:title');
    expect(hubHtml).toContain('application/ld+json');
    // SSR content is present in #root before the client bundle takes over
    expect(hubHtml).toContain('Inspection prep, without the guesswork');

    const article = await request.get('/resources/dental-inspection-prep');
    expect(article.status()).toBe(200);
    const articleHtml = await article.text();
    expect(articleHtml).toContain(
      '<title>How to prepare for a state dental board inspection | AudDent Resources</title>',
    );
    expect(articleHtml).toContain('How to prepare for a state dental board inspection');
    expect(articleHtml).toContain('"dateModified": "2026-08-10"');
    expect(articleHtml).toContain('BreadcrumbList');
    expect(articleHtml).toContain('application/rss+xml');
  });

  test('prerendered privacy page ships crawler-facing meta', async ({ request }) => {
    const response = await request.get('/privacy');
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('<title>Privacy Policy | AudDent</title>');
    expect(html).toContain('<link rel="canonical" href="https://www.auditdent.example/privacy" />');
    expect(html).toContain('What we collect');
    expect(html).toContain('mailto:hello@auditdent.example');
    expect(html).toContain('BreadcrumbList');
  });

  test('serves security headers on the built site', async ({ request }) => {
    const response = await request.get('/');
    expect(response.status()).toBe(200);
    const headers = response.headers();
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['content-security-policy']).toContain("default-src 'self'");
    expect(headers['content-security-policy']).toContain('https://plausible.io');
  });

  test('sticky demo bar appears after scrolling past the hero', async ({ page }) => {
    await page.goto('/');
    const bar = page.getByRole('region', { name: 'Quick demo booking' });
    await expect(bar).toBeHidden();

    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(bar).toBeVisible();

    await bar.getByRole('link', { name: 'Book a 30-minute demo' }).click();
    await expect(page.locator('#demo')).toBeVisible();
  });

  test('unknown paths render the 404 page and link home', async ({ page }) => {
    await page.goto('/does-not-exist');
    await expect(page.getByRole('heading', { name: 'This page doesn’t exist.' })).toBeVisible();
    await expect(page.getByText('404')).toBeVisible();

    await page.getByRole('link', { name: 'Back to AudDent' }).click();
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
