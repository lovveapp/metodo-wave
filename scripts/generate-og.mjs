/**
 * Generates public/og-image.png by screenshotting the /og page
 * with Puppeteer (actual Recharts rendering).
 *
 * Usage: npm run generate-og
 */
import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PORT = 4399;
const URL  = `http://localhost:${PORT}/metodo-wave/og/`;

// ── Start astro dev ───────────────────────────────────────────────────────────
console.log('Starting dev server…');
const dev = spawn('npx', ['astro', 'dev', '--port', String(PORT)], {
  cwd: ROOT,
  stdio: ['ignore', 'pipe', 'pipe'],
});

dev.stderr.on('data', (d) => process.stderr.write(d));

await new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('Dev server timed out')), 30_000);
  dev.stdout.on('data', (data) => {
    const s = data.toString();
    process.stdout.write(s);
    if (s.includes(String(PORT))) { clearTimeout(t); resolve(); }
  });
});

// Give the server a moment to finish asset bundling
await new Promise((r) => setTimeout(r, 2000));

// ── Screenshot ────────────────────────────────────────────────────────────────
console.log(`Screenshotting ${URL}…`);
const browser = await puppeteer.launch({ headless: true });
const page    = await browser.newPage();

await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: 'networkidle0' });

// Hide Astro dev toolbar and any debug overlays
await page.addStyleTag({
  content: `
    astro-dev-toolbar,
    #astro-dev-toolbar,
    [data-astro-dev-toolbar],
    astro-dev-overlay { display: none !important; }
  `,
});

// Wait for Recharts SVG to be present
await page.waitForSelector('.recharts-surface', { timeout: 15_000 });

// Wait for fonts + chart animations to fully settle
await new Promise((r) => setTimeout(r, 3000));

const buf = await page.screenshot({ type: 'png' });
await browser.close();
dev.kill();

// ── Save ──────────────────────────────────────────────────────────────────────
const outPath = join(ROOT, 'public', 'og-image.png');
writeFileSync(outPath, buf);
console.log('✓  public/og-image.png generated (1200×630)');
