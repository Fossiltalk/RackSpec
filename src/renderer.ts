import type { RackSpec, RenderOptions } from './types.js';
import { type RackLayout, type LayoutBlock, type LayoutRibbon, RIBBON_W, RIBBON_H } from './layout.js';
import { resolveLayout } from './layout.js';
import { getDefaultRegistry, mergeRegistry } from './registry.js';
import { renderDevice, renderFrame } from './devices.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

// ─── Main renderer ────────────────────────────────────────────────────────────

export function renderLayout(rack: RackSpec, options: RenderOptions = {}): string {
  const scale = options.scale ?? 96;
  const scaleFactor = scale / 96;

  let registry = getDefaultRegistry();
  if (options.registry && options.registry.length > 0) {
    registry = mergeRegistry(registry, options.registry);
  }

  const layout = resolveLayout(rack, registry, scale);
  return emitSVG(layout, scaleFactor);
}

// ─── SVG emitter ──────────────────────────────────────────────────────────────

function emitSVG(layout: RackLayout, scaleFactor: number): string {
  const pad = Math.round(4 * scaleFactor);
  const totalW = layout.totalWidth + pad * 2;
  const totalH = layout.totalHeight + pad * 2;

  const leftSvg = emitBlock(layout.left, pad, pad, scaleFactor);
  const rightSvg = layout.right
    ? emitBlock(layout.right, pad + layout.left.totalWidth + Math.round(20 * scaleFactor), pad, scaleFactor)
    : '';

  return [
    `<svg xmlns="${SVG_NS}" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}" role="img">`,
    leftSvg,
    rightSvg,
    '</svg>',
  ].join('\n');
}

function emitBlock(block: LayoutBlock, offsetX: number, offsetY: number, scaleFactor: number): string {
  return block.ribbons
    .map(r => emitRibbon(r, offsetX, offsetY, scaleFactor))
    .join('\n');
}

function emitRibbon(r: LayoutRibbon, offsetX: number, offsetY: number, scaleFactor: number): string {
  const x = r.x + offsetX;
  const y = r.y + offsetY;
  const parts: string[] = [];

  const label = r.name ? ` aria-label="${escapeXml(r.name)}"` : '';
  parts.push(`<g${label}>`);

  // Stripes
  parts.push(emitStripes(x, y, r.width, r.height, r.stripes));

  // Frame overlay
  if (r.frame) {
    parts.push(renderFrame(x, y, r.width, r.height, r.frame));
  }

  // Devices (positioned in ribbon-local space, so add ribbon offset)
  for (const device of r.devices) {
    const svgDevice = renderDevice(
      { ...device, cx: device.cx + x, cy: device.cy + y },
      r.width,
      r.height,
      scaleFactor,
    );
    if (svgDevice) parts.push(svgDevice);
  }

  parts.push('</g>');
  return parts.join('\n');
}

function emitStripes(
  x: number,
  y: number,
  totalW: number,
  totalH: number,
  stripes: { color: string; width: number }[],
): string {
  if (stripes.length === 0) {
    return `<rect x="${x}" y="${y}" width="${totalW}" height="${totalH}" fill="#CCCCCC"/>`;
  }

  const totalParts = stripes.reduce((s, st) => s + st.width, 0);
  const parts: string[] = [];
  let currentX = x;

  for (const stripe of stripes) {
    const stripeW = (stripe.width / totalParts) * totalW;
    parts.push(
      `<rect x="${currentX.toFixed(2)}" y="${y}" width="${stripeW.toFixed(2)}" height="${totalH}" fill="${stripe.color}"/>`
    );
    currentX += stripeW;
  }

  return parts.join('');
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
