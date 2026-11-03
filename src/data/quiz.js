// Preguntas del pasaporte. `a` = índice de la respuesta correcta.
export const quiz = [
  { q: '¿Qué animal está más emparentado contigo?', o: ['Dimetrodon', 'Tyrannosaurus rex', 'Un pterosaurio'], a: 0,
    why: 'Dimetrodon es un sinápsido, de la línea que llevó a los mamíferos.' },
  { q: 'Si la historia de la Tierra fuera un día, ¿a qué hora aparecen los primeros dinosaurios?', o: ['Al mediodía', 'Cerca de las 22:47', 'A las 23:59'], a: 1,
    why: 'Hace ~233 Ma equivale a unas 22:47. Los humanos modernos llegan en los últimos 6 segundos.' },
  { q: '¿Dónde está el cráter del asteroide que acabó con los dinosaurios no avianos?', o: ['Arizona', 'Yucatán, México', 'Siberia'], a: 1,
    why: 'Chicxulub, enterrado bajo la península de Yucatán, tiene unos 180 km de diámetro.' },
  { q: '¿Qué grupo de dinosaurios sigue vivo?', o: ['Los saurópodos', 'Las aves', 'Los cocodrilos'], a: 1,
    why: 'Las aves son terópodos. Los cocodrilos son parientes, pero no dinosaurios.' },
  { q: '¿Cuál fue la mayor extinción masiva?', o: ['Cretácico–Paleógeno', 'Pérmico–Triásico', 'Ordovícico final'], a: 1,
    why: 'Hace 252 Ma desapareció ~81–95 % de las especies marinas.' },
  { q: '¿Qué vivió más cerca en el tiempo del T. rex?', o: ['Stegosaurus', 'Tú'], a: 1,
    why: 'Entre Stegosaurus y T. rex hay ~80 Ma; entre T. rex y tú, ~66 Ma.' },
  { q: '¿De qué estado mexicano son Coahuilaceratops, Velafrons y Tlatolophus?', o: ['Chihuahua', 'Coahuila', 'Sonora'], a: 1,
    why: 'Los tres vienen del Cretácico tardío de Coahuila, sobre todo de la Formación Cerro del Pueblo.' },
  { q: '¿Cómo sabemos que Dickinsonia era un animal?', o: ['Por sus huesos', 'Por moléculas de colesterol conservadas', 'Por sus dientes'], a: 1,
    why: 'En 2018 se encontró colesterol, una molécula típica de animales, en fósiles de Dickinsonia.' },
  { q: '¿Qué tamaño tenía el Velociraptor real?', o: ['Como una persona', 'Como un pavo', 'Como un caballo'], a: 1,
    why: 'Medía ~1.5–2 m de largo, la mayor parte cola, y tenía plumas.' },
  { q: '¿Qué prueba ayudó a demostrar la deriva continental?', o: ['Mesosaurus en África y Sudamérica', 'El tamaño de Argentinosaurus', 'Los colores de Microraptor'], a: 0,
    why: 'Un reptil de agua dulce no podía cruzar el Atlántico: los continentes estaban unidos.' },
  { q: '¿Quién es Naia?', o: ['Un dinosaurio de Puebla', 'Una joven de hace ~13,000 años hallada en Quintana Roo', 'Un mamut de Santa Lucía'], a: 1,
    why: 'Su esqueleto, en la cueva inundada de Hoyo Negro, es de los más antiguos y completos de América.' },
  { q: '¿Qué conserva mejor un fósil de color?', o: ['Melanosomas fosilizados', 'El tono de la roca', 'Nada, el color nunca se conserva'], a: 0,
    why: 'Así se reconstruyeron el antifaz de Sinosauropteryx y el negro iridiscente de Microraptor.' },
];

// Sellos del pasaporte: uno por sala visitada.
export const stamps = [
  { id: 'inicio', label: 'Vestíbulo', href: '/' },
  { id: 'tiempo', label: 'Tiempo profundo', href: '/tiempo' },
  { id: 'vida', label: 'Archivo de vida', href: '/vida' },
  { id: 'dinosaurios', label: 'Sala mesozoica', href: '/dinosaurios' },
  { id: 'mexico', label: 'Sala México', href: '/mexico' },
  { id: 'mitos', label: 'Mitos y evidencia', href: '/mitos' },
  { id: 'metodo', label: 'Cómo sabemos', href: '/metodo' },
  { id: 'donde', label: 'Tu lugar en el tiempo', href: '/donde-vives' },
];
