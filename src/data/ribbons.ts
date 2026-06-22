import type { RegistryEntry } from '../types.js';

/**
 * Stub ribbon registry.
 * Stripe definitions are proportional widths with approximate colors.
 * These 12 entries cover all spec §18 examples needed for integration tests.
 */
export const STUB_RIBBONS: RegistryEntry[] = [
  // ─── Army ──────────────────────────────────────────────────────────────────
  {
    // Exact stripe definition from spec §13.4
    id: 'army-bsm',
    name: 'Bronze Star Medal',
    branch: ['us-army'],
    stripes: [
      { color: '#FFFFFF', width: 1 },
      { color: '$scarlet',  width: 3 },
      { color: '#FFFFFF', width: 1 },
      { color: '$imperial-blue', width: 3 },
      { color: '#FFFFFF', width: 1 },
      { color: '$scarlet',  width: 3 },
      { color: '#FFFFFF', width: 1 },
    ],
    authorizedDevices: ['olcb', 'olcs', 'vd'],
    frame: 'none',
  },
  {
    // Exact stripe definition from spec §13.4
    id: 'army-puc',
    name: 'Presidential Unit Citation',
    branch: ['us-army'],
    stripes: [
      { color: '$imperial-blue', width: 14 },
    ],
    authorizedDevices: ['stcb', 'stcs'],
    frame: 'gold',
  },
  {
    id: 'army-ph',
    name: 'Purple Heart',
    branch: ['us-army'],
    stripes: [
      { color: '$scarlet', width: 1 },
      { color: '#4B2D7F', width: 5 },  // purple
      { color: '$scarlet', width: 1 },
    ],
    authorizedDevices: ['olcb', 'olcs'],
    frame: 'none',
  },
  {
    id: 'army-arcom',
    name: 'Army Commendation Medal',
    branch: ['us-army'],
    stripes: [
      { color: '#FFFFFF', width: 1 },
      { color: '$scarlet', width: 1 },
      { color: '#FFFFFF', width: 1 },
      { color: '$myrtle-green', width: 5 },
      { color: '#FFFFFF', width: 1 },
      { color: '$scarlet', width: 1 },
      { color: '#FFFFFF', width: 1 },
    ],
    authorizedDevices: ['olcb', 'olcs', 'vd'],
    frame: 'none',
  },
  {
    id: 'army-gcm',
    name: 'Army Good Conduct Medal',
    branch: ['us-army'],
    stripes: [
      { color: '$scarlet', width: 1 },
      { color: '#FFFFFF', width: 1 },
      { color: '$scarlet', width: 9 },
      { color: '#FFFFFF', width: 1 },
      { color: '$scarlet', width: 1 },
    ],
    authorizedDevices: ['kntb', 'num'],
    frame: 'none',
  },
  {
    id: 'army-ndsm',
    name: 'National Defense Service Medal',
    branch: ['us-army', 'us-navy', 'us-usmc', 'us-af', 'us-ssf', 'us-uscg'],
    stripes: [
      { color: '$old-glory-red', width: 1 },
      { color: '#FFFFFF', width: 1 },
      { color: '$imperial-blue', width: 1 },
      { color: '#C5A028', width: 3 },  // gold
      { color: '$imperial-blue', width: 1 },
      { color: '#FFFFFF', width: 1 },
      { color: '$old-glory-red', width: 1 },
    ],
    authorizedDevices: ['stcb', 'stcs'],
    frame: 'none',
  },
  {
    id: 'army-gwots',
    name: 'Global War on Terrorism Service Medal',
    branch: ['us-army', 'us-navy', 'us-usmc', 'us-af', 'us-ssf', 'us-uscg'],
    stripes: [
      { color: '$imperial-blue', width: 1 },
      { color: '#FFFFFF', width: 1 },
      { color: '$old-glory-red', width: 5 },
      { color: '$imperial-blue', width: 1 },
      { color: '#C5A028', width: 3 },
      { color: '$imperial-blue', width: 1 },
      { color: '$old-glory-red', width: 5 },
      { color: '#FFFFFF', width: 1 },
      { color: '$imperial-blue', width: 1 },
    ],
    authorizedDevices: [],
    frame: 'none',
  },
  {
    id: 'army-msm',
    name: 'Meritorious Service Medal',
    branch: ['us-army'],
    stripes: [
      { color: '#FFFFFF', width: 1 },
      { color: '$scarlet', width: 1 },
      { color: '#FFFFFF', width: 1 },
      { color: '#4B2D7F', width: 7 },  // purple
      { color: '#FFFFFF', width: 1 },
      { color: '$scarlet', width: 1 },
      { color: '#FFFFFF', width: 1 },
    ],
    authorizedDevices: ['olcb', 'olcs'],
    frame: 'none',
  },
  {
    id: 'army-afrm',
    name: 'Armed Forces Reserve Medal',
    branch: ['us-army'],
    stripes: [
      { color: '$old-glory-red', width: 2 },
      { color: '#FFFFFF', width: 1 },
      { color: '$imperial-blue', width: 1 },
      { color: '#FFFFFF', width: 1 },
      { color: '$old-glory-red', width: 1 },
      { color: '$imperial-blue', width: 1 },
      { color: '#FFFFFF', width: 1 },
      { color: '$old-glory-red', width: 1 },
      { color: '$imperial-blue', width: 1 },
      { color: '#FFFFFF', width: 1 },
      { color: '$old-glory-red', width: 2 },
    ],
    authorizedDevices: ['hgb', 'hgs', 'hgg', 'md'],
    frame: 'none',
  },
  // ─── Navy ──────────────────────────────────────────────────────────────────
  {
    id: 'navy-achievement',
    name: 'Navy and Marine Corps Achievement Medal',
    branch: ['us-navy', 'us-usmc'],
    stripes: [
      { color: '#000080', width: 1 },
      { color: '#FFFFFF', width: 1 },
      { color: '#000080', width: 2 },
      { color: '#C5A028', width: 5 },  // gold center
      { color: '#000080', width: 2 },
      { color: '#FFFFFF', width: 1 },
      { color: '#000080', width: 1 },
    ],
    authorizedDevices: ['stg', 'sts', 'vd'],
    frame: 'none',
  },
  // ─── Air Force ─────────────────────────────────────────────────────────────
  {
    id: 'af-dfc',
    name: 'Distinguished Flying Cross',
    branch: ['us-af', 'us-army'],
    stripes: [
      { color: '#FFFFFF', width: 1 },
      { color: '$old-glory-red', width: 1 },
      { color: '#FFFFFF', width: 1 },
      { color: '$imperial-blue', width: 5 },
      { color: '#FFFFFF', width: 1 },
      { color: '$old-glory-red', width: 1 },
      { color: '#FFFFFF', width: 1 },
    ],
    authorizedDevices: ['olcb', 'olcs', 'stg', 'sts', 'vd', 'cd'],
    frame: 'none',
  },
  // ─── NATO / International ───────────────────────────────────────────────────
  {
    id: 'nato-medal',
    name: 'NATO Medal',
    branch: ['us-army', 'us-navy', 'us-usmc', 'us-af', 'us-uscg', 'nato'],
    stripes: [
      { color: '$imperial-blue', width: 5 },
      { color: '#FFFFFF', width: 2 },
      { color: '$imperial-blue', width: 13 },
      { color: '#FFFFFF', width: 2 },
      { color: '$imperial-blue', width: 5 },
    ],
    authorizedDevices: ['clsp'],
    frame: 'none',
  },
];
