import { chromium } from '@playwright/test';

const browser = await chromium.launch();

for (const [name, viewport] of [
  ['desktop', { width: 1280, height: 900 }],
  ['mobile', { width: 375, height: 812 }],
]) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `shots/${name}-full.png`, fullPage: true });
  await page.screenshot({ path: `shots/${name}-hero.png` });
  await context.close();
}
await browser.close();
console.log('done');
