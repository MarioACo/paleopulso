// Figura a escala en metros: siluetas alineadas al suelo, una junto a otra.
// Sirve en el servidor (fichas) y en el navegador (comparador).
export type ScaleItem = { file?: string; aspect?: number; length: number; label: string; tone?: 'human' | 'animal' | 'alt'; rect?: { h: number } };

const fmt = (m: number) => (m >= 1 ? `${+m.toFixed(1)} m` : `${Math.round(m * 100)} cm`);

export function scaleSvg(input: ScaleItem[]) {
  // Chrome no dibuja <image> de fracciones de unidad: en piezas pequeñas se trabaja en centímetros.
  const U = Math.max(...input.map((i) => i.length)) < 2 ? 100 : 1;
  const items = input.map((i) => ({ ...i, length: i.length * U, rect: i.rect && { h: i.rect.h * U } }));
  const gap = Math.max(...items.map((i) => i.length)) * 0.06;
  let x = 0, maxH = 0;
  const placed = items.map((it) => {
    const w = it.rect ? it.length : it.tone === 'human' ? 1.7 * U * (it.aspect || 0.4) : it.length;
    const h = it.rect ? it.rect.h : it.tone === 'human' ? 1.7 * U : it.length / (it.aspect || 2);
    const p = { ...it, x, w, h };
    x += w + gap;
    maxH = Math.max(maxH, h);
    return p;
  });
  const W = x - gap * 0.5, H = maxH * 1.18 + W * 0.06;
  const base = maxH * 1.12;
  const fs = W * 0.018;
  const ticks = niceTicks(W / U).map((t) => t * U);
  const body = placed.map((p) => {
    const y = base - p.h;
    const shape = p.rect
      ? `<rect x="${p.x}" y="${y}" width="${p.w}" height="${p.h}" rx="${p.h * 0.12}" class="sc-bus"/><rect x="${p.x + p.w * 0.05}" y="${y + p.h * 0.18}" width="${p.w * 0.9}" height="${p.h * 0.3}" class="sc-bus-win"/>`
      : `<image href="${p.file}" x="${p.x}" y="${y}" width="${p.w}" height="${p.h}" preserveAspectRatio="none" class="sc-${p.tone || 'animal'}"/>`;
    return `<g>${shape}<text x="${p.x + p.w / 2}" y="${Math.max(y - fs * 0.6, fs)}" class="sc-label" font-size="${fs}">${p.label}</text></g>`;
  }).join('');
  const axis = ticks.map((t) => `<line x1="${t}" x2="${t}" y1="${base}" y2="${base + fs * 0.5}" class="sc-tick"/><text x="${t}" y="${base + fs * 1.7}" font-size="${fs * 0.85}" class="sc-tick-t">${fmt(t / U)}</text>`).join('');
  return `<svg viewBox="0 0 ${W.toFixed(3)} ${H.toFixed(3)}" class="scale-svg" role="img" aria-label="Comparación de tamaños a escala"><line x1="0" x2="${W}" y1="${base}" y2="${base}" class="sc-ground"/>${body}${axis}</svg>`;
}

function niceTicks(W: number) {
  const steps = [0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10, 20];
  const step = steps.find((s) => W / s <= 8) || 50;
  const out = [];
  for (let t = 0; t <= W; t += step) out.push(+t.toFixed(3));
  return out;
}
