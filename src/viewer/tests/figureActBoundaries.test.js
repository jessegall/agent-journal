// @vitest-environment node
import {readFileSync} from "node:fs";
import * as THREE from "three";
import {expect, test} from "vitest";
import {ACTS, pogoBounces} from "../src/figure/acts.js";
import {CLIPS, drawnPose} from "../src/figure/figure.js";
import {jointAngles} from "../src/figure/blend.js";

const {rig, stances} = JSON.parse(readFileSync(new URL("./figureRig.json", import.meta.url)));
const vectors = (table) => new Map(Object.entries(table).map(([name, at]) => [name, new THREE.Vector3(...at)]));
const RIG = {order: rig.order, parents: new Map(Object.entries(rig.parents)), heads: vectors(rig.heads), along: vectors(rig.along), eyes: rig.eyes.map((at) => new THREE.Vector3(...at))};
const stanceOf = (voice) => Object.fromEntries(Object.entries(stances[voice]).map(([key, value]) => [key, Array.isArray(value) ? new Set(value) : value]));

function posed(name, voice, u) {
    const clip = CLIPS.find((entry) => entry.name === name);
    const {pose, turned} = drawnPose(RIG, stanceOf(voice), clip, u * clip.frames, 0);
    return {pose, moves: pose.moves(turned)};
}

function continuous(name, voice, u) {
    const before = posed(name, voice, u - 1e-7);
    const after = posed(name, voice, u + 1e-7);
    for (const [bone, angle] of jointAngles(RIG, before.moves, after.moves)) {
        expect(angle, `${name} ${voice} ${bone} at ${u}`).toBeLessThan(0.0001);
        const first = RIG.heads.get(bone).clone().applyMatrix4(before.moves.get(bone));
        const second = RIG.heads.get(bone).clone().applyMatrix4(after.moves.get(bone));
        expect(first.distanceTo(second), `${name} ${voice} ${bone} stays joined`).toBeLessThan(0.0001);
    }
}

test("the rifle's head and supporting wrist turn continuously through aiming, raising and lowering", () => {
    const {draw, drops} = ACTS.bug_shot;
    for (const voice of Object.keys(stances)) {
        continuous("bug_shot", voice, (draw[0] + draw[1]) / 2);
        continuous("bug_shot", voice, (draw[0] + 3 * draw[1]) / 4);
        continuous("bug_shot", voice, drops[0] + 0.125);
        continuous("bug_shot", voice, drops[0] + 0.2);
    }
});

test("mallet contact correction blends smoothly when the hands reach and release it", () => {
    for (const voice of Object.keys(stances)) {
        for (const u of [ACTS.bug_smash.raise[0], ACTS.bug_smash.lower[1]]) {
            continuous("bug_smash", voice, u);
            const origin = (sample) => {
                const held = sample.pose.props.get("big_mallet");
                return held.at.clone().applyMatrix4(sample.moves.get(held.bone));
            };
            const before = origin(posed("bug_smash", voice, u - 1e-7));
            const after = origin(posed("bug_smash", voice, u + 1e-7));
            expect(before.distanceTo(after), `${voice} supported mallet`).toBeLessThan(0.01);
        }
    }
});

test("pogo compression meets every bounce and extends through liftoff without a knee snap", () => {
    const {bounces, spring} = ACTS.pogo;
    const lengths = pogoBounces().map(Math.sqrt);
    const total = lengths.reduce((sum, length) => sum + length, 0);
    let elapsed = 0;
    const joins = [bounces[0], bounces[1], spring[0] + 0.06];
    for (const length of lengths.slice(0, -1)) {
        elapsed += length;
        joins.push(bounces[0] + (bounces[1] - bounces[0]) * elapsed / total);
    }
    for (const voice of Object.keys(stances)) for (const u of joins) continuous("pogo", voice, u);
});

test("the pogo draw carries the hand from behind the back to the handle without switching poses mid-reach", () => {
    for (const voice of Object.keys(stances)) {
        let before = posed("pogo", voice, 0);
        for (let step = 1; step <= 450; step++) {
            const after = posed("pogo", voice, ACTS.pogo.draw[1] * step / 450);
            for (const bone of ["upper_arm_r", "forearm_r", "hand_r"]) {
                const a = RIG.heads.get(bone).clone().applyMatrix4(before.moves.get(bone));
                const b = RIG.heads.get(bone).clone().applyMatrix4(after.moves.get(bone));
                expect(a.distanceTo(b), `${voice} ${bone} at draw sample ${step}`).toBeLessThan(0.02);
                expect(jointAngles(RIG, before.moves, after.moves).get(bone), `${voice} ${bone} turns with the reach`).toBeLessThan(0.02);
            }
            before = after;
        }
    }
});

test("pogo knees carry the hips while the feet remain on the stick's pegs", () => {
    for (const voice of Object.keys(stances)) {
        const first = posed("pogo", voice, 0);
        const footAt = (sample, side) => RIG.heads.get(`foot_${side}`).clone().applyMatrix4(sample.moves.get(`foot_${side}`));
        for (let step = 0; step <= 160; step++) {
            const sample = posed("pogo", voice, step / 160);
            for (const side of ["l", "r"]) expect(footAt(sample, side).z, `${voice} foot ${side} ${step}`).toBeCloseTo(footAt(first, side).z, 8);
        }
        const compressed = posed("pogo", voice, ACTS.pogo.bounces[1]);
        const high = RIG.heads.get("hips").clone().applyMatrix4(first.moves.get("hips")).z;
        const low = RIG.heads.get("hips").clone().applyMatrix4(compressed.moves.get("hips")).z;
        expect(high - low, voice).toBeGreaterThan(0.2);
    }
});

test("rummaging eases from and back to each voice's exact resting arms", () => {
    for (const voice of Object.keys(stances)) {
        continuous("rummage", voice, ACTS.rummage.leans[0]);
        continuous("rummage", voice, ACTS.rummage.pops[1]);
        const first = posed("rummage", voice, 0);
        const last = posed("rummage", voice, 1);
        for (const [bone, angle] of jointAngles(RIG, first.moves, last.moves)) expect(angle, `${voice} ${bone}`).toBeLessThan(1e-6);
    }
});
