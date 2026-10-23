// @vitest-environment node
import {expect, test} from "vitest";
import * as THREE from "three";
import {CLIPS, Posing} from "../src/figure/figure.js";

// a rig whose every bone stands at rest, the arms straight out to the sides as Blender's rig holds them, z up; it has no
// leg lengths, so the figure is posed seated
const atRest = (make) => ({get: () => make(), has: () => true, set() {}, forEach() {}, *[Symbol.iterator]() {}});
const RIG = {
    parents: atRest(() => ""),
    heads: atRest(() => new THREE.Vector3()),
    tails: atRest(() => new THREE.Vector3(0, 0, 0.1)),
    rest: atRest(() => new THREE.Matrix4()),
    along: {...atRest(() => new THREE.Vector3(1, 0, 0)), get: (name) => new THREE.Vector3(name.endsWith("_r") ? -1 : 1, 0, 0)},
    order: [],
    eyes: [],
};
const STANCE = {voice: "butler", level: new Set(["l"]), busy: new Set(["l"]), carried: new Set(), free: new Set(["r"]), tablet: new Set(), cloth: new Set(), shield: new Set()};
const STEPS = 64;

test("a running command's figure swings a hammer in its free hand, one blow a loop, never an empty arm pumping", () => {
    const clip = CLIPS.find((each) => each.name === "work");
    const heights = [];
    for (let step = 0; step <= STEPS; step++) {
        const pose = new Posing(RIG, "sit", 0);
        clip.pose(pose, STANCE, step / STEPS);
        expect(pose.props.get("work_hammer")?.bone).toBe("hand_r");
        heights.push(new THREE.Vector3(-1, 0, 0).transformDirection(pose.matrix("upper_arm_r")).z);
    }
    const turns = heights.slice(2).filter((height, index) => Math.sign(height - heights[index + 1]) !== Math.sign(heights[index + 1] - heights[index])).length;
    expect(turns).toBe(1);
    expect(heights[0]).toBeCloseTo(heights[STEPS], 6);
});
