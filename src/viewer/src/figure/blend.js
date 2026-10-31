import * as THREE from "three";

export const JOINT_STEP_DEGREES = 12;
export const JOINT_STEP = THREE.MathUtils.degToRad(JOINT_STEP_DEGREES);
const SETTLED_ANGLE = 1e-7;
const SETTLED_DISTANCE = 1e-7;
const translation = (at) => new THREE.Matrix4().makeTranslation(at.x, at.y, at.z);
const frameOf = (rig, moves, name) => moves.get(name).clone().multiply(translation(rig.heads.get(name)));

function localOf(rig, moves, name) {
    const parent = rig.parents.get(name);
    const frame = frameOf(rig, moves, name);
    return parent ? frameOf(rig, moves, parent).invert().multiply(frame) : frame;
}

const partsOf = (matrix) => {
    const at = new THREE.Vector3(), turn = new THREE.Quaternion(), scale = new THREE.Vector3();
    matrix.decompose(at, turn, scale);
    return {at, turn, scale};
};

export function jointAngles(rig, from, to) {
    return new Map(rig.order.map((name) => [name,
        partsOf(localOf(rig, from, name)).turn.angleTo(partsOf(localOf(rig, to, name)).turn),
    ]));
}

// Interpolate in parent space; independent world-space turns pull articulated joints apart.
export function blendMoves(rig, from, to, k, previous = from, limit = JOINT_STEP) {
    const frames = new Map(), moves = new Map();
    let settled = k >= 1;
    for (const name of rig.order) {
        const a = partsOf(localOf(rig, from, name));
        const b = partsOf(localOf(rig, to, name));
        const last = partsOf(localOf(rig, previous, name));
        const at = a.at.lerp(b.at, k);
        const scale = a.scale.lerp(b.scale, k);
        const desired = a.turn.slerp(b.turn, k);
        const distance = last.turn.angleTo(desired);
        const turn = last.turn.slerp(desired, distance > limit ? limit / distance : 1);
        const local = new THREE.Matrix4().compose(at, turn, scale);
        const parent = rig.parents.get(name);
        const world = parent ? frames.get(parent).clone().multiply(local) : local;
        frames.set(name, world);
        moves.set(name, world.clone().multiply(translation(rig.heads.get(name).clone().negate())));
        settled &&= turn.angleTo(b.turn) < SETTLED_ANGLE && at.distanceTo(b.at) < SETTLED_DISTANCE && scale.distanceTo(b.scale) < SETTLED_DISTANCE;
    }
    return {moves, settled};
}
