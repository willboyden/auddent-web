import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Security headers for the built site (vite preview mirrors it; the deploy
// host must set the same headers — FOLLOWUPS.md #5).
//
// CSP notes:
// - style-src 'unsafe-inline': emotion injects runtime <style>/CSSOM rules
//   (and the prerendered pages carry inline <style data-emotion> tags).
// - script-src: only our bundle + the Plausible snippet. Inline JSON-LD
//   scripts are exempt (non-JS script type). Playwright's addInitScript is
//   injected out-of-band (CDP) and bypasses CSP.
// - If lead capture is wired to an external form service (FOLLOWUPS.md #4),
//   add that origin to form-action + connect-src.
const productionHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' https://plausible.io",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self' https://plausible.io",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// The dev server injects inline module scripts (react-refresh preamble, HMR
// client) that the strict CSP would block — CSP is omitted there (localhost
// only); the rest still apply.
const devHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 5199,
    strictPort: true,
    headers: devHeaders,
  },
  preview: {
    port: 4173,
    strictPort: true,
    headers: productionHeaders,
  },
});
