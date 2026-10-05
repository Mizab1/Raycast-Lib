import type { SandstoneConfig } from "sandstone";

export default {
  name: "sandstone-raycast-testing",
  packs: {
    datapack: {
      description: ["A ", { text: "Sandstone", color: "gold" }, " datapack."],
      packFormat: 121
    },
    resourcepack: {
      description: ["A ", { text: "Sandstone", color: "gold" }, " resource pack."],
      packFormat: 97
    }
  },
  onConflict: {
    default: "warn"
  },
  namespace: "raycast_test",
  packUid: "acyaSZ7S",
  mcmeta: "latest",
  saveOptions: { clientPath: "C:\\Users\\mizab\\AppData\\Roaming\\ModrinthApp\\profiles\\Fabric 1.21.5", world: "Raycast" }
} as SandstoneConfig;
