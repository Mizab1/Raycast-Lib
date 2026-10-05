import { passable, raycast } from "sandstone-raycast";
import { effect, execute, loc, MCFunction, Objective, particle, rel, Selector, tellraw } from "sandstone";

const rightClick = Objective.create("rcObj", "minecraft.used:minecraft.carrot_on_a_stick")("@s");

MCFunction(
  "on_tick",
  () => {
    execute
      .as(Selector("@a", { scores: { [rightClick.objective.name]: [1, null] } }))
      .at("@s")
      .anchored("eyes")
      .positioned(loc(0, 0, 1))
      .run(() => {
        rightClick.set(0);

        raycast(
          "raycast/cast",
          passable.name,
          Selector("@e", { type: "minecraft:husk", dx: 0 }),
          MCFunction("raycast/update", () => {
            particle("minecraft:crit", rel(0, 0, 0), [0, 0, 0], 0, 1);
          }),
          MCFunction("raycast/hit", () => {
            tellraw("@s", { text: "Hit!" });
            effect.give(Selector("@e", { type: "minecraft:husk", dx: 0 }), "minecraft:instant_health");
          }),
          1,
          50
        );
      });
  },
  { runEveryTick: true }
);
