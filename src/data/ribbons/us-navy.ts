/**
 * US Navy ribbon registry.
 * Sources: SECNAVINST 1650.1, The Institute of Heraldry (tioh.army.mil), MIL-DTL-11589.
 * Proportional widths in 64ths of an inch (total = 88/64" = 1-3/8").
 * Colors marked † are close approximations.
 */
import type { RegistryEntry } from '../../types.js';

export const NAVY_RIBBONS: RegistryEntry[] = [

  // ─── PERSONAL DECORATIONS ─────────────────────────────────────────────────

  {
    id: 'navy-moh',
    name: 'Medal of Honor (Navy)',
    branch: ['us-navy', 'us-usmc'],
    // Light blue (sky blue) ribbon — solid field representing the sea/sky
    stripes: [
      { color: '$sky-blue', width: 88 },
    ],
    authorizedDevices: [],
    frame: 'none',
  },

  {
    id: 'navy-cross',
    name: 'Navy Cross',
    branch: ['us-navy', 'us-usmc'],
    // Navy blue wide flanks | white center stripe
    stripes: [
      { color: '$navy-blue', width: 36 },
      { color: '$white',     width: 16 },
      { color: '$navy-blue', width: 36 },
    ],
    authorizedDevices: ['st', 'vd'],
    frame: 'none',
  },

  {
    id: 'navy-dsm',
    name: 'Navy Distinguished Service Medal',
    branch: ['us-navy', 'us-usmc'],
    // Navy blue outer | wide golden-yellow center
    stripes: [
      { color: '$navy-blue',     width: 16 },
      { color: '$golden-yellow', width: 56 },
      { color: '$navy-blue',     width: 16 },
    ],
    authorizedDevices: ['st'],
    frame: 'none',
  },

  {
    id: 'navy-ss',
    name: 'Silver Star (Navy/USMC)',
    branch: ['us-navy', 'us-usmc'],
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
    authorizedDevices: ['st', 'vd'],
    frame: 'none',
  },

  {
    id: 'navy-lom',
    name: 'Legion of Merit (Navy/USMC)',
    branch: ['us-navy', 'us-usmc'],
    stripes: [
      { color: '$white',   width: 1 },
      { color: '$crimson', width: 20 },
      { color: '$white',   width: 1 },
    ],
    authorizedDevices: ['st', 'vd'],
    frame: 'none',
  },

  {
    id: 'navy-dfc',
    name: 'Distinguished Flying Cross (Navy/USMC)',
    branch: ['us-navy', 'us-usmc'],
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
    authorizedDevices: ['st', 'vd'],
    frame: 'none',
  },

  {
    id: 'navy-marine-corps-medal',
    name: 'Navy and Marine Corps Medal',
    branch: ['us-navy', 'us-usmc'],
    // Navy blue | golden-yellow | scarlet (three equal sections)
    stripes: [
      { color: '$navy-blue',     width: 29 },
      { color: '$golden-yellow', width: 30 },
      { color: '$scarlet',       width: 29 },
    ],
    authorizedDevices: ['st'],
    frame: 'none',
  },

  {
    id: 'navy-bsm',
    name: 'Bronze Star Medal (Navy/USMC)',
    branch: ['us-navy', 'us-usmc'],
    stripes: [
      { color: '$white',            width:  2 },
      { color: '$scarlet',          width: 18 },
      { color: '$white',            width:  2 },
      { color: '$ultramarine-blue', width:  8 },
      { color: '$white',            width:  2 },
      { color: '$scarlet',          width: 18 },
      { color: '$white',            width:  2 },
    ],
    authorizedDevices: ['st', 'vd'],
    frame: 'none',
  },

  {
    id: 'navy-ph',
    name: 'Purple Heart (Navy/USMC)',
    branch: ['us-navy', 'us-usmc'],
    stripes: [
      { color: '$white',               width: 8 },
      { color: '$purple-heart-purple', width: 72 },
      { color: '$white',               width: 8 },
    ],
    authorizedDevices: ['st'],
    frame: 'none',
  },

  {
    id: 'navy-msm',
    name: 'Meritorious Service Medal (Navy/USMC)',
    branch: ['us-navy', 'us-usmc'],
    stripes: [
      { color: '$crimson', width: 1 },
      { color: '$white',   width: 2 },
      { color: '$crimson', width: 5 },
      { color: '$white',   width: 2 },
      { color: '$crimson', width: 1 },
    ],
    authorizedDevices: ['st'],
    frame: 'none',
  },

  {
    id: 'navy-am',
    name: 'Air Medal (Navy/USMC)',
    branch: ['us-navy', 'us-usmc'],
    stripes: [
      { color: '$ultramarine-blue', width:  8 },
      { color: '$golden-orange',    width: 16 },
      { color: '$ultramarine-blue', width: 40 },
      { color: '$golden-orange',    width: 16 },
      { color: '$ultramarine-blue', width:  8 },
    ],
    authorizedDevices: ['st', 'num', 'vd'],
    frame: 'none',
  },

  {
    id: 'navy-commendation',
    name: 'Navy and Marine Corps Commendation Medal',
    branch: ['us-navy', 'us-usmc'],
    // Myrtle green with narrow white pinstripes inside each edge
    stripes: [
      { color: '$myrtle-green', width: 12 },
      { color: '$white',        width:  4 },
      { color: '$myrtle-green', width: 52 },
      { color: '$white',        width:  4 },
      { color: '$myrtle-green', width: 12 },
    ],
    authorizedDevices: ['st', 'vd'],
    frame: 'none',
  },

  {
    id: 'navy-achievement',
    name: 'Navy and Marine Corps Achievement Medal',
    branch: ['us-navy', 'us-usmc'],
    // Myrtle green with thin golden-orange accents †
    stripes: [
      { color: '$myrtle-green',  width:  8 },
      { color: '$golden-orange', width:  4 },
      { color: '$myrtle-green',  width: 56 },
      { color: '$golden-orange', width:  4 },
      { color: '$myrtle-green',  width:  8 },
    ],
    authorizedDevices: ['st'],
    frame: 'none',
  },

  // ─── UNIT AWARDS ──────────────────────────────────────────────────────────

  {
    id: 'navy-puc',
    name: 'Navy Presidential Unit Citation',
    branch: ['us-navy', 'us-usmc'],
    // Old glory red | golden-yellow | navy blue (bottom-to-top when worn vertically)
    // On the ribbon bar, displayed left-to-right as: red | gold | blue
    stripes: [
      { color: '$old-glory-red',  width: 29 },
      { color: '$golden-yellow',  width: 30 },
      { color: '$navy-blue',      width: 29 },
    ],
    authorizedDevices: ['st'],
    frame: 'gold',
  },

  {
    id: 'navy-nuc',
    name: 'Navy Unit Commendation',
    branch: ['us-navy', 'us-usmc'],
    // Navy blue | golden-yellow | scarlet | myrtle green | red | gold | blue
    stripes: [
      { color: '$navy-blue',     width: 12 },
      { color: '$golden-yellow', width:  8 },
      { color: '$scarlet',       width:  8 },
      { color: '$myrtle-green',  width:  8 },
      { color: '$scarlet',       width:  8 },
      { color: '$golden-yellow', width:  8 },
      { color: '$navy-blue',     width: 12 },
    ],
    authorizedDevices: ['st'],
    frame: 'gold',
  },

  {
    id: 'navy-muc',
    name: 'Navy Meritorious Unit Commendation',
    branch: ['us-navy', 'us-usmc'],
    // Myrtle green flanks | dark blue | scarlet | blue | golden yellow
    stripes: [
      { color: '$myrtle-green',  width: 16 },
      { color: '$navy-blue',     width:  8 },
      { color: '$scarlet',       width:  8 },
      { color: '$golden-yellow', width:  8 },
      { color: '$scarlet',       width:  8 },
      { color: '$navy-blue',     width:  8 },
      { color: '$myrtle-green',  width: 16 },
    ],
    authorizedDevices: ['st'],
    frame: 'gold',
  },

  {
    id: 'navy-e',
    name: 'Navy "E" Ribbon',
    branch: ['us-navy'],
    // Gold | white | navy blue center
    stripes: [
      { color: '$golden-yellow', width:  6 },
      { color: '$white',         width: 16 },
      { color: '$navy-blue',     width: 44 },
      { color: '$white',         width: 16 },
      { color: '$golden-yellow', width:  6 },
    ],
    authorizedDevices: [],
    frame: 'none',
  },

  // ─── CONDUCT / GOOD CONDUCT ───────────────────────────────────────────────

  {
    id: 'navy-gcm',
    name: 'Navy Good Conduct Medal',
    branch: ['us-navy'],
    // Predominantly scarlet/red ribbon
    stripes: [
      { color: '$scarlet', width: 88 },
    ],
    authorizedDevices: ['stc'],
    frame: 'none',
  },

  // ─── SERVICE RIBBONS ──────────────────────────────────────────────────────

  {
    id: 'navy-expeditionary',
    name: 'Navy Expeditionary Medal',
    branch: ['us-navy'],
    // Ultramarine blue flanks | golden-yellow stripe | ultramarine blue center
    stripes: [
      { color: '$ultramarine-blue', width: 12 },
      { color: '$golden-yellow',    width: 16 },
      { color: '$ultramarine-blue', width: 36 },
      { color: '$golden-yellow',    width: 16 },
      { color: '$ultramarine-blue', width: 12 },
    ],
    authorizedDevices: ['stc'],
    frame: 'none',
  },

  {
    id: 'navy-sea-service-deployment',
    name: 'Sea Service Deployment Ribbon',
    branch: ['us-navy', 'us-usmc'],
    // Navy blue | red/yellow/teal accents | teal/aqua center †
    stripes: [
      { color: '$navy-blue',       width: 12 },
      { color: '$scarlet',         width:  4 },
      { color: '$golden-yellow',   width:  4 },
      { color: '$myrtle-green',    width:  4 },
      { color: '#00CED1',          width: 36 },  // dark turquoise/sea color
      { color: '$myrtle-green',    width:  4 },
      { color: '$golden-yellow',   width:  4 },
      { color: '$scarlet',         width:  4 },
      { color: '$navy-blue',       width: 12 },
    ],
    authorizedDevices: ['stc'],
    frame: 'none',
  },

  {
    id: 'navy-arctic-service',
    name: 'Navy Arctic Service Ribbon',
    branch: ['us-navy'],
    // Shades of blue flanking a white center, representing arctic ice and sea †
    stripes: [
      { color: '$bluebird',         width: 20 },
      { color: '$sky-blue',         width:  4 },
      { color: '$white',            width:  8 },
      { color: '$sky-blue',         width:  2 },
      { color: '$bluebird',         width:  2 },
      { color: '$navy-blue',        width:  4 },
      { color: '$bluebird',         width:  2 },
      { color: '$sky-blue',         width:  2 },
      { color: '$white',            width:  8 },
      { color: '$sky-blue',         width:  4 },
      { color: '$bluebird',         width: 20 },
    ],
    authorizedDevices: [],
    frame: 'none',
  },

  {
    id: 'navy-overseas-service',
    name: 'Navy and Marine Corps Overseas Service Ribbon',
    branch: ['us-navy', 'us-usmc'],
    // Teal/blue | golden accent | dark blue | golden yellow | red center †
    stripes: [
      { color: '#008080',          width: 10 },  // teal
      { color: '$golden-yellow',   width:  4 },
      { color: '$navy-blue',       width: 16 },
      { color: '$golden-yellow',   width:  4 },
      { color: '$old-glory-red',   width: 20 },
      { color: '$golden-yellow',   width:  4 },
      { color: '$navy-blue',       width: 16 },
      { color: '$golden-yellow',   width:  4 },
      { color: '#008080',          width: 10 },
    ],
    authorizedDevices: [],
    frame: 'none',
  },

  {
    id: 'navy-ndsm',
    name: 'National Defense Service Medal (Navy)',
    branch: ['us-navy'],
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
];
