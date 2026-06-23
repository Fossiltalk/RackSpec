/**
 * US Army ribbon registry.
 * Sources: AR 600-8-22, The Institute of Heraldry (tioh.army.mil), MIL-DTL-11589.
 * Proportional widths are in 64ths of an inch (total = 88/64" = 1-3/8").
 * Colors marked † are close approximations.
 */
import type { RegistryEntry } from '../../types.js';

export const ARMY_RIBBONS: RegistryEntry[] = [

  // ─── PERSONAL DECORATIONS ─────────────────────────────────────────────────

  {
    id: 'army-moh',
    name: 'Medal of Honor (Army)',
    branch: ['us-army'],
    // Old Glory Red | white | ultramarine blue (wide center) | white | Old Glory Red
    stripes: [
      { color: '$old-glory-red',    width:  8 },
      { color: '$white',            width:  8 },
      { color: '$ultramarine-blue', width: 48 },
      { color: '$white',            width:  8 },
      { color: '$old-glory-red',    width:  8 },
    ],
    authorizedDevices: [],
    frame: 'none',
  },

  {
    id: 'army-dsc',
    name: 'Distinguished Service Cross',
    branch: ['us-army'],
    // Blue outer | white pinstripes | wide blue inner | scarlet center
    stripes: [
      { color: '$ultramarine-blue', width:  6 },
      { color: '$white',            width:  2 },
      { color: '$ultramarine-blue', width: 28 },
      { color: '$white',            width:  2 },
      { color: '$scarlet',          width:  4 },
      { color: '$white',            width:  2 },
      { color: '$ultramarine-blue', width: 28 },
      { color: '$white',            width:  2 },
      { color: '$ultramarine-blue', width:  6 },
    ],
    authorizedDevices: ['olc'],
    frame: 'none',
  },

  {
    id: 'army-dsm',
    name: 'Distinguished Service Medal',
    branch: ['us-army'],
    // Wide scarlet flanks | blue pinstripe | white center
    stripes: [
      { color: '$scarlet',          width: 20 },
      { color: '$ultramarine-blue', width:  4 },
      { color: '$white',            width: 40 },
      { color: '$ultramarine-blue', width:  4 },
      { color: '$scarlet',          width: 20 },
    ],
    authorizedDevices: ['olc'],
    frame: 'none',
  },

  {
    id: 'army-ss',
    name: 'Silver Star (Army)',
    branch: ['us-army'],
    stripes: [
      { color: '$ultramarine-blue', width:  6 },
      { color: '$white',            width:  3 },
      { color: '$ultramarine-blue', width: 14 },
      { color: '$white',            width: 14 },
      { color: '$old-glory-red',    width:  4 },
      { color: '$white',            width: 14 },
      { color: '$ultramarine-blue', width: 14 },
      { color: '$white',            width:  3 },
      { color: '$ultramarine-blue', width:  6 },
    ],
    authorizedDevices: ['olc', 'vd'],
    frame: 'none',
  },

  {
    id: 'army-lom',
    name: 'Legion of Merit (Army)',
    branch: ['us-army'],
    stripes: [
      { color: '$white',   width: 1 },
      { color: '$crimson', width: 20 },
      { color: '$white',   width: 1 },
    ],
    authorizedDevices: ['olc'],
    frame: 'none',
  },

  {
    id: 'army-dfc',
    name: 'Distinguished Flying Cross (Army)',
    branch: ['us-army'],
    stripes: [
      { color: '$ultramarine-blue', width:  6 },
      { color: '$white',            width:  9 },
      { color: '$ultramarine-blue', width: 11 },
      { color: '$white',            width:  3 },
      { color: '$old-glory-red',    width:  6 },
      { color: '$white',            width:  3 },
      { color: '$ultramarine-blue', width: 11 },
      { color: '$white',            width:  9 },
      { color: '$ultramarine-blue', width:  6 },
    ],
    authorizedDevices: ['olc', 'vd'],
    frame: 'none',
  },

  {
    id: 'army-sm',
    name: "Soldier's Medal",
    branch: ['us-army'],
    // Blue outer | alternating red/white/blue center
    stripes: [
      { color: '$ultramarine-blue', width: 12 },
      { color: '$white',            width:  4 },
      { color: '$old-glory-red',    width:  4 },
      { color: '$white',            width:  4 },
      { color: '$old-glory-blue',   width:  4 },
      { color: '$white',            width:  4 },
      { color: '$old-glory-red',    width:  4 },
      { color: '$white',            width:  4 },
      { color: '$old-glory-blue',   width:  4 },
      { color: '$white',            width:  4 },
      { color: '$old-glory-red',    width:  4 },
      { color: '$white',            width:  4 },
      { color: '$ultramarine-blue', width: 12 },
    ],
    authorizedDevices: ['olc'],
    frame: 'none',
  },

  {
    id: 'army-bsm',
    name: 'Bronze Star Medal (Army)',
    branch: ['us-army'],
    // MIL-DTL-11589: white(1/32) | scarlet(9/16) | white(1/32) | ub(1/8) | white(1/32) | scarlet(9/16) | white(1/32)
    stripes: [
      { color: '$white',            width:  2 },
      { color: '$scarlet',          width: 18 },
      { color: '$white',            width:  2 },
      { color: '$ultramarine-blue', width:  8 },
      { color: '$white',            width:  2 },
      { color: '$scarlet',          width: 18 },
      { color: '$white',            width:  2 },
    ],
    authorizedDevices: ['olc', 'vd'],
    frame: 'none',
  },

  {
    id: 'army-ph',
    name: 'Purple Heart',
    branch: ['us-army'],
    stripes: [
      { color: '$white',               width: 8 },
      { color: '$purple-heart-purple', width: 72 },
      { color: '$white',               width: 8 },
    ],
    authorizedDevices: ['olc'],
    frame: 'none',
  },

  {
    id: 'army-msm',
    name: 'Meritorious Service Medal (Army)',
    branch: ['us-army'],
    // Crimson with 5 narrow white pinstripes evenly spaced (MIL-DTL-11589)
    stripes: [
      { color: '$crimson', width: 8 },
      { color: '$white',   width: 1 },
      { color: '$crimson', width: 12 },
      { color: '$white',   width: 1 },
      { color: '$crimson', width: 12 },
      { color: '$white',   width: 1 },
      { color: '$crimson', width: 12 },
      { color: '$white',   width: 1 },
      { color: '$crimson', width: 12 },
      { color: '$white',   width: 1 },
      { color: '$crimson', width: 8 },
    ],
    authorizedDevices: ['olc'],
    frame: 'none',
  },

  {
    id: 'army-am',
    name: 'Air Medal (Army)',
    branch: ['us-army'],
    stripes: [
      { color: '$ultramarine-blue', width:  8 },
      { color: '$golden-orange',    width: 16 },
      { color: '$ultramarine-blue', width: 40 },
      { color: '$golden-orange',    width: 16 },
      { color: '$ultramarine-blue', width:  8 },
    ],
    authorizedDevices: ['olc', 'num'],
    frame: 'none',
  },

  {
    id: 'army-arcom',
    name: 'Army Commendation Medal',
    branch: ['us-army'],
    // Wide myrtle-green flanks | thin golden-yellow pinstripes | white center
    // AR 600-8-22: 1/2" green, 1/16" gold, 1/4" white, 1/16" gold, 1/2" green → 88/64"
    stripes: [
      { color: '$myrtle-green',  width: 32 },
      { color: '$golden-yellow', width:  4 },
      { color: '$white',         width: 16 },
      { color: '$golden-yellow', width:  4 },
      { color: '$myrtle-green',  width: 32 },
    ],
    authorizedDevices: ['olc', 'vd'],
    frame: 'none',
  },

  {
    id: 'army-arcam',
    name: 'Army Reserve Components Achievement Medal',
    branch: ['us-army'],
    // Myrtle green outer | golden-yellow | white | green center | white | golden-yellow | green outer
    stripes: [
      { color: '$myrtle-green',  width: 14 },
      { color: '$golden-yellow', width:  4 },
      { color: '$white',         width:  4 },
      { color: '$myrtle-green',  width: 44 },
      { color: '$white',         width:  4 },
      { color: '$golden-yellow', width:  4 },
      { color: '$myrtle-green',  width: 14 },
    ],
    authorizedDevices: ['olc'],
    frame: 'none',
  },

  {
    id: 'army-aam',
    name: 'Army Achievement Medal',
    branch: ['us-army'],
    // Green | white | green | white | blue center | white | green | white | green †
    stripes: [
      { color: '$myrtle-green',     width:  8 },
      { color: '$white',            width:  4 },
      { color: '$myrtle-green',     width:  4 },
      { color: '$white',            width:  4 },
      { color: '$ultramarine-blue', width: 36 },
      { color: '$white',            width:  4 },
      { color: '$myrtle-green',     width:  4 },
      { color: '$white',            width:  4 },
      { color: '$myrtle-green',     width:  8 },
    ],
    authorizedDevices: ['olc'],
    frame: 'none',
  },

  // ─── CONDUCT & SERVICE RIBBONS ───────────────────────────────────────────

  {
    id: 'army-gcm',
    name: 'Army Good Conduct Medal',
    branch: ['us-army'],
    // Predominantly scarlet with thin white pinstripes
    stripes: [
      { color: '$scarlet', width:  2 },
      { color: '$white',   width:  1 },
      { color: '$scarlet', width:  2 },
      { color: '$white',   width:  1 },
      { color: '$scarlet', width:  2 },
      { color: '$white',   width:  1 },
      { color: '$scarlet', width: 18 },
      { color: '$white',   width:  1 },
      { color: '$scarlet', width:  2 },
      { color: '$white',   width:  1 },
      { color: '$scarlet', width:  2 },
      { color: '$white',   width:  1 },
      { color: '$scarlet', width:  2 },
    ],
    authorizedDevices: ['knt'],
    frame: 'none',
  },

  {
    id: 'army-asr',
    name: 'Army Service Ribbon',
    branch: ['us-army'],
    // Symmetric rainbow: scarlet edges → blue center (AR 600-8-22; spectrum represents assignments)
    stripes: [
      { color: '$scarlet',          width: 14 },
      { color: '$persian-orange',   width: 10 },
      { color: '$golden-yellow',    width:  6 },
      { color: '$myrtle-green',     width:  4 },
      { color: '$ultramarine-blue', width:  4 },
      { color: '$myrtle-green',     width:  4 },
      { color: '$golden-yellow',    width:  6 },
      { color: '$persian-orange',   width: 10 },
      { color: '$scarlet',          width: 14 },
    ],
    authorizedDevices: [],
    frame: 'none',
  },

  {
    id: 'army-osr',
    name: 'Overseas Service Ribbon',
    branch: ['us-army'],
    // Old glory blue | grotto blue | golden yellow | old glory red | golden yellow | grotto blue | old glory blue †
    stripes: [
      { color: '$old-glory-blue',  width: 12 },
      { color: '$grotto-blue',     width: 16 },
      { color: '$golden-yellow',   width:  4 },
      { color: '$old-glory-red',   width: 24 },
      { color: '$golden-yellow',   width:  4 },
      { color: '$grotto-blue',     width: 16 },
      { color: '$old-glory-blue',  width: 12 },
    ],
    authorizedDevices: ['num'],
    frame: 'none',
  },

  {
    id: 'army-afrm',
    name: 'Armed Forces Reserve Medal (Army)',
    branch: ['us-army'],
    stripes: [
      { color: '$old-glory-red',  width: 2 },
      { color: '$white',          width: 1 },
      { color: '$imperial-blue',  width: 1 },
      { color: '$white',          width: 1 },
      { color: '$old-glory-red',  width: 1 },
      { color: '$imperial-blue',  width: 1 },
      { color: '$white',          width: 1 },
      { color: '$old-glory-red',  width: 1 },
      { color: '$imperial-blue',  width: 1 },
      { color: '$white',          width: 1 },
      { color: '$old-glory-red',  width: 2 },
    ],
    authorizedDevices: ['hg', 'md'],
    frame: 'none',
  },

  {
    id: 'army-ndsm',
    name: 'National Defense Service Medal (Army)',
    branch: ['us-army'],
    stripes: [
      { color: '$scarlet',        width: 14 },
      { color: '$white',          width:  1 },
      { color: '$old-glory-blue', width:  1 },
      { color: '$white',          width:  1 },
      { color: '$scarlet',        width:  1 },
      { color: '$golden-yellow',  width:  8 },
      { color: '$scarlet',        width:  1 },
      { color: '$white',          width:  1 },
      { color: '$old-glory-blue', width:  1 },
      { color: '$white',          width:  1 },
      { color: '$scarlet',        width: 14 },
    ],
    authorizedDevices: ['stc'],
    frame: 'none',
  },

  {
    id: 'army-gwots',
    name: 'Global War on Terrorism Service Medal (Army)',
    branch: ['us-army'],
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
    authorizedDevices: [],
    frame: 'none',
  },

  {
    id: 'army-icm',
    name: 'Iraq Campaign Medal (Army)',
    branch: ['us-army'],
    stripes: [
      { color: '$scarlet',       width: 10 },
      { color: '$white',         width:  4 },
      { color: '$myrtle-green',  width:  2 },
      { color: '$white',         width:  4 },
      { color: '$black',         width: 10 },
      { color: '$chamois',       width: 28 },
      { color: '$black',         width: 10 },
      { color: '$white',         width:  4 },
      { color: '$myrtle-green',  width:  2 },
      { color: '$white',         width:  4 },
      { color: '$scarlet',       width: 10 },
    ],
    authorizedDevices: ['stc'],
    frame: 'none',
  },

  {
    id: 'army-swasm',
    name: 'Southwest Asia Service Medal (Army)',
    branch: ['us-army'],
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
    id: 'army-mfo',
    name: 'Multinational Force and Observers Medal (Army)',
    branch: ['us-army'],
    // Orange dominant flanks | narrow olive green | narrow white center
    stripes: [
      { color: '$persian-orange',  width: 36 },
      { color: '$primitive-green', width:  4 },
      { color: '$white',           width:  8 },
      { color: '$primitive-green', width:  4 },
      { color: '$persian-orange',  width: 36 },
    ],
    authorizedDevices: ['num'],
    frame: 'none',
  },

  // ─── UNIT AWARDS ──────────────────────────────────────────────────────────

  {
    id: 'army-puc',
    name: 'Presidential Unit Citation (Army)',
    branch: ['us-army'],
    stripes: [
      { color: '$imperial-blue', width: 14 },
    ],
    authorizedDevices: ['olc'],
    frame: 'gold',
  },

  {
    id: 'army-vua',
    name: 'Valorous Unit Award',
    branch: ['us-army'],
    // Old glory red | ultramarine blue | white | blue segments | red
    stripes: [
      { color: '$old-glory-red',    width: 12 },
      { color: '$ultramarine-blue', width:  1 },
      { color: '$white',            width:  1 },
      { color: '$ultramarine-blue', width:  3 },
      { color: '$white',            width:  3 },
      { color: '$ultramarine-blue', width:  3 },
      { color: '$white',            width:  1 },
      { color: '$ultramarine-blue', width:  1 },
      { color: '$old-glory-red',    width: 12 },
    ],
    authorizedDevices: ['olc'],
    frame: 'gold',
  },

  {
    id: 'army-muc',
    name: 'Army Meritorious Unit Commendation',
    branch: ['us-army'],
    stripes: [
      { color: '$scarlet', width: 14 },
    ],
    authorizedDevices: ['olc'],
    frame: 'gold',
  },

  {
    id: 'army-jmua',
    name: 'Joint Meritorious Unit Award (Army)',
    branch: ['us-army'],
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
    authorizedDevices: ['olc'],
    frame: 'gold',
  },
];
