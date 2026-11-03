// Descarga y verifica los recursos externos de Paleopulso y los guarda en el repo,
// para que el sitio no dependa de servicios de terceros al visitarse.
//
//   node scripts/fetch-assets.mjs            → descarga solo lo que falta
//   node scripts/fetch-assets.mjs --force    → vuelve a descargar todo
//
// Fuentes:
//   PhyloPic (siluetas; solo licencias que permiten uso comercial)  https://www.phylopic.org
//   Wikimedia Commons (fotos; se guarda autoría y licencia)           https://commons.wikimedia.org
//   GPlates Web Service, modelo MERDITH2021 (costas y paleocoordenadas) https://gws.gplates.org
//   Paleobiology Database (rangos de aparición)                       https://paleobiodb.org
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { species, scaleRefs } from '../src/data/species.js';
import { periods, MAP_TIMES, mapTimeFor } from '../src/data/periods.js';
import { featured } from '../src/data/featured.js';
import { keyRefs } from '../src/data/refs.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public/assets');
const MANIFEST = path.join(ROOT, 'src/data/assets.json');
const FORCE = process.argv.includes('--force');
const UA = { 'User-Agent': 'Paleopulso/2.0 (https://github.com/MarioACo/paleopulso)' };
const MODEL = 'MERDITH2021';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url, type = 'json', tries = 6) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: UA, redirect: 'follow' });
      if (r.status === 404 || r.status === 400) return null;
      if (r.status === 429) { await sleep(6000 * (i + 1)); throw new Error(`429 ${url}`); }
      if (!r.ok) throw new Error(`${r.status} ${url}`);
      return type === 'json' ? await r.json() : type === 'text' ? await r.text() : Buffer.from(await r.arrayBuffer());
    } catch (e) {
      if (i === tries - 1) { console.warn('  ✗', e.message); return null; }
      await sleep(800 * (i + 1));
    }
  }
}
const exists = (f) => fs.access(f).then(() => true, () => false);
const stripHtml = (s = '') => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
async function pool(items, n, fn) {
  const q = [...items]; await Promise.all(Array.from({ length: n }, async () => { while (q.length) await fn(q.shift()); }));
}

const old = (await exists(MANIFEST)) ? JSON.parse(await fs.readFile(MANIFEST, 'utf8')) : {};
const manifest = { silhouettes: {}, photos: {}, paleo: {}, pbdb: {}, maps: {}, ...(FORCE ? {} : old) };
for (const d of ['silhouettes', 'photos', 'maps']) await fs.mkdir(path.join(OUT, d), { recursive: true });

// ── PhyloPic ────────────────────────────────────────────────
const LICENSE_NAMES = {
  'creativecommons.org/publicdomain/zero/1.0/': 'CC0 1.0',
  'creativecommons.org/publicdomain/mark/1.0/': 'Dominio público',
  'creativecommons.org/licenses/by/4.0/': 'CC BY 4.0',
  'creativecommons.org/licenses/by/3.0/': 'CC BY 3.0',
  'creativecommons.org/licenses/by-sa/3.0/': 'CC BY-SA 3.0',
};
const licenseName = (href = '') => Object.entries(LICENSE_NAMES).find(([k]) => href.includes(k))?.[1] || href;

// La raíz redirige a ?build=N; a veces ese build aún no está listo, así que se prueba N y N-1.
async function phylopicBuild() {
  const r = await fetch('https://api.phylopic.org/', { headers: UA, redirect: 'manual' });
  const n = Number(new URL(r.headers.get('location') || '/?build=0', 'https://api.phylopic.org').searchParams.get('build'));
  for (const b of [n, n - 1, n - 2]) if (b > 0 && (await get(`https://api.phylopic.org/images?build=${b}&page=0`))) return b;
  throw new Error('No se pudo obtener el build de PhyloPic');
}
const BUILD = await phylopicBuild();
// Silueta concreta elegida a mano por su UUID (p. ej. la persona de la escala).
async function phylopicImage(uuid) {
  const it = await get(`https://api.phylopic.org/images/${uuid}?build=${BUILD}&embed_specificNode=true`);
  if (!it?._links?.vectorFile) return null;
  const taxon = it._embedded?.specificNode?.names?.[0]?.map?.((p) => p.text).join(' ') || it._links.specificNode?.title || '';
  return { vector: it._links.vectorFile.href, uuid, taxon, query: 'uuid', exact: true, contributor: it._links.contributor?.title || it.attribution || 'Desconocido', attribution: it.attribution || null, license: licenseName(it._links.license?.href), licenseUrl: it._links.license?.href, page: `https://www.phylopic.org/images/${uuid}` };
}

