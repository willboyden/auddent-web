// Post-build prerender pass: writes real HTML for /resources,
// /resources/<slug>, and /privacy (per-page <title>, canonical, OG tags,
// JSON-LD) plus the /rss.xml feed into dist/. Each page is written as <dir>/index.html AND a
// <dir>.html sibling, so both /dir and /dir/ resolve to the real page on any
// static host (with or without an SPA rewrite rule).
//
// Styling: component styles are emotion (runtime-injected), so in Node the
// SSR pass emits them as inline <style data-emotion> tags inside the markup —
// the prerendered page is self-styled. The built CSS bundle (font-face + any
// static CSS) is inlined in <head> as well. The client bundle still loads and
// replaces #root — no hydration, just a full re-render of identical markup.
import { existsSync, readdirSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');

// TODO(followup 5): swap for the real domain when it exists.
const BASE_URL = 'https://www.auditdent.example';

function escapeXml(value) {
  return value.replace(/[<>&'"]/g, (char) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  })[char]);
}

function jsonLdBlock(graph) {
  // Escape `<` so a JSON string could never terminate the script element.
  const json = JSON.stringify(graph, null, 2).replace(/</g, '\\u003c');
  return `    <script type="application/ld+json">${json}</script>`;
}

function pageHtml({ title, description, canonical, ogType, jsonLd, body, css, js }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeXml(title)}</title>
    <meta name="description" content="${escapeXml(description)}" />
    <meta property="og:title" content="${escapeXml(title)}" />
    <meta property="og:description" content="${escapeXml(description)}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${BASE_URL}/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="theme-color" content="#0b2545" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" type="application/rss+xml" title="AudDent Resources" href="${BASE_URL}/rss.xml" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
${jsonLd}
    <style>${css}</style>
  </head>
  <body>
    <div id="root">${body}</div>
    <script defer data-domain="auditdent.example" src="https://plausible.io/js/script.js"></script>
    <script type="module" src="/assets/${js}"></script>
  </body>
</html>
`;
}

function buildFeed(articles, productName) {
  const byDateDesc = [...articles].sort((a, b) => b.updatedIso.localeCompare(a.updatedIso));
  const latestIso = byDateDesc[0].updatedIso;
  const rfc2822 = (iso) => new Date(`${iso}T00:00:00Z`).toUTCString();
  const items = byDateDesc
    .map((article) => {
      const link = `${BASE_URL}/resources/${article.slug}`;
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${link}</link>
      <description>${escapeXml(article.summary)}</description>
      <pubDate>${rfc2822(article.updatedIso)}</pubDate>
      <guid isPermaLink="true">${link}</guid>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(productName)} Resources</title>
    <link>${BASE_URL}/resources</link>
    <description>Inspection prep guides for dental practices — what state boards and OSHA actually check.</description>
    <language>en</language>
    <lastBuildDate>${rfc2822(latestIso)}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

if (!existsSync(distDir)) {
  console.error('dist/ not found — run `vite build` first.');
  process.exit(1);
}

const vite = await createServer({
  root,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, watch: null },
  optimizeDeps: { noDiscovery: true, include: [] },
});

try {
  const [entry, resources, content] = await Promise.all([
    vite.ssrLoadModule('/src/prerender-entry.tsx'),
    vite.ssrLoadModule('/src/data/resources.ts'),
    vite.ssrLoadModule('/src/data/content.ts'),
  ]);
  const { renderResourcesPage, renderArticlePage, renderPrivacyPage } = entry;
  const { RESOURCE_ARTICLES } = resources;
  const { PRODUCT_NAME } = content;

  const assetsDir = path.join(distDir, 'assets');
  const assets = readdirSync(assetsDir);
  const entryJs = assets.find((file) => file.startsWith('index-') && file.endsWith('.js'));
  if (!entryJs) {
    console.error(`Could not find the built entry chunk (index-*.js) in ${assetsDir}`);
    process.exit(1);
  }
  const cssFiles = assets.filter((file) => file.endsWith('.css')).sort();
  const css = cssFiles.map((file) => readFile(path.join(assetsDir, file), 'utf8')).join('\n');

  // Write both <dir>/index.html (served at /dir/) and <dir>.html (served at
  // /dir — the extensionless form that static resolvers, incl. vite preview,
  // look up). Both carry identical content; the canonical is extensionless.
  const writePage = async (relativePath, html) => {
    for (const filePath of [
      path.join(distDir, `${relativePath}.html`),
      path.join(distDir, relativePath, 'index.html'),
    ]) {
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, html, 'utf8');
    }
    console.log(`prerendered ${relativePath}/`);
  };

  const homeCrumb = { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` };

  await writePage(
    'resources',
    pageHtml({
      title: 'Resources — Inspection prep guides | AudDent',
      description:
        'Plain-language guides on what state boards and OSHA actually check, written for busy practices — not compliance vendors.',
      canonical: `${BASE_URL}/resources`,
      ogType: 'website',
      jsonLd: jsonLdBlock([
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Inspection prep resources',
          url: `${BASE_URL}/resources`,
          isPartOf: { '@type': 'WebSite', name: PRODUCT_NAME, url: `${BASE_URL}/` },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [homeCrumb, { '@type': 'ListItem', position: 2, name: 'Resources', item: `${BASE_URL}/resources` }],
        },
      ]),
      body: renderResourcesPage(),
      css,
      js: entryJs,
    }),
  );

  await writePage(
    'privacy',
    pageHtml({
      title: 'Privacy Policy | AudDent',
      description:
        'What AudDent collects when you request a demo or the inspection checklist, and what we do with it — plain language, no fine print.',
      canonical: `${BASE_URL}/privacy`,
      ogType: 'website',
      jsonLd: jsonLdBlock([
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Privacy Policy',
          url: `${BASE_URL}/privacy`,
          isPartOf: { '@type': 'WebSite', name: PRODUCT_NAME, url: `${BASE_URL}/` },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [homeCrumb, { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: `${BASE_URL}/privacy` }],
        },
      ]),
      body: renderPrivacyPage(),
      css,
      js: entryJs,
    }),
  );

  for (const article of RESOURCE_ARTICLES) {
    const canonical = `${BASE_URL}/resources/${article.slug}`;
    const title = `${article.title} | ${PRODUCT_NAME} Resources`;
    await writePage(
      path.join('resources', article.slug),
      pageHtml({
        title,
        description: article.summary,
        canonical,
        ogType: 'article',
        jsonLd: jsonLdBlock([
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.summary,
            dateModified: article.updatedIso,
            author: { '@type': 'Organization', name: PRODUCT_NAME },
            publisher: {
              '@type': 'Organization',
              name: PRODUCT_NAME,
              logo: { '@type': 'ImageObject', url: `${BASE_URL}/favicon.svg` },
            },
            mainEntityOfPage: canonical,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              homeCrumb,
              { '@type': 'ListItem', position: 2, name: 'Resources', item: `${BASE_URL}/resources` },
              { '@type': 'ListItem', position: 3, name: article.title, item: canonical },
            ],
          },
        ]),
        body: renderArticlePage(article),
        css,
        js: entryJs,
      }),
    );
  }

  await writeFile(path.join(distDir, 'rss.xml'), buildFeed(RESOURCE_ARTICLES, PRODUCT_NAME), 'utf8');
  console.log('prerendered rss.xml');
} finally {
  await vite.close();
}
process.exit(0);
