/* eslint-disable no-undef -- page.evaluate callbacks below execute in the browser context */
import { chromium } from '@playwright/test';
const PREVIEW_PORT = process.env.PREVIEW_PORT || '4173';

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
const page = await context.newPage();

// Phone-width overflow check across every public route. /404.html is the
// real file (vite preview serves the SPA fallback for unknown paths).
const pages = ['/', '/resources', '/resources/dental-inspection-prep', '/privacy', '/404.html'];
for (const path of pages) {
  const probe = await context.newPage();
  await probe.goto(`http://127.0.0.1:${PREVIEW_PORT}${path}`, { waitUntil: 'networkidle' });
  const result = await probe.evaluate(() => {
    const doc = document.documentElement;
    return {
      scrollWidth: doc.scrollWidth,
      overflow: doc.scrollWidth > window.innerWidth,
      h1: document.querySelector('h1')?.textContent.trim().slice(0, 60) ?? null,
    };
  });
  console.log(`${path}: overflow=${result.overflow} scrollWidth=${result.scrollWidth} h1="${result.h1}"`);
  await probe.close();
}

await page.goto(`http://127.0.0.1:${PREVIEW_PORT}/`, { waitUntil: 'networkidle' });

const metrics = await page.evaluate(() => {
  const doc = document.documentElement;
  const overflow = doc.scrollWidth > window.innerWidth;
  const offenders = [];
  if (overflow) {
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1)) {
        offenders.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 20)} w=${Math.round(r.width)}`);
      }
    });
  }
  const order = Array.from(document.querySelectorAll('main > section')).map((s) => s.id);
  const h1 = document.querySelector('h1');
  const font = h1 ? getComputedStyle(h1).fontFamily : null;
  const interLoaded = document.fonts.check('700 52px Inter');
  return { overflow, innerWidth: window.innerWidth, scrollWidth: doc.scrollWidth, offenders: offenders.slice(0, 10), order, font, interLoaded };
});
console.log(JSON.stringify(metrics, null, 2));

const wide = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page2 = await wide.newPage();
await page2.goto(`http://127.0.0.1:${PREVIEW_PORT}/`, { waitUntil: 'networkidle' });
const smallText = await page2.evaluate(() => {
  const bad = [];
  document.querySelectorAll('main p, main li, main span, main a, main button').forEach((el) => {
    const cs = getComputedStyle(el);
    const px = parseFloat(cs.fontSize);
    if (el.textContent.trim().length > 3 && px < 13 && cs.display !== 'none') {
      bad.push(`${el.tagName.toLowerCase()}: ${px}px "${el.textContent.trim().slice(0, 40)}"`);
    }
  });
  return bad.slice(0, 12);
});
console.log('small-text (desktop):', JSON.stringify(smallText, null, 2));
await browser.close();
