// Sonido ambiente sintetizado (Web Audio): sin archivos, sin licencias.
// Apagado por defecto; la preferencia se guarda en localStorage.
// Las páginas cambian el paisaje con: window.dispatchEvent(new CustomEvent('paleo:era', { detail: 'cretacico' }))
type Kind = 'magma' | 'mar' | 'lluvia' | 'viento' | 'museo';
const BY_PERIOD: Record<string, Kind> = {
  hadico: 'magma', arcaico: 'magma', proterozoico: 'mar', ediacarico: 'mar', cambrico: 'mar', ordovicico: 'mar', silurico: 'mar',
  devonico: 'lluvia', carbonifero: 'lluvia', permico: 'viento', triasico: 'viento', jurasico: 'lluvia', cretacico: 'lluvia',
  paleogeno: 'lluvia', neogeno: 'viento', cuaternario: 'viento',
};
const KEY = 'paleopulso:sound';
let ctx: AudioContext | null = null, master: GainNode | null = null, current: { kind: Kind; stop: () => void } | null = null;
let wanted: Kind = 'museo';

function noise(c: AudioContext, brown = false) {
  const len = c.sampleRate * 4, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    d[i] = brown ? (last = (last + 0.02 * w) / 1.02) * 3.5 : w;
  }
  const src = c.createBufferSource(); src.buffer = buf; src.loop = true;
  return src;
}
function lfo(c: AudioContext, target: AudioParam, rate: number, depth: number) {
  const o = c.createOscillator(), g = c.createGain();
  o.frequency.value = rate; g.gain.value = depth; o.connect(g).connect(target); o.start();
  return o;
}

function build(kind: Kind) {
  const c = ctx!, out = c.createGain();
  out.gain.value = 0; out.connect(master!);
  const nodes: AudioScheduledSourceNode[] = [];
  const chain = (src: AudioScheduledSourceNode, type: BiquadFilterType, freq: number, q: number, gain: number) => {
    const f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = c.createGain(); g.gain.value = gain;
    src.connect(f).connect(g).connect(out); src.start(); nodes.push(src);
    return { f, g };
  };
  if (kind === 'magma') {
    const { g } = chain(noise(c, true), 'lowpass', 120, 0.7, 0.9);
    nodes.push(lfo(c, g.gain, 0.07, 0.35));
    chain(noise(c), 'bandpass', 900, 8, 0.015);
  } else if (kind === 'mar') {
    const { g, f } = chain(noise(c), 'lowpass', 700, 0.5, 0.25);
    nodes.push(lfo(c, g.gain, 0.11, 0.22), lfo(c, f.frequency, 0.11, 400));
  } else if (kind === 'lluvia') {
    chain(noise(c), 'highpass', 2500, 0.3, 0.06);
    const { g } = chain(noise(c, true), 'lowpass', 400, 0.5, 0.35);
    nodes.push(lfo(c, g.gain, 0.05, 0.1));
  } else if (kind === 'viento') {
    const { f, g } = chain(noise(c), 'bandpass', 500, 1.2, 0.18);
    nodes.push(lfo(c, f.frequency, 0.06, 300), lfo(c, g.gain, 0.09, 0.08));
  } else {
    chain(noise(c, true), 'lowpass', 220, 0.5, 0.12); // sala del museo: murmullo grave
  }
  out.gain.linearRampToValueAtTime(1, c.currentTime + 2.5);
  return {
    kind,
    stop: () => {
      out.gain.cancelScheduledValues(c.currentTime);
      out.gain.setValueAtTime(out.gain.value, c.currentTime);
      out.gain.linearRampToValueAtTime(0, c.currentTime + 2);
      setTimeout(() => { nodes.forEach((n) => { try { n.stop(); } catch { /* ya detenido */ } }); out.disconnect(); }, 2200);
    },
  };
}

function play(kind: Kind) {
  wanted = kind;
  if (!ctx || ctx.state !== 'running') return;
  if (current?.kind === kind) return;
  current?.stop();
  current = build(kind);
}

export function setupAmbient(button: HTMLButtonElement) {
  const on = () => localStorage.getItem(KEY) === 'on';
  const label = () => {
    button.setAttribute('aria-pressed', String(on()));
    button.title = (on() ? button.dataset.on : button.dataset.off) || '';
    button.setAttribute('aria-label', button.title);
  };
  async function start() {
    ctx ||= new AudioContext();
    if (!master) { master = ctx.createGain(); master.gain.value = 0.35; master.connect(ctx.destination); }
    await ctx.resume();
    current = null;
    play(wanted);
  }
  button.addEventListener('click', async () => {
    if (on()) { localStorage.setItem(KEY, 'off'); current?.stop(); current = null; await ctx?.suspend(); }
    else { localStorage.setItem(KEY, 'on'); await start(); }
    label();
  });
  // El navegador exige un gesto del usuario: si estaba encendido, arranca con el primer toque.
  if (on()) addEventListener('pointerdown', () => on() && start(), { once: true });
  addEventListener('paleo:era', (e) => play(BY_PERIOD[(e as CustomEvent).detail] || 'museo'));
  label();
}
