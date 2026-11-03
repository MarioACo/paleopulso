import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => new Response(
  `User-agent: *\nDisallow: /og/\n\nSitemap: ${new URL('/sitemap.xml', site)}\n`,
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
