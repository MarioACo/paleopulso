// Estudios clave citados en las fichas. No se guardan DOI escritos a mano:
// `npm run assets` los busca en Crossref y solo acepta el resultado si el título
// contiene todas las palabras de `must`, el año coincide (±1 por la versión en línea)
// y el primer autor es el de la primera palabra de `q`.
// La descripción original de cada género sale aparte de PBDB.
export const keyRefs = {
  estromatolitos: [{ q: 'Allwood Stromatolite reef from the Early Archaean era of Australia', year: 2006, must: ['stromatolite', 'archaean'], why: 'Estromatolitos de Strelley Pool como evidencia de vida' }],
  charnia: [{ q: 'Ford Precambrian fossils from Charnwood Forest', year: 1958, must: ['charnwood'], why: 'Descripción de Charnia' }],
  dickinsonia: [{ q: 'Bobrovskiy Ancient steroids establish the Ediacaran fossil Dickinsonia as one of the earliest animals', year: 2018, must: ['dickinsonia', 'steroids'], why: 'Colesterol fósil en Dickinsonia' }],
  hallucigenia: [{ q: "Smith Caron Hallucigenia's head and the pharyngeal armature of early ecdysozoans", year: 2015, must: ['hallucigenia', 'head'], why: 'Identificación de la cabeza' }],
  dunkleosteus: [{ q: 'Engelman A Devonian Fish Tale new method of body length estimation Dunkleosteus', year: 2023, must: ['dunkleosteus', 'length'], why: 'Nueva estimación de tamaño (~4 m)' }],
  tiktaalik: [{ q: 'Daeschler Shubin Jenkins A Devonian tetrapod-like fish and the evolution of the tetrapod body plan', year: 2006, must: ['devonian', 'tetrapod'], why: 'Descripción de Tiktaalik' }],
  arthropleura: [
    { q: 'Davies The largest arthropod in Earth history: insights from newly discovered Arthropleura remains', year: 2021, must: ['arthropleura', 'largest'], why: 'Ejemplar gigante de Northumberland' },
    { q: 'Lheritier Head anatomy and phylogenomics show the Carboniferous giant Arthropleura belonged to a millipede-centipede group', year: 2024, must: ['arthropleura', 'head'], why: 'Anatomía de la cabeza' },
  ],
  inostrancevia: [{ q: 'Kammerer Rapid turnover of top predators in African terrestrial faunas around the Permian-Triassic mass extinction', year: 2023, must: ['predators', 'permian'], why: 'Inostrancevia en Sudáfrica' }],
  tanystropheus: [{ q: 'Spiekman Aquatic habits and niche partitioning in the extraordinarily long-necked Triassic reptile Tanystropheus', year: 2020, must: ['tanystropheus', 'niche'], why: 'Dos especies con nichos distintos' }],
  cryolophosaurus: [{ q: 'Hammer Hickerson A crested theropod dinosaur from Antarctica', year: 1994, must: ['theropod', 'antarctica'], why: 'Descripción de Cryolophosaurus' }],
  huizachal: [{ q: 'Clark Hopson Distinctive mammal-like reptile from Mexico and its bearing on the phylogeny of the Tritylodontidae', year: 1985, must: ['mexico', 'tritylodontidae'], why: 'Bocatherium de Huizachal' }],
  giraffatitan: [{ q: 'Taylor A re-evaluation of Brachiosaurus altithorax and its generic separation from Giraffatitan brancai', year: 2009, must: ['giraffatitan'], why: 'Giraffatitan como género distinto de Brachiosaurus' }],
  diplodocus: [{ q: 'Tschopp Mateus Benson A specimen-level phylogenetic analysis and taxonomic revision of Diplodocidae', year: 2015, must: ['diplodocidae', 'specimen-level'], why: 'Revalidación de Brontosaurus' }],
  sinosauropteryx: [{ q: 'Smithwick Countershading and stripes in the theropod dinosaur Sinosauropteryx', year: 2017, must: ['sinosauropteryx', 'countershading'], why: 'Colores de Sinosauropteryx' }],
  microraptor: [{ q: 'Li Reconstruction of Microraptor and the evolution of iridescent plumage', year: 2012, must: ['microraptor', 'iridescent'], why: 'Plumaje iridiscente' }],
  spinosaurus: [
    { q: 'Ibrahim Tail-propelled aquatic locomotion in a theropod dinosaur', year: 2020, must: ['tail', 'aquatic'], why: 'Hipótesis de nadador' },
    { q: 'Sereno Spinosaurus is not an aquatic dinosaur', year: 2022, must: ['spinosaurus', 'aquatic', 'not'], why: 'Hipótesis de cazador en la orilla' },
  ],
  velociraptor: [{ q: 'Turner Makovicky Norell Feather quill knobs in the dinosaur Velociraptor', year: 2007, must: ['quill', 'velociraptor'], why: 'Evidencia de plumas' }],
  tlatolophus: [{ q: 'Ramirez-Velasco Tlatolophus galorum parasaurolophini dinosaur Cerro del Pueblo Formation Coahuila', year: 2021, must: ['tlatolophus'], why: 'Descripción de Tlatolophus' }],
  quetzalcoatlus: [{ q: 'Lawson Pterosaur from the latest Cretaceous of West Texas discovery of the largest flying creature', year: 1975, must: ['pterosaur', 'texas'], why: 'Descubrimiento de Quetzalcoatlus' }],
  trex: [
    { q: 'Stevens Binocular vision in theropod dinosaurs', year: 2006, must: ['binocular', 'theropod'], why: 'Visión binocular' },
    { q: 'DePalma Physical evidence of predatory behavior in Tyrannosaurus rex', year: 2013, must: ['predatory', 'tyrannosaurus'], why: 'Mordida cicatrizada: cazaba presas vivas' },
  ],
  chicxulub: [
    { q: 'Hildebrand Chicxulub crater a possible Cretaceous/Tertiary boundary impact crater on the Yucatan Peninsula', year: 1991, must: ['chicxulub', 'crater'], why: 'Identificación del cráter' },
    { q: 'Schulte The Chicxulub asteroid impact and mass extinction at the Cretaceous-Paleogene boundary', year: 2010, must: ['chicxulub', 'asteroid', 'boundary'], why: 'Síntesis del impacto y la extinción' },
  ],
  titanoboa: [{ q: 'Head Giant boid snake from the Palaeocene neotropics reveals hotter past equatorial temperatures', year: 2009, must: ['boid', 'palaeocene'], why: 'Descripción de Titanoboa' }],
  megalodon: [{ q: 'Cooper Body dimensions of the extinct giant shark Otodus megalodon a 2D reconstruction', year: 2020, must: ['megalodon', 'body'], why: 'Estimación de proporciones' }],
  'ambar-chiapas': [{ q: 'Poinar Brown Hymenaea mexicana sp. nov. from Mexican amber indicates Old World connections', year: 2002, must: ['hymenaea', 'mexican'], why: 'El árbol que produjo el ámbar' }],
  lucy: [{ q: 'Johanson Taieb Plio-Pleistocene hominid discoveries in Hadar Ethiopia', year: 1976, must: ['hadar', 'hominid'], why: 'Hallazgos de Hadar' }],
  mamut: [{ q: 'Vartanyan Holocene dwarf mammoths from Wrangel Island in the Siberian Arctic', year: 1993, must: ['wrangel', 'mammoths'], why: 'Mamuts de Wrangel (dato de la sala de mitos)' }],
  neandertal: [{ q: 'Green A Draft Sequence of the Neandertal Genome Krause Briggs Science', year: 2010, must: ['draft', 'neandertal', 'genome'], why: 'ADN neandertal en humanos actuales' }],
  vallecillosaurus: [{ q: 'Smith A new aigialosaur Squamata Anguimorpha with soft tissue remains from the Upper Cretaceous of Nuevo Leon Mexico', year: 2008, must: ['aigialosaur', 'mexico'], why: 'Descripción de Vallecillosaurus' }],
  acantholipan: [{ q: 'Rivera-Sylva Acantholipan gonzalezi nodosaurid Coahuila Mexico', year: 2018, must: ['nodosaurid'], why: 'Descripción de Acantholipan' }],
  yehuecauhceratops: [{ q: 'Rivera-Sylva Yehuecauhceratops mudei centrosaurine Aguja Formation Coahuila', year: 2016, must: ['centrosaurine', 'aguja'], why: 'Descripción del ejemplar, que recibió su nombre en 2017' }],
  labocania: [{ q: 'Molnar A distinctive theropod dinosaur from the Upper Cretaceous of Baja California Mexico', year: 1974, must: ['theropod', 'baja california'], why: 'Descripción de Labocania' }],
  naia: [{ q: 'Chatters Late Pleistocene human skeleton and mtDNA link Paleoamericans and modern Native Americans', year: 2014, must: ['pleistocene', 'paleoamericans'], why: 'Naia y su ADN' }],
};
