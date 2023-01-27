import { BLOCKS, execute, functionCmd, loc, MCFunction, MCFunctionInstance, rel, SelectorClass, _ } from "sandstone";


/**
 * @param nameOfFile Name of the file that will be generated 
 * @param blockToHit Block name to actively look for, once the block is found the raycast will stop
 * @param entityToHit Name of the Entity to look for, it accept Selectors with distance attribute
 * @param runOnEveryStep MCFunction to run on every step
 * @param runOnHit MCFunction to run on hitting the target
 * @param step Step size of the raycast, default is 1
 * 
 * You can pass `null` where you don't want to pass the args such as `entityToHit`, `blockToHit`.
 */
export function raycast(nameOfFile: string, blockToHit: BLOCKS, entityToHit: SelectorClass, runOnEveryStep: MCFunctionInstance, runOnHit: MCFunctionInstance, step: number = 1): void {
    // Reuseable function to check if the target is hit
    function ifHitBlock(): void {
        execute.if(_.block(rel(0, 0, 0), blockToHit)).run(runOnHit);
    }
    function ifHitEntity(): void {
        execute.if.entity(entityToHit).run(runOnHit);
    }

    // Recursive function to cast a ray
    const recurcive: any = MCFunction(nameOfFile, () => {
        runOnEveryStep()
        if (entityToHit == null) {
            execute.unless(_.block(rel(0, 0, 0), blockToHit)).positioned(loc(0, 0, step)).run(recurcive);
            ifHitBlock()
        }
        if (blockToHit == null) {
            execute.unless.entity(entityToHit).positioned(loc(0, 0, step)).run(recurcive);
            ifHitEntity()
        }
        if (entityToHit != null && blockToHit != null) {
            execute.unless(_.block(rel(0, 0, 0), blockToHit)).unless.entity(entityToHit).positioned(loc(0, 0, step)).run(recurcive);
            ifHitBlock()
            ifHitEntity()
        }
    });
    functionCmd(recurcive)
}
