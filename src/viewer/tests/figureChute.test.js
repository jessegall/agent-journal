// @vitest-environment node
import {readFileSync} from "node:fs";
import * as THREE from "three";
import {expect, test} from "vitest";

const {CANOPY, CLIPS, Posing, canopyOf} = await import("../src/figure/figure.js");
const {ACTS, chuteOver} = await import("../src/figure/acts.js");
const {FRAMED} = await import("../src/figure/frame.js");

const {rig, stances} = JSON.parse(readFileSync(new URL("./figureRig.json", import.meta.url)));
const vectors = (table) => new Map(Object.entries(table).map(([name, at]) => [name, new THREE.Vector3(...at)]));
const RIG = {order: rig.order, parents: new Map(Object.entries(rig.parents)), heads: vectors(rig.heads), along: vectors(rig.along), eyes: rig.eyes.map((at) => new THREE.Vector3(...at))};
const stanceOf = (voice) => Object.fromEntries(Object.entries(stances[voice]).map(([key, value]) => [key, Array.isArray(value) ? new Set(value) : value]));
const SIZE = 112;

test("the parachute's canopy is drawn in 3D as the figure is: a dome of gores in two colours, each shaded and outlined, its lines leaving the rim a pair a side", () => {
    const canopy = canopyOf(FRAMED.height / SIZE, SIZE);
    const parts = canopy.scene.getObjectByName("canopy").children[0].children;
    expect(parts.filter((part) => part.name.startsWith("canopy_gore_"))).toHaveLength(CANOPY.panels);
    for (const part of parts) {
        expect(part.material.type, part.name).toBe("ShaderMaterial");
        expect(part.children.some((hull) => hull.material.side === THREE.BackSide), part.name).toBe(true);
    }
    // a dome with depth, as wide across as the act draws it
    const size = new THREE.Vector3();
    canopy.bounds.getSize(size);
    expect(size.x / (FRAMED.height / SIZE)).toBeCloseTo(ACTS.chute.width * SIZE, -1);
    expect(size.z).toBeGreaterThan(size.x * 0.5);
    // the lines leave the rim, the left hand's pair on its left and the right's on its right, all below the dome's top
    expect(canopy.ends).toHaveLength(4);
    expect(canopy.ends.slice(0, 2).every((end) => end.x < 0) && canopy.ends.slice(2).every((end) => end.x > 0)).toBe(true);
    for (const end of canopy.ends) expect(end.y).toBeLessThan(canopy.bounds.max.y);
});

test("under the parachute the figure hangs with both arms raised, its hands gripping above its shoulders, for every voice, all through its sway", () => {
    const chute = CLIPS.find((clip) => clip.name === "chute");
    for (const voice of Object.keys(stances)) {
        for (let frame = 0; frame < chute.frames; frame += 4) {
            const pose = new Posing(RIG, "stand", 0);
            chute.pose(pose, stanceOf(voice), frame / chute.frames);
            const moves = pose.moves(0);
            for (const side of ["l", "r"]) {
                const hand = RIG.heads.get(`hand_${side}`).clone().applyMatrix4(moves.get(`hand_${side}`));
                const shoulder = RIG.heads.get(`upper_arm_${side}`).clone().applyMatrix4(moves.get(`upper_arm_${side}`));
                expect(hand.z - shoulder.z, `${voice} ${side} at ${frame}`).toBeGreaterThan(0.4);
            }
        }
    }
});

test("the canopy is drawn above the head, swaying a little, and each of its lines runs from the rim down to the hand on its side", () => {
    const canopy = {at: {x: 40, y: 20}, ends: [{x: 6, y: 22}, {x: 14, y: 24}, {x: 66, y: 24}, {x: 74, y: 22}], width: 80, height: 30};
    const head = {x: 56, y: 40};
    const hands = [{x: 76, y: 48}, {x: 36, y: 50}];
    const turns = [];
    for (let u = 0; u < 1; u += 0.05) {
        const over = chuteOver(canopy, head, hands, SIZE, u);
        turns.push(over.turn);
        expect(over.middle).toEqual({x: head.x, y: head.y - ACTS.chute.above * SIZE});
        expect(over.top + canopy.height).toBeLessThan(head.y);
        expect(over.lines.map((line) => line.to)).toEqual([hands[1], hands[1], hands[0], hands[0]]);
        for (const line of over.lines) expect(line.from.y).toBeLessThan(line.to.y);
    }
    expect(Math.max(...turns.map(Math.abs))).toBeGreaterThan(0);
    expect(Math.max(...turns.map(Math.abs))).toBeLessThanOrEqual(ACTS.chute.sway);
});
