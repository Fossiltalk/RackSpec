import type {
  RackSpec,
  Header,
  Row,
  RibbonToken,
  RibbonRef,
  Decoration,
  FlagToken,
  DeviceToken,
  Stripe,
  UniformType,
  DisplayMode,
  RowAlignment,
  RowSpacing,
  TextureCode,
} from './types.js';
import { RackSpecParseError } from './types.js';
import { PALETTE } from './data/palette.js';

// ─── Header field regex (§5.3) ────────────────────────────────────────────────

const HEADER_FIELD_RE = /^[a-z0-9]{1,8}:[a-z0-9-]+$/;
const SLUG_CHARS_RE = /^[a-z0-9-]+$/;
const HEX_COLOR_RE = /^#[0-9A-F]{6}$/;

// ─── Public entry point ───────────────────────────────────────────────────────

export function parse(input: string): RackSpec {
  // Support base64url-encoded input (§14.2)
  const raw = maybeDecodeBase64url(input);

  const tokens = raw.split(';');

  // §16.1 — version must be first token
  if (tokens[0] !== 'rack/v1') {
    throw new RackSpecParseError(
      'UNKNOWN_VERSION',
      `Unrecognized version token "${tokens[0]}". Only "rack/v1" is supported.`,
    );
  }

  // Consume header fields until we hit a non-header token
  let i = 1;
  const headerRaw: Record<string, string> = {};
  while (i < tokens.length && HEADER_FIELD_RE.test(tokens[i])) {
    const colonIdx = tokens[i].indexOf(':');
    const key = tokens[i].slice(0, colonIdx);
    const value = tokens[i].slice(colonIdx + 1);
    headerRaw[key] = value;
    i++;
  }

  // §5.3 / §16.13 — br is required
  if (!headerRaw['br']) {
    throw new RackSpecParseError(
      'MISSING_BR',
      "Required header field 'br' is missing.",
    );
  }

  const header = buildHeader(headerRaw);

  // Remaining tokens are row blocks separated by ';'
  // left-breast block is tokens[i], right-breast block is tokens[i+1] (if present)
  const leftBlockRaw = tokens[i] ?? '';
  const rightBlockRaw = tokens[i + 1] ?? '';

  if (!leftBlockRaw.trim()) {
    throw new RackSpecParseError('EMPTY_ROW_BLOCK', 'Left-breast row block is empty.');
  }

  const leftRows = parseRowBlock(leftBlockRaw);
  const rightRows = rightBlockRaw.trim() ? parseRowBlock(rightBlockRaw) : undefined;

  return { version: 'rack/v1', header, leftRows, rightRows };
}

// ─── Header builder ───────────────────────────────────────────────────────────

function buildHeader(raw: Record<string, string>): Header {
  return {
    br: raw['br'] as string,
    ut: parseUniformType(raw['ut']),
    dm: parseDisplayMode(raw['dm']),
    rw: raw['rw'] === '4' ? 4 : 3,
    ra: parseRowAlignment(raw['ra']),
    sp: parseRowSpacing(raw['sp']),
    tx: raw['tx'] === 'grille' ? 'grille' : 'flat',
  };
}

function parseUniformType(v: string | undefined): UniformType {
  const valid: UniformType[] = ['service', 'dress', 'mess', 'parade', 'working', 'digital'];
  return valid.includes(v as UniformType) ? (v as UniformType) : 'service';
}

function parseDisplayMode(v: string | undefined): DisplayMode {
  const valid: DisplayMode[] = ['full', 'top3', 'fav9', 'mini', 'mini-full'];
  return valid.includes(v as DisplayMode) ? (v as DisplayMode) : 'full';
}

function parseRowAlignment(v: string | undefined): RowAlignment {
  return v === 'l' || v === 'r' ? v : 'c';
}

function parseRowSpacing(v: string | undefined): RowSpacing {
  if (v === '1') return 1;
  if (v === '2') return 2;
  return 0;
}

// ─── Row block / ribbon token parsing ────────────────────────────────────────

function parseRowBlock(block: string): Row[] {
  const rowStrings = block.split('|').filter(r => r.trim().length > 0);
  if (rowStrings.length === 0) {
    throw new RackSpecParseError('EMPTY_ROW_BLOCK', 'Row block contains no rows.');
  }
  return rowStrings.map(parseRow);
}

