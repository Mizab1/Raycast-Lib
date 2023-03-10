# Raycast Library for Sandstone
---
*This library is built for sandstone: https://github.com/sandstone-mc/sandstone* :computer:

This library provides a simple raycast function to quickly construct a raycast for blocks and\or entities.


To import the raycast function:
1. Download the NPM Library. :arrow_down:
   - You can do it by running `npm i sandstone-raycast` in your console.
2. Import the `raycast` in your project. :arrow_heading_down:
```ts
    import { raycast } from "sandstone-raycast";
```
4. Call the raycast function to generate MCFunctons.
5. Enjoy :star:
---
**Syntax:**
```ts
raycast(fileName, blockToIgnore, entityToHit, runOnEveryStep, runOnHit, step, maxIter){
    // code
}
```
`nameOfFile` Name of the file that will be generated.

`blockToIgnore` Block name ignore, if the current block is not the specified block then the raycast will stop, can be null.

`entityToHit` Name of the Entity to look for, it accept Selectors with distance attribute, can be null.

`runOnEveryStep` MCFunction to run on every step.

`runOnHit` MCFunction to run on hitting the target.

`step` Step size of the raycast, default is 1 (OPTIONAL).

`maxIter` Maximum iteration of the raycast, default is 20 (OPTIONAL).

**Example of raycast function:**
```ts
raycast(
    "raycast/cast",
    "minecraft:air", 
    Selector('@e', 
        { 
            type: "minecraft:husk", 
            dx: 0
        }
    ),
    MCFunction("raycast/update", () => {
        particle("minecraft:crit", rel(0, 0, 0), [0, 0, 0], 0, 1);
    }), 
    MCFunction("raycast/hit", () => {
        effect.give(Selector('@e', { type: 'minecraft:husk', dx: 0}), "minecraft:instant_health");
        say("Hi")
    }), 1, 50
)
```

**Example Pack:**
```ts
import { effect, execute, loc, MCFunction, Objective, particle, rel, say, Selector } from 'sandstone'
import { raycast } from "sandstone-raycast";

export const rightClickObj = Objective.create("rcObj", "minecraft.used:minecraft.carrot_on_a_stick")
export const rightClick = rightClickObj("@s")

MCFunction('test', () => {
    execute.as(Selector('@a', { scores: { 'rcObj': [1, null] } })).at('@s').anchored("eyes").positioned(loc(0, 0, 1)).run(() => {
        rightClick.set(0);
        raycast(
            "raycast/cast",
            "minecraft:air", 
            Selector('@e', 
                { 
                    type: "minecraft:husk", 
                    dx: 0
                }
            ),
            MCFunction("raycast/update", () => {
                particle("minecraft:crit", rel(0, 0, 0), [0, 0, 0], 0, 1);
            }), 
            MCFunction("raycast/hit", () => {
                effect.give(Selector('@e', { type: 'minecraft:husk', dx: 0}), "minecraft:instant_health");
                say("Hi")
            }), 1, 50
        )
	})
}, {
	runEachTick: true
})
```

<span style="color:red">NOTE: This library does **NOT** handle scores and right click detection</span>



