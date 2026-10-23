// @vitest-environment node
import {readFileSync} from "node:fs";
import * as THREE from "three";
import {expect, test} from "vitest";
import {CLIPS, HAND, Posing, TOOLS} from "../src/figure/figure.js";

// the figures' own skeleton and what each voice carries, as figure.js figureOf reads them from the voices' glbs
const {rig, stances} = JSON.parse(readFileSync(new URL("./figureRig.json", import.meta.url)));
const vectors = (table) => new Map(Object.entries(table).map(([name, at]) => [name, new THREE.Vector3(...at)]));
const RIG = {order: rig.order, parents: new Map(Object.entries(rig.parents)), heads: vectors(rig.heads), along: vectors(rig.along), eyes: rig.eyes.map((at) => new THREE.Vector3(...at))};
const stanceOf = (voice) => Object.fromEntries(Object.entries(stances[voice]).map(([key, value]) => [key, Array.isArray(value) ? new Set(value) : value]));
// what lies flat on the palm rather than in the closed fingers: the hand is anywhere under the sheet
const SHEETS = new Set(["papers", "writing_paper", "writing_tablet"]);

test("every prop a hand holds sits in that hand, in every frame of every clip that holds it, for every voice", () => {
    const held = new Set();
    for (const voice of Object.keys(stances)) {
        for (const clip of CLIPS.filter((each) => !each.voices || each.voices.includes(voice))) {
            for (const posture of clip.postures ?? ["stand"]) {
                const steps = clip.frames * 2;
                for (let step = 0; step <= steps; step++) {
                    const pose = new Posing(RIG, posture, 0);
                    clip.pose(pose, stanceOf(voice), step / steps);
                    const moves = pose.moves(0);
                    for (const [name, prop] of pose.props) {
                        if (!prop.bone.startsWith("hand_")) continue;
                        held.add(name);
                        const grip = pose.grip(prop.bone.slice(-1), [0, 0, 0]).applyMatrix4(moves.get(prop.bone));
                        const reach = SHEETS.has(name) ? TOOLS.paper.width / 2 : HAND.grip;
                        expect(prop.at.clone().applyMatrix4(moves.get(prop.bone)).distanceTo(grip), `${voice} ${clip.name} ${posture} ${step} ${name}`).toBeLessThanOrEqual(reach);
                    }
                }
            }
        }
    }
    expect([...held]).toEqual(expect.arrayContaining(["magnifying_glass", "pocket_watch", "writing_pen", "hand_whistle", "work_hammer"]));
});
