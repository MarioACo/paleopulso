// Pruebas en un navegador real sobre el sitio compilado (dist/).
//   npm run build && npm test
// Navegador: CHROME_PATH, o Chrome/Edge/Chromium instalados en rutas habituales.
// Las pruebas que dependen de servicios externos (GPlates, Nominatim) se omiten si no responden.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
if (!fs.existsSync(path.join(ROOT, 'index.html'))) { console.error('Falta dist/: ejecuta primero npm run build'); process.exit(1); }

const BROWSERS = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].filter(Boolean);
const exe = BROWSERS.find((p) => fs.existsSync(p));
if (!exe) { console.error('No encontré Chrome/Edge/Chromium. Indica uno con CHROME_PATH.'); process.exit(1); }

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = http.createServer((q, r) => {
  let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(r);
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const BASE = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ executablePath: exe, headless: true });
let failed = 0, skipped = 0, passed = 0;
async function test(name, fn, { network = false } = {}) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  try {
    const note = await fn(page);
    if (errors.length) throw new Error(`errores de JavaScript: ${errors.join(' | ')}`);
    passed++; console.log(`✓ ${name}${note ? ' · ' + note : ''}`);
  } catch (e) {
    if (network && /Timeout|net::|servicio/i.test(e.message)) { skipped++; console.log(`○ ${name} · omitida: el servicio externo no respondió`); }
    else { failed++; console.log(`✗ ${name}\n    ${e.message.split('\n')[0]}`); }
  } finally { await page.close(); }
}
const expect = (cond, msg) => { if (!cond) throw new Error(msg); };
const go = (page, p) => page.goto(BASE + p, { waitUntil: 'networkidle' });

// ── Todas las páginas cargan sin errores ni desbordes ───────
const pages = ['/', '/visita', '/colabora', '/tiempo', '/continentes', '/vida', '/dinosaurios', '/mexico', '/donde-vives', '/mitos', '/metodo', '/pasaporte', '/creditos', '/especie/trex', '/especie/hallucigenia', '/especie/ambar-chiapas'];
await test('Todas las salas cargan sin errores', async (page) => {
  for (const p of pages) {
    const r = await go(page, p);
    expect(r.status() === 200, `${p} respondió ${r.status()}`);
    expect(await page.locator('h1').count() === 1, `${p} no tiene un único h1`);
  }
  return `${pages.length} páginas`;
});
await test('Inglés: todas las salas en /en/ sin restos de la interfaz en español', async (page) => {
  // Frases de la interfaz que nunca deberían aparecer en inglés (los nombres de lugares sí pueden ir en español).
  const SPANISH = ['Ver la ficha', 'Toca un punto', 'Pieza del día', '¿Sabías que', 'En debate', 'Sin mapa', 'Siguiente', 'Comprobar', 'Archivo de vida', 'Sala mesozoica', 'Saltar al contenido', 'Cómo sabemos', 'Reconstrucción en vida', 'Fósil o montaje', 'Para seguir leyendo'];
  let n = 0;
  for (const p of pages) {
    const url = p === '/' ? '/en/' : `/en${p}`;
    const r = await go(page, url);
    expect(r.status() === 200, `${url} respondió ${r.status()}`);
    expect((await page.getAttribute('html', 'lang')) === 'en', `${url} sin lang="en"`);
    const text = await page.evaluate(() => document.body.innerText);
    const left = SPANISH.filter((s) => text.includes(s));
    expect(!left.length, `${url} contiene: ${left.join(', ')}`);
    n++;
  }
  await go(page, '/vida');
  await page.click('.lang-switch');
  await page.waitForLoadState('networkidle');
  expect(page.url().endsWith('/en/vida') || page.url().endsWith('/en/vida/'), `el selector llevó a ${page.url()}`);
  return `${n} páginas en inglés`;
});
await test('Móvil: sin desbordamiento horizontal y menú funcional', async () => {
  const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  try {
    for (const p of pages) {
      await go(m, p);
      const o = await m.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(o <= 1, `${p} se desborda ${o}px`);
    }
    // La barra superior no debe cortarse: el pasaporte tiene que quedar dentro de la pantalla.
    for (const p of ['/', '/en/']) {
      await go(m, p);
      const right = await m.evaluate(() => document.querySelector('.passport-chip').getBoundingClientRect().right);
      expect(right <= 390, `${p}: la barra se sale de la pantalla (${Math.round(right)} px)`);
    }
    await go(m, '/');
    await m.click('.menu-toggle');
    expect(await m.locator('#navLinks').isVisible(), 'el menú no se abre');
  } finally { await m.close(); }
});
await test('Imágenes locales sin enlaces rotos', async (page) => {
  let n = 0;
  for (const p of ['/', '/vida', '/especie/trex', '/mexico']) {
    await go(page, p);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } });
    const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.src).map((i) => i.src));
    expect(!broken.length, `rotas en ${p}: ${broken.slice(0, 3).join(', ')}`);
    n += await page.evaluate(() => document.images.length);
  }
  return `${n} imágenes revisadas`;
});

