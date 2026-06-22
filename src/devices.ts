import type { LayoutDevice } from './layout.js';
import { STAR_PERSONAL_D, STAR_CAMPAIGN_D, OLC_SIZE, KNOT_W, KNOT_H } from './layout.js';

// ─── Material colors ───────────────────────────────────────────────────────────

const MATERIAL_COLORS: Record<string, { fill: string; stroke: string }> = {
  b: { fill: '#8B5A2B', stroke: '#5C3A1A' },   // bronze
  s: { fill: '#A8A9AD', stroke: '#707070' },   // silver
  g: { fill: '#C5A028', stroke: '#8B6914' },   // gold
  w: { fill: '#FFFFFF', stroke: '#AAAAAA' },   // white/enamel
};

function matColor(material: string | undefined, defaultMat: string): { fill: string; stroke: string } {
  return MATERIAL_COLORS[material ?? defaultMat] ?? MATERIAL_COLORS[defaultMat]!;
}

// ─── 5-pointed star polygon ───────────────────────────────────────────────────

function starPoints(cx: number, cy: number, r: number): string {
  const inner = r * 0.382; // ratio for a regular 5-pointed star
  const points: string[] = [];
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 72 - 90) * (Math.PI / 180);
    const innerAngle = outerAngle + 36 * (Math.PI / 180);
    points.push(`${(cx + r * Math.cos(outerAngle)).toFixed(2)},${(cy + r * Math.sin(outerAngle)).toFixed(2)}`);
    points.push(`${(cx + inner * Math.cos(innerAngle)).toFixed(2)},${(cy + inner * Math.sin(innerAngle)).toFixed(2)}`);
  }
  return points.join(' ');
}

function renderStar(d: LayoutDevice, diameter: number, defaultMat: string): string {
  const r = diameter / 2;
  const { fill, stroke } = matColor(d.material, defaultMat);
  const pts = starPoints(d.cx, d.cy, r);
  return `<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
}

// ─── Oak leaf cluster ──────────────────────────────────────────────────────────

function renderOLC(d: LayoutDevice, scaleFactor: number): string {
  const { fill, stroke } = matColor(d.material, 'b');
  const s = OLC_SIZE * scaleFactor;
  const r = s / 2;
  // Three-lobed approximation using circles for the lobes
  const stem = s * 0.15;
  const lobeR = r * 0.42;
  return [
    // Center lobe
    `<circle cx="${d.cx.toFixed(2)}" cy="${(d.cy - r * 0.2).toFixed(2)}" r="${(lobeR).toFixed(2)}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`,
    // Left lobe
    `<circle cx="${(d.cx - r * 0.45).toFixed(2)}" cy="${(d.cy + r * 0.15).toFixed(2)}" r="${(lobeR * 0.85).toFixed(2)}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`,
    // Right lobe
    `<circle cx="${(d.cx + r * 0.45).toFixed(2)}" cy="${(d.cy + r * 0.15).toFixed(2)}" r="${(lobeR * 0.85).toFixed(2)}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`,
    // Stem
    `<rect x="${(d.cx - stem / 2).toFixed(2)}" y="${(d.cy + r * 0.3).toFixed(2)}" width="${stem.toFixed(2)}" height="${(r * 0.45).toFixed(2)}" fill="${fill}" stroke="${stroke}" stroke-width="0.5"/>`,
  ].join('');
}

// ─── Hourglass ────────────────────────────────────────────────────────────────

