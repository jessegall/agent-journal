// @vitest-environment node
import {readFileSync} from "node:fs";
import * as THREE from "three";
import {expect, test} from "vitest";

const {BIG_MALLET, CLIPS, Posing, bigMalletOf} = await import("../src/figure/figure.js");
const {ACTS, SMASH, bugStep, smashAt, smashPlan} = await import("../src/figure/acts.js");
const {GRAVITY} = await import("../src/domain/falls.js");
const {AIRBORNE, clipFor} = await import("../src/domain/figureState.js");
const {FRAMED} = await import("../src/figure/frame.js");

const {rig, stances} = JSON.parse(readFileSync(new URL("./figureRig.json", import.meta.url)));
const vectors = (table) => new Map(Object.entries(table).map(([name, at]) => [name, new THREE.Vector3(...at)]));
const RIG = {order: rig.order, parents: new Map(Object.entries(rig.parents)), heads: vectors(rig.heads), along: vectors(rig.along), eyes: rig.eyes.map((at) => new THREE.Vector3(...at))};
const stanceOf = (voice) => Object.fromEntries(Object.entries(stances[voice]).map(([key, value]) => [key, Array.isArray(value) ? new Set(value) : value]));
const clip = CLIPS.find((each) => each.name === "bug_smash");
const act = ACTS.bug_smash;
const SIZE = 112;
// the compose box the figure stands on, its left, right and top on the page
const COMPOSER = {left: 300, right: 1100, top: 620};
// the bug's height above its feet climbing head up, in pixels (figure.js BUG long, its head out past the middle)
const BUG_UP = 15 * 0.65;

// the mallet act frame by frame on `floor` for a figure starting with its middle at `x`, each frame on the page
function framesOf(x, floor) {
    const plan = smashPlan(x, floor, SIZE);
    return Array.from({length: act.frames + 1}, (_, frame) => {
        const at = smashAt(plan, frame / act.frames, SIZE);
        return {u: frame / act.frames, figure: floor.left + at.figure, bug: {...at.bug, x: floor.left + at.bug.dx}, steps: at.steps, way: at.way};
    });
}

test("the bug starts behind the box of the floor the figure stands on, climbs up onto its top edge and walks along it as the figure walks to meet it", () => {
    for (const x of [420, 640, 900]) {
        const frames = framesOf(x, COMPOSER);
        const [first] = frames;
        // behind the box: inside its ends and wholly under its top edge, head up as it climbs
        expect(first.bug.x).toBeGreaterThan(COMPOSER.left);
        expect(first.bug.x).toBeLessThan(COMPOSER.right);
        expect(first.bug.below, `${x} hidden behind the box`).toBeGreaterThan(BUG_UP);
        expect(first.bug.turn).toBe(90);
        // it comes up out of sight and over the edge, never higher than the edge before it stands on it
        for (const [index, frame] of frames.entries()) {
            if (index) expect(frame.bug.below, `${x} frame ${index} rises`).toBeLessThanOrEqual(frames[index - 1].bug.below);
            expect(frame.bug.below).toBeGreaterThanOrEqual(0);
        }
        const onTop = frames.filter((frame) => frame.u >= act.climb[1]);
        for (const frame of onTop) expect([frame.bug.below, frame.bug.turn], `${x} at ${frame.u}`).toEqual([0, 0]);
        // before the walk neither moves; through it they close in on each other, each its own way, and keep within the floor
        const walking = frames.filter((frame) => frame.u > act.walk[0] && frame.u <= act.walk[1]);
        expect(frames.filter((frame) => frame.u <= act.walk[0]).every((frame) => frame.bug.x === first.bug.x && frame.figure === first.figure)).toBe(true);
        for (const [index, frame] of walking.entries()) {
            const before = index ? walking[index - 1] : first;
            expect(frame.bug.x, `${x} bug walks to the figure`).toBeLessThan(before.bug.x + 1e-9);
            expect(frame.figure, `${x} figure walks to the bug`).toBeGreaterThan(before.figure - 1e-9);
            expect(frame.figure).toBeGreaterThan(COMPOSER.left);
            expect(frame.bug.x).toBeLessThan(COMPOSER.right);
        }
        const met = frames.find((frame) => frame.u >= act.walk[1]);
        expect(met.bug.x - met.figure, `${x} met`).toBeCloseTo(act.away * SIZE, 6);
        expect(first.bug.x - met.bug.x, `${x} both walk`).toBeCloseTo(met.figure - first.figure, 6);
        expect(met.figure - first.figure, `${x} a walk`).toBeGreaterThan(SIZE / 2);
        // the figure steps as it walks, turned the way it goes, and stands still after
        expect(met.way).toBe(1);
        expect(met.steps).toBeCloseTo((met.figure - first.figure) / (SMASH.stride * SIZE), 6);
        expect(frames.at(-1).figure).toBe(met.figure);
    }
    // a figure with no room before the floor's end walks back from it to meet the bug where it came up
    const cramped = framesOf(COMPOSER.right - 40, COMPOSER);
    expect(cramped.at(-1).bug.x).toBe(cramped[0].bug.x);
    expect(cramped.at(-1).bug.x).toBeLessThan(COMPOSER.right);
    expect(cramped.at(-1).way).toBe(-1);
    expect(cramped.at(-1).bug.x - cramped.at(-1).figure).toBeCloseTo(act.away * SIZE, 6);
});

