import type {
  RackSpec,
  Row,
  RibbonToken,
  DeviceToken,
  Stripe,
  RegistryEntry,
} from './types.js';
import { type Registry, resolveSlug, resolveStripeColor } from './registry.js';

// ─── Physical constants (at 96 dpi) ───────────────────────────────────────────

export const RIBBON_W = 133;  // 1-3/8 in
export const RIBBON_H = 36;   // 3/8 in
export const FRAME_W  = 140;  // unit-award frame width
export const FRAME_H  = 48;   // unit-award frame height
export const RIBBON_GAP = 2;  // px between ribbons in a row

const ROW_SPACING: Record<0 | 1 | 2, number> = { 0: 0, 1: 12, 2: 24 };

// Star diameters (px at 96 dpi)
export const STAR_PERSONAL_D = 30;   // 5/16 in
export const STAR_CAMPAIGN_D = 18;   // 3/16 in
export const OLC_SIZE = 26;          // oak leaf cluster across
export const KNOT_W = 18;            // knot clasp width
export const KNOT_H = 10;            // knot clasp height

// ─── Layout types ─────────────────────────────────────────────────────────────

export interface ResolvedStripe {
  color: string;  // hex
  width: number;  // proportional
}

export interface LayoutDevice {
  typeCode: string;
  material?: string;
  count?: number;
  param?: string;
  /** Center x within the ribbon (ribbon-local coordinates) */
  cx: number;
  /** Center y within the ribbon (ribbon-local coordinates) */
  cy: number;
}

export interface LayoutRibbon {
  /** Top-left x in SVG coordinates */
  x: number;
  /** Top-left y in SVG coordinates */
  y: number;
  width: number;
  height: number;
  stripes: ResolvedStripe[];
  frame?: 'gold' | 'silver';
  devices: LayoutDevice[];
  /** Accessible name from registry */
  name?: string;
}

export interface LayoutBlock {
  ribbons: LayoutRibbon[];
  totalWidth: number;
  totalHeight: number;
}

export interface RackLayout {
  left: LayoutBlock;
  right?: LayoutBlock;
  totalWidth: number;
  totalHeight: number;
}

// ─── Main layout resolver ─────────────────────────────────────────────────────

export function resolveLayout(
  rack: RackSpec,
  registry: Registry,
  scale: number = 96,
): RackLayout {
  const scaleFactor = scale / 96;
  const rw = scale / 96;  // ribbon dimension scale

  const left = layoutBlock(rack.leftRows, rack.header, registry, 0, 0, scaleFactor);
  let right: LayoutBlock | undefined;

  if (rack.rightRows) {
    const rightX = left.totalWidth + Math.round(20 * scaleFactor);
    right = layoutBlock(rack.rightRows, rack.header, registry, rightX, 0, scaleFactor);
  }

  const totalWidth = right
    ? left.totalWidth + Math.round(20 * scaleFactor) + right.totalWidth
    : left.totalWidth;
  const totalHeight = Math.max(left.totalHeight, right?.totalHeight ?? 0);

  return { left, right, totalWidth, totalHeight };
}

function layoutBlock(
  rows: Row[],
  header: RackSpec['header'],
  registry: Registry,
  offsetX: number,
  offsetY: number,
  scaleFactor: number,
): LayoutBlock {
  const ribbons: LayoutRibbon[] = [];
  const rw = Math.round(RIBBON_W * scaleFactor);
  const rh = Math.round(RIBBON_H * scaleFactor);
  const gap = Math.round(RIBBON_GAP * scaleFactor);
  const rowSpacingPx = Math.round(ROW_SPACING[header.sp] * scaleFactor);
  const maxPerRow = header.rw;

  let currentY = offsetY;

  // Rows are ordered top-to-bottom (row[0] = topmost displayed)
  for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
    const row = rows[rowIdx];
    const isTopRow = rowIdx === 0;
    const count = row.length;

    // Determine x offset for row alignment (only applies to the topmost incomplete row)
    let rowOffsetX = offsetX;
    if (isTopRow && count < maxPerRow) {
      const fullRowWidth = maxPerRow * rw + (maxPerRow - 1) * gap;
      const thisRowWidth = count * rw + (count - 1) * gap;
      if (header.ra === 'c') {
        rowOffsetX = offsetX + Math.round((fullRowWidth - thisRowWidth) / 2);
      } else if (header.ra === 'r') {
        rowOffsetX = offsetX + (fullRowWidth - thisRowWidth);
      }
      // 'l' keeps rowOffsetX = offsetX
    }

    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const token = row[colIdx];
      const x = rowOffsetX + colIdx * (rw + gap);
      const y = currentY;

      const { stripes, frame, name } = resolveRibbonVisuals(token, registry, scaleFactor);

      // Frame may change ribbon dimensions
      const useFrame = frame && frame !== 'none';
      const fw = useFrame ? Math.round(FRAME_W * scaleFactor) : rw;
      const fh = useFrame ? Math.round(FRAME_H * scaleFactor) : rh;

      const devices = computeDevicePositions(token.decorations, fw, fh, scaleFactor);

      ribbons.push({ x, y, width: fw, height: fh, stripes, frame, devices, name });
    }

    currentY += rh + (rowIdx < rows.length - 1 ? rowSpacingPx : 0);
  }

  const fullRowWidth = maxPerRow * rw + (maxPerRow - 1) * gap;
  const totalHeight = currentY - offsetY;

  return { ribbons, totalWidth: fullRowWidth, totalHeight };
}