// ── Interacciones ───────────────────────────────────────────
await test('Reloj de la Tierra', async (page) => {
  await go(page, '/');
  await page.locator('.clock-list button').first().click();
  expect((await page.textContent('#clockCenter')) === '00:00:00', 'el origen de la Tierra no marca 00:00:00');
});
await test('Tiempo: el panel sigue el descenso', async (page) => {
  await go(page, '/tiempo');
  await page.evaluate(() => { document.getElementById('jurasico').scrollIntoView({ behavior: 'instant' }); scrollBy({ top: 200, behavior: 'instant' }); });
  await page.waitForTimeout(900);
  const depth = (await page.textContent('#pDepth')).trim();
  expect(/^(1[4-9]\d|20\d) Ma$/.test(depth), `profundidad inesperada: ${depth}`);
  expect(await page.locator('#pMap .land').count() > 0, 'no se dibujó el mapa');
  return depth;
});
await test('Máquina del tiempo: deslizar y reproducir', async (page) => {
  await go(page, '/continentes');
  await page.locator('#slider').fill('0');
  await page.waitForTimeout(1200);
  expect((await page.textContent('#tMa')) === '800 Ma', 'el inicio no es 800 Ma');
  await page.click('#play');
  await page.waitForTimeout(3200);
  const now = await page.textContent('#tMa');
  expect(now !== '800 Ma', 'la reproducción no avanza');
  return `800 Ma → ${now}`;
});
await test('Archivo: filtros y buscador', async (page) => {
  await go(page, '/vida');
  const n = async () => +(await page.textContent('#count'));
  const all = await n();
  await page.click('button[data-era="Mesozoico"]'); const meso = await n();
  await page.check('#mx'); const mx = await n();
  await page.fill('#q', 'coahuila'); const q = await n();
  expect(all > meso && meso > mx && mx >= q && q > 0, `conteos ${all}/${meso}/${mx}/${q}`);
  return `${all} → ${meso} → ${mx} → ${q}`;
});
await test('Comparador de tamaños', async (page) => {
  await go(page, '/dinosaurios');
  const count = () => page.locator('#scaleOut image, #scaleOut rect').count();
  const before = await count();
  await page.click('button[data-pick="ballena-azul"]');
  expect((await count()) > before, 'no se agregó la ballena');
});
await test('Ficha: pestañas de fotos y bibliografía con DOI', async (page) => {
  await go(page, '/especie/trex');
  await page.locator('[data-tab="1"]').click();
  expect(await page.locator('[data-photo="1"]').isVisible(), 'la pestaña no cambia la foto');
  const dois = await page.locator('.refs a[href^="https://doi.org/"]').count();
  expect(dois >= 2, `esperaba ≥2 DOI, hay ${dois}`);
});
await test('Mitos: marcador', async (page) => {
  await go(page, '/mitos');
  await page.locator('.myth').first().locator('[data-guess="mito"]').click();
  expect((await page.textContent('#hits')) === '1', 'no contó el acierto');
});
await test('Pasaporte: sellos y examen', async (page) => {
  for (const p of ['/', '/tiempo', '/mexico']) await go(page, p);
  await go(page, '/pasaporte');
  expect((await page.locator('.stamp.got').count()) >= 3, 'faltan sellos');
  expect(await page.locator('#qNext').isHidden(), '«Siguiente» visible antes de responder');
  await page.locator('#qOpts button').first().click();
  expect(await page.locator('#qWhy').isVisible(), 'no muestra la explicación');
});
await test('México: tocar un yacimiento', async (page) => {
  await go(page, '/mexico');
  await page.locator('#mxMap [data-site="chicxulub"]').click({ force: true });
  expect((await page.textContent('#mxCard .mx-name')) === 'Cráter de Chicxulub', 'la tarjeta no cambió');
});

// ── Con servicios externos ──────────────────────────────────
await test('¿Qué había donde vives? (GPlates en vivo)', async (page) => {
  await go(page, '/donde-vives');
  await page.click('button[data-name="Saltillo"]');
  await page.waitForSelector('#journey:not([hidden])', { timeout: 45000 }).catch(() => { throw new Error('Timeout: servicio'); });
  const t = await page.textContent('#rTitle');
  expect(/Saltillo estaba en \d/.test(t), `título inesperado: ${t}`);
  expect(await page.locator('#paleo .you').count() === 1, 'no aparece el punto «Tú»');
  return t;
}, { network: true });

await browser.close(); server.close();
console.log(`\n${passed} correctas · ${failed} fallidas · ${skipped} omitidas · navegador: ${path.basename(exe)}`);
process.exit(failed ? 1 : 0);
