interface RackSpec {
    version: 'rack/v1';
    header: Header;
    leftRows: Row[];
    rightRows?: Row[];
}
type BranchCode = string;
type UniformType = 'service' | 'dress' | 'mess' | 'parade' | 'working' | 'digital';
type DisplayMode = 'full' | 'top3' | 'fav9' | 'mini' | 'mini-full';
type RowAlignment = 'c' | 'l' | 'r';
type RowSpacing = 0 | 1 | 2;
type TextureCode = 'flat' | 'grille';
interface Header {
    br: BranchCode;
    ut: UniformType;
    dm: DisplayMode;
    rw: 3 | 4;
    ra: RowAlignment;
    sp: RowSpacing;
    tx: TextureCode;
}
type Row = RibbonToken[];
interface RibbonToken {
    ref: RibbonRef;
    decorations: Decoration[];
}
type RibbonRef = SlugRef | InlineStripeRef;
interface SlugRef {
    kind: 'slug';
    id: string;
}
interface InlineStripeRef {
    kind: 'inline';
    stripes: Stripe[];
}
interface Stripe {
    /** Hex color: #RRGGBB */
    color: string;
    /** Proportional width (positive integer) */
    width: number;
}
type Decoration = FlagToken | DeviceToken;
interface FlagToken {
    kind: 'flag';
    key: 'f';
    value: 'gold' | 'silver' | 'none';
}
interface DeviceToken {
    kind: 'device';
    typeCode: string;
    material?: 'b' | 's' | 'g' | 'w';
    count?: number;
    param?: string;
    pos?: 'c' | 'l' | 'r';
}
interface RegistryStripe {
    color: string;
    width: number;
}
interface RegistryEntry {
    id: string;
    name: string;
    branch: string[];
    stripes: RegistryStripe[];
    authorizedDevices?: string[];
    frame?: 'none' | 'gold' | 'silver';
}
interface RenderOptions {
    /** Additional registry entries merged at render time (override built-ins by ID) */
    registry?: RegistryEntry[];
    /** Pixels per inch; default 96 */
    scale?: number;
}
type ParseErrorCode = 'UNKNOWN_VERSION' | 'MISSING_BR' | 'INVALID_SLUG_CHARS' | 'INVALID_STRIPE_WIDTH' | 'INVALID_HEX_COLOR' | 'EMPTY_ROW_BLOCK' | 'INVALID_DEVICE_COUNT';
interface ParseError {
    code: ParseErrorCode;
    message: string;
}
declare class RackSpecParseError extends Error {
    readonly code: ParseErrorCode;
    constructor(code: ParseErrorCode, message: string);
}

declare function parse(input: string): RackSpec;

declare function renderLayout(rack: RackSpec, options?: RenderOptions): string;

interface Registry {
    entries: Map<string, RegistryEntry>;
}
declare function loadRegistry(entries: RegistryEntry[]): Registry;
declare function mergeRegistry(base: Registry, overrides: RegistryEntry[]): Registry;
declare function resolveSlug(registry: Registry, id: string): RegistryEntry | null;
declare function getDefaultRegistry(): Registry;

/**
 * Stub ribbon registry.
 * Stripe definitions are proportional widths with approximate colors.
 * These 12 entries cover all spec §18 examples needed for integration tests.
 */
declare const STUB_RIBBONS: RegistryEntry[];

/**
 * Named color palette (§13.3).
 * Maps palette slug names to sRGB hex values (approximations of PMS/AMS-STD-595).
 * Hex values are render approximations; physical chips are authoritative.
 */
declare const PALETTE: Record<string, string>;

/**
 * Parse a RackSpec DSL v1 string and return an SVG string.
 *
 * @param spec  RackSpec DSL string (raw or base64url-encoded)
 * @param options  Optional registry overrides and scale factor
 * @returns  Complete `<svg>…</svg>` string
 */
declare function renderSpec(spec: string, options?: RenderOptions): string;

export { type Decoration, type DeviceToken, type FlagToken, type Header, type InlineStripeRef, PALETTE, type ParseError, type ParseErrorCode, type RackSpec, RackSpecParseError, type RegistryEntry, type RegistryStripe, type RenderOptions, type RibbonRef, type RibbonToken, type Row, STUB_RIBBONS, type SlugRef, type Stripe, getDefaultRegistry, loadRegistry, mergeRegistry, parse, renderLayout as render, renderSpec, resolveSlug };
