# Raycast Library for Sandstone
---
*This library is built for sandstone: https://github.com/sandstone-mc/sandstone* :computer:

This library provides a simple raycast function to quickly construct a raycast for blocks and\or entities.


To import the raycast function:
1. Download the Library (RaycastLib.ts) :arrow_down:
2. Paste it in your project folder :clipboard:
3. Import the `Raycast.ts` file in your project :arrow_heading_down:
```ts
import { raycast } from './RaycastLib'
```
4. Call the raycast function 
5. Enjoy :star:
---
**Syntax:**
```ts
raycast(fileName, blockToIgnore, entityToHit, runOnEveryStep, runOnHit, step){
    // code
}
```
`nameOfFile` Name of the file that will be generated.

`blockToIgnore` Block name ignore, if the current block is not the specified block then the raycast will stop.

`entityToHit` Name of the Entity to look for, it accept Selectors with distance attribute.

`runOnEveryStep` MCFunction to run on every step.

`runOnHit` MCFunction to run on hitting the target.

`step` Step size of the raycast, default is 1 (OPTIONAL).

**Example of the function:**
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
    }), 1
)
```

**Example Pack:**
```ts
import { effect, execute, loc, MCFunction, Objective, particle, rel, say, Selector } from 'sandstone'
import { raycast } from './RaycastLib'

export const rightClickObj = Objective.create("cast.rc.obj", "minecraft.used:minecraft.carrot_on_a_stick")
export const rightClick = rightClickObj("@s")

MCFunction('test', () => {
    execute.as(Selector('@a', { scores: { 'cast.rc.obj': [1, null] } })).at('@s').anchored("eyes").positioned(loc(0, 0, 1)).run(() => {
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
            }), 1
        )
	})
}, {
	runEachTick: true
})
```

<span style="color:red">NOTE: This library does **NOT** handle scores and right click detection</span>



