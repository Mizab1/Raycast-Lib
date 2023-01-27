import type { SandstoneConfig } from 'sandstone'

export default {
  name: 'Raycast Lib',
  description: [ 'A ', { text: 'Sandstone', color: 'gold' }, ' data pack.' ],
  formatVersion: 7,
  namespace: 'raycast_lib',
  packUid: 'Soa5_Ih6',
  saveOptions: { world: 'Testing 3' },
  onConflict: {
    default: 'warn',
  },
} as SandstoneConfig
