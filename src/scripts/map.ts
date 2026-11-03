// Mapas del museo: costas de GPlates (paleomapas) o Natural Earth (México), con d3-geo.
import { geoArea, geoEqualEarth, geoGraticule10, geoMercator, geoPath, type GeoProjection } from 'd3-geo';

export type Site = { id: string; lon: number; lat: number; label?: string; href?: string; mx?: boolean; ping?: boolean };
type Opts = { url: string; sites?: Site[]; projection?: 'world' | 'mexico'; width?: number; height?: number; onSite?: (id: string) => void };

const cache = new Map<string, Promise<any>>();
function load(url: string) {
  if (!cache.has(url)) cache.set(url, fetch(url).then((r) => r.json()).then(fixWinding));
  return cache.get(url)!;
}

// d3 usa orientación esférica: un anillo con el sentido contrario cubriría todo el globo.
function fixWinding(geo: any) {
  const fixPoly = (poly: number[][][]) => (geoArea({ type: 'Polygon', coordinates: poly } as any) > 2 * Math.PI ? poly.map((r) => [...r].reverse()) : poly);
  const fixGeom = (g: any) => {
    if (!g) return g;
    if (g.type === 'Polygon') g.coordinates = fixPoly(g.coordinates);
    if (g.type === 'MultiPolygon') g.coordinates = g.coordinates.map(fixPoly);
    return g;
  };
  if (geo.type === 'FeatureCollection') geo.features.forEach((f: any) => fixGeom(f.geometry));
  else if (geo.type === 'Feature') fixGeom(geo.geometry);
  return geo;
}

function projectionFor(kind: Opts['projection'], w: number, h: number): GeoProjection {
  if (kind === 'mexico') {
    // Encuadre de México: de Baja California a Yucatán.
    return geoMercator().fitExtent([[10, 10], [w - 10, h - 10]], {
      type: 'Feature', properties: {}, geometry: { type: 'MultiPoint', coordinates: [[-117.5, 32.8], [-86.5, 14.4]] },
    } as any);
  }
  return geoEqualEarth().fitExtent([[6, 6], [w - 6, h - 6]], { type: 'Sphere' } as any);
}

export async function drawMap(svg: SVGSVGElement, o: Opts) {
  const w = o.width ?? 960, h = o.height ?? (o.projection === 'mexico' ? 640 : 480);
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.classList.add('map');
  const proj = projectionFor(o.projection, w, h);
  const path = geoPath(proj);
  const geo = await load(o.url);
  const lands = geo.type === 'FeatureCollection' ? geo.features : [geo];
  const sphere = o.projection === 'mexico' ? `<rect class="sphere" width="${w}" height="${h}"/>` : `<path class="sphere" d="${path({ type: 'Sphere' } as any)}"/>`;
  const land = lands.map((f: any) => `<path class="land${f.id === '484' ? ' mx-land' : ''}" d="${path(f) || ''}"/>`).join('');
  const sites = (o.sites || []).map((s) => {
    const p = proj([s.lon, s.lat]);
    if (!p) return '';
    const [x, y] = p.map((v) => v.toFixed(1));
    const ring = s.ping ? `<circle class="site-ring" cx="${x}" cy="${y}" r="7"/>` : '';
    const dot = `<circle class="site${s.mx ? ' mx' : ''}" cx="${x}" cy="${y}" r="${s.ping ? 6 : 5}" data-site="${s.id}"><title>${s.label || ''}</title></circle>`;
    return s.href ? `<a href="${s.href}" aria-label="${s.label || s.id}">${ring}${dot}</a>` : `<g>${ring}${dot}</g>`;
  }).join('');
  svg.innerHTML = `${sphere}<path class="grat" d="${path(geoGraticule10()) || ''}"/>${land}<g class="sites">${sites}</g>`;
  if (o.onSite) {
    svg.querySelectorAll<SVGCircleElement>('[data-site]').forEach((c) => {
      c.style.cursor = 'pointer';
      c.addEventListener('click', (e) => { e.preventDefault(); o.onSite!(c.dataset.site!); });
    });
  }
  return { proj };
}