function parseRow(rowStr: string): Row {
  const tokenStrings = rowStr.split(',').filter(t => t.trim().length > 0);
  return tokenStrings.map(parseRibbonToken);
}

function parseRibbonToken(tokenStr: string): RibbonToken {
  const tildeIdx = tokenStr.indexOf('~');
  const refStr = tildeIdx === -1 ? tokenStr : tokenStr.slice(0, tildeIdx);
  const decorStr = tildeIdx === -1 ? '' : tokenStr.slice(tildeIdx + 1);

  const ref = parseRibbonRef(refStr.trim());
  const decorations = decorStr ? parseDecorationList(decorStr) : [];

  return { ref, decorations };
}

// ─── Ribbon reference parsing ─────────────────────────────────────────────────

function parseRibbonRef(refStr: string): RibbonRef {
  if (refStr.startsWith('[')) {
    return parseInlineStripeSpec(refStr);
  }
  // Slug ID — validate characters (§16.15)
  if (!SLUG_CHARS_RE.test(refStr)) {
    throw new RackSpecParseError(
      'INVALID_SLUG_CHARS',
      `Invalid characters in slug ID "${refStr}". Only [a-z0-9-] are allowed.`,
    );
  }
  return { kind: 'slug', id: refStr };
}

function parseInlineStripeSpec(spec: string): { kind: 'inline'; stripes: Stripe[] } {
  // Strip surrounding [ ]
  const inner = spec.slice(1, spec.endsWith(']') ? spec.length - 1 : spec.length);
  const stripeStrings = inner.split('_');
  const stripes: Stripe[] = [];

  for (const s of stripeStrings) {
    const eqIdx = s.indexOf('=');
    if (eqIdx === -1) {
      // Malformed — skip with warning
      console.warn(`[rackspec] Skipping malformed stripe token "${s}" in inline spec.`);
      continue;
    }
    const colorRef = s.slice(0, eqIdx);
    const widthStr = s.slice(eqIdx + 1);
    const width = parseInt(widthStr, 10);

    if (!Number.isInteger(width) || width <= 0) {
      throw new RackSpecParseError(
        'INVALID_STRIPE_WIDTH',
        `Invalid stripe width "${widthStr}" in inline spec.`,
      );
    }

    const color = resolveColorRef(colorRef, spec);
    stripes.push({ color, width });
  }

  return { kind: 'inline', stripes };
}

function resolveColorRef(ref: string, context: string): string {
  if (ref.startsWith('$')) {
    const name = ref.slice(1);
    const entry = PALETTE[name];
    if (!entry) {
      console.warn(`[rackspec] Unknown palette color "${name}" in "${context}". Falling back to #CCCCCC.`);
      return '#CCCCCC';
    }
    return entry;
  }
  if (ref.startsWith('#')) {
    if (!HEX_COLOR_RE.test(ref)) {
      throw new RackSpecParseError(
        'INVALID_HEX_COLOR',
        `Invalid hex color "${ref}" — must be #RRGGBB in uppercase.`,
      );
    }
    return ref;
  }
  console.warn(`[rackspec] Unrecognized color reference "${ref}" in "${context}". Falling back to #CCCCCC.`);
  return '#CCCCCC';
}

// ─── Decoration list parsing ──────────────────────────────────────────────────

function parseDecorationList(decorStr: string): Decoration[] {
  const parts = decorStr.split('.');
  return parts
    .filter(p => p.trim().length > 0)
    .map(parseDecorationToken)
    .filter((d): d is Decoration => d !== null);
}

function parseDecorationToken(token: string): Decoration | null {
  if (token.startsWith('@')) {
    return parseFlagToken(token);
  }
  return parseDeviceToken(token);
}

