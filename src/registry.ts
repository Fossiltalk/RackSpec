import type { RegistryEntry } from './types.js';
import { ALL_RIBBONS } from './data/ribbons/index.js';
import { PALETTE } from './data/palette.js';

export interface Registry {
  entries: Map<string, RegistryEntry>;
}

// ─── Load / merge ─────────────────────────────────────────────────────────────

export function loadRegistry(entries: RegistryEntry[]): Registry {
  const map = new Map<string, RegistryEntry>();
  for (const entry of entries) {
    if (!entry.id || !entry.name || !entry.branch || !entry.stripes) {
      console.warn(`[rackspec] Registry entry missing required fields — skipping.`, entry);
      continue;
    }
    if (map.has(entry.id)) {
      throw new Error(`[rackspec] Duplicate registry ID "${entry.id}". Registry load aborted.`);
    }
    map.set(entry.id, entry);
  }
  return { entries: map };
}

export function mergeRegistry(base: Registry, overrides: RegistryEntry[]): Registry {
  const merged = new Map(base.entries);
  for (const entry of overrides) {
    if (!entry.id || !entry.name || !entry.branch || !entry.stripes) {
      console.warn(`[rackspec] Override registry entry missing required fields — skipping.`, entry);
      continue;
    }
    merged.set(entry.id, entry);
  }
  return { entries: merged };
}

export function resolveSlug(registry: Registry, id: string): RegistryEntry | null {
  return registry.entries.get(id) ?? null;
}

// ─── Stripe color resolution ──────────────────────────────────────────────────

/**
 * Resolves a stripe color string ($palette-name or #RRGGBB) to a hex value.
 */
export function resolveStripeColor(color: string): string {
  if (color.startsWith('$')) {
    const name = color.slice(1);
    const hex = PALETTE[name];
    if (!hex) {
      console.warn(`[rackspec] Unknown palette color "${name}" in registry — using #CCCCCC.`);
      return '#CCCCCC';
    }
    return hex;
  }
  return color; // already hex
}

// ─── Default registry singleton ───────────────────────────────────────────────

let _defaultRegistry: Registry | null = null;

export function getDefaultRegistry(): Registry {
  if (!_defaultRegistry) {
    _defaultRegistry = loadRegistry(ALL_RIBBONS);
  }
  return _defaultRegistry;
}
