export { parse } from './parser.js';
export { renderLayout } from './renderer.js';
export { loadRegistry, mergeRegistry, resolveSlug, getDefaultRegistry } from './registry.js';
export { STUB_RIBBONS } from './data/ribbons.js';
export { PALETTE } from './data/palette.js';

export type {
  RackSpec,
  Header,
  Row,
  RibbonToken,
  RibbonRef,
  SlugRef,
  InlineStripeRef,
  Stripe,
  Decoration,
  FlagToken,
  DeviceToken,
  RegistryEntry,
  RegistryStripe,
  RenderOptions,
  ParseError,
  ParseErrorCode,
} from './types.js';
export { RackSpecParseError } from './types.js';

// Convenience: parse + render in one call
import { parse } from './parser.js';
import { renderLayout } from './renderer.js';
import type { RenderOptions } from './types.js';

/**
 * Parse a RackSpec DSL v1 string and return an SVG string.
 *
 * @param spec  RackSpec DSL string (raw or base64url-encoded)
 * @param options  Optional registry overrides and scale factor
 * @returns  Complete `<svg>…</svg>` string
 */
export function renderSpec(spec: string, options?: RenderOptions): string {
  const rack = parse(spec);
  return renderLayout(rack, options);
}

/** Primary entry point: parse a RackSpec DSL string and return SVG. */
export { renderSpec as render };
