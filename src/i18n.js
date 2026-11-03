// Idiomas del museo: español (raíz) e inglés (/en/).
// Los datos en español viven en src/data/*.js; los textos en inglés en src/data/en/*.js.
import { species as speciesEs, scaleRefs as refsEs } from './data/species.js';
import { periods as periodsEs, extinctions as extEs, eras as erasEs, strata as strataEs, EARTH_AGE } from './data/periods.js';
import { speciesEn, continentEn } from './data/en/species.js';
import { periodsEn, erasEn, extinctionsEn } from './data/en/content.js';

export const LANGS = ['es', 'en'];
export const LOCALE = { es: 'es-MX', en: 'en-US' };

// T('texto', 'text') según el idioma.
export const tr = (lang) => (es, en) => (lang === 'en' ? en : es);

// Ruta en el idioma: '/vida' → '/en/vida'.
export const L = (lang, p = '/') => (lang === 'en' ? (p === '/' ? '/en/' : `/en${p}`) : p);
// Quita el prefijo de idioma de una ruta.
export const stripLang = (p) => p.replace(/^\/en(\/|$)/, '/');

const REF_NAMES_EN = { humano: 'Person', autobus: 'Bus', 'ballena-azul': 'Blue whale', elefante: 'African elephant' };
const REF_NOTES_EN = { humano: '1.70 m tall', autobus: '12 m', 'ballena-azul': '≈ 25 m (living)', elefante: '≈ 6–7 m with trunk' };

export function speciesL(lang) {
  if (lang !== 'en') return speciesEs;
  return speciesEs.map((s) => ({ ...s, ...speciesEn[s.id], continent: continentEn[s.continent] || s.continent, continentEs: s.continent }));
}
export const speciesByIdL = (lang) => Object.fromEntries(speciesL(lang).map((s) => [s.id, s]));
export function scaleRefsL(lang) {
  return lang === 'en' ? refsEs.map((r) => ({ ...r, name: REF_NAMES_EN[r.id], note: REF_NOTES_EN[r.id] })) : refsEs;
}
export function periodsL(lang) {
  if (lang !== 'en') return periodsEs;
  return periodsEs.map((p) => ({ ...p, ...periodsEn[p.id], groupEs: p.group }));
}
export const periodByIdL = (lang) => Object.fromEntries(periodsL(lang).map((p) => [p.id, p]));
export const strataL = (lang) => { const by = periodByIdL(lang); return strataEs.map((p) => by[p.id]); };
export const erasL = (lang) => (lang === 'en' ? erasEs.map((e) => ({ ...e, label: erasEn[e.id] })) : erasEs);
export const extinctionsL = (lang) => (lang === 'en' ? extEs.map((e) => ({ ...e, ...extinctionsEn[e.id], range: e.range.replace(' %', '%') })) : extEs);

export function formatMaL(ma, lang) {
  const loc = LOCALE[lang];
  if (lang !== 'en') {
    if (ma === 0) return 'hoy';
    if (ma < 0.01) return `hace ${Math.round(ma * 1e6).toLocaleString(loc)} años`;
    if (ma < 1) return `hace ${Math.round(ma * 1000).toLocaleString(loc)} mil años`;
    return `${ma.toLocaleString(loc, { maximumFractionDigits: 2 })} Ma`;
  }
  if (ma === 0) return 'today';
  if (ma < 0.01) return `${Math.round(ma * 1e6).toLocaleString(loc)} years ago`;
  if (ma < 1) return `${Math.round(ma * 1000).toLocaleString(loc)},000 years ago`;
  return `${ma.toLocaleString(loc, { maximumFractionDigits: 2 })} Ma`;
}
export const numL = (n, lang, opts) => n.toLocaleString(LOCALE[lang], opts);
export { EARTH_AGE };
