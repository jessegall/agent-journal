// @vitest-environment node
import {expect, test} from "vitest";
import * as THREE from "three";
import {CLIPS, Posing} from "../src/figure/figure.js";

// a rig whose every bone stands at rest where the pose functions ask for it
const atRest = (make) => ({get: () => make(), has: () => true, set() {}, forEach() {}, *[Symbol.iterator]() {}});
// an arm's bones start a length apart, so a hand reaches what a clip holds
const ARM_DROP = {forearm: 1.5, hand: 3};
const headOf = (name) => new THREE.Vector3(0, -(ARM_DROP[name.split("_")[0]] ?? 0), 0);
const RIG = {
    parents: atRest(() => ""),
    heads: {...atRest(() => new THREE.Vector3()), get: headOf},
    tails: atRest(() => new THREE.Vector3(0, 0, 0.1)),
    rest: atRest(() => new THREE.Matrix4()),
    along: atRest(() => new THREE.Vector3(0, 1, 0)),
    order: [],
    eyes: [],
};
const STANCE = {
    voice: "butler",
    level: new Set(["l"]),
    busy: new Set(["l"]),
    carried: new Set(),
    free: new Set(["r"]),
    tablet: new Set(),
    cloth: new Set(),
    shield: new Set(),
};

// the pose a clip holds at its time `t`, as how open its eyes are and the numbers of every bone's matrix
function posed(clip, t) {
    const pose = new Posing(RIG, "stand", 0);
    clip.pose(pose, STANCE, t);
    return JSON.stringify([
        pose.eyes.toFixed(6),
        ...[...pose.final].map(([name, matrix]) => [name, matrix.elements.map((n) => n.toFixed(6))]),
    ]);
}

// the slowest clips and the ones whose time was rounded inside, each from a moment it moves: the waiting figure from its whistling, past
// the stretch it holds its watch still on purpose
const MOVING = {think: 0.2, sleep: 0.2, waiting: 0.72, idle: 0.2};

test("the slow clips move on every display frame instead of holding a pose for several", () => {
    for (const [name, from] of Object.entries(MOVING)) {
        const clip = CLIPS.find((each) => each.name === name);
        const step = ((1 / 60) * clip.fps) / clip.frames;
        const poses = Array.from({length: 120}, (_, i) => posed(clip, from + i * step));
        const moved = poses.slice(1).filter((pose, i) => pose !== poses[i]).length;
        expect(moved / (poses.length - 1), name).toBeGreaterThanOrEqual(0.9);
    }
});