// ─── Visual resolution ────────────────────────────────────────────────────────

interface RibbonVisuals {
  stripes: ResolvedStripe[];
  frame?: 'gold' | 'silver';
  name?: string;
}

function resolveRibbonVisuals(
  token: RibbonToken,
  registry: Registry,
  scaleFactor: number,
): RibbonVisuals {
  let stripes: ResolvedStripe[];
  let registryFrame: 'gold' | 'silver' | 'none' | undefined;
  let name: string | undefined;

  if (token.ref.kind === 'slug') {
    const entry = resolveSlug(registry, token.ref.id);
    if (!entry) {
      console.warn(`[rackspec] Unknown ribbon ID "${token.ref.id}" — rendering placeholder.`);
      stripes = [{ color: '#CCCCCC', width: 1 }];
    } else {
      stripes = entry.stripes.map(s => ({ color: resolveStripeColor(s.color), width: s.width }));
      registryFrame = entry.frame as 'gold' | 'silver' | 'none' | undefined;
      name = entry.name;
    }
  } else {
    // Inline stripes are already color-resolved during parsing
    stripes = token.ref.stripes;
  }

  // Override frame from decoration flags (@f:gold, @f:silver, @f:none)
  // Track whether ANY @f flag was explicitly set so @f:none can suppress the registry default.
  let explicitFrame: 'gold' | 'silver' | 'none' | null = null;
  for (const d of token.decorations) {
    if (d.kind === 'flag' && d.key === 'f') {
      explicitFrame = d.value;
    }
  }

  let frame: 'gold' | 'silver' | undefined;
  if (explicitFrame !== null) {
    // @f:none → no frame (§15 rule 11)
    frame = explicitFrame === 'none' ? undefined : explicitFrame;
  } else if (registryFrame && registryFrame !== 'none') {
    frame = registryFrame;
  }

  return { stripes, frame, name };
}

// ─── Device position computation (§8.2.3) ────────────────────────────────────

export function computeDevicePositions(
  decorations: RibbonToken['decorations'],
  ribbonW: number,
  ribbonH: number,
  scaleFactor: number = 1,
): LayoutDevice[] {
  // Separate devices from flags; apply explicit @pos overrides
  const deviceTokens = decorations.filter((d): d is DeviceToken => d.kind === 'device');
  if (deviceTokens.length === 0) return [];

  const cy = ribbonH / 2;
  const cx = ribbonW / 2;

  // Devices with explicit position overrides bypass the rules
  const explicit: LayoutDevice[] = [];
  const auto: DeviceToken[] = [];

  for (const dt of deviceTokens) {
    if (dt.pos) {
      const deviceCx = dt.pos === 'c' ? cx : dt.pos === 'r' ? cx + ribbonW / 4 : cx - ribbonW / 4;
      explicit.push({ ...dt, cx: deviceCx, cy });
    } else {
      auto.push(dt);
    }
  }

  const autoLayout = placeAutoDevices(auto, ribbonW, ribbonH, cx, cy, scaleFactor);
  return [...explicit, ...autoLayout];
}

