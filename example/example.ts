
import { effect, execute, loc, MCFunction, Objective, particle, rel, say, Selector } from 'sandstone'
import { raycast } from '../src/RaycastLib'

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
			}), 1, 30
		)
	})
}, {
	runEachTick: true
})