// Entradas "Clado|Preferido": busca el clado y prefiere la silueta cuyo taxón contenga «Preferido».
async function phylopic(names, genus) {
  for (const entry of names) {
    if (entry.startsWith('uuid:')) { const hit = await phylopicImage(entry.slice(5)); if (hit) return hit; continue; }
    const [name, prefer] = entry.split('|');
    const nodes = await get(`https://api.phylopic.org/nodes?build=${BUILD}&filter_name=${encodeURIComponent(name.toLowerCase())}&page=0&embed_items=true`);
    const node = nodes?._embedded?.items?.[0];
    // La búsqueda es aproximada («Tiktaalik» devuelve Lota lota): exigir coincidencia de nombre.
    const nodeName = node?.names?.[0]?.[0]?.text?.toLowerCase() || '';
    if (!node || !nodeName.startsWith(name.toLowerCase())) continue;
    const imgs = await get(`https://api.phylopic.org/images?build=${BUILD}&filter_clade=${node.uuid}&filter_license_nc=false&page=0&embed_items=true&embed_specificNode=true`);
    const items = imgs?._embedded?.items || [];
    if (!items.length) continue;
    // Preferir silueta del propio taxón; si no, la primera del clado.
    const nameOf = (it) => it._embedded?.specificNode?.names?.[0]?.map?.((p) => p.text).join(' ') || '';
    const pick = (prefer && items.find((it) => nameOf(it).includes(prefer)))
      || items.find((it) => it._embedded?.specificNode?.uuid === node.uuid) || items[0];
    const vector = pick._links?.vectorFile?.href;
    if (!vector) continue;
    return {
      vector, uuid: pick.uuid,
      taxon: nameOf(pick) || pick._links?.specificNode?.title || name,
      query: name, exact: nameOf(pick).toLowerCase().startsWith(genus.toLowerCase()),
      contributor: pick._links?.contributor?.title || pick.attribution || 'Desconocido',
      attribution: pick.attribution || pick._links?.contributor?.title || null,
      license: licenseName(pick._links?.license?.href), licenseUrl: pick._links?.license?.href,
      page: `https://www.phylopic.org/images/${pick.uuid}`,
    };
  }
  return null;
}

// Limpia el SVG de PhyloPic: deja solo el dibujo, con color heredado (currentColor).
function cleanSvg(svg) {
  let s = svg.replace(/<\?xml[^>]*>/, '').replace(/<!DOCTYPE[^>]*>/, '').replace(/<metadata[\s\S]*?<\/metadata>/g, '');
  s = s.replace(/fill="#?[0-9a-fA-F]{3,6}"/g, 'fill="currentColor"').replace(/fill:\s*#?[0-9a-fA-F]{3,6}/g, 'fill:currentColor');
  s = s.replace(/\s(width|height)="[^"]*"/, '').replace(/\s(width|height)="[^"]*"/, '');
  return s.trim();
}

const silhouetteJobs = [...species, ...scaleRefs].filter((s) => s.silhouette);
console.log(`Siluetas (${silhouetteJobs.length}) · PhyloPic build ${BUILD}`);
await pool(silhouetteJobs, 4, async (s) => {
  const file = path.join(OUT, 'silhouettes', `${s.id}.svg`);
  if (!FORCE && manifest.silhouettes[s.id] && (await exists(file))) return;
  const hit = await phylopic(s.silhouette, s.name.split(' ')[0]);
  if (!hit) { console.warn(`  · sin silueta libre: ${s.id}`); delete manifest.silhouettes[s.id]; await fs.rm(file, { force: true }); return; }
  const svg = await get(hit.vector, 'text');
  if (!svg) return;
  await fs.writeFile(file, cleanSvg(svg));
  const vb = svg.match(/viewBox="([^"]+)"/)?.[1]?.split(/[\s,]+/).map(Number);
  const { vector, ...credit } = hit;
  manifest.silhouettes[s.id] = { file: `/assets/silhouettes/${s.id}.svg`, aspect: vb ? +(vb[2] / vb[3]).toFixed(3) : 2, ...credit };
  console.log(`  ✓ ${s.id} ← ${hit.taxon}${hit.exact ? '' : ' (taxón cercano)'} · ${hit.license}`);
});