function placeAutoDevices(
  devices: DeviceToken[],
  ribbonW: number,
  ribbonH: number,
  cx: number,
  cy: number,
  scaleFactor: number,
): LayoutDevice[] {
  if (devices.length === 0) return [];

  const result: LayoutDevice[] = [];
  const remaining: DeviceToken[] = [];

  // Fixed-position devices are placed first, regardless of count
  for (const dt of devices) {
    if (dt.typeCode === 'vd') {
      // Far viewer's right
      result.push({ ...dt, cx: ribbonW - Math.round(14 * scaleFactor), cy });
    } else if (dt.typeCode === 'arr') {
      // Far viewer's left
      result.push({ ...dt, cx: Math.round(14 * scaleFactor), cy });
    } else if (dt.typeCode === 'mid') {
      // Centered, flat
      result.push({ ...dt, cx, cy });
    } else if (dt.typeCode === 'clsp') {
      result.push({ ...dt, cx, cy });
    } else if (dt.typeCode === 'num') {
      result.push({ ...dt, cx, cy });
    } else if (dt.typeCode === 'ros') {
      result.push({ ...dt, cx, cy });
    } else {
      remaining.push(dt);
    }
  }

  // For knt (knot clasps) — evenly spaced or centered
  const knots = remaining.filter(d => d.typeCode === 'knt');
  const others = remaining.filter(d => d.typeCode !== 'knt');

  if (knots.length > 0) {
    const knotDt = knots[0]; // all knt devices are the same type with a count
    const n = knotDt.count ?? 1;
    const kw = Math.round(KNOT_W * scaleFactor);
    const totalKnotWidth = n * kw + (n - 1) * Math.round(4 * scaleFactor);
    const startX = (ribbonW - totalKnotWidth) / 2 + kw / 2;
    for (let i = 0; i < n; i++) {
      result.push({
        typeCode: 'knt',
        material: knotDt.material,
        count: 1,  // emit individually for rendering
        cx: startX + i * (kw + Math.round(4 * scaleFactor)),
        cy,
      });
    }
  }

  if (others.length === 0) return result;

  // Standard positional rules for star/OLC devices
  placeSymmetric(others, cx, cy, ribbonW, scaleFactor, result);

  return result;
}

function placeSymmetric(
  devices: DeviceToken[],
  cx: number,
  cy: number,
  ribbonW: number,
  scaleFactor: number,
  out: LayoutDevice[],
): void {
  const step = Math.round(22 * scaleFactor); // spacing between symmetric devices

  // Check if there's a silver device — it goes center, others radiate outward
  const silverDevice = devices.find(d =>
    d.typeCode === 'olcs' || d.typeCode === 'sts' || d.typeCode === 'stcs'
  );

  if (silverDevice) {
    out.push({ ...silverDevice, cx, cy });
    const goldDevices = devices.filter(d => d !== silverDevice);
    placeRadial(goldDevices, cx, cy, step, out);
    return;
  }

  // No silver device — use standard count-based rules
  switch (devices.length) {
    case 1:
      out.push({ ...devices[0], cx, cy });
      break;
    case 2:
      // viewer's right first, then left
      out.push({ ...devices[0], cx: cx + step, cy });
      out.push({ ...devices[1], cx: cx - step, cy });
      break;
    case 3:
      out.push({ ...devices[0], cx, cy });
      out.push({ ...devices[1], cx: cx + step, cy });
      out.push({ ...devices[2], cx: cx - step, cy });
      break;
    case 4:
      out.push({ ...devices[0], cx: cx + step, cy });
      out.push({ ...devices[1], cx: cx - step, cy });
      out.push({ ...devices[2], cx: cx + step * 2.2, cy });
      out.push({ ...devices[3], cx: cx - step * 2.2, cy });
      break;
    case 5:
      out.push({ ...devices[0], cx, cy });
      out.push({ ...devices[1], cx: cx + step, cy });
      out.push({ ...devices[2], cx: cx - step, cy });
      out.push({ ...devices[3], cx: cx + step * 2.2, cy });
      out.push({ ...devices[4], cx: cx - step * 2.2, cy });
      break;
    default:
      // More than 5 — center the cluster
      for (let i = 0; i < devices.length; i++) {
        out.push({ ...devices[i], cx: cx + (i - (devices.length - 1) / 2) * step, cy });
      }
  }
}

function placeRadial(
  devices: DeviceToken[],
  cx: number,
  cy: number,
  step: number,
  out: LayoutDevice[],
): void {
  // First to viewer's right, then left, alternating
  for (let i = 0; i < devices.length; i++) {
    const side = i % 2 === 0 ? 1 : -1;
    const offset = Math.ceil((i + 1) / 2) * step;
    out.push({ ...devices[i], cx: cx + side * offset, cy });
  }
}
