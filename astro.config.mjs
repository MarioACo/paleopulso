import { defineConfig } from 'astro/config';

// URL pública: SITE_URL, o la de producción que Vercel publica al compilar.
const site = process.env.SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  || 'http://localhost:4321';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