// ── Wikimedia Commons ───────────────────────────────────────
async function commonsInfo(fileName) {
  const t = fileName.replace(/^(File|Archivo):/i, '');
  const j = await get(`https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(t)}&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1600&format=json&origin=*`);
  const page = j && Object.values(j.query.pages)[0];
  const ii = page?.imageinfo?.[0];
  if (!ii) return null;
  const m = ii.extmetadata || {};
  const lic = m.LicenseShortName?.value || '';
  if (/fair use|non-free/i.test(lic)) return null;
  return {
    url: ii.thumburl || ii.url, page: ii.descriptionurl, title: t,
    artist: stripHtml(m.Artist?.value) || 'Autor desconocido', license: lic || 'Ver fuente',
    licenseUrl: m.LicenseUrl?.value || null,
  };
}
async function wikiLeadImage(title) {
  for (const lang of ['es', 'en']) {
    const j = await get(`https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages|info&inprop=url&piprop=name&format=json&redirects=1&origin=*`);
    const p = j && Object.values(j.query.pages)[0];
    if (p?.pageimage) return { name: p.pageimage, article: p.fullurl, lang };
  }
  return null;
}
async function savePhoto(key, info, extra) {
  const file = path.join(OUT, 'photos', `${key}.webp`);
  const buf = await get(info.url, 'buffer');
  if (!buf) return null;
  const img = sharp(buf, { failOn: 'none' }).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true });
  const { width, height } = await img.webp({ quality: 80 }).toFile(file);
  return { file: `/assets/photos/${key}.webp`, w: width, h: height, credit: info.artist, license: info.license, licenseUrl: info.licenseUrl, source: info.page, ...extra };
}

console.log('Fotos');
// Portadas de Wikipedia que no son del animal (mapas de distribución, escalas…).
const NOT_A_PHOTO = /range|distribution|map[a_ ]|mapa|scale|size[_ ]comparison|tamaño|cladogram|timeline/i;
await pool(species, 1, async (s) => {
  if (!FORCE && manifest.photos[s.id]?.length) return;
  const list = [];
  const lead = s.wiki && (await wikiLeadImage(s.wiki));
  const curated = featured[s.id]?.media || [];
  for (const [i, c] of curated.entries()) {
    const info = await commonsInfo(c.file);
    if (!info) { console.warn(`  · no disponible: ${c.file}`); continue; }
    await sleep(700);
    const p = await savePhoto(`${s.id}-${c.kind}`, info, { kind: c.kind, label: c.label, note: c.note });
    if (p) list.push(p);
  }
  if (lead && NOT_A_PHOTO.test(lead.name)) console.warn(`  · portada descartada (${lead.name})`);
  else if (lead && !curated.some((c) => c.file.replace(/ /g, '_') === lead.name)) {
    const info = await commonsInfo(lead.name);
    if (info) {
      const p = await savePhoto(`${s.id}-lead`, info, { kind: 'lead', label: lead.name.replace(/_/g, ' ').replace(/\.\w+$/, '') });
      if (p) list.push(p);
    }
  }
  if (lead) s._article = lead.article;
  manifest.photos[s.id] = list;
  console.log(`  ${list.length ? '✓' : '·'} ${s.id} (${list.length})`);
});

// ── GPlates: costas por periodo + posición antigua de cada hallazgo ─────────
function simplifyRing(pts, eps) {
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop(); let max = 0, idx = -1;
    const [ax, ay] = pts[a], [bx, by] = pts[b], dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy);
    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i];
      // Anillo cerrado (a == b): distancia al punto; si no, distancia a la recta.
      const d = len ? Math.abs(dy * px - dx * py + bx * ay - by * ax) / len : Math.hypot(px - ax, py - ay);
      if (d > max) { max = d; idx = i; }
    }
    if (max > eps) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
const ringArea = (r) => Math.abs(r.reduce((s, [x, y], i) => { const [x2, y2] = r[(i + 1) % r.length]; return s + x * y2 - x2 * y; }, 0) / 2);
function simplifyGeo(fc, eps = 0.35, minArea = 0.6) {
  const polys = [];
  for (const f of fc.features || []) {
    const g = f.geometry; if (!g) continue;
    const list = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
    for (const poly of list) {
      const outer = simplifyRing(poly[0], eps).map(([x, y]) => [+x.toFixed(2), +y.toFixed(2)]);
      if (outer.length >= 4 && ringArea(outer) >= minArea) polys.push([outer]);
    }
  }
  return { type: 'Feature', properties: {}, geometry: { type: 'MultiPolygon', coordinates: polys } };
}

