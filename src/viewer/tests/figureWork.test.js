// @vitest-environment node
import {readFileSync} from "node:fs";
import {expect, test} from "vitest";
import * as THREE from "three";
import {CLIPS, HAND, Posing, TOOLS, WORK, blowsLandAt} from "../src/figure/figure.js";
import {PARCEL, PUSH_LOOK, workLook} from "../src/figure/parcels.js";
import {canSwitch} from "../src/figure/timeline.js";

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
const STANCE = {voice: "butler", level: new Set(["l"]), busy: new Set(["l"]), carried: new Set(), free: new Set(["r"]), tablet: new Set(), shield: new Set()};
// a few poses for each blow, enough to see each come down and lift back
const STEPS_A_BLOW = 16;

test("the hammering holds a readable preparation, strikes once, rebounds above contact and lifts back slowly", () => {
    const clip = CLIPS.find((each) => each.name === "work");
    expect([WORK.blows, clip.frames]).toEqual([1, WORK.blowFrames]);
    expect([clip.loops, Boolean(clip.interruptible), Boolean(clip.leaves)]).toEqual([true, false, false]);
    for (let frame = 1; frame < clip.frames; frame++) expect(canSwitch(clip, frame, frame - 1), `${frame}`).toBe(false);
    expect(canSwitch(clip, clip.frames, clip.frames - 1)).toBe(true);
    const heightAt = (u) => {
        const pose = new Posing(RIG, "sit", 0);
        clip.pose(pose, STANCE, u);
        expect(pose.props.get("work_hammer")?.bone).toBe("hand_r");
        return new THREE.Vector3(-1, 0, 0).transformDirection(pose.matrix("upper_arm_r")).z;
    };
    const contact = heightAt(WORK.lands);
    expect(heightAt(0)).toBeCloseTo(heightAt(1), 9);
    expect(heightAt(WORK.prepare)).toBeGreaterThan(heightAt(0));
    expect(heightAt(WORK.lands - 0.02)).toBeGreaterThan(contact);
    expect(heightAt((WORK.lands + WORK.contact) / 2)).toBeCloseTo(contact, 9);
    expect(heightAt((WORK.contact + WORK.rebound) / 2)).toBeGreaterThan(contact);
    expect(heightAt(WORK.rebound)).toBeCloseTo(contact, 9);
    expect(heightAt(0.8)).toBeGreaterThan(heightAt(0.6));
    expect(1 - WORK.rebound).toBeGreaterThan(WORK.lands - WORK.prepare);
});

// the figures' own skeleton and what each voice carries, as figure.js figureOf reads them from the voices' glbs
const {rig, stances} = JSON.parse(readFileSync(new URL("./figureRig.json", import.meta.url)));
const vectors = (table) => new Map(Object.entries(table).map(([name, at]) => [name, new THREE.Vector3(...at)]));
const REAL = {order: rig.order, parents: new Map(Object.entries(rig.parents)), heads: vectors(rig.heads), along: vectors(rig.along), eyes: rig.eyes.map((at) => new THREE.Vector3(...at))};
const stanceOf = (voice) => Object.fromEntries(Object.entries(stances[voice]).map(([key, value]) => [key, Array.isArray(value) ? new Set(value) : value]));

test("on its feet the figure hammers side-on, its face toward the side its blows land on, where the page stands the parcel", () => {
    const work = CLIPS.find((each) => each.name === "work");
    expect(work.postures).not.toContain("walk");
    for (const voice of Object.keys(stances)) {
        const lands = blowsLandAt(stanceOf(voice));
        expect(Math.abs(lands), voice).toBeGreaterThan(0.15);
        expect(Math.abs(lands), voice).toBeLessThan(0.4);
        for (let step = 0; step <= 64; step++) {
            const pose = new Posing(REAL, "stand", 0);
            work.pose(pose, stanceOf(voice), step / 64);
            const facing = new THREE.Vector3(0, -1, 0).transformDirection(pose.moves(0).get("head"));
            expect(Math.abs(facing.x), `${voice} ${step}`).toBeGreaterThan(0.9);
            expect(Math.sign(facing.x), `${voice} ${step}`).toBe(Math.sign(lands));
            expect([...pose.props.keys()], `${voice} ${step}`).toEqual(["work_hammer"]);
        }
    }
});

