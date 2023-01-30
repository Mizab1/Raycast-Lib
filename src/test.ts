
import { BLOCKS, effect, execute, loc, MCFunction, MCFunctionInstance, Objective, particle, rel, say, Selector, SelectorClass } from 'sandstone'
import { raycast, raycastConverse } from './RaycastLib'

export const rightClickObj = Objective.create("cast.rc.obj", "minecraft.used:minecraft.carrot_on_a_stick")
export const rightClick = rightClickObj("@s")
let name: string = "raycast2/cast"
let block: BLOCKS = "minecraft:oak_planks"
let entity: SelectorClass = Selector('@e', {
	type: "minecraft:creeper",
	dx: 0
})
let update: MCFunctionInstance = MCFunction("raycast2/update", () => {
	particle("minecraft:crit", rel(0, 0, 0), [0, 0, 0], 0, 1);
})
let hit: MCFunctionInstance = MCFunction("raycast2/hit", () => {
	say("hi")
})
let steps: number = 2

MCFunction('test', () => {
    execute.as(Selector('@a', { scores: { 'cast.rc.obj': [1, null] } })).at('@s').anchored("eyes").positioned(loc(0, 0, 1)).run(() => {
		rightClick.set(0);
		raycast(
			"raycast/cast",
			"minecraft:sandstone", 
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
		// raycast(name, block, null, update, hit, steps)
	})
}, {
	runEachTick: true
})