// Unidades geológicas. Límites en millones de años (Ma) según la Tabla
// Cronoestratigráfica Internacional (ICS); colores = colores oficiales de la ICS.
// `map` = edad (Ma) usada para el mapa paleogeográfico de GPlates (modelo MERDITH2021).

export const EARTH_AGE = 4567;

export const periods = [
  {
    id: 'hadico', name: 'Hádico', rank: 'Eón', group: 'Precámbrico', start: 4567, end: 4031,
    color: '#AE027E', map: null,
    lead: 'La Tierra se ensambla entre impactos y océanos de magma.',
    world: 'Un impacto gigante formó la Luna poco después del origen del planeta. La superficie se enfrió lo suficiente para que hubiera agua líquida y una corteza temprana, aunque casi ninguna roca de esta época sobrevive.',
    life: 'No hay evidencia confirmada de vida. Algunas señales químicas en circones se discuten, pero no son concluyentes.',
    evidence: 'Circones de Jack Hills (Australia) de hasta ~4,400 Ma: los minerales terrestres más antiguos conocidos.',
    event: 'Origen de la Tierra y de la Luna',
  },
  {
    id: 'arcaico', name: 'Arcaico', rank: 'Eón', group: 'Precámbrico', start: 4031, end: 2500,
    color: '#F0047F', map: null,
    lead: 'Microbios transforman un planeta sin oxígeno libre.',
    world: 'Océanos globales, volcanismo intenso y los primeros núcleos de continentes (cratones). El Sol brillaba alrededor de un 25 % menos que hoy.',
    life: 'Comunidades microbianas construyen estromatolitos. En algún momento surge la fotosíntesis que libera oxígeno.',
    evidence: 'Estromatolitos de Pilbara (Australia, ~3,430 Ma) y señales isotópicas del carbono.',
    event: 'Primeras evidencias sólidas de vida',
  },
  {
    id: 'proterozoico', name: 'Proterozoico', rank: 'Eón', group: 'Precámbrico', start: 2500, end: 538.8,
    color: '#F73563', map: 800,
    lead: 'Oxígeno, células complejas y el planeta congelado.',
    world: 'La Gran Oxidación (~2,400 Ma) llena de oxígeno la atmósfera por primera vez. Se forman y rompen supercontinentes como Rodinia y el planeta pasa por glaciaciones casi globales («Tierra bola de nieve»).',
    life: 'Aparecen las células con núcleo (eucariotas), la reproducción sexual y los primeros organismos multicelulares.',
    evidence: 'Formaciones de hierro bandeado, microfósiles y el fósil espiral Grypania.',
    event: 'Gran Oxidación',
  },
  {
    id: 'ediacarico', name: 'Ediacárico', rank: 'Periodo', group: 'Precámbrico', start: 635, end: 538.8,
    color: '#FED96A', map: 560,
    lead: 'Un experimento de cuerpos blandos antes de los animales modernos.',
    world: 'El planeta sale de la última gran glaciación global; los mares someros se expanden.',
    life: 'Dickinsonia, Charnia y Kimberella: organismos sin conchas ni huesos, muchos difíciles de clasificar.',
    evidence: 'Impresiones en areniscas de Australia, Rusia, Terranova e Inglaterra; moléculas de colesterol conservadas en Dickinsonia.',
    event: 'Primeros ecosistemas de organismos grandes',
  },
  {
    id: 'cambrico', name: 'Cámbrico', rank: 'Periodo', group: 'Paleozoico', start: 538.8, end: 486.85,
    color: '#7FA056', map: 510,
    lead: 'Ojos, armaduras y depredadores cambian los mares.',
    world: 'Continentes dispersos, casi todos cerca del ecuador o en el hemisferio sur. La tierra firme era roca desnuda.',
    life: 'La «explosión cámbrica»: aparecen casi todos los grandes grupos animales actuales, incluidos los primeros vertebrados.',
    evidence: 'Burgess Shale (Canadá) y Chengjiang (China) conservan incluso tejidos blandos.',
    event: 'Radiación cámbrica',
  },
  {
    id: 'ordovicico', name: 'Ordovícico', rank: 'Periodo', group: 'Paleozoico', start: 486.85, end: 443.1,
    color: '#009270', map: 460,
    lead: 'Los mares se llenan de vida y las plantas tocan tierra.',
    world: 'Mares altos e inmensas plataformas marinas. Al final, Gondwana llega al polo sur y se cubre de hielo.',
    life: 'Arrecifes, nautiloideos gigantes, peces sin mandíbula y las primeras plantas terrestres, parecidas a hepáticas.',
    evidence: 'Esporas fósiles de plantas, graptolitos y conodontos usados para correlacionar rocas en todo el mundo.',
    event: 'Extinción del Ordovícico final',
  },
  {
    id: 'silurico', name: 'Silúrico', rank: 'Periodo', group: 'Paleozoico', start: 443.1, end: 419.62,
    color: '#B3E1B6', map: 430,
    lead: 'La recuperación de los mares y una revolución verde.',
    world: 'El hielo se derrite, sube el nivel del mar y el clima se vuelve cálido y estable.',
    life: 'Plantas vasculares como Cooksonia, primeros artrópodos terrestres, escorpiones marinos y peces con mandíbula.',
    evidence: 'Tallos de Cooksonia, euriptéridos de Nueva York y peces acorazados.',
    event: 'Primeros ecosistemas terrestres',
  },
  {
    id: 'devonico', name: 'Devónico', rank: 'Periodo', group: 'Paleozoico', start: 419.62, end: 358.86,
    color: '#CB8C37', map: 380,
    lead: 'Bosques, arrecifes y aletas que se vuelven patas.',
    world: 'Aparecen los primeros bosques, que crean suelos y cambian la química del aire y del océano.',
    life: 'La «edad de los peces». Los primeros tetrápodos salen del agua; aparecen árboles y semillas.',
    evidence: 'Tiktaalik (Canadá), huellas de tetrápodos en Polonia y troncos fósiles de Archaeopteris.',
    event: 'Extinciones del Devónico tardío',
  },
  {
    id: 'carbonifero', name: 'Carbonífero', rank: 'Periodo', group: 'Paleozoico', start: 358.86, end: 298.9,
    color: '#67A599', map: 310,
    lead: 'Bosques pantanosos que hoy quemamos como carbón.',
    world: 'Selvas de licópsidos gigantes en el ecuador; el oxígeno del aire supera al actual.',
    life: 'Insectos gigantes, anfibios diversos y los primeros amniotas: animales que ponen huevos con cáscara.',
    evidence: 'Capas de carbón, tocones fósiles con reptiles atrapados (Joggins, Canadá) y alas de Meganeura.',
    event: 'Origen del huevo amniota',
  },
  {
    id: 'permico', name: 'Pérmico', rank: 'Periodo', group: 'Paleozoico', start: 298.9, end: 251.902,
    color: '#F04028', map: 260,
    lead: 'Pangea reúne toda la tierra antes de la peor crisis de la historia.',
    world: 'Un solo supercontinente con interiores secos y estaciones extremas.',
    life: 'Dominan los sinápsidos, los parientes lejanos de los mamíferos. Glossopteris cubre el sur.',
    evidence: 'Los mismos fósiles (Mesosaurus, Glossopteris) en continentes hoy separados: prueba de la deriva continental.',
    event: 'Extinción del Pérmico–Triásico',
  },
  {
    id: 'triasico', name: 'Triásico', rank: 'Periodo', group: 'Mesozoico', start: 251.902, end: 201.4,
    color: '#812B92', map: 220,
    lead: 'La vida se reconstruye; nacen dinosaurios y mamíferos.',
    world: 'Pangea sigue unida, con desiertos interiores y monzones en las costas.',
    life: 'Aparecen dinosaurios, pterosaurios, tortugas, cocodrilos tempranos y los primeros mamíferos.',
    evidence: 'Ischigualasto (Argentina) muestra que los primeros dinosaurios eran escasos y pequeños.',
    event: 'Extinción del Triásico–Jurásico',
  },
  {
    id: 'jurasico', name: 'Jurásico', rank: 'Periodo', group: 'Mesozoico', start: 201.4, end: 143.1,
    color: '#34B2C9', map: 150,
    lead: 'Gigantes en tierra, reptiles marinos y las primeras aves.',
    world: 'Pangea se abre: nace el Atlántico y el Golfo de México. Clima cálido y húmedo.',
    life: 'Saurópodos colosales, estegosaurios, alosaurios, ictiosaurios y Archaeopteryx.',
    evidence: 'Formación Morrison (EUA), Tendaguru (Tanzania) y las calizas de Solnhofen (Alemania).',
    event: 'Fragmentación de Pangea',
  },
  {
    id: 'cretacico', name: 'Cretácico', rank: 'Periodo', group: 'Mesozoico', start: 143.1, end: 66,
    color: '#7FC64E', map: 90,
    lead: 'Flores, plumas y el reinado final de los dinosaurios.',
    world: 'Mares interiores, como el que partía Norteamérica en dos, y continentes cada vez más separados. Gran parte del norte de México estaba bajo el mar o en sus costas.',
    life: 'Plantas con flor, abejas, dinosaurios muy diversos, mosasaurios y aves modernas tempranas.',
    evidence: 'Plumas en China, huevos y nidos en Mongolia y Argentina, y la capa de iridio del final.',
    event: 'Impacto de Chicxulub y extinción K–Pg',
  },
  {
    id: 'paleogeno', name: 'Paleógeno', rank: 'Periodo', group: 'Cenozoico', start: 66, end: 23.04,
    color: '#FD9A52', map: 50,
    lead: 'Los mamíferos ocupan el mundo que dejaron los dinosaurios.',
    world: 'Arranca muy cálido (sin hielo polar) y luego empieza un enfriamiento largo; se forma el hielo de la Antártida.',
    life: 'Primates, murciélagos, ballenas que vuelven al mar y serpientes gigantes como Titanoboa.',
    evidence: 'Wadi al-Hitan (Egipto) muestra ballenas con patas traseras.',
    event: 'Máximo térmico del Paleoceno–Eoceno',
  },
  {
    id: 'neogeno', name: 'Neógeno', rank: 'Periodo', group: 'Cenozoico', start: 23.04, end: 2.58,
    color: '#FFE619', map: 15,
    lead: 'Pastizales, montañas y los primeros homininos.',
    world: 'Los continentes casi en su posición actual. Se cierra el istmo de Panamá y se unen las Américas.',
    life: 'Caballos, elefantes y felinos se diversifican; megalodón domina los mares; homininos bípedos en África.',
    evidence: 'Dientes, polen e isótopos registran la expansión de los pastizales.',
    event: 'Gran Intercambio Biótico Americano',
  },
  {
    id: 'cuaternario', name: 'Cuaternario', rank: 'Periodo', group: 'Cenozoico', start: 2.58, end: 0,
    color: '#F9F97F', map: 0,
    lead: 'Hielo, megafauna y una especie capaz de leer el pasado.',
    world: 'Ciclos glaciales repetidos: el nivel del mar baja hasta ~120 m y aparecen puentes de tierra como Beringia.',
    life: 'Mamuts, perezosos gigantes, gliptodontes y dientes de sable conviven con humanos, que se expanden por todo el planeta.',
    evidence: 'Huesos, ADN antiguo, herramientas, arte rupestre y núcleos de hielo.',
    event: 'Glaciaciones y expansión humana',
  },
];

