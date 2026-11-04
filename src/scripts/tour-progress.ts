// Avance de la visita guiada, guardado solo en el navegador.
// { a: { "1": "2", ... } } → respuesta elegida en cada parada.
const KEY = 'paleopulso:visita';
export const TOUR_STOPS = 10;

export function loadTour(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}').a || {}; } catch { return {}; }
}
export function saveAnswer(n: number, v: string) {
  const a = loadTour(); a[n] = v;
  localStorage.setItem(KEY, JSON.stringify({ a }));
}
export function resetTour() { localStorage.removeItem(KEY); }
/** Primera parada sin responder (1…TOUR_STOPS), o null si no hay avance o ya terminó. */
export function nextStop(): number | null {
  const a = loadTour();
  const done = Object.keys(a).length;
  if (!done) return null;
  for (let n = 1; n <= TOUR_STOPS; n++) if (!(n in a)) return n;
  return null;
}
