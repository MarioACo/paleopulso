# Paleopulso

Un museo de historia natural en el navegador: 4,567 millones de años de vida, rocas y continentes en movimiento, con fuentes y niveles de certeza. Contenido de todo el mundo, con una sala dedicada a México. En español (raíz) e inglés (`/en/`).

## Salas

| Ruta | Qué hay |
| --- | --- |
| `/` | Vestíbulo: reloj de «la Tierra en 24 horas», pieza del día, las cinco extinciones, misión de huellas |
| `/tiempo` | Descenso por estratos con mapa paleogeográfico que cambia con cada periodo |
| `/continentes` | Máquina del tiempo: los continentes de hace 800 Ma a hoy, con reproducción |
| `/donde-vives` | Elige un lugar y mira dónde estaba en cada época (GPlates en vivo) y qué fósiles hay cerca |
| `/vida` | Archivo de 73 piezas con mapa mundial, filtros por era, ambiente, continente y México |
| `/especie/:id` | Ficha: fotos (evidencia / reconstrucción), escala con una persona, mapa «entonces y ahora», rango en PBDB, bibliografía verificada |
| `/dinosaurios` | Sala mesozoica por periodos y comparador de tamaños a escala |
| `/mexico` | Yacimientos de México, línea de tiempo, Chicxulub y museos para visitar |
| `/mitos` | 14 tarjetas «¿mito o realidad?» con marcador |
| `/metodo` | Cómo trabaja la paleontología y qué tan segura es cada capa de una reconstrucción |
| `/visita` | Visita guiada de 10 paradas con preguntas, guía para docentes y hoja imprimible |
| `/pasaporte` | Sellos por sala visitada y examen final |
| `/colabora` | Cómo reportar errores y sugerir piezas (avisos prellenados en GitHub) |
| `/creditos` | Autoría y licencia de cada imagen y silueta |

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:4321
npm run check      # verifica los datos y compila
npm test           # pruebas en navegador real sobre dist/ (usa Chrome o Edge; o CHROME_PATH)
npm run a11y       # auditoría de accesibilidad con axe-core (WCAG 2.1 AA)
npm run verify     # check + test + a11y
npm run og         # regenera las imágenes para compartir (public/og/)
node tests/weight.mjs   # peso de carga de cada sala
```

La URL pública se toma de `SITE_URL` o, en Vercel, de `VERCEL_PROJECT_PRODUCTION_URL` (sitemap, enlaces canónicos e imágenes para compartir). La analítica usa el componente de Astro de `@vercel/analytics` y solo se incluye al compilar en Vercel; hay que activarla en el panel del proyecto (*Analytics → Enable*).

## Idiomas

Cada sala vive en `src/views/` y se publica dos veces: `src/pages/x.astro` (español) y `src/pages/en/x.astro` (inglés). El idioma se deduce de la URL. Los textos en inglés están en `src/data/en/`; `npm run check` falla si a una pieza, mito, pregunta o parada le falta su traducción, y `npm test` busca frases de la interfaz en español dentro de `/en/`.

Para traducir un texto nuevo de la interfaz: `T('texto', 'text')` en la vista (ver `src/i18n.js`).

## Datos y recursos

- `src/data/periods.js` — escala geológica (límites y colores de la ICS), extinciones y reloj de 24 h.
- `src/data/species.js` — el catálogo. Cada pieza lleva lugar y coordenadas del hallazgo, edad, tamaño, dato curioso y si algo está en debate.
- `src/data/refs.js` — estudios clave por pieza. Los DOI no se escriben a mano: `npm run assets` los busca en Crossref y solo los acepta si coinciden título, año y primer autor. Los DOI que trae PBDB también se confirman en Crossref (PBDB tiene algunos erróneos).
- `src/data/myths.js`, `quiz.js`, `mexico.js`, `featured.js` — contenido de las salas.
- `scripts/process-photos.mjs` — decide cómo se presenta cada imagen (lámina, recorte o fotografía) y crea miniaturas de 640 px.
- `src/data/assets.json` + `public/assets/` — recursos descargados **y guardados en el repo**, para no depender de terceros al visitar el sitio.

Para añadir una pieza: agrégala a `species.js`, ejecuta `npm run assets` (descarga silueta, foto, paleomapa y rango de PBDB solo de lo que falta) y luego `npm run check`.

`npm run check` falla si una edad cae fuera de su periodo, si falta un archivo o una licencia, y avisa si una edad no coincide con el rango de la Paleobiology Database (las diferencias justificadas se documentan con `pbdbNote`).

Fuentes: [ICS](https://stratigraphy.org/chart) · [GPlates Web Service](https://gws.gplates.org) (modelo MERDITH2021) · [Paleobiology Database](https://paleobiodb.org) · [PhyloPic](https://www.phylopic.org) (solo licencias sin restricción comercial) · [Wikimedia Commons](https://commons.wikimedia.org) · [Natural Earth](https://www.naturalearthdata.com).

La versión anterior (HTML estático) se conserva en `legacy/`.
