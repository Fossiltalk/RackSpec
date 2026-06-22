/**
 * Joint / interservice medals and campaign medals worn by all or multiple US branches.
 * Stripe data sourced from The Institute of Heraldry (tioh.army.mil) and MIL-DTL-11589.
 * Proportional widths are in 64ths of an inch (total ribbon = 88/64" = 1-3/8").
 * Colors marked † are close approximations; physical chips are authoritative.
 */
import type { RegistryEntry } from '../../types.js';

const ALL_US = ['us-army', 'us-navy', 'us-usmc', 'us-af', 'us-ssf', 'us-uscg'];

export const US_JOINT_RIBBONS: RegistryEntry[] = [

  // ─── DEFENSE-WIDE DECORATIONS ─────────────────────────────────────────────

  {
    id: 'defense-distinguished-service',
    name: 'Defense Distinguished Service Medal',
    branch: ALL_US,
    stripes: [
      { color: '$bluebird',       width: 24 },
      { color: '$golden-yellow',  width: 16 },
      { color: '$scarlet',        width:  8 },
      { color: '$golden-yellow',  width: 16 },
      { color: '$bluebird',       width: 24 },
    ],
    authorizedDevices: ['olc', 'st'],
    frame: 'none',
  },

  {
    id: 'defense-superior-service',
    name: 'Defense Superior Service Medal',
    branch: ALL_US,
    stripes: [
      { color: '$golden-yellow',  width: 12 },
      { color: '$bluebird',       width: 16 },
      { color: '$white',          width: 12 },
      { color: '$scarlet',        width:  8 },
      { color: '$white',          width: 12 },
      { color: '$bluebird',       width: 16 },
      { color: '$golden-yellow',  width: 12 },
    ],
    authorizedDevices: ['olc', 'st'],
    frame: 'none',
  },

  {
    id: 'defense-meritorious-service',
    name: 'Defense Meritorious Service Medal',
    branch: ALL_US,
    // †Approximate — bluebird outer, crimson/white layered center
    stripes: [
      { color: '$bluebird',   width:  8 },
      { color: '$white',      width:  4 },
      { color: '$crimson',    width: 12 },
      { color: '$white',      width:  4 },
      { color: '$crimson',    width: 24 },
      { color: '$white',      width:  4 },
      { color: '$crimson',    width: 12 },
      { color: '$white',      width:  4 },
      { color: '$bluebird',   width:  8 },
    ],
    authorizedDevices: ['olc', 'st'],
    frame: 'none',
  },

  {
    id: 'joint-commendation',
    name: 'Joint Service Commendation Medal',
    branch: ALL_US,
    stripes: [
      { color: '$bluebird',      width: 16 },
      { color: '$white',         width:  8 },
      { color: '$myrtle-green',  width:  6 },
      { color: '$white',         width:  8 },
      { color: '$myrtle-green',  width: 16 },
      { color: '$white',         width:  8 },
      { color: '$myrtle-green',  width:  6 },
      { color: '$white',         width:  8 },
      { color: '$bluebird',      width: 16 },
    ],
    authorizedDevices: ['olc', 'st', 'vd'],
    frame: 'none',
  },

  {
    id: 'joint-achievement',
    name: 'Joint Service Achievement Medal',
    branch: ALL_US,
    // †Approximate — blue outer, green inner, red center
    stripes: [
      { color: '$old-glory-blue',  width: 12 },
      { color: '$white',           width:  6 },
      { color: '$myrtle-green',    width:  8 },
      { color: '$white',           width:  6 },
      { color: '$old-glory-red',   width: 14 },
      { color: '$white',           width:  6 },
      { color: '$myrtle-green',    width:  8 },
      { color: '$white',           width:  6 },
      { color: '$old-glory-blue',  width: 12 },
    ],
    authorizedDevices: ['olc', 'st'],
    frame: 'none',
  },

  {
    id: 'joint-meritorious-unit',
    name: 'Joint Meritorious Unit Award',
    branch: ALL_US,
    stripes: [
      { color: '$bluebird',      width: 12 },
      { color: '$golden-yellow', width:  8 },
      { color: '$bluebird',      width: 12 },
      { color: '$white',         width:  8 },
      { color: '$crimson',       width:  8 },
      { color: '$white',         width:  8 },
      { color: '$bluebird',      width: 12 },
      { color: '$golden-yellow', width:  8 },
      { color: '$bluebird',      width: 12 },
    ],
    authorizedDevices: ['olc', 'st'],
    frame: 'gold',
  },

  // ─── SHARED PERSONAL DECORATIONS ─────────────────────────────────────────

  {
    id: 'purple-heart',
    name: 'Purple Heart',
    branch: ALL_US,
    stripes: [
      { color: '$white',                width: 8 },
      { color: '$purple-heart-purple',  width: 72 },
      { color: '$white',                width: 8 },
    ],
    authorizedDevices: ['olc', 'st'],
    frame: 'none',
  },

  {
    // Same ribbon worn by all branches; devices differ by branch (see branch-specific entries)
    id: 'silver-star',
    name: 'Silver Star',
    branch: ALL_US,
    stripes: [
      { color: '$ultramarine-blue',  width:  6 },
      { color: '$white',             width:  3 },
      { color: '$ultramarine-blue',  width: 14 },
      { color: '$white',             width: 14 },
      { color: '$old-glory-red',     width:  4 },
      { color: '$white',             width: 14 },
      { color: '$ultramarine-blue',  width: 14 },
      { color: '$white',             width:  3 },
      { color: '$ultramarine-blue',  width:  6 },
    ],
    authorizedDevices: ['olc', 'st'],
    frame: 'none',
  },

  {
    id: 'legion-of-merit',
    name: 'Legion of Merit',
    branch: ALL_US,
    stripes: [
      { color: '$white',   width: 1 },
      { color: '$crimson', width: 20 },
      { color: '$white',   width: 1 },
    ],
    authorizedDevices: ['olc', 'st'],
    frame: 'none',
  },

  {
    id: 'distinguished-flying-cross',
    name: 'Distinguished Flying Cross',
    branch: ALL_US,
    stripes: [
      { color: '$ultramarine-blue',  width:  6 },
      { color: '$white',             width:  9 },
      { color: '$ultramarine-blue',  width: 11 },
      { color: '$white',             width:  3 },
      { color: '$old-glory-red',     width:  6 },
      { color: '$white',             width:  3 },
      { color: '$ultramarine-blue',  width: 11 },
      { color: '$white',             width:  9 },
      { color: '$ultramarine-blue',  width:  6 },
    ],
    authorizedDevices: ['olc', 'st', 'vd', 'cd'],
    frame: 'none',
  },

  {
    id: 'bronze-star',
    name: 'Bronze Star Medal',
    branch: ALL_US,
    // Predominantly scarlet flanks; narrow ultramarine center (MIL-DTL-11589)
    stripes: [
      { color: '$white',            width:  2 },
      { color: '$scarlet',          width: 18 },
      { color: '$white',            width:  2 },
      { color: '$ultramarine-blue', width:  8 },
      { color: '$white',            width:  2 },
      { color: '$scarlet',          width: 18 },
      { color: '$white',            width:  2 },
    ],
    authorizedDevices: ['olc', 'st', 'vd'],
    frame: 'none',
  },

  {
    id: 'meritorious-service',
    name: 'Meritorious Service Medal',
    branch: ALL_US,
    stripes: [
      { color: '$crimson', width: 1 },
      { color: '$white',   width: 2 },
      { color: '$crimson', width: 5 },
      { color: '$white',   width: 2 },
      { color: '$crimson', width: 1 },
    ],
    authorizedDevices: ['olc', 'st'],
    frame: 'none',
  },

  {
    id: 'air-medal',
    name: 'Air Medal',
    branch: ALL_US,
    // Ultramarine blue flanks; golden-orange stripes; ultramarine center
    stripes: [
      { color: '$ultramarine-blue', width:  8 },
      { color: '$golden-orange',    width: 16 },
      { color: '$ultramarine-blue', width: 40 },
      { color: '$golden-orange',    width: 16 },
      { color: '$ultramarine-blue', width:  8 },
    ],
    authorizedDevices: ['olc', 'st', 'num'],
    frame: 'none',
  },

  {
    id: 'humanitarian-service',
    name: 'Humanitarian Service Medal',
    branch: ALL_US,
    stripes: [
      { color: '$purple-violet',  width: 12 },
      { color: '$white',          width:  4 },
      { color: '$bluebird',       width: 20 },
      { color: '$old-glory-blue', width: 16 },
      { color: '$bluebird',       width: 20 },
      { color: '$white',          width:  4 },
      { color: '$purple-violet',  width: 12 },
    ],
    authorizedDevices: ['stc'],
    frame: 'none',
  },

  {
    id: 'pow-medal',
    name: 'Prisoner of War Medal',
    branch: ALL_US,
    stripes: [
      { color: '$old-glory-red',  width:  4 },
      { color: '$white',          width:  6 },
      { color: '$old-glory-blue', width:  4 },
      { color: '#1A1A1A',         width: 52 },  // Black center
      { color: '$old-glory-blue', width:  4 },
      { color: '$white',          width:  6 },
      { color: '$old-glory-red',  width:  4 },
    ],
    authorizedDevices: [],
    frame: 'none',
  },

  {
    id: 'mfo-medal',
    name: 'Multinational Force and Observers Medal',
    branch: ALL_US,
    stripes: [
      { color: '$persian-orange', width: 6 },
      { color: '$primitive-green', width: 2 },
      { color: '$white',           width: 6 },
      { color: '$primitive-green', width: 2 },
      { color: '$persian-orange',  width: 6 },
    ],
    authorizedDevices: ['num'],
    frame: 'none',
  },

  {
    id: 'armed-forces-service',
    name: 'Armed Forces Service Medal',
    branch: ALL_US,
    // Multiple green shades flanking a central bluebird blue †
    stripes: [
      { color: '$golden-yellow',   width: 4 },
      { color: '$primitive-green', width: 8 },
      { color: '$myrtle-green',    width: 8 },
      { color: '$primitive-green', width: 8 },
      { color: '$golden-yellow',   width: 8 },
      { color: '$bluebird',        width: 16 },
      { color: '$golden-yellow',   width: 8 },
      { color: '$primitive-green', width: 8 },
      { color: '$myrtle-green',    width: 8 },
      { color: '$primitive-green', width: 8 },
      { color: '$golden-yellow',   width: 4 },
    ],
    authorizedDevices: ['stc'],
    frame: 'none',
  },

  {
    id: 'armed-forces-reserve',
    name: 'Armed Forces Reserve Medal',
    branch: ALL_US,
    // Alternating bluebird and chamois stripes (2-color design MIL-DTL-11589)
    stripes: [
      { color: '$bluebird', width: 4 },
      { color: '$chamois',  width: 2 },
      { color: '$bluebird', width: 4 },
      { color: '$chamois',  width: 2 },
      { color: '$bluebird', width: 4 },
      { color: '$chamois',  width: 24 },
      { color: '$bluebird', width: 8 },
      { color: '$chamois',  width: 24 },
      { color: '$bluebird', width: 4 },
      { color: '$chamois',  width: 2 },
      { color: '$bluebird', width: 4 },
      { color: '$chamois',  width: 2 },
      { color: '$bluebird', width: 4 },
    ],
    authorizedDevices: ['hg', 'md', 'num'],
    frame: 'none',
  },

  // ─── CAMPAIGN / SERVICE MEDALS (all branches) ─────────────────────────────

  {
    id: 'national-defense-service',
    name: 'National Defense Service Medal',
    branch: ALL_US,
    // Scarlet edges | thin blue/white pinstripes | golden-yellow center (MIL-DTL-11589)
    stripes: [
      { color: '$scarlet',         width: 14 },
      { color: '$white',           width:  1 },
      { color: '$old-glory-blue',  width:  1 },
      { color: '$white',           width:  1 },
      { color: '$scarlet',         width:  1 },
      { color: '$golden-yellow',   width:  8 },
      { color: '$scarlet',         width:  1 },
      { color: '$white',           width:  1 },
      { color: '$old-glory-blue',  width:  1 },
      { color: '$white',           width:  1 },
      { color: '$scarlet',         width: 14 },
    ],
    authorizedDevices: ['stc'],
    frame: 'none',
  },

  {
    id: 'armed-forces-expeditionary',
    name: 'Armed Forces Expeditionary Medal',
    branch: ALL_US,
    // Green/yellow/brown edges; blue/white/red center (MIL-DTL-11589) †
    stripes: [
      { color: '$primitive-green',  width:  6 },
      { color: '$golden-yellow',    width:  6 },
      { color: '$earth-brown',      width:  6 },
      { color: '$black',            width:  6 },
      { color: '$bluebird',         width: 14 },
      { color: '$old-glory-blue',   width:  4 },
      { color: '$white',            width:  4 },
      { color: '$old-glory-red',    width:  4 },
      { color: '$old-glory-blue',   width:  4 },
      { color: '$bluebird',         width: 14 },
      { color: '$black',            width:  6 },
      { color: '$earth-brown',      width:  6 },
      { color: '$golden-yellow',    width:  6 },
      { color: '$primitive-green',  width:  6 },
    ],
    authorizedDevices: ['stc', 'arr'],
    frame: 'none',
  },

  {
    id: 'gwot-expeditionary',
    name: 'Global War on Terrorism Expeditionary Medal',
    branch: ALL_US,
    // Dark blue dominant with golden and scarlet accents (MIL-DTL-11589) †
    stripes: [
      { color: '$bluebird',        width: 10 },
      { color: '$old-glory-blue',  width:  6 },
      { color: '$white',           width:  4 },
      { color: '$old-glory-blue',  width:  4 },
      { color: '$bluebird',        width:  4 },
      { color: '$golden-yellow',   width:  4 },
      { color: '$bluebird',        width:  4 },
      { color: '$scarlet',         width: 12 },
      { color: '$bluebird',        width:  4 },
      { color: '$golden-yellow',   width:  4 },
      { color: '$bluebird',        width:  4 },
      { color: '$old-glory-blue',  width:  4 },
      { color: '$white',           width:  4 },
      { color: '$old-glory-blue',  width:  6 },
      { color: '$bluebird',        width: 10 },
    ],
    authorizedDevices: ['stc'],
    frame: 'none',
  },

  {
    id: 'gwot-service',
    name: 'Global War on Terrorism Service Medal',
    branch: ALL_US,
    // Old Glory Blue flanks | golden-yellow | scarlet | blue | white | blue(center) (MIL-DTL-11589)
    stripes: [
      { color: '$old-glory-blue',  width: 10 },
      { color: '$golden-yellow',   width:  8 },
      { color: '$scarlet',         width:  8 },
      { color: '$old-glory-blue',  width:  4 },
      { color: '$white',           width:  4 },
      { color: '$old-glory-blue',  width: 20 },
      { color: '$white',           width:  4 },
      { color: '$old-glory-blue',  width:  4 },
      { color: '$scarlet',         width:  8 },
      { color: '$golden-yellow',   width:  8 },
      { color: '$old-glory-blue',  width: 10 },
    ],
    authorizedDevices: ['stc'],
    frame: 'none',
  },

  {
    id: 'iraq-campaign',
    name: 'Iraq Campaign Medal',
    branch: ALL_US,
    // Scarlet | white | green | white | black | chamois(center) | black | white | green | white | scarlet
    stripes: [
      { color: '$scarlet',         width: 10 },
      { color: '$white',           width:  4 },
      { color: '$myrtle-green',    width:  2 },
      { color: '$white',           width:  4 },
      { color: '$black',           width: 10 },
      { color: '$chamois',         width: 28 },
      { color: '$black',           width: 10 },
      { color: '$white',           width:  4 },
      { color: '$myrtle-green',    width:  2 },
      { color: '$white',           width:  4 },
      { color: '$scarlet',         width: 10 },
    ],
    authorizedDevices: ['stc'],
    frame: 'none',
  },

  {
    id: 'afghanistan-campaign',
    name: 'Afghanistan Campaign Medal',
    branch: ALL_US,
    // Emerald | scarlet | black | white | red/white/blue center | white | black | scarlet | emerald
    stripes: [
      { color: '$myrtle-green',    width:  5 },
      { color: '$scarlet',         width: 12 },
      { color: '$black',           width:  8 },
      { color: '$white',           width: 14 },
      { color: '$old-glory-red',   width:  2 },
      { color: '$white',           width:  2 },
      { color: '$old-glory-blue',  width:  2 },
      { color: '$white',           width: 14 },
      { color: '$black',           width:  8 },
      { color: '$scarlet',         width: 12 },
      { color: '$myrtle-green',    width:  5 },
    ],
    authorizedDevices: ['stc'],
    frame: 'none',
  },

  {
    id: 'inherent-resolve-campaign',
    name: 'Inherent Resolve Campaign Medal',
    branch: ALL_US,
    // Blue | teal | sand/tan | orange | sand/tan | teal | blue †
    stripes: [
      { color: '$old-glory-blue',  width: 10 },
      { color: '$bluebird',        width:  8 },
      { color: '$chamois',         width: 12 },
      { color: '$persian-orange',  width: 28 },
      { color: '$chamois',         width: 12 },
      { color: '$bluebird',        width:  8 },
      { color: '$old-glory-blue',  width: 10 },
    ],
    authorizedDevices: ['stc'],
    frame: 'none',
  },

  {
    id: 'korean-service',
    name: 'Korean Service Medal',
    branch: ALL_US,
    // White edge | wide bluebird | white center | wide bluebird | white edge
    stripes: [
      { color: '$white',    width:  2 },
      { color: '$bluebird', width: 38 },
      { color: '$white',    width:  8 },
      { color: '$bluebird', width: 38 },
      { color: '$white',    width:  2 },
    ],
    authorizedDevices: ['stc'],
    frame: 'none',
  },

  {
    id: 'korea-defense-service',
    name: 'Korea Defense Service Medal',
    branch: ALL_US,
    // Green | white | green | golden | blue center | golden | green | white | green †
    stripes: [
      { color: '$myrtle-green',  width: 12 },
      { color: '$white',         width:  4 },
      { color: '$myrtle-green',  width:  6 },
      { color: '$golden-yellow', width:  4 },
      { color: '$bluebird',      width: 24 },
      { color: '$golden-yellow', width:  4 },
      { color: '$myrtle-green',  width:  6 },
      { color: '$white',         width:  4 },
      { color: '$myrtle-green',  width: 12 },
    ],
    authorizedDevices: ['stc'],
    frame: 'none',
  },

  {
    id: 'vietnam-service',
    name: 'Vietnam Service Medal',
    branch: ALL_US,
    // Primitive green edges | air-force yellow with red pinstripes (MIL-DTL-11589)
    stripes: [
      { color: '$primitive-green', width:  8 },
      { color: '$air-force-yellow', width: 20 },
      { color: '$old-glory-red',   width:  4 },
      { color: '$air-force-yellow', width: 10 },
      { color: '$old-glory-red',   width:  4 },
      { color: '$air-force-yellow', width: 10 },
      { color: '$old-glory-red',   width:  4 },
      { color: '$air-force-yellow', width: 20 },
      { color: '$primitive-green', width:  8 },
    ],
    authorizedDevices: ['stc'],
    frame: 'none',
  },

  {
    id: 'american-campaign',
    name: 'American Campaign Medal',
    branch: ALL_US,
    // Blue/white/black/white/blue | center US tricolor | blue/white/red/white/blue
    stripes: [
      { color: '$bluebird',        width: 12 },
      { color: '$white',           width:  4 },
      { color: '$black',           width:  4 },
      { color: '$scarlet',         width:  4 },
      { color: '$white',           width:  4 },
      { color: '$bluebird',        width: 12 },
      { color: '$old-glory-blue',  width:  4 },
      { color: '$white',           width:  4 },
      { color: '$old-glory-red',   width:  8 },
      { color: '$white',           width:  4 },
      { color: '$old-glory-blue',  width:  4 },
      { color: '$bluebird',        width: 12 },
      { color: '$white',           width:  4 },
      { color: '$scarlet',         width:  4 },
      { color: '$black',           width:  4 },
      { color: '$white',           width:  4 },
      { color: '$bluebird',        width: 12 },
    ],
    authorizedDevices: ['stc'],
    frame: 'none',
  },

  {
    id: 'eame-campaign',
    name: 'European-African-Middle Eastern Campaign Medal',
    branch: ALL_US,
    // Brown/irish-green/white/scarlet | center US tricolor | scarlet/white/black/white/brown
    stripes: [
      { color: '$earth-brown',   width: 12 },
      { color: '$irish-green',   width:  4 },
      { color: '$white',         width:  4 },
      { color: '$scarlet',       width:  4 },
      { color: '$irish-green',   width:  4 },
      { color: '$old-glory-blue', width:  4 },
      { color: '$white',         width:  4 },
      { color: '$old-glory-red', width:  8 },
      { color: '$white',         width:  4 },
      { color: '$old-glory-blue', width:  4 },
      { color: '$irish-green',   width:  4 },
      { color: '$white',         width:  4 },
      { color: '$black',         width:  4 },
      { color: '$white',         width:  4 },
      { color: '$earth-brown',   width: 12 },
    ],
    authorizedDevices: ['stc'],
    frame: 'none',
  },

  {
    id: 'asiatic-pacific-campaign',
    name: 'Asiatic-Pacific Campaign Medal',
    branch: ALL_US,
    // Air-force yellow flanks with white/red pinstripes | US tricolor center
    stripes: [
      { color: '$air-force-yellow', width: 12 },
      { color: '$white',            width:  4 },
      { color: '$scarlet',          width:  4 },
      { color: '$white',            width:  4 },
      { color: '$air-force-yellow', width: 12 },
      { color: '$old-glory-blue',   width:  4 },
      { color: '$white',            width:  4 },
      { color: '$old-glory-red',    width:  8 },
      { color: '$white',            width:  4 },
      { color: '$old-glory-blue',   width:  4 },
      { color: '$air-force-yellow', width: 12 },
      { color: '$white',            width:  4 },
      { color: '$scarlet',          width:  4 },
      { color: '$white',            width:  4 },
      { color: '$air-force-yellow', width: 12 },
    ],
    authorizedDevices: ['stc'],
    frame: 'none',
  },

  {
    id: 'wwii-victory',
    name: 'World War II Victory Medal',
    branch: ALL_US,
    // Rainbow flanks | white pinstripes | wide old-glory-red center
    stripes: [
      { color: '$bluebird',       width:  4 },
      { color: '$myrtle-green',   width:  4 },
      { color: '$golden-yellow',  width:  4 },
      { color: '$persian-orange', width:  4 },
      { color: '$scarlet',        width:  4 },
      { color: '$white',          width:  2 },
      { color: '$old-glory-red',  width: 36 },
      { color: '$white',          width:  2 },
      { color: '$scarlet',        width:  4 },
      { color: '$persian-orange', width:  4 },
      { color: '$golden-yellow',  width:  4 },
      { color: '$myrtle-green',   width:  4 },
      { color: '$bluebird',       width:  4 },
    ],
    authorizedDevices: [],
    frame: 'none',
  },

  {
    id: 'southwest-asia-service',
    name: 'Southwest Asia Service Medal',
    branch: ALL_US,
    // Desert-themed: black | chamois | blue/white/red | chamois | green | black (Desert Storm)
    stripes: [
      { color: '$black',          width:  4 },
      { color: '$chamois',        width:  8 },
      { color: '$old-glory-blue', width:  4 },
      { color: '$white',          width:  4 },
      { color: '$old-glory-red',  width:  4 },
      { color: '$chamois',        width: 12 },
      { color: '$myrtle-green',   width:  6 },
      { color: '$black',          width:  4 },
      { color: '$myrtle-green',   width:  6 },
      { color: '$chamois',        width: 12 },
      { color: '$old-glory-red',  width:  4 },
      { color: '$white',          width:  4 },
      { color: '$old-glory-blue', width:  4 },
      { color: '$chamois',        width:  8 },
      { color: '$black',          width:  4 },
    ],
    authorizedDevices: ['stc'],
    frame: 'none',
  },

  {
    id: 'nato-medal',
    name: 'NATO Medal',
    branch: [...ALL_US, 'nato'],
    // Imperial blue | white | wide imperial blue | white | imperial blue (MIL-DTL-11589)
    stripes: [
      { color: '$imperial-blue', width:  5 },
      { color: '$white',         width:  2 },
      { color: '$imperial-blue', width: 13 },
      { color: '$white',         width:  2 },
      { color: '$imperial-blue', width:  5 },
    ],
    authorizedDevices: ['clsp'],
    frame: 'none',
  },

  {
    id: 'un-medal',
    name: 'United Nations Medal',
    branch: [...ALL_US, 'un'],
    // UN blue with thin white pinstripes
    stripes: [
      { color: '$bluebird', width: 2 },
      { color: '$white',    width: 1 },
      { color: '$bluebird', width: 12 },
      { color: '$white',    width: 1 },
      { color: '$bluebird', width: 2 },
    ],
    authorizedDevices: ['clsp'],
    frame: 'none',
  },
];
