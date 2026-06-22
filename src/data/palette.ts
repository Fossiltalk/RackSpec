/**
 * Named color palette (§13.3).
 * Maps palette slug names to sRGB hex values (approximations of PMS/AMS-STD-595).
 * Hex values are render approximations; physical chips are authoritative.
 */
export const PALETTE: Record<string, string> = {
  'old-glory-red':    '#BF0A30',
  'old-glory-blue':   '#002868',
  'golden-yellow':    '#FDD017',
  'imperial-blue':    '#004B8D',
  'myrtle-green':     '#007A33',
  'crimson':          '#990000',
  'scarlet':          '#CC0000',
  'white':            '#FFFFFF',
  'black':            '#000000',
  'gold':             '#C5A028',
  'silver':           '#A8A9AD',
  // Additional colors used by stub registry ribbons
  'purple':           '#4B0082',
  'green':            '#006400',
  'tan':              '#D2B48C',
  'khaki':            '#C3B091',
  'dark-blue':        '#00008B',
  'light-blue':       '#ADD8E6',
  'dark-green':       '#006400',
  'orange':           '#FF8C00',
  'maroon':           '#800000',
  'navy-blue':        '#000080',
  'forest-green':     '#228B22',
  'buff':             '#F0DC82',
  'sky-blue':         '#87CEEB',
};
