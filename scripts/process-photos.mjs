// Pasada local sobre las fotos ya descargadas (no usa la red):
//  · mide el borde para decidir la presentación: «recorte» (fondo transparente),
//    «lámina» (ilustración sobre fondo claro) o «fotografía» (lo demás);
//  · genera una versión de 640 px para tarjetas y listas.
// Se ejecuta al final de `npm run assets` y también por separado: `node scripts/process-photos.mjs`.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = path.join(ROOT, 'src/data/assets.json');

// Borde (4 % de cada lado): fracción transparente, luminancia media y cuánto varía.
async function borderStats(file) {
  const { data, info } = await sharp(file).resize(100, 100, { fit: 'fill' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const b = 4, vals = [];
  let n = 0, transp = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (x >= b && x < info.width - b && y >= b && y < info.height - b) continue;
    const i = (y * info.width + x) * 4; n++;
    if (data[i + 3] < 30) { transp++; continue; }
    vals.push(0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]);
  }
  const mean = vals.length ? vals.reduce((a, v) => a + v, 0) / vals.length : 0;
  const sd = vals.length ? Math.sqrt(vals.reduce((a, v) => a + (v - mean) ** 2, 0) / vals.length) : 0;
  return { transp: transp / n, mean, sd };
}

export async function processPhotos(manifest) {
  let plates = 0, cutouts = 0, made = 0;
  for (const list of Object.values(manifest.photos || {})) {
    for (const p of list) {
      const src = path.join(ROOT, 'public', p.file);
      const { transp, mean, sd } = await borderStats(src);
      // Recorte con transparencia → sin marco; fondo claro → lámina en papel; lo demás → fotografía.
      p.frame = transp > 0.5 ? 'cutout' : mean > 215 && sd < 65 ? 'plate' : 'photo';
      if (p.frame === 'plate') plates++;
      if (p.frame === 'cutout') cutouts++;
      const sm = p.file.replace(/\.webp$/, '-sm.webp');
      const out = path.join(ROOT, 'public', sm);
      if (!(await fs.access(out).then(() => true, () => false))) {
        await sharp(src).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 74 }).toFile(out);
        made++;
      }
      p.sm = sm;
    }
  }
  return { plates, cutouts, made };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const manifest = JSON.parse(await fs.readFile(MANIFEST, 'utf8'));
  const r = await processPhotos(manifest);
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 1));
  console.log(`Fotos: ${r.plates} láminas, ${r.cutouts} recortes, ${r.made} miniaturas nuevas.`);
}