test("the hand is closed round the hammer's handle at every frame of the swing: its grip inside the fist, the handle across the palm through it, the head beyond the thumb", () => {
    const work = CLIPS.find((each) => each.name === "work");
    for (const voice of Object.keys(stances)) {
        for (let step = 0; step <= 128; step++) {
            const pose = new Posing(REAL, "stand", 0);
            work.pose(pose, stanceOf(voice), step / 128);
            const moves = pose.moves(0);
            const held = pose.props.get("work_hammer");
            const move = moves.get(held.bone);
            const shape = new THREE.Matrix3().setFromMatrix4(move);
            // the fingers closed: the hand drawn well short of the open hand along its length
            expect(REAL.along.get(held.bone).clone().applyMatrix3(shape).length(), `${voice} ${step}`).toBeLessThan(0.7);
            // the grip inside the closed hand: along its length between the wrist and the fingers' ends, and on its middle line
            const wrist = REAL.heads.get(held.bone).clone().applyMatrix4(move);
            const length = REAL.along.get(held.bone).clone().transformDirection(move);
            const grip = held.at.clone().applyMatrix4(move).sub(wrist);
            const along = grip.dot(length);
            expect(along, `${voice} ${step}`).toBeGreaterThan(0);
            expect(along, `${voice} ${step}`).toBeLessThan(2 * HAND.grip * WORK.fist);
            expect(grip.clone().addScaledVector(length, -along).length(), `${voice} ${step}`).toBeLessThan(TOOLS.hammer.handleRadius);
            // the handle runs across the palm, never out of its back, from the little finger's side to the thumb's
            const turn = held.turn;
            const turned = new THREE.Matrix4().extractRotation(moves.get(held.frame)).multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...[turn.x, turn.y, turn.z].map((degrees) => THREE.MathUtils.degToRad(degrees || 0)), "ZYX")));
            const handle = new THREE.Vector3(0, 0, 1).applyMatrix4(turned);
            const palm = new THREE.Vector3(0, 0, 1).transformDirection(move);
            const thumb = new THREE.Vector3(0, -1, 0).transformDirection(move);
            expect(Math.abs(handle.dot(palm)), `${voice} ${step}`).toBeLessThan(0.05);
            expect(handle.dot(thumb), `${voice} ${step}`).toBeGreaterThan(0.5);
        }
    }
});

// the corners of the hammer's head in the figure's units, its prop held as figure.js heldPropOf places it: on the bone that carries it,
// turned as the hand is and then as the prop is, the head the handle's length past the grip
function hammerHead(pose, moves) {
    const held = pose.props.get("work_hammer");
    const radians = (degrees) => (degrees * Math.PI) / 180;
    const turned = new THREE.Matrix4().extractRotation(moves.get(held.frame)).multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(radians(held.turn.x || 0), radians(held.turn.y || 0), radians(held.turn.z || 0), "ZYX")));
    const at = held.at.clone().applyMatrix4(moves.get(held.bone));
    const [width, height, depth] = TOOLS.hammer.head;
    const reach = TOOLS.hammer.handleLength - TOOLS.hammer.gripFrom;
    return [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => at.clone().add(new THREE.Vector3((x * width) / 2, (-z * depth) / 2, reach + (y * height) / 2).applyMatrix4(turned)))));
}

test("every blow contacts the box's top: the hammer's head comes to rest on its surface, never into it, over the box, from a little further back than at first", () => {
    const work = CLIPS.find((each) => each.name === "work");
    // the box's top in the figure's units over its feet, at the chat's 112-pixel picture of 5.4 units
    const top = (PARCEL.height * 5.4) / 112;
    for (const voice of Object.keys(stances)) {
        const lands = blowsLandAt(stanceOf(voice));
        // further from the feet than the 0.256 of the picture it stood at before task 2708
        expect(Math.abs(lands) * 112, voice).toBeGreaterThan(0.256 * 112 + 4);
        const heads = Array.from({length: 129}, (_, step) => {
            const pose = new Posing(REAL, "stand", 0);
            work.pose(pose, stanceOf(voice), step / 128);
            return hammerHead(pose, pose.moves(0));
        });
        const lowest = heads.map((corners) => Math.min(...corners.map((corner) => corner.z)));
        // at no frame does any corner of the head go below the box's top
        for (const [step, low] of lowest.entries()) expect(low, `${voice} ${step}`).toBeGreaterThanOrEqual(top);
        // at the strike it rests on it, held there for frames before it lifts again, its middle over the box where the page stands it
        const resting = lowest.filter((low) => low - top < 0.01);
        expect(resting.length, voice).toBeGreaterThan(3);
        const struck = heads[lowest.indexOf(Math.min(...lowest))];
        const middle = struck.reduce((sum, corner) => sum.add(corner), new THREE.Vector3()).multiplyScalar(1 / struck.length);
        expect(Math.abs(middle.x - lands * 5.4), voice).toBeLessThan(0.1);
    }
});

test("hammering, the figure looks at the box's top, where its blows strike; taking a built box round, pushing and stacking it, it looks ahead the way it goes, never at the box", () => {
    const xOf = (box) => 300 + box.along;
    // hammering: the top of the box, on the floor or wherever it stands
    for (const up of [0, 24]) {
        const parcels = [{along: 40, state: "piled", up: 0}, {along: 120, state: "building", up}];
        expect(workLook(parcels, true, xOf, 600, 1), `${up}`).toEqual({at: {x: 420, y: 600 - up - PARCEL.height}});
    }
    // with a built box, round behind it, pushing it and hopping it onto the pile: ahead the way it goes, at its eyes, well clear of the box
    for (const way of [1, -1]) {
        for (const up of [0, 24]) {
            const box = {along: 120, state: "built", up};
            const {at} = workLook([box], true, xOf, 600, way);
            expect(Math.sign(at.x - xOf(box)), `${way} ${up}`).toBe(way);
            expect(Math.abs(at.x - xOf(box)), `${way} ${up}`).toBeGreaterThan(PARCEL.width * 3);
            expect(at.y, `${way} ${up}`).toBe(600 - PUSH_LOOK.up);
        }
    }
    // setting out to build one, before it is begun: no look at all, so nothing turns its head to a bar
    expect(workLook([{along: 40, state: "piled", up: 0}], true, xOf, 600, 1)).toEqual({at: null});
    // with no box in hand and none to build the work holds no look, and the bar may have it
    expect(workLook([{along: 40, state: "piled", up: 0}], false, xOf, 600, 1)).toBe(null);
});

