// ─── Top-level parsed structure ───────────────────────────────────────────────

export interface RackSpec {
  version: 'rack/v1';
  header: Header;
  leftRows: Row[];
  rightRows?: Row[];
}

// ─── Header ───────────────────────────────────────────────────────────────────

export type BranchCode = string; // us-army, us-navy, uk, etc. (§10)
export type UniformType = 'service' | 'dress' | 'mess' | 'parade' | 'working' | 'digital';
export type DisplayMode = 'full' | 'top3' | 'fav9' | 'mini' | 'mini-full';
export type RowAlignment = 'c' | 'l' | 'r';
export type RowSpacing = 0 | 1 | 2;
export type TextureCode = 'flat' | 'grille';

export interface Header {
  br: BranchCode;
  ut: UniformType;
  dm: DisplayMode;
  rw: 3 | 4;
  ra: RowAlignment;
  sp: RowSpacing;
  tx: TextureCode;
}

// ─── Row / ribbon token ───────────────────────────────────────────────────────

export type Row = RibbonToken[];

export interface RibbonToken {
  ref: RibbonRef;
  decorations: Decoration[];
}

// ─── Ribbon reference (§7.1) ──────────────────────────────────────────────────

export type RibbonRef = SlugRef | InlineStripeRef;

export interface SlugRef {
  kind: 'slug';
  id: string;
}

export interface InlineStripeRef {
  kind: 'inline';
  stripes: Stripe[];
}

export interface Stripe {
  /** Hex color: #RRGGBB */
  color: string;
  /** Proportional width (positive integer) */
  width: number;
}

// ─── Decorations (§8) ─────────────────────────────────────────────────────────

export type Decoration = FlagToken | DeviceToken;

export interface FlagToken {
  kind: 'flag';
  key: 'f';
  value: 'gold' | 'silver' | 'none';
}

export interface DeviceToken {
  kind: 'device';
  typeCode: string;
  material?: 'b' | 's' | 'g' | 'w';
  count?: number;
  param?: string;
  pos?: 'c' | 'l' | 'r';
}

// ─── Registry (§13.4) ─────────────────────────────────────────────────────────

export interface RegistryStripe {
  color: string; // $palette-name or #RRGGBB
  width: number;
}

export interface RegistryEntry {
  id: string;
  name: string;
  branch: string[];
  stripes: RegistryStripe[];
  authorizedDevices?: string[];
  frame?: 'none' | 'gold' | 'silver';
}

// ─── Render options ───────────────────────────────────────────────────────────

export interface RenderOptions {
  /** Additional registry entries merged at render time (override built-ins by ID) */
  registry?: RegistryEntry[];
  /** Pixels per inch; default 96 */
  scale?: number;
}

// ─── Parse errors ─────────────────────────────────────────────────────────────

export type ParseErrorCode =
  | 'UNKNOWN_VERSION'
  | 'MISSING_BR'
  | 'INVALID_SLUG_CHARS'
  | 'INVALID_STRIPE_WIDTH'
  | 'INVALID_HEX_COLOR'
  | 'EMPTY_ROW_BLOCK'
  | 'INVALID_DEVICE_COUNT';

export interface ParseError {
  code: ParseErrorCode;
  message: string;
}

export class RackSpecParseError extends Error {
  constructor(
    public readonly code: ParseErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'RackSpecParseError';
  }
}
