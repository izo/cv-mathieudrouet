import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseURL = process.env.PDF_BASE_URL || 'http://127.0.0.1:4321';
const targets = [
  { path: '/', file: 'CV-Mathieu-Drouet-FR.pdf', lang: 'fr' },
  { path: '/en/', file: 'CV-Mathieu-Drouet-EN.pdf', lang: 'en' },
];

await mkdir('public', { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  for (const target of targets) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(new URL(target.path, baseURL).href, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
    await page.evaluate(async () => { await document.fonts.ready; });
    await page.pdf({
      path: `public/${target.file}`,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      tagged: true,
      outline: true,
    });
    await page.close();
    console.log(`Generated public/${target.file}`);
  }
} finally {
  await browser.close();
}
