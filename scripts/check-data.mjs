// Verificación de coherencia de los datos (se ejecuta con `npm run check`).
// Falla si algo es incoherente; avisa si una edad difiere del rango de PBDB.
import fs from 'node:fs';
import { species, speciesById } from '../src/data/species.js';
import { periodById, periods } from '../src/data/periods.js';
import { myths } from '../src/data/myths.js';
import { quiz } from '../src/data/quiz.js';

const assets = JSON.parse(fs.readFileSync(new URL('../src/data/assets.json', import.meta.url)));
const errors = [], warnings = [];
const ids = new Set();

for (const s of species) {
  if (ids.has(s.id)) errors.push(`id repetido: ${s.id}`);
  ids.add(s.id);
  const p = periodById[s.period];
  if (!p) { errors.push(`${s.id}: periodo desconocido «${s.period}»`); continue; }
  if (s.ma > p.start || s.ma < p.end) errors.push(`${s.id}: ${s.ma} Ma está fuera de ${p.name} (${p.start}–${p.end})`);
  if (Math.abs(s.lat) > 90 || Math.abs(s.lon) > 180) errors.push(`${s.id}: coordenadas inválidas`);
  for (const k of ['name', 'summary', 'fact', 'place', 'country', 'continent', 'habitat', 'group']) if (!s[k]) errors.push(`${s.id}: falta ${k}`);
  const pal = assets.paleo?.[s.id];
  if (pal && (Math.abs(pal.lat) > 90 || Math.abs(pal.lon) > 180)) errors.push(`${s.id}: paleocoordenada inválida (${pal.lat}, ${pal.lon})`);
  if (pal && !assets.maps?.[pal.time]) errors.push(`${s.id}: falta el mapa de ${pal.time} Ma`);
  const r = assets.pbdb?.[s.id];
  // PBDB da rangos del género completo; tolerancia de 3 Ma o 10 %.
  if (r && !s.pbdbNote) {
    const tol = Math.max(3, s.ma * 0.1);
    if (s.ma > r.first + tol || s.ma < r.last - tol) warnings.push(`${s.id}: ${s.ma} Ma vs PBDB ${r.taxon} ${r.first}–${r.last} Ma`);
  }
  for (const f of [...(assets.photos?.[s.id] || []), assets.silhouettes?.[s.id]].filter(Boolean)) {
    if (!fs.existsSync(new URL(`../public${f.file}`, import.meta.url))) errors.push(`${s.id}: falta archivo ${f.file}`);
    if (!f.license) errors.push(`${s.id}: ${f.file} sin licencia`);
  }
}
for (const [id, r] of Object.entries(assets.refs || {})) {
  if (!speciesById[id]) errors.push(`referencias de una pieza inexistente: ${id}`);
  for (const st of r.studies) if (!st.doi || !st.title || !st.year) errors.push(`${id}: estudio incompleto`);
}
for (const m of myths) if (m.species && !speciesById[m.species]) errors.push(`mito con especie inexistente: ${m.species}`);
for (const q of quiz) if (!(q.a >= 0 && q.a < q.o.length)) errors.push(`pregunta con respuesta inválida: ${q.q}`);
for (let i = 1; i < periods.length; i++) if (periods[i].start > periods[i - 1].start && periods[i].rank === 'Periodo' && periods[i - 1].rank === 'Periodo') errors.push(`orden de periodos: ${periods[i].id}`);

for (const w of warnings) console.warn('⚠', w);
for (const e of errors) console.error('✗', e);
console.log(`${species.length} especies · ${myths.length} mitos · ${quiz.length} preguntas · ${errors.length} errores · ${warnings.length} avisos`);
if (errors.length) process.exit(1);
