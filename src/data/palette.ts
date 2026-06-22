/**
 * Named color palette (§13.3).
 * Maps palette slug names to sRGB hex values.
 *
 * Hex values are render approximations of PMS/AMS-STD-595 physical chips.
 * Physical chips and FS-595/AMS-STD-595 are authoritative for manufacturing;
 * hex values are sufficient for on-screen rendering.
 *
 * TIOH = The Institute of Heraldry (authoritative for US awards)
 */
export const PALETTE: Record<string, string> = {
  // ─── US Flag / National colors (TIOH ribbon values) ────────────────────────
  'old-glory-red':        '#BF0A30',  // PMS 200 C, FS 11086
  'old-glory-blue':       '#002868',  // PMS 280 C, FS 15056
  'scarlet':              '#CC0000',  // PMS 485 C, FS 11105
  'crimson':              '#990000',  // PMS 201 C, FS 11136

  // ─── Blues ──────────────────────────────────────────────────────────────────
  'imperial-blue':        '#004B8D',  // PMS 293 C, FS 15095
  'ultramarine-blue':     '#003087',  // FS 15090 — Army/Navy ribbon blue
  'bluebird':             '#5B8DB8',  // FS 15121 — medium cornflower blue (Defense medals)
  'grotto-blue':          '#1D4B8B',  // Deep royal blue (Coast Guard DSM)
  'navy-blue':            '#000080',  // Standard navy blue
  'sky-blue':             '#87CEEB',  // Light sky blue

  // ─── Greens ─────────────────────────────────────────────────────────────────
  'myrtle-green':         '#007A33',  // PMS 356 C, FS 14110
  'irish-green':          '#009A44',  // PMS 347 C — EAME Campaign, vivid green
  'primitive-green':      '#4A6130',  // FS 34077 — olive/jungle green, Vietnam Service

  // ─── Yellows / Golds ────────────────────────────────────────────────────────
  'golden-yellow':        '#FDD017',  // PMS 116 C, FS 13655
  'air-force-yellow':     '#FFD100',  // PMS 109 C — lighter AF/SSF yellow
  'gold':                 '#C5A028',  // PMS 871 C, FS 13538 — metallic gold
  'golden-orange':        '#D97B0E',  // Warm golden-orange (Air Medal stripes)
  'chamois':              '#C8A96E',  // FS 20219 — tan/buff (Iraq Campaign center)

  // ─── Reds / Purples ─────────────────────────────────────────────────────────
  'purple-heart-purple':  '#7851A9',  // "Old orchid" — Purple Heart ribbon
  'purple-violet':        '#4B2D7F',  // Deeper violet/purple

  // ─── Earth / Neutrals ───────────────────────────────────────────────────────
  'earth-brown':          '#826644',  // Earth tone (EAME Campaign edges)
  'persian-orange':       '#DC7B39',  // Orange (MFO Medal)
  'buff':                 '#F0DC82',  // Light buff/straw

  // ─── Monochrome ─────────────────────────────────────────────────────────────
  'black':                '#000000',  // FS 17038
  'white':                '#FFFFFF',  // FS 17925
  'silver':               '#A8A9AD',  // PMS 877 C — metallic silver
};