function parseFlagToken(token: string): FlagToken | null {
  // Format: @key:value
  const colonIdx = token.indexOf(':');
  if (colonIdx === -1) {
    console.warn(`[rackspec] Malformed flag token "${token}" — skipping.`);
    return null;
  }
  const key = token.slice(1, colonIdx);
  const value = token.slice(colonIdx + 1);

  if (key !== 'f') {
    // §16.18 — unknown flag keys are skipped with a warning
    console.warn(`[rackspec] Unknown flag key "@${key}" — skipping.`);
    return null;
  }

  if (value !== 'gold' && value !== 'silver' && value !== 'none') {
    console.warn(`[rackspec] Unknown @f value "${value}" — skipping.`);
    return null;
  }

  return { kind: 'flag', key: 'f', value: value as 'gold' | 'silver' | 'none' };
}

// Type codes that carry a material code suffix per §8.2.2.
// Listed longest-first so prefix matching tries the most specific match first.
const TYPE_CODES_WITH_MATERIAL = ['stc', 'olc', 'hg', 'knt', 'st'] as const;
const MATERIAL_CODE_RE = /^[bsgw]$/;

// Parameterized device regex (type-code:param[@pos])
const PARAM_DEVICE_RE = /^([a-z]{2,4}):([A-Za-z0-9-]+)(?:@([clr]))?$/;
// Simple device regex (no material extraction — for known codes like vd, arr, mid, etc.)
const SIMPLE_DEVICE_RE = /^([a-z]{2,4})(\d*)(?:@([clr]))?$/;

function parseDeviceToken(token: string): DeviceToken | null {
  const pos = extractPosOverride(token);
  // Remove @pos suffix for inner parsing
  const inner = pos ? token.slice(0, token.lastIndexOf('@' + pos)) : token;

  // 1. Parameterized devices: type:param
  const paramMatch = PARAM_DEVICE_RE.exec(inner);
  if (paramMatch) {
    const [, typeCode, param, posInner] = paramMatch;
    return { kind: 'device', typeCode, param, pos: (pos ?? posInner ?? undefined) as 'c'|'l'|'r'|undefined };
  }

  // 2. Devices with a material code suffix (longest type-code prefix wins)
  for (const prefix of TYPE_CODES_WITH_MATERIAL) {
    if (inner.startsWith(prefix)) {
      const rest = inner.slice(prefix.length);
      if (rest.length === 0 || MATERIAL_CODE_RE.test(rest[0]) || /\d/.test(rest[0])) {
        const material = (rest.length > 0 && MATERIAL_CODE_RE.test(rest[0])) ? rest[0] : undefined;
        const countStr = material ? rest.slice(1) : rest;
        if (countStr.length > 0 && !/^\d+$/.test(countStr)) break; // digits only after material
        const count = countStr ? parseInt(countStr, 10) : undefined;
        if (count !== undefined && (count < 1 || !Number.isInteger(count))) {
          console.warn(`[rackspec] Invalid device count "${countStr}" in "${token}" — skipping.`);
          return null;
        }
        return { kind: 'device', typeCode: prefix, material: material as 'b'|'s'|'g'|'w'|undefined, count, pos };
      }
    }
  }

  // 3. Simple devices (vd, cd, rd, od, md, arr, mid) — no material, optional count
  const simpleMatch = SIMPLE_DEVICE_RE.exec(inner);
  if (simpleMatch) {
    const [, typeCode, countStr, posInner] = simpleMatch;
    const count = countStr ? parseInt(countStr, 10) : undefined;
    if (count !== undefined && (count < 1 || !Number.isInteger(count))) {
      console.warn(`[rackspec] Invalid device count "${countStr}" in "${token}" — skipping.`);
      return null;
    }
    return { kind: 'device', typeCode, count, pos: (pos ?? posInner ?? undefined) as 'c'|'l'|'r'|undefined };
  }

  console.warn(`[rackspec] Could not parse device token "${token}" — skipping.`);
  return null;
}

function extractPosOverride(token: string): 'c' | 'l' | 'r' | undefined {
  const m = /@([clr])$/.exec(token);
  return m ? (m[1] as 'c' | 'l' | 'r') : undefined;
}

// ─── Base64url decode (§14.2) ─────────────────────────────────────────────────

function maybeDecodeBase64url(input: string): string {
  if (input.startsWith('rack/v')) return input;
  try {
    // base64url → base64
    const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(b64);
    if (decoded.startsWith('rack/v')) return decoded;
  } catch {
    // not base64 — treat as raw
  }
  return input;
}
