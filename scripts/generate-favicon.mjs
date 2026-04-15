/**
 * Generates public/favicon.png + public/favicon.svg from the W lettermark.
 * Uses JetBrains Mono Bold via Google Fonts + Puppeteer.
 *
 * Usage: npm run generate-favicon
 */
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SIZE = 512;

const html = `<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: ${SIZE}px;
      height: ${SIZE}px;
      background: #09090b;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .letter {
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      font-weight: 700;
      font-size: 390px;
      color: #06b6d4;
      line-height: 1;
      user-select: none;
    }
  </style>
</head>
<body><span class="letter">W</span></body>
</html>`;

console.log('Rendering W lettermark…');

const browser = await puppeteer.launch({ headless: true });
const page    = await browser.newPage();

await page.setViewport({ width: SIZE, height: SIZE, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle0' });

// Let the font fully paint
await new Promise((r) => setTimeout(r, 600));

const buf = await page.screenshot({ type: 'png' });
await browser.close();

// ── Save 32×32 PNG favicon ────────────────────────────────────────────────────
const favicon32 = await sharp(buf).resize(32, 32).png().toBuffer();
writeFileSync(join(ROOT, 'public', 'favicon.png'), favicon32);

// ── Save 180×180 for Apple touch icon ────────────────────────────────────────
const favicon180 = await sharp(buf).resize(180, 180).png().toBuffer();
writeFileSync(join(ROOT, 'public', 'apple-touch-icon.png'), favicon180);

// ── SVG favicon (inline, no external deps — scales perfectly at any size) ────
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#09090b"/>
  <text
    x="16" y="25"
    text-anchor="middle"
    font-family="'JetBrains Mono', 'Courier New', monospace"
    font-weight="700"
    font-size="24"
    fill="#06b6d4"
  >W</text>
</svg>`;
writeFileSync(join(ROOT, 'public', 'favicon.svg'), svg);

console.log('✓  favicon.png (32×32)');
console.log('✓  apple-touch-icon.png (180×180)');
console.log('✓  favicon.svg');
