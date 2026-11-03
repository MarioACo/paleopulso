// Auditoría de accesibilidad con axe-core (WCAG 2.1 A/AA) sobre el sitio compilado.
//   npm run build && node tests/a11y.mjs      (falla si hay problemas graves o críticos)
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from 'playwright-core';
const require = createRequire(import.meta.url);
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const exe = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(Boolean).find((p) => fs.existsSync(p));
const T = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.json': 'application/json', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise((ok) => srv.listen(0, '127.0.0.1', ok));
const b = await chromium.launch({ executablePath: exe });
const pages = (process.argv[2] || '/,/visita,/colabora,/tiempo,/continentes,/vida,/dinosaurios,/mexico,/donde-vives,/mitos,/metodo,/pasaporte,/creditos,/especie/trex,/especie/estromatolitos,/en/,/en/vida,/en/especie/trex,/en/donde-vives').split(',');
let serious = 0;
for (const p of pages) {
  const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`http://127.0.0.1:${srv.address().port}${p}`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 20)); } scrollTo({ top: 0, behavior: 'instant' }); });
  await page.waitForTimeout(900);
  await page.addScriptTag({ content: AXE });
  const res = await page.evaluate(() => window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] }));
  const bad = res.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
  serious += bad.length;
  console.log(`${bad.length ? '✗' : '✓'} ${p}`);
  for (const v of res.violations) console.log(`   ${v.impact.padEnd(8)} ${v.id} (${v.nodes.length}) ${v.nodes[0]?.target?.join(' ')} ${v.nodes[0]?.any?.[0]?.message?.slice(0, 110) || ''}`);
  await page.close();
}
await b.close(); srv.close();
process.exit(serious ? 1 : 0);