const mapTimes = [...new Set([...MAP_TIMES, ...periods.map((p) => p.map).filter((t) => t !== null)])].sort((a, b) => a - b);
console.log(`Paleomapas (${mapTimes.join(', ')} Ma)`);
for (const t of mapTimes) {
  const file = path.join(OUT, 'maps', `coast-${t}.json`);
  if (!FORCE && (await exists(file))) { manifest.maps[t] = `/assets/maps/coast-${t}.json`; continue; }
  const fc = await get(`https://gws.gplates.org/reconstruct/coastlines/?time=${t}&model=${MODEL}`);
  if (!fc) continue;
  const simple = simplifyGeo(fc);
  await fs.writeFile(file, JSON.stringify(simple));
  manifest.maps[t] = `/assets/maps/coast-${t}.json`;
  console.log(`  ✓ ${t} Ma · ${(JSON.stringify(simple).length / 1024).toFixed(0)} KB`);
}

console.log('Paleocoordenadas');
await pool(species, 4, async (s) => {
  const t = mapTimeFor(s.ma);
  if (t === null) return;
  const ok = (p) => p && Math.abs(p.lat) <= 90 && Math.abs(p.lon) <= 180;
  if (!FORCE && ok(manifest.paleo[s.id]) && Math.abs(manifest.paleo[s.id].time - t) <= 30) return;
  delete manifest.paleo[s.id];
  // GPlates devuelve 1000,1000 si el punto no pertenece a ninguna placa en esa edad: se prueban edades vecinas.
  const tries = MAP_TIMES.filter((x) => Math.abs(x - s.ma) <= 30).sort((x, y) => Math.abs(x - s.ma) - Math.abs(y - s.ma));
  for (const time of tries) {
    const j = await get(`https://gws.gplates.org/reconstruct/reconstruct_points/?points=${s.lon},${s.lat}&time=${time}&model=${MODEL}`);
    const c = j?.coordinates?.[0];
    const p = c && { time, lon: +c[0].toFixed(2), lat: +c[1].toFixed(2) };
    if (ok(p)) { manifest.paleo[s.id] = p; return; }
  }
  console.warn(`  · sin paleocoordenada: ${s.id}`);
});

// ── PBDB ────────────────────────────────────────────────────
console.log('Rangos PBDB');
await pool(species.filter((s) => s.pbdb), 4, async (s) => {
  if (!FORCE && manifest.pbdb[s.id]) return;
  const j = await get(`https://paleobiodb.org/data1.2/taxa/single.json?name=${encodeURIComponent(s.pbdb)}&show=app`);
  const r = j?.records?.[0];
  if (r && r.fea !== undefined) manifest.pbdb[s.id] = { taxon: r.nam, first: r.fea, last: r.lla, occurrences: r.noc, url: `https://paleobiodb.org/classic/checkTaxonInfo?taxon_no=${r.oid.replace('txn:', '')}` };
});

