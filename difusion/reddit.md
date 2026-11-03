# Paleopulso en Reddit — borradores

> Sustituye `[URL]` por la dirección pública del sitio antes de publicar.
> Lee las reglas de cada subreddit el mismo día (cambian seguido) y usa la *flair* que pidan.

## Antes de publicar

- **Una comunidad por día**, nunca el mismo texto copiado: Reddit marca como spam los envíos idénticos.
- **Sé transparente con la IA.** Muchas comunidades de ciencia rechazan contenido generado por IA sin aviso. Los borradores ya lo mencionan: el texto se redactó con ayuda de IA y cada dato se verificó contra fuentes. Que te corrijan es justo lo que buscas.
- **Quédate a contestar** las primeras 2–3 horas. Agradece cada corrección y, cuando la apliques, responde «corregido, gracias» con el enlace: eso convence más que el post.
- **Primero mira la página en tu celular** y comparte un enlace por WhatsApp para comprobar que salga la imagen de vista previa.
- Si un subreddit no permite enlaces propios, publica en su hilo semanal de autopromoción (si lo tiene) o pregunta antes a los moderadores.
- Horarios sugeridos: comunidades en inglés, martes a jueves por la mañana de EE. UU. (8–11 h, hora del centro de México); r/mexico, por la tarde-noche.

Cuando lleguen correcciones: abre un aviso en GitHub (o pídele a Claude que lo aplique) y verifica con `npm run verify`.

---

## 1. r/Paleontology (inglés) — el más importante: aquí está la gente que puede corregir

**Título:**
I built a free, fully sourced “museum” website: 73 fossils, every DOI checked against Crossref, plus a tool that shows where your town was 66 Ma ago. I’d love corrections.

**Texto:**

Hi! I’m from Mexico and I’ve loved fossils since I was a kid, so I built **Paleopulso**, a free natural-history-museum-style site (Spanish and English): [URL]/en/

What’s in it:

- **73 pieces** from stromatolites to Naia (Hoyo Negro), each with find site, age, size to scale next to a person, and a “then and now” map of where the site was at the time (GPlates, MERDITH2021).
- **Ages cross-checked automatically** against each taxon’s PBDB range; mismatches are documented on the page (e.g. Argentinosaurus vs. the Huincul Formation age).
- **References:** key studies cited for the fun facts, with DOIs verified against Crossref (title, year and first author). PBDB itself had a few wrong DOIs, which I filtered out.
- Fossil vs. museum mount vs. life reconstruction are labelled separately, and debated points (Spinosaurus ecology, Dunkleosteus length, Labocania’s affinities…) are flagged as debated.
- A Mexico hall: Coahuila hadrosaurs and ceratopsids, Tlayúa, Vallecillo, Chiapas amber, Chicxulub.

Transparency: I wrote the texts with help from AI tools and then checked everything against PBDB, the ICS chart and the original papers where I could. That’s exactly why I’m posting here: **I’d really appreciate you tearing it apart.** Every record has a “Report a correction” button that opens a pre-filled GitHub issue, or just comment below.

Specific things I’m unsure about:
1. Size estimates for the Mexican taxa (Acantholipan, Yehuecauhceratops, Tlatolophus).
2. Whether I picked the right “key study” for each fact.
3. Anything outdated after 2024.

Thanks for reading!

---

## 2. r/Dinosaurs (inglés) — más visual y divertido

**Título:**
Made a free size comparator + “myth or fossil?” cards for dinosaurs (no movie raptors, I promise)

**Texto:**

I made a museum-style site where you can put any dinosaur next to a person, a bus or a blue whale, at real scale: [URL]/en/dinosaurios

There are also 14 “myth or fossil?” cards (T. rex vision, feathered Velociraptor, Brontosaurus…) with the evidence behind each answer, and a hall of Mexican dinosaurs that rarely get attention (Coahuilaceratops, Tlatolophus, Velafrons).

Silhouettes are from PhyloPic and photos from Wikimedia Commons, all credited. The texts were drafted with AI help and checked against PBDB and the papers, so if something is wrong, please tell me and I’ll fix it.

Which dinosaur should I add next?

---

## 3. r/geology (inglés) — la máquina del tiempo y los estratos

**Título:**
A free interactive “descent through the strata” + plate tectonics time machine (800 Ma → today) using GPlates

**Texto:**

I built an educational site where you scroll down through the strata (ICS colours, a rock texture per period) while a side panel shows the palaeogeographic map of each period: [URL]/en/tiempo

There’s also a time machine with 33 maps from the GPlates Web Service (MERDITH2021) — [URL]/en/continentes — and a page where you type your town and it reconstructs where that point was at each age: [URL]/en/donde-vives

Caveats I state on the site: the coastlines are present-day outlines rotated back (not palaeo-shorelines), and some terranes have no plate assignment at certain ages (e.g. the Burgess Shale at 510 Ma). If you know a better way to communicate this to the public, or spot an error in the period notes, I’d love to hear it. The texts were written with AI help and checked against sources.

---

## 4. r/mexico (español) — el orgullo local

**Título:**
Hice un museo de paleontología gratis en línea con una sala dedicada a los fósiles de México (Coahuila, Tlayúa, Chicxulub, el ámbar de Chiapas, Naia…)

**Texto:**

Desde niño me encantan los dinosaurios y me di cuenta de que casi nadie sabe todo lo que hay en México, así que hice **Paleopulso**, un museo en línea gratuito: [URL]/mexico

- Dinosaurios de Coahuila: Coahuilaceratops (con cuernos posiblemente de los más largos de su familia), Tlatolophus (su nombre viene del náhuatl), Velafrons, Latirhinus, Yehuecauhceratops.
- La laguna de Tlayúa en Puebla, las lajas de Vallecillo en Nuevo León, el ámbar de Simojovel, el cráter de Chicxulub y los mamuts del AIFA.
- Una sección para poner tu ciudad y ver dónde estaba hace 66 o 150 millones de años.
- Una lista de museos para ir a verlos en persona (Museo del Desierto, Geología UNAM, Quinametzin…).

Los textos los redacté con ayuda de IA y los verifiqué contra bases de datos científicas y artículos originales. Si estudias geología o biología, o trabajas en un museo, me ayudaría mucho que me corrigieras. Cada ficha tiene un botón para reportar errores.

¿Qué fósil o yacimiento de su estado debería agregar?

---

## 5. r/SideProject (inglés) — para opiniones de diseño y comodidad de uso

**Título:**
Paleopulso: a night-time natural history museum in the browser. Looking for UX feedback

**Texto:**

I built a museum-style science site (Astro, no framework on the client): [URL]/en/

Showcases with warm “spotlight” lighting, paper museum labels, strata you scroll through, a 24-hour “Earth day” clock, a size comparator, a plate tectonics time machine, optional synthesised ambient sound and a stamp passport. It’s bilingual (ES/EN), passes axe-core WCAG AA checks and has browser tests.

What I’d love feedback on: Is it comfortable to read on your phone? Is anything confusing or slow? Does the dark museum look help or get in the way?

Built with heavy help from AI coding tools; the scientific content is cross-checked against PBDB, ICS and Crossref.

---

## Respuestas útiles para los comentarios

- **«¿Esto lo hizo una IA?»** — «Me ayudé con IA para redactar y programar, y por eso cada dato se cruza con PBDB, la escala ICS y los artículos originales (los DOI se verifican en Crossref). Justo por eso lo comparto aquí: si ves un error, lo corrijo y te doy crédito.» / *“I used AI to help write and code it, which is why every fact is cross-checked against PBDB, the ICS chart and the original papers (DOIs verified in Crossref). That’s exactly why I’m sharing it here: if you see an error I’ll fix it and credit you.”*
- **Te corrigen un dato** — «¡Gracias! Ya quedó corregido: [enlace]. ¿Te puedo mencionar en los créditos?» / *“Thanks! Fixed: [link]. Can I credit you?”*
- **Piden una pieza** — «Buena idea. Si sabes de un artículo o una imagen con licencia libre, me ayuda mucho.» / *“Great idea — if you know a paper or a freely licensed image, that helps a lot.”*
