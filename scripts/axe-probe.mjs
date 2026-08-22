import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
await page.goto('http://127.0.0.1:4173/');
const results = await new AxeBuilder({ page }).analyze();
for (const v of results.violations) {
  console.log(`\n== ${v.id} (${v.impact}) ${v.help}`);
  for (const n of v.nodes) {
    console.log('  target:', n.target.join(' '));
    console.log('  text:', (n.html || '').slice(0, 100).replace(/\s+/g, ' '));
    console.log('  data:', JSON.stringify(n.any?.[0]?.data || {}));
  }
}
await browser.close();