test("every voice's blow lands on the bug where they met, down at the floor's height, and the walk turns the figure the way it goes", () => {
    const frames = framesOf(640, COMPOSER);
    const blow = frames.find((frame) => frame.u >= act.blow);
    const bug = bugStep({x: 0, speed: 0, falling: false}, {x: blow.bug.x, y: COMPOSER.top}, COMPOSER.top, 1 / act.fps);
    expect(bug.y, "on the floor's top").toBe(COMPOSER.top);
    expect(blow.bug).toMatchObject({whole: false, flat: 1});
    expect(frames.find((frame) => frame.u >= act.blow - 0.02).bug.whole).toBe(true);
    for (const voice of Object.keys(stances)) {
        const pose = new Posing(RIG, "stand", 0);
        clip.pose(pose, stanceOf(voice), act.blow);
        const moves = pose.moves(0);
        const held = pose.props.get("big_mallet");
        const turned = new THREE.Matrix4().extractRotation(moves.get(held.frame)).multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...["x", "y", "z"].map((axis) => THREE.MathUtils.degToRad(held.turn[axis] || 0)), "ZYX")));
        const head = held.at.clone().applyMatrix4(moves.get(held.bone)).addScaledVector(new THREE.Vector3(1, 0, 0).transformDirection(turned), BIG_MALLET.handle);
        // across from the figure's middle in pixels, at the bug; down on the floor under its feet
        expect(Math.abs((head.x / FRAMED.height) * SIZE - (blow.bug.x - blow.figure)), `${voice} on the bug`).toBeLessThan(6);
        expect(head.z - BIG_MALLET.head, `${voice} at the floor`).toBeLessThan(0.3);
        // walking, it is turned the way it goes
        const walking = new Posing(RIG, "stand", 0.3);
        walking.walkWay = 1;
        clip.pose(walking, stanceOf(voice), (act.walk[0] + act.walk[1]) / 2);
        const ahead = new THREE.Vector3(0, -1, 0).transformDirection(walking.moves(0).get("hips"));
        expect(THREE.MathUtils.radToDeg(Math.atan2(ahead.x, -ahead.y)), `${voice} turned to walk`).toBeGreaterThan(80);
    }
});

test("the bug keeps to its floor as it moves and falls under gravity when the floor goes or drops away, as the figure does", () => {
    const step = 1 / 60;
    // carried on its floor as it moves, up as well
    let bug = bugStep({x: 500, y: 620, speed: 0, falling: false}, {x: 504, y: 617}, 900, step);
    expect(bug).toMatchObject({x: 504, y: 617, falling: false});
    bug = bugStep(bug, {x: 504, y: 560}, 900, step);
    expect(bug).toMatchObject({y: 560, falling: false});
    // the composer moves away from under it: it falls from where it was, faster each frame, onto the ground below
    const fall = (from, ground) => {
        const path = [from];
        for (let frame = 0; frame < 120 && path.at(-1).y < ground; frame++) path.push(bugStep(path.at(-1), null, ground, step));
        return path;
    };
    const gone = fall(bug, 760);
    expect(gone.at(-1)).toMatchObject({x: 504, y: 760});
    const speeds = gone.slice(1).map((each) => each.speed);
    expect(speeds.slice(0, -1).every((speed, index) => index === 0 || speed > speeds[index - 1])).toBe(true);
    expect(speeds[3]).toBeCloseTo(GRAVITY * step * 4, 6);
    // landed, it stays there though its floor comes back
    expect(bugStep(gone.at(-1), {x: 504, y: 560}, 760, step)).toMatchObject({y: 760, falling: true});
    // the dock it walks on closes: its floor drops to the compose box below in one frame, and it falls there rather than jump down
    const closed = bugStep({x: 500, y: 560, speed: 0, falling: false}, {x: 500, y: 620}, 620, step);
    expect(closed.falling).toBe(true);
    expect(closed.y).toBeLessThan(570);
    expect(fall(closed, 620).at(-1).y).toBe(620);
    // the figure on the same floor falls as well, whatever act it plays
    const beat = {clip: "bug_smash", facing: 0, once: true};
    expect(clipFor({mode: AIRBORNE, place: {posture: "stand"}, beat, state: "idle", doing: "idle"}, () => true).clip).toBe("fall");
});

test("the mallet's head is drawn whole, its iron bands round its two ends and nothing sticking out of it", () => {
    const root = new THREE.Group();
    bigMalletOf(root);
    root.updateMatrixWorld(true);
    const part = (name) => new THREE.Box3().setFromObject(root.getObjectByName(`${root.name}_${name}`));
    const head = part("head");
    const reach = head.clone().expandByScalar(BIG_MALLET.head * 0.05);
    for (const end of [-1, 1]) {
        const band = part(`band_${end}`);
        expect(reach.containsBox(band), `band ${end} within the head`).toBe(true);
        // round the head's end, not across its middle
        const middle = band.getCenter(new THREE.Vector3()).sub(head.getCenter(new THREE.Vector3()));
        expect(middle.length(), `band ${end} at an end`).toBeCloseTo(BIG_MALLET.width / 2 - BIG_MALLET.band, 6);
    }
    expect(reach.containsPoint(new THREE.Box3().setFromObject(root).max)).toBe(true);
});
