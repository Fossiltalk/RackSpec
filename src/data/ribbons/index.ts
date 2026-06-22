import type { RegistryEntry } from '../../types.js';
import { US_JOINT_RIBBONS } from './us-joint.js';
import { ARMY_RIBBONS } from './us-army.js';
import { NAVY_RIBBONS } from './us-navy.js';

export const ALL_RIBBONS: RegistryEntry[] = [
  ...US_JOINT_RIBBONS,
  ...ARMY_RIBBONS,
  ...NAVY_RIBBONS,
];
