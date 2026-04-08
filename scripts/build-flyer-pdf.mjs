#!/usr/bin/env node
/**
 * build-flyer-pdf.mjs
 *
 * flyer.html を A4 2ページの PDF に変換してリポジトリルートに出力する。
 *
 * 使い方:
 *   npx playwright install chromium   # 初回のみ
 *   node scripts/build-flyer-pdf.mjs
 *
 * 出力: flyer.pdf
 */
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const htmlPath = path.join(repoRoot, 'flyer.html');
const pdfPath = path.join(repoRoot, 'flyer.pdf');

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });
  console.log(`Generated: ${pdfPath}`);
} finally {
  await browser.close();
}
