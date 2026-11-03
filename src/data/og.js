// Imágenes para compartir de cada sala (las fichas se generan a partir del catálogo).
// `photo` = pieza cuya imagen principal ilustra la tarjeta.
export const ogPages = [
  { id: 'inicio', kicker: 'Museo de historia natural', title: 'La Tierra antes de nosotros', photo: 'trex' },
  { id: 'tiempo', kicker: 'Sala I · Tiempo profundo', title: 'Desciende por los estratos', photo: 'dickinsonia' },
  { id: 'continentes', kicker: 'Máquina del tiempo', title: 'Los continentes nunca se quedan quietos', photo: 'mesosaurus' },
  { id: 'vida', kicker: 'Sala II · Archivo de vida', title: 'Formas de existir', photo: 'anomalocaris' },
  { id: 'dinosaurios', kicker: 'Sala III · Mesozoico', title: 'Hueso, hipótesis y animal', photo: 'triceratops' },
  { id: 'mexico', kicker: 'Sala IV · México', title: 'Bajo nuestros pies hubo otros mundos', photo: 'coahuilaceratops' },
  { id: 'donde-vives', kicker: 'Tu lugar en el tiempo', title: '¿Qué había donde vives?', photo: 'mamut' },
  { id: 'mitos', kicker: 'Sala V · Mitos y evidencia', title: '¿Mito o fósil?', photo: 'velociraptor' },
  { id: 'metodo', kicker: 'Sala VI · Método', title: 'La ciencia no adivina: reconstruye', photo: 'trilobites' },
  { id: 'pasaporte', kicker: 'Pasaporte del museo', title: 'Tu cuaderno de campo', photo: 'stegosaurus' },
];
export const ogIdFor = (pathname) => {
  const p = pathname.replace(/^\/|\/$/g, '');
  if (!p) return 'inicio';
  if (p.startsWith('especie/')) return p.slice(8);
  return ogPages.some((o) => o.id === p) ? p : 'inicio';
};
