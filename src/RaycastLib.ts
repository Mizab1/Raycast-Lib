import { BLOCKS, execute, functionCmd, loc, MCFunction, MCFunctionInstance, Objective, rel, SelectorClass, _ } from "sandstone";

// Private Variables 
const raycastPvtObj = Objective.create('raycastPvt.obj', 'dummy');
const currentIter = raycastPvtObj('@s');


function castMain(blockToIgnore, entityToHit, runOnEveryStep, step, recurcive, ifHitBlock, ifHitEntity){
    runOnEveryStep();
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
}
/**
 * Creates a simple raycast.
 * @param nameOfFile Name of the file that will be generated.
 * @param blockToIgnore Block name ignore, if the current block is not the specified block then the raycast will stop.
 * @param entityToHit Name of the Entity to look for, it accept Selectors with distance attribute.
 * @param runOnEveryStep MCFunction to run on every step.
 * @param runOnHit MCFunction to run on hitting the target.
 * @param step Step size of the raycast, default is 1.
 * @param maxIter Maximum iteration of the raycast, default is 20.
 * 
 * You can use NOT operator (!) to invert the condition of 'entityToHit'.
 * Note: You can pass `null` where you don't want to pass the args such as `entityToHit`, `blockToHit`.
 */
function ifHitBlock(maxIter, blockToIgnore, runOnHit): unknown {
    return execute.unless(_.block(rel(0, 0, 0), blockToIgnore)).run(runOnHit);
    if(maxIter != null){
        currentIter.set(0);
    }
}
function ifHitEntity(maxIter, entityToHit, runOnHit): unknown {
    return execute.if.entity(entityToHit).run(runOnHit);
    if(maxIter != null){
        currentIter.set(0);
    }
}
export function raycast(nameOfFile: string, blockToIgnore: BLOCKS | null, entityToHit: SelectorClass | null, runOnEveryStep: MCFunctionInstance, runOnHit: MCFunctionInstance, step: number = 1,  maxIter: null | number = 20): void {
    // Reuseable function to check if the target is hit

    // Recursive function to cast a ray
    const recurcive: any = MCFunction(nameOfFile, () => {
        if(maxIter == null){
            castMain(blockToIgnore, entityToHit, runOnEveryStep, step, recurcive, ifHitBlock(maxIter, blockToIgnore, runOnHit), ifHitEntity(maxIter, entityToHit, runOnHit));
        }else{
            currentIter.add(1);
            _
                .if(currentIter.greaterOrEqualThan(maxIter), () => {
                    currentIter.set(0);
                })
                .elseIf(_.not(currentIter.greaterOrEqualThan(maxIter)), () => {
                    castMain(blockToIgnore, entityToHit, runOnEveryStep, step, recurcive, ifHitBlock(maxIter, blockToIgnore, runOnHit), ifHitEntity(maxIter, entityToHit, runOnHit));
                }) 
        }
    });
    functionCmd(recurcive);
}
