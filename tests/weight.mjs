// Peso de carga de cada sala (lo que descarga un visitante al abrirla y recorrerla).
//   npm run build && node tests/weight.mjs
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const exe = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(Boolean).find((p) => fs.existsSync(p));
const srv = http.createServer((q, r) => { let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); } const ext = path.extname(f); r.writeHead(200, { 'content-type': { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.json': 'application/json', '.woff2': 'font/woff2' }[ext] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise((ok) => srv.listen(0, '127.0.0.1', ok));
const b = await chromium.launch({ executablePath: exe });
const rows = [];
for (const p of ['/', '/tiempo', '/continentes', '/vida', '/dinosaurios', '/mexico', '/donde-vives', '/especie/trex', '/mitos']) {
  const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const bytes = { total: 0, img: 0, json: 0, font: 0, js: 0 };
  page.on('response', async (res) => {
    const len = (await res.body().catch(() => Buffer.alloc(0))).length;
    const t = res.headers()['content-type'] || '';
    bytes.total += len;
    if (t.includes('image')) bytes.img += len; else if (t.includes('json')) bytes.json += len; else if (t.includes('font')) bytes.font += len; else if (t.includes('javascript')) bytes.js += len;
  });
  const t0 = Date.now();
  await page.goto(`http://127.0.0.1:${srv.address().port}${p}`, { waitUntil: 'load' });
  const first = Date.now() - t0;
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 800) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } });
  await page.waitForLoadState('networkidle');
  const kb = (n) => `${Math.round(n / 1024)}`.padStart(5);
  rows.push(`${p.padEnd(16)} total ${kb(bytes.total)} KB · imágenes ${kb(bytes.img)} · mapas ${kb(bytes.json)} · fuentes ${kb(bytes.font)} · js ${kb(bytes.js)} · load ${first} ms`);
  await page.close();
}
console.log(rows.join('\n'));
await b.close(); srv.close();