function renderHourglass(d: LayoutDevice, scaleFactor: number): string {
  const { fill, stroke } = matColor(d.material, 'b');
  const w = Math.round(14 * scaleFactor);
  const h = Math.round(18 * scaleFactor);
  const x = d.cx - w / 2;
  const y = d.cy - h / 2;
  const mx = d.cx;
  const my = d.cy;
  // Top triangle: top-left, top-right, middle-center
  const top = `M ${x.toFixed(1)},${y.toFixed(1)} L ${(x + w).toFixed(1)},${y.toFixed(1)} L ${mx.toFixed(1)},${my.toFixed(1)} Z`;
  // Bottom triangle: bottom-left, bottom-right, middle-center
  const bot = `M ${x.toFixed(1)},${(y + h).toFixed(1)} L ${(x + w).toFixed(1)},${(y + h).toFixed(1)} L ${mx.toFixed(1)},${my.toFixed(1)} Z`;
  return `<path d="${top} ${bot}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
}

// ─── Arrowhead ────────────────────────────────────────────────────────────────

function renderArrowhead(d: LayoutDevice, scaleFactor: number): string {
  const w = Math.round(12 * scaleFactor);
  const h = Math.round(14 * scaleFactor);
  const x = d.cx;
  const y = d.cy;
  // Upward-pointing
  const pts = `${x.toFixed(1)},${(y - h / 2).toFixed(1)} ${(x + w / 2).toFixed(1)},${(y + h / 2).toFixed(1)} ${(x - w / 2).toFixed(1)},${(y + h / 2).toFixed(1)}`;
  return `<polygon points="${pts}" fill="#8B5A2B" stroke="#5C3A1A" stroke-width="1"/>`;
}

// ─── Letter device (V, C, R, O, M) ───────────────────────────────────────────

const LETTER_MAP: Record<string, string> = {
  vd: 'V',
  cd: 'C',
  rd: 'R',
  od: 'O',
  md: 'M',
};

function renderLetterDevice(d: LayoutDevice, ribbonH: number, scaleFactor: number): string {
  const letter = LETTER_MAP[d.typeCode] ?? d.typeCode.toUpperCase();
  const fontSize = Math.round(ribbonH * 0.65);
  return `<text x="${d.cx.toFixed(2)}" y="${(d.cy + fontSize * 0.35).toFixed(2)}" font-family="serif" font-size="${fontSize}" font-weight="bold" fill="#C5A028" stroke="#8B6914" stroke-width="0.5" text-anchor="middle">${letter}</text>`;
}

// ─── Numeral device ───────────────────────────────────────────────────────────

function renderNumeral(d: LayoutDevice, ribbonH: number, scaleFactor: number): string {
  const n = d.param ?? String(d.count ?? '?');
  const fontSize = Math.round(ribbonH * 0.7);
  return `<text x="${d.cx.toFixed(2)}" y="${(d.cy + fontSize * 0.35).toFixed(2)}" font-family="sans-serif" font-size="${fontSize}" font-weight="bold" fill="#C5A028" stroke="#8B6914" stroke-width="0.5" text-anchor="middle">${n}</text>`;
}

// ─── Knot clasp ───────────────────────────────────────────────────────────────

function renderKnot(d: LayoutDevice, scaleFactor: number): string {
  const w = Math.round(KNOT_W * scaleFactor);
  const h = Math.round(KNOT_H * scaleFactor);
  const x = d.cx - w / 2;
  const y = d.cy - h / 2;
  return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w}" height="${h}" rx="2" fill="#8B5A2B" stroke="#5C3A1A" stroke-width="1"/>`;
}

// ─── Clasp device ─────────────────────────────────────────────────────────────

function renderClasp(d: LayoutDevice, ribbonW: number, ribbonH: number, scaleFactor: number): string {
  const label = d.param ?? '';
  const h = Math.round(ribbonH * 0.6);
  const w = Math.round(ribbonW * 0.75);
  const x = d.cx - w / 2;
  const y = d.cy - h / 2;
  const fontSize = Math.round(h * 0.55);
  return [
    `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w}" height="${h}" rx="2" fill="#C5A028" stroke="#8B6914" stroke-width="1"/>`,
    `<text x="${d.cx.toFixed(1)}" y="${(d.cy + fontSize * 0.3).toFixed(1)}" font-family="sans-serif" font-size="${fontSize}" fill="#000000" text-anchor="middle">${label}</text>`,
  ].join('');
}

// ─── Rosette ──────────────────────────────────────────────────────────────────

