// Linkrot guard (docs/plans/state-checklist.md): resolves every primary
// source the state checklists cite — each item's referenceUrl plus each
// state's boardUrl. A dead citation is a gate failure: the checklists are a
// compliance deliverable and their sources must be live.
//
// Bot-walled domains (cdc.gov, mass.gov) reject automated/datacenter clients
// with 403 even for live pages; they are skipped with a logged warning and
// are spot-checked manually under the plan's two-reviewer rule.
//
// Results are cached for 7 days (scripts/linkrot-cache.json, gitignored) so
// the gate does not hammer state agencies on every run.
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'linkrot-cache.json');
const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const TIMEOUT_MS = 15000;
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
// Domains that 403 automated clients even for live pages (see header).
const BOT_WALL_HOSTS = new Set(['cdc.gov', 'mass.gov']);

function isBotWalled(url) {
  const host = new URL(url).hostname.toLowerCase();
  return [...BOT_WALL_HOSTS].some((walled) => host === walled || host.endsWith(`.${walled}`));
}

// State agencies sometimes defeat Node's fetch: invalid-to-Node certificate
// chains (UNABLE_TO_VERIFY_LEAF_SIGNATURE) or TLS stacks that reject Node's
// client hello (ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR). curl uses the system
// trust store and a real HTTP client, so any fetch-level failure retries via
// curl. A genuinely dead link fails both paths.
function curlStatus(url) {
  return new Promise((resolve) => {
    execFile(
      'curl',
      ['-s', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', String(TIMEOUT_MS / 1000), '-L', `-A`, USER_AGENT, url],
      { timeout: TIMEOUT_MS + 5000 },
      (error, stdout) => resolve(error ? 0 : Number(stdout.trim())),
    );
  });
}

async function checkUrl(url) {
  // Returns { ok, status, note } — ok=false also for network failures.
  const headers = { 'user-agent': USER_AGENT };
  let fetchNote = '';
  for (const method of ['HEAD', 'GET']) {
    try {
      const response = await fetch(url, {
        method,
        headers,
        redirect: 'follow',
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (response.status >= 200 && response.status < 400) {
        return { ok: true, status: response.status };
      }
      if (response.status === 405 || response.status === 501) continue; // HEAD not allowed
      return { ok: false, status: response.status };
    } catch (error) {
      fetchNote = error?.cause?.code ?? error?.name ?? String(error);
      continue;
    }
  }
  // fetch-level failure (TLS / network) — retry with the system trust store.
  const status = await curlStatus(url);
  if (status >= 200 && status < 400) {
    return { ok: true, status, note: `curl fallback (fetch: ${fetchNote})` };
  }
  return { ok: false, status, note: `fetch: ${fetchNote}; curl: ${status || 'unreachable'}` };
}

async function loadCache() {
  if (!existsSync(CACHE_FILE)) return {};
  try {
    return JSON.parse(await readFile(CACHE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

if (!existsSync(path.join(root, 'src', 'data', 'checklists', 'index.ts'))) {
  console.error('src/data/checklists/index.ts not found — nothing to check.');
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
  const { CHECKLIST_ITEMS, CHECKLIST_STATES } = await vite.ssrLoadModule('/src/data/checklists/index.ts');

  const boardUrls = CHECKLIST_STATES.map((state) => state.boardUrl);
  const allUrls = [...new Set([...CHECKLIST_ITEMS.map((item) => item.referenceUrl), ...boardUrls])];

  const cache = await loadCache();
  const now = Date.now();
  const failures = [];
  const skipped = [];
  let checked = 0;
  let cached = 0;

  for (const url of allUrls) {
    if (isBotWalled(url)) {
      skipped.push(url);
      continue;
    }
    const entry = cache[url];
    if (entry && typeof entry.checkedAtMs === 'number' && now - entry.checkedAtMs < TTL_MS) {
      cached += 1;
      if (!entry.ok) failures.push({ url, status: entry.status, note: 'cached failure' });
      continue;
    }
    checked += 1;
    const result = await checkUrl(url);
    cache[url] = { ok: result.ok, status: result.status, checkedAtMs: now };
    if (!result.ok) failures.push({ url, status: result.status, note: result.note });
  }

  await writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');

  for (const url of skipped) {
    console.log(`linkrot: skipped (bot-walled domain, spot-check manually) ${url}`);
  }
  console.log(`linkrot: ${allUrls.length} unique URLs — ${checked} checked now, ${cached} from cache, ${skipped.length} skipped.`);

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`linkrot: DEAD ${failure.url} (status ${failure.status}${failure.note ? `, ${failure.note}` : ''})`);
    }
    process.exitCode = 1;
  } else {
    console.log('linkrot: all cited sources resolve.');
  }
} finally {
  await vite.close();
}
process.exit(process.exitCode);