export const periodById = Object.fromEntries(periods.map((p) => [p.id, p]));

// Periodos "hoja" (sin solaparse) para el descenso por estratos, de reciente a antiguo.
export const strata = ['cuaternario', 'neogeno', 'paleogeno', 'cretacico', 'jurasico', 'triasico', 'permico',
  'carbonifero', 'devonico', 'silurico', 'ordovicico', 'cambrico', 'ediacarico', 'proterozoico', 'arcaico', 'hadico']
  .map((id) => periodById[id]);

// Proterozoico sin el Ediacárico, para que los estratos no se solapen.
export const strataRange = (p) => (p.id === 'proterozoico' ? { start: 2500, end: 635 } : { start: p.start, end: p.end });

export const eras = [
  { id: 'Precámbrico', label: 'Precámbrico', start: 4567, end: 538.8 },
  { id: 'Paleozoico', label: 'Paleozoico', start: 538.8, end: 251.902 },
  { id: 'Mesozoico', label: 'Mesozoico', start: 251.902, end: 66 },
  { id: 'Cenozoico', label: 'Cenozoico', start: 66, end: 0 },
];

// Si la historia de la Tierra fuera un día de 24 horas.
export function clockTime(ma) {
  const seconds = 86400 * (1 - ma / EARTH_AGE);
  const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), s = Math.floor(seconds % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatMa(ma) {
  if (ma === 0) return 'hoy';
  if (ma < 0.01) return `hace ${Math.round(ma * 1e6).toLocaleString('es-MX')} años`;
  if (ma < 1) return `hace ${Math.round(ma * 1000).toLocaleString('es-MX')} mil años`;
  return `${ma.toLocaleString('es-MX', { maximumFractionDigits: 2 })} Ma`;
}

export const extinctions = [
  { id: 'ordovicico', name: 'Ordovícico final', ma: 443.1, loss: 85, range: '≈ 85 %', cause: 'Una glaciación rápida en Gondwana bajó el nivel del mar y enfrió los océanos; ocurrió en dos pulsos.' },
  { id: 'devonico', name: 'Devónico tardío', ma: 372, loss: 75, range: '≈ 70–75 %', cause: 'Varios pulsos (Kellwasser, ~372 Ma, y Hangenberg, ~359 Ma) ligados a falta de oxígeno en los mares. Los arrecifes casi desaparecen.' },
  { id: 'permico', name: 'Pérmico–Triásico', ma: 251.9, loss: 90, range: '≈ 81–95 %', cause: 'Las erupciones de los Traps Siberianos liberaron enormes cantidades de CO₂: calentamiento, acidificación y mares sin oxígeno. La peor crisis conocida.' },
  { id: 'triasico', name: 'Triásico–Jurásico', ma: 201.4, loss: 76, range: '≈ 76 %', cause: 'El vulcanismo de la Provincia Magmática del Atlántico Central, mientras Pangea se abría. Despejó el camino a los dinosaurios.' },
  { id: 'cretacico', name: 'Cretácico–Paleógeno', ma: 66, loss: 76, range: '≈ 76 %', cause: 'El impacto de un asteroide de ~10 km en Chicxulub (Yucatán, México), sumado al vulcanismo del Decán. Desaparecen todos los dinosaurios no avianos.' },
];

// Edades con mapa paleogeográfico descargado. Cada pieza usa la más cercana a su edad.
export const MAP_TIMES = [0, 15, 30, 50, 66, 80, 90, 110, 125, 150, 170, 190, 210, 230, 250, 270, 290, 310, 340, 370, 380, 400, 420, 430, 460, 480, 510, 540, 560, 800];
export function mapTimeFor(ma) {
  if (ma > 1000) return null;
  return MAP_TIMES.reduce((best, t) => (Math.abs(t - ma) < Math.abs(best - ma) ? t : best), 0);
}
