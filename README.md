# Raycast Library for Sandstone

---

_This library is built for [Sandstone](https://github.com/sandstone-mc/sandstone)._ :computer:

> **Note:** This library is works with >=Release 1.0 of sandstone. For earlier versions refer [Here](https://github.com/Mizab1/Raycast-Lib/tree/c8ee7bf208b03ccfe711cb2ce0e2d51c81cd1a4f).

This library provides a simple raycast function for quickly creating raycasts that can detect blocks and/or entities.

## Installation

To use the raycast function:

1. Install the NPM package: :arrow_down:

   ```bash
   bun i sandstone-raycast
   ```

2. Import `raycast` into your project: :arrow_heading_down:

   ```ts
   import { raycast, passable } from "sandstone-raycast";
   ```

3. Call the `raycast` function to generate the required MCFunctions.

4. Enjoy! :star:

---

## Syntax

```ts
raycast(fileName, blockToIgnore, entityToHit, runOnEveryStep, runOnHit, step, maxIter);
```

### Parameters

`fileName`  
Name of the main raycast .mcfunction file.

`blockToIgnore`  
Block(s) name ignore, if the current block is not the specified block then the raycast will stop. Can be a block tag. Can be `null`.

`entityToHit`  
Entity to look for, it accepts selectors with `distance` property. Can be `null`.

`runOnEveryStep`  
Function to run on every step. Can be `anonymous`. Can be `null`.

`runOnHit`  
MCFunction to run on hitting the target. Can be anonymous. Can be `null`.

`step`  
Step size of the raycast. Defaults to `1`. _(Optional)_

`maxIter`  
Maximum iteration of the raycast. Defaults to `20`. _(Optional)_

---

## Example

```ts
raycast(
  "raycast_main",
  passable.name,
  Selector("@e", { type: "husk", dx: 0 }),
  MCFunction("raycast_update", () => {
    particle("electric_spark", rel(0, 0, 0), [0, 0, 0], 0, 1);
  }),
  MCFunction("raycast_hit", () => {
    tellraw("@s", { text: "Hit!" });
  })
);
```

---

## `Passable` BLock Library

Raycast includes a passable block tag containing blocks that the raycast can pass through.
If you want a simple raycast without manually specifying which blocks it can pass through, you can use this tag.
Import passable from the Raycast package and use `passable.name` as the `blockToIgnore` parameter:

## Example Pack

```ts
import { passable, raycast } from "sandstone-raycast";
import { effect, execute, loc, MCFunction, Objective, particle, rel, Selector } from "sandstone";

const rightClick = Objective.create("rcObj", "minecraft.used:minecraft.carrot_on_a_stick")("@s");

MCFunction(
  "test",
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
            effect.give(Selector("@e", { type: "minecraft:husk", dx: 0 }), "minecraft:instant_health");
          }),
          1,
          50
        );
      });
  },
  { runEveryTick: true }
);
```

> **Note:** This library does **not** handle score setup or right-click detection.
