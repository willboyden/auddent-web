import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// Guards the static files the deploy host serves that vite preview hides
// behind the SPA fallback: the custom 404 page and the sitemap.
const publicDir = path.resolve(process.cwd(), 'public');

describe('deploy static files', () => {
  it('ships a self-contained 404 page that mirrors the client 404', () => {
    const html = readFileSync(path.join(publicDir, '404.html'), 'utf8');
    expect(html).toContain('<title>Page not found | AudDent</title>');
    expect(html).toContain('noindex');
    expect(html).toContain('This page doesn’t exist.');
    expect(html).toContain('href="/"');
    expect(html).toContain('Back to AudDent');
  });

  it('lists the privacy page and every resource article in the sitemap', () => {
    const xml = readFileSync(path.join(publicDir, 'sitemap.xml'), 'utf8');
    for (const loc of [
      '/resources',
      '/resources/dental-inspection-prep',
      '/resources/sterilization-what-inspectors-check',
      '/resources/osha-300-dental-practices',
      '/resources/dental-waterline-standards',
      '/checklist/california',
      '/checklist/texas',
      '/checklist/florida',
      '/checklist/massachusetts',
      '/privacy',
    ]) {
      expect(xml).toContain(`<loc>https://www.auditdent.example${loc}</loc>`);
    }
  });
});
