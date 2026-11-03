// Mapa del sitio para buscadores: salas y fichas (sin las plantillas de /og/).
import type { APIRoute } from 'astro';
import { species } from '../data/species.js';

const rooms = ['', 'tiempo', 'continentes', 'vida', 'dinosaurios', 'mexico', 'donde-vives', 'mitos', 'metodo', 'pasaporte', 'visita', 'colabora', 'creditos'];

export const GET: APIRoute = ({ site }) => {
  const es = [...rooms.map((r) => `/${r}`), ...species.map((s) => `/especie/${s.id}`)];
  const urls = [...es, ...es.map((u) => (u === '/' ? '/en/' : `/en${u}`))];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${new URL(u, site)}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
