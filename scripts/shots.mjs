import { chromium } from '@playwright/test';
import { ogConfig } from './og-config.mjs';
const PREVIEW_PORT = process.env.PREVIEW_PORT || '4173';

const BASE = `http://127.0.0.1:${PREVIEW_PORT}`;
const browser = await chromium.launch();

for (const [name, viewport] of [
  ['desktop', { width: 1280, height: 900 }],
  ['mobile', { width: 375, height: 812 }],
]) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `shots/${name}-full.png`, fullPage: true });
  await page.screenshot({ path: `shots/${name}-hero.png` });
  await page.goto(`${BASE}/resources`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `shots/${name}-resources.png`, fullPage: true });
  if (name === 'desktop') {
    await page.goto(`${BASE}/resources/${ogConfig.articleSlug}`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `shots/desktop-article.png`, fullPage: true });
    await page.goto(`${BASE}/privacy`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `shots/desktop-privacy.png`, fullPage: true });
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await page.locator('#demo').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `shots/desktop-demo.png` });
    await page.goto(`${BASE}/404.html`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `shots/desktop-404.png` });
  }
  await context.close();
}
await browser.close();
console.log('done');