// ── Bibliografía ────────────────────────────────────────────
// Descripción original (PBDB) y estudios clave (src/data/refs.js), verificados en Crossref.
const norm = (t = '') => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const MAILTO = 'mailto=paleopulso@users.noreply.github.com';
async function crossref(q, year, must) {
  const expected = norm(q.split(' ')[0]).replace(/[^a-z]/g, '');
  const j = await get(`https://api.crossref.org/works?query.bibliographic=${encodeURIComponent(q)}&rows=12&select=DOI,title,issued,container-title,author&${MAILTO}`);
  const hits = [];
  for (const it of j?.message?.items || []) {
    const title = stripHtml(it.title?.[0] || '');
    const y = it.issued?.['date-parts']?.[0]?.[0];
    // Solo el artículo: fuera respuestas, comentarios, reseñas (F1000) y fe de erratas.
    if (/^(author response|response to|reply|comment|faculty opinions|correction|erratum|retraction)/i.test(title) || /^10\.3410\/|\.sa\d+$/i.test(it.DOI)) continue;
    const au = it.author || [];
    const first = norm(au[0]?.family || '').replace(/[^a-z]/g, '');
    if (!first.startsWith(expected.slice(0, 5))) continue;
    if (must.every((w) => norm(title).includes(norm(w))) && (!year || Math.abs(y - year) <= 1)) {
      const authors = au.length > 2 ? `${au[0].family} et al.` : au.map((a) => a.family).join(' y ');
      hits.push({ title, year: y, journal: it['container-title']?.[0] || '', authors, doi: it.DOI });
    }
  }
  // Preferir la versión publicada en revista sobre el preprint (bioRxiv 10.1101).
  return hits.find((h) => !h.doi.startsWith('10.1101/')) || hits[0] || null;
}
console.log('Bibliografía');
manifest.refs ||= {};
await pool(species, 2, async (s) => {
  if (!FORCE && manifest.refs[s.id]) return;
  const out = { original: null, studies: [] };
  if (s.pbdb) {
    const t = await get(`https://paleobiodb.org/data1.2/taxa/single.json?name=${encodeURIComponent(s.pbdb)}&show=attr,ref`);
    const r = t?.records?.[0];
    if (r?.ref) {
      const ref = r.rid && (await get(`https://paleobiodb.org/data1.2/refs/single.json?id=${r.rid.replace('ref:', '')}&show=both`))?.records?.[0];
      // Solo el DOI que registra PBDB (buscarlo por título dio falsos positivos), y aun así
      // se confirma en Crossref: PBDB tiene DOI erróneos (p. ej. Dart 1925 apunta a una revista de fisioterapia).
      let doi = ref?.doi || null;
      if (doi) {
        const w = (await get(`https://api.crossref.org/works/${encodeURIComponent(doi)}?${MAILTO}`))?.message;
        const y = w?.issued?.['date-parts']?.[0]?.[0];
        const fam = norm(w?.author?.[0]?.family || '').replace(/[^a-z]/g, '');
        const exp = norm(ref.al1 || '').replace(/[^a-z]/g, '');
        // Los libros escaneados (BHL) no traen autor en Crossref: basta el año.
        const authorOk = fam ? fam.startsWith(exp.slice(0, 5)) : doi.startsWith('10.5962/bhl');
        // También el título: hay homónimos (otro «McKenna 1997» en una revista de fisioterapia).
        const words = (t) => new Set(norm(stripHtml(t)).split(/[^a-z]+/).filter((x) => x.length > 4));
        const tw = words(ref.tit || ref.pbt || r.ref), cw = words(w?.title?.[0] || '');
        const titleOk = [...tw].filter((x) => cw.has(x)).length >= Math.max(1, Math.min(2, tw.size));
        if (!w || !authorOk || !titleOk || Math.abs(y - +ref.pby) > 2) { console.warn(`  · DOI de PBDB descartado: ${s.id} ${doi}`); doi = null; }
      }
      // PBDB da la fuente de su clasificación, que no siempre es la descripción original:
      // en la ficha se muestra como «Fuente en PBDB», junto a la autoría del nombre.
      out.original = { authority: r.att, citation: r.ref, doi };
    }
  }
  for (const k of keyRefs[s.id] || []) {
    const hit = await crossref(k.q, k.year, k.must);
    if (hit) out.studies.push({ ...hit, why: k.why });
    else console.warn(`  · sin confirmar en Crossref: ${s.id} · ${k.q.slice(0, 60)}`);
  }
  manifest.refs[s.id] = out;
});

for (const s of species) if (s._article) (manifest.articles ||= {})[s.id] = s._article;
await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 1));
const n = (o) => Object.keys(o || {}).length;
console.log(`\nListo: ${n(manifest.silhouettes)} siluetas, ${Object.values(manifest.photos).flat().length} fotos, ${n(manifest.maps)} mapas, ${n(manifest.paleo)} paleocoordenadas, ${n(manifest.pbdb)} rangos PBDB.`);

// ── México y vecinos (Natural Earth 1:50m, dominio público, vía world-atlas) ──
{
  const { feature } = await import('topojson-client');
  const topo = JSON.parse(await fs.readFile(path.join(ROOT, 'node_modules/world-atlas/countries-50m.json'), 'utf8'));
  const all = feature(topo, topo.objects.countries).features;
  const round = (g) => JSON.parse(JSON.stringify(g, (k, v) => (typeof v === 'number' ? +v.toFixed(2) : v)));
  const pick = (ids) => all.filter((f) => ids.includes(f.id)).map((f) => ({ type: 'Feature', id: f.id, properties: { name: f.properties.name }, geometry: round(f.geometry) }));
  // 484 México · 840 EUA · 320 Guatemala · 084 Belice · 192 Cuba · 340 Honduras · 222 El Salvador
  const fc = { type: 'FeatureCollection', features: pick(['484', '840', '320', '084', '192', '340', '222']) };
  await fs.writeFile(path.join(OUT, 'maps', 'mexico.json'), JSON.stringify(fc));
  manifest.maps.mexico = '/assets/maps/mexico.json';
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 1));
  console.log(`México: ${(JSON.stringify(fc).length / 1024).toFixed(0)} KB`);
}
