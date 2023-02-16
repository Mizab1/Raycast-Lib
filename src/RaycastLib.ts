import { BLOCKS, execute, functionCmd, loc, MCFunction, MCFunctionInstance, Objective, rel, SelectorClass, tellraw, _ } from "sandstone";

// Private Variables 
const raycastPvtObj = Objective.create('raycastPvt.obj', 'dummy');
const currentIter = raycastPvtObj('@s');

/**
 * Creates a simple raycast.
 * @param nameOfFile Name of the file that will be generated.
 * @param blockToIgnore Block name ignore, if the current block is not the specified block then the raycast will stop.
 * @param entityToHit Name of the Entity to look for, it accept Selectors with distance attribute.
 * @param runOnEveryStep MCFunction to run on every step, can be null.
 * @param runOnHit MCFunction to run on hitting the target, can be null.
 * @param step Step size of the raycast, default is 1.
 * @param maxIter Maximum iteration of the raycast, default is 20.
 * 
 * You can use NOT operator (!) to invert the condition of 'entityToHit'.
 * Note: You can pass `null` where you don't want to pass the args such as `entityToHit`, `blockToHit`.
 */
export function raycast(nameOfFile: string, blockToIgnore: BLOCKS, entityToHit: SelectorClass, runOnEveryStep: MCFunctionInstance, runOnHit: MCFunctionInstance, step: number = 1,  maxIter: number = 20): void {
    // Reuseable function to check if the target is hit or not
    function ifHitBlock(): void {
        execute.unless(_.block(rel(0, 0, 0), blockToIgnore)).run(() => {
            runOnHit();
            currentIter.set(0);
        });
    }
    function ifHitEntity(): void {
        execute.if.entity(entityToHit).run(() => {
            runOnHit();
            currentIter.set(0);
        });
    }

    // Recursive function to cast a ray
    const recurcive: any = MCFunction(nameOfFile, () => {
        currentIter.add(1);
        _
            .if(currentIter.greaterOrEqualThan(maxIter), () => {
                currentIter.set(0);
            })
            .elseIf(_.not(currentIter.greaterOrEqualThan(maxIter)), () => {
                runOnEveryStep();
                if(entityToHit == null && blockToIgnore == null){
                    tellraw('@s', {
                        "text": "[Raycast Wizard] Both Entity and Block are null, what am I suppose to look for?",
                        "color": "white"
                    });
                    currentIter.set(0);
                    return;
                }
                if (entityToHit == null) {
                    execute.if(_.block(rel(0, 0, 0), blockToIgnore)).positioned(loc(0, 0, step)).run(recurcive);
                    ifHitBlock();
                }
                if (blockToIgnore == null) {
                    execute.unless.entity(entityToHit).positioned(loc(0, 0, step)).run(recurcive);
                    ifHitEntity();
                }
                if (entityToHit != null && blockToIgnore != null) {
                    execute.if(_.block(rel(0, 0, 0), blockToIgnore)).unless.entity(entityToHit).positioned(loc(0, 0, step)).run(recurcive);
                    ifHitBlock();
                    ifHitEntity();
                }
            }) 
    });
    functionCmd(recurcive);
}
