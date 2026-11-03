// Acceso a los recursos descargados (src/data/assets.json) y utilidades de presentación.
import assets from '../data/assets.json';
import { periodById } from '../data/periods.js';
import { species } from '../data/species.js';

export { assets };

export const silhouetteOf = (id) => assets.silhouettes?.[id] || null;
// Las portadas de Wikipedia se clasifican por su nombre de archivo: reconstrucción o evidencia.
const LIFE_RE = /reconstruc|restoration|life|vida|paleoart|artist|render|\b(NT|TD|BW)\b/i;
const EVID_RE = /skelet|esquelet|skull|cr[aá]neo|fossil|f[oó]sil|holotyp|specimen|mount|bones?|teeth|tooth|museum|museo|cast|slab|stromatol|impres/i;
// Revisadas a mano (hoja de contactos) donde el nombre del archivo no lo dice.
const LEAD_KIND = {
  grypania: 'evidence', hallucigenia: 'evidence', dickinsonia: 'evidence', trilobites: 'evidence', tiktaalik: 'evidence',
  archaeopteris: 'evidence', dimetrodon: 'evidence', arthropleura: 'evidence', inostrancevia: 'evidence', lystrosaurus: 'evidence',
  ichthyosaurus: 'evidence', allosaurus: 'evidence', herrerasaurus: 'evidence', iguanodon: 'evidence', quetzalcoatlus: 'evidence',
  mosasaurus: 'evidence', glyptodon: 'evidence', mamut: 'evidence', tlatolophus: 'evidence', eryops: 'evidence', 'ambar-chiapas': 'evidence',
  cryolophosaurus: 'life',
  haikouichthys: 'life', sacabambaspis: 'life', cooksonia: 'life', meganeura: 'life', hylonomus: 'life', diplodocus: 'life',
  velociraptor: 'life', muzquizopteryx: 'life', paraceratherium: 'life', lucy: 'life', smilodon: 'life',
};
function classify(p, id) {
  if (p.kind !== 'lead') return p;
  const n = p.label || '';
  return { ...p, kind: LEAD_KIND[id] || (EVID_RE.test(n) ? 'evidence' : LIFE_RE.test(n) ? 'life' : 'lead') };
}
export const photosOf = (id) => (assets.photos?.[id] || []).map((p) => classify(p, id));
export const articleOf = (id) => assets.articles?.[id] || null;
export const pbdbOf = (id) => assets.pbdb?.[id] || null;
export const paleoOf = (id) => assets.paleo?.[id] || null;

// Foto principal: reconstrucción en vida si existe; si no, evidencia; si no, portada.
export function mainPhoto(id) {
  const list = photosOf(id);
  return list.find((p) => p.kind === 'life') || list.find((p) => p.kind === 'evidence') || list[0] || null;
}

export const periodOf = (s) => periodById[s.period];
export const speciesInPeriod = (pid) => species.filter((s) => s.period === pid);
export const href = (s) => `/especie/${s.id}`;

export const KIND_LABEL = {
  life: 'Reconstrucción en vida',
  evidence: 'Fósil o montaje',
  evidence2: 'Fósil',
  lead: 'Imagen de referencia',
};
export const KIND_NOTE = {
  life: 'Interpretación científica: la anatomía se apoya en fósiles; piel, color y postura son hipótesis.',
  evidence: 'Evidencia: fósil, yacimiento o montaje de museo. Los montajes suelen completar con réplicas las partes que no se hallaron.',
  evidence2: 'Evidencia fósil.',
  lead: 'Imagen de referencia de Wikimedia Commons.',
};

// Taxón de la silueta distinto del animal → se avisa en la ficha.
export function silhouetteIsProxy(s) {
  const sil = silhouetteOf(s.id);
  if (!sil) return false;
  if (sil.query === 'uuid') return false;
  const genus = (s.silhouette?.[0] || s.name).split(/[\s|]/)[0].toLowerCase();
  return !sil.taxon.toLowerCase().startsWith(genus);
}

export const fmtLength = (m) => (m >= 1 ? `${m.toLocaleString('es-MX', { maximumFractionDigits: 1 })} m` : `${Math.round(m * 100)} cm`);
