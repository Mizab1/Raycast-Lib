import { _, execute, loc, MCFunction, MCFunctionClass, Objective, rel, Tag, TagClass } from "sandstone";
import { MultipleEntitiesArgument } from "sandstone/arguments";
import { BlockStatic } from "sandstone/commands";

// Block Tag
export const passable: TagClass<"block"> = Tag("block", "passable", [
  "#minecraft:air",
  "minecraft:water",
  "#minecraft:rails",
  "#minecraft:buttons",
  "#minecraft:coral_plants",
  "#minecraft:corals",
  "#minecraft:flower_pots",
  "#minecraft:flowers",
  "#minecraft:flowers",
  "#minecraft:saplings",
  "minecraft:snow",
  "minecraft:tall_grass",
  "minecraft:short_grass",
  "#minecraft:crops",
  "minecraft:vine",
  "#minecraft:all_signs",
  "minecraft:tripwire",
  "minecraft:glass",
  "#minecraft:leaves",
  "minecraft:leaf_litter",
  "minecraft:big_dripleaf_stem",
  "minecraft:big_dripleaf",
  "minecraft:fern",
  "minecraft:large_fern",
  "minecraft:potted_fern"
]);

// Private Variables
const raycastPvtObj = Objective.create("raycastPvt.obj", "dummy");
const currentIter = raycastPvtObj("@s");

/**
 * Creates a simple raycast.
 * @param nameOfFile Name of the main raycast .mcfunction file.
 * @param blockToIgnore Block(s) name ignore, if the current block is not the specified block then the raycast will stop. Can be a block tag. Can be null.
 * @param entityToHit Entity to look for, it accepts selectors with distance property. Can be null.
 * @param runOnEveryStep Function to run on every step. Can be anonymous. Can be null.
 * @param runOnHit MCFunction to run on hitting the target. Can be anonymous. Can be null.
 * @param step Step size of the raycast. Defaults to 1.
 * @param maxIter Maximum iteration of the raycast. Defaults to 20.
 */
export function raycast(
  nameOfFile: string,
  blockToIgnore: string | null,
  entityToHit: MultipleEntitiesArgument | null,
  runOnEveryStep: (() => void) | MCFunctionClass<any, any>,
  runOnHit: (() => void) | MCFunctionClass<any, any>,
  step: number = 1,
  maxIter: number = 20
): void {
  // If both the targets are not defined
  if (!entityToHit && !blockToIgnore) {
    throw new Error(`[Raycast Wizard: ${nameOfFile}] Both 'blockToIgnore' and 'entityToHit' cannot be null.`);
  }

  // Reuseable function to check if the target is hit or not
  function ifHitBlock(): void {
    if (!blockToIgnore) return;
    execute.unless.block(rel(0, 0, 0), blockToIgnore as BlockStatic).run(() => {
      runOnHit();
      currentIter.set(0);
    });
  }
  function ifHitEntity(): void {
    if (!entityToHit) return;
    execute.if.entity(entityToHit).run(() => {
      runOnHit();
      currentIter.set(0);
    });
  }

  // Recursive function to cast a ray forward
  const recursive: any = MCFunction(nameOfFile, () => {
    // Increment the current iteration
    currentIter.add(1);

    _.if(currentIter[">"](maxIter), () => {
      // Reset the score if it's greater than the max iteration
      currentIter.set(0);
    }).elseIf(currentIter["<="](maxIter), () => {
      // Run the user defined function to run every iteration
      runOnEveryStep();

      // Check if the target is hit, if not do the recursive call
      if (!entityToHit && blockToIgnore) {
        execute.if
          .block(rel(0, 0, 0), blockToIgnore as BlockStatic)
          .positioned(loc(0, 0, step))
          .run(recursive);
        ifHitBlock();
      }
      if (!blockToIgnore && entityToHit) {
        execute.unless
          .entity(entityToHit)
          .positioned(loc(0, 0, step))
          .run(recursive);
        ifHitEntity();
      }
      if (entityToHit && blockToIgnore) {
        execute.if
          .block(rel(0, 0, 0), blockToIgnore as BlockStatic)
          .unless.entity(entityToHit)
          .positioned(loc(0, 0, step))
          .run(recursive);
        ifHitBlock();
        ifHitEntity();
      }
    });
  });

  // Start the raycast
  recursive();
}