function renderRosette(d: LayoutDevice, scaleFactor: number): string {
  const r = Math.round(10 * scaleFactor);
  const { fill, stroke } = matColor('g', 'g');
  const innerR = Math.round(r * 0.5);
  return [
    `<circle cx="${d.cx.toFixed(1)}" cy="${d.cy.toFixed(1)}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`,
    `<circle cx="${d.cx.toFixed(1)}" cy="${d.cy.toFixed(1)}" r="${innerR}" fill="${stroke}" stroke="${stroke}" stroke-width="0.5"/>`,
  ].join('');
}

// ─── MID (Mention in Despatches oak leaf) ─────────────────────────────────────

function renderMID(d: LayoutDevice, scaleFactor: number): string {
  // Horizontal (rotated 90°) oak leaf — reuse OLC circles, just flattened
  const { fill, stroke } = matColor('s', 's');
  const s = OLC_SIZE * scaleFactor * 0.8;
  const r = s / 2;
  const lobeR = r * 0.42;
  return [
    `<circle cx="${d.cx.toFixed(2)}" cy="${d.cy.toFixed(2)}" r="${(lobeR).toFixed(2)}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`,
    `<circle cx="${(d.cx - r * 0.5).toFixed(2)}" cy="${d.cy.toFixed(2)}" r="${(lobeR * 0.8).toFixed(2)}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`,
    `<circle cx="${(d.cx + r * 0.5).toFixed(2)}" cy="${d.cy.toFixed(2)}" r="${(lobeR * 0.8).toFixed(2)}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`,
  ].join('');
}

// ─── Frame ────────────────────────────────────────────────────────────────────

export function renderFrame(
  x: number,
  y: number,
  w: number,
  h: number,
  style: 'gold' | 'silver',
): string {
  const color = style === 'gold' ? '#C5A028' : '#A8A9AD';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${color}" stroke-width="3"/>`;
}

// ─── Dispatch ─────────────────────────────────────────────────────────────────

export function renderDevice(
  d: LayoutDevice,
  ribbonW: number,
  ribbonH: number,
  scaleFactor: number,
): string {
  switch (d.typeCode) {
    // Personal award stars — type code 'st', material g/s (§8.2.2)
    case 'st':
      return renderStar(d, STAR_PERSONAL_D * scaleFactor, d.material ?? 'g');

    // Campaign/service stars — type code 'stc', material b/s (§8.2.2)
    case 'stc':
      return renderStar(d, STAR_CAMPAIGN_D * scaleFactor, d.material ?? 'b');

    // Oak leaf clusters — type code 'olc', material b/s (§8.2.2)
    case 'olc':
      return renderOLC(d, scaleFactor);

    // Hourglass — type code 'hg', material b/s/g (§8.2.2)
    case 'hg':
      return renderHourglass(d, scaleFactor);

    // Arrowhead
    case 'arr':
      return renderArrowhead(d, scaleFactor);

    // Letter devices
    case 'vd':
    case 'cd':
    case 'rd':
    case 'od':
    case 'md':
      return renderLetterDevice(d, ribbonH, scaleFactor);

    // Numeral
    case 'num':
      return renderNumeral(d, ribbonH, scaleFactor);

    // Knot clasp — type code 'knt', material b (§8.2.2)
    case 'knt':
      return renderKnot(d, scaleFactor);

    // Named clasp
    case 'clsp':
      return renderClasp(d, ribbonW, ribbonH, scaleFactor);

    // Rosette
    case 'ros':
      return renderRosette(d, scaleFactor);

    // MID oak leaf
    case 'mid':
      return renderMID(d, scaleFactor);

    // MBR (mention in despatches bars)
    case 'mbr': {
      const n = d.count ?? 1;
      const bw = Math.round(ribbonW * 0.4);
      const bh = Math.round(ribbonH * 0.25);
      return Array.from({ length: n }, (_, i) =>
        `<rect x="${(d.cx - bw / 2).toFixed(1)}" y="${(d.cy - bh / 2 + i * (bh + 2)).toFixed(1)}" width="${bw}" height="${bh}" fill="#C5A028" stroke="#8B6914" stroke-width="0.5"/>`
      ).join('');
    }

    default:
      // §16.6 — unknown device type codes are skipped with a warning
      console.warn(`[rackspec] Unknown device type code "${d.typeCode}" — skipping.`);
      return '';
  }
}