test("the figure sets out to build a box only where there is room behind the box for it to stand and push it to the pile", async () => {
    const {buildSpot} = await import("../src/figure/places.js");
    const {PUSH} = await import("../src/figure/parcels.js");
    const {boxed} = await import("./support/figurePage.js");
    // the chat's side a little left of the compose box's, as on the page, so the figure cannot stand far past the compose box's end
    const thread = {...boxed({left: 280, top: 100, right: 900, bottom: 800}), querySelector: () => null};
    const home = {...boxed({left: 300, right: 700, top: 600, bottom: 720}), closest: () => thread};
    globalThis.window = {innerWidth: 1280, innerHeight: 800};
    globalThis.CSS = {escape: (text) => text};
    globalThis.document = {querySelector: (selector) => (selector === "[data-figure-home]" ? home : null), querySelectorAll: () => []};
    const figure = {size: 112, below: 0.05};
    // a figure whose blows land on its left, setting out from anywhere along the compose box, the left end most of all
    const beside = -Math.abs(blowsLandAt(stanceOf("butler"))) * 112;
    for (const x of [300, 320, 360, 500, 680]) {
        const spot = buildSpot(figure, {x, y: 600}, {beside});
        const behindIt = spot.x + beside - PUSH.reach - PUSH.room;
        // the place behind the box is one it can stand at, not one pulled back inside the chat
        expect(buildSpot(figure, {x, y: 600}, {x: behindIt}).x, `${x}`).toBeCloseTo(behindIt, 5);
    }
});

test("the figure hammers a box in stretches of four to ten seconds; now and then it looks through the glass for five, then hammers a new stretch", async () => {
    const {HAMMER, INSPECT, hammering, inspecting} = await import("../src/figure/parcels.js");
    const {INSPECTING} = await import("../src/figure/figure.js");
    expect([HAMMER.least, HAMMER.most, INSPECT.ms]).toEqual([4000, 10000, 5000]);
    // a seeded random, so the share is the same every run
    let seed = 2743;
    const random = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
    const boxes = Array.from({length: 2000}, () => hammering(1000, random));
    const inspected = boxes.filter((box) => box.inspects.length);
    expect(inspected.length / boxes.length).toBeGreaterThan(0.2);
    expect(inspected.length / boxes.length).toBeLessThan(0.3);
    expect(boxes.some((box) => box.inspects.length === 2), "a new stretch may be broken by a second look").toBe(true);
    for (const box of boxes) {
        expect(box.inspects.length).toBeLessThanOrEqual(INSPECT.most);
        // the stretches of hammering between the looks, each a whole stretch but the ones a look cut short
        const looks = box.inspects;
        let stretchBegun = 0;
        for (const look of looks) {
            expect(look.from - stretchBegun, "a look comes inside its stretch").toBeLessThan(HAMMER.most);
            expect(look.from - stretchBegun).toBeGreaterThan(0);
            expect(look.to - look.from).toBeCloseTo(INSPECT.ms, 6);
            // while it lasts the hammering stops: the figure inspects, and hammers before and after it
            expect(inspecting(box, box.began + (look.from + look.to) / 2)).toBe(true);
            expect(inspecting(box, box.began + look.from - 1)).toBe(false);
            expect(inspecting(box, box.began + look.to)).toBe(false);
            stretchBegun = look.to;
        }
        // after the last look, or with none, a whole stretch of four to ten seconds before the box is built
        const last = box.until - box.began - stretchBegun;
        expect(last).toBeGreaterThanOrEqual(HAMMER.least);
        expect(last).toBeLessThanOrEqual(HAMMER.most);
    }
    // the clip of the inspection plays as long as it lasts, side-on to the box as the hammering is, the glass in its free hand
    const clip = CLIPS.find((each) => each.name === "inspect");
    expect((clip.frames / clip.fps) * 1000).toBeCloseTo(INSPECT.ms, -2);
    expect(INSPECTING.frames).toBe(clip.frames);
    for (const voice of Object.keys(stances)) {
        const pose = new Posing(REAL, "stand", 0);
        clip.pose(pose, stanceOf(voice), 0.5);
        const facing = new THREE.Vector3(0, -1, 0).transformDirection(pose.moves(0).get("hips"));
        expect(Math.sign(facing.x), voice).toBe(Math.sign(blowsLandAt(stanceOf(voice))));
        expect(pose.props.get("magnifying_glass")?.bone, voice).toMatch(/^hand_/);
        expect(pose.props.has("work_hammer"), voice).toBe(false);
    }
});
