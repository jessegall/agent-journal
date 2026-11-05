// @vitest-environment node
import {readFileSync} from "node:fs";
import * as THREE from "three";
import {expect, test} from "vitest";

const {CLIPS, Posing, rifleTarget, burstKick} = await import("../src/figure/figure.js");
const {ACTS, WALL_BUGS, bugShotFrame, bugShotScene, wallBugAt, wallBugs} = await import("../src/figure/acts.js");
const {FRAMED} = await import("../src/figure/frame.js");
const {actOver} = await import("../src/domain/figureState.js");
const {stretchedFrame} = await import("../src/figure/timeline.js");
const {seeded} = await import("./support/seeded.js");

const {rig, stances} = JSON.parse(readFileSync(new URL("./figureRig.json", import.meta.url)));
const vectors = (table) => new Map(Object.entries(table).map(([name, at]) => [name, new THREE.Vector3(...at)]));
const RIG = {order: rig.order, parents: new Map(Object.entries(rig.parents)), heads: vectors(rig.heads), along: vectors(rig.along), eyes: rig.eyes.map((at) => new THREE.Vector3(...at))};
const stanceOf = (voice) => Object.fromEntries(Object.entries(stances[voice]).map(([key, value]) => [key, Array.isArray(value) ? new Set(value) : value]));

// the chat window on the page, and the figure's 112-pixel picture standing in it near its foot
const WORLD = {left: 200, top: 80, right: 1100, bottom: 760};
const SIZE = 112;
const PICTURE = {x: 600, y: 600};
const act = ACTS.bug_shot;
const clip = CLIPS.find((each) => each.name === "bug_shot");

test("every bug of a bug shot crawls on the left, the right or the top wall of the chat window, two to five of them, each count drawn over many rolls", () => {
    const random = seeded(2884);
    const counts = new Map();
    const walls = new Set();
    for (let roll = 0; roll < 400; roll++) {
        const bugs = wallBugs(random);
        counts.set(bugs.length, (counts.get(bugs.length) ?? 0) + 1);
        for (const bug of bugs) {
            walls.add(bug.wall);
            // on its wall at every moment as it crawls, never out in the open
            for (const seconds of [0, 1.5, 7, 30, 95]) {
                const at = wallBugAt(bug, WORLD, seconds);
                const label = `${roll} ${bug.wall} ${seconds}`;
                if (bug.wall === "left") expect([at.x, at.turn], label).toEqual([WORLD.left + WALL_BUGS.inset, 90]);
                if (bug.wall === "right") expect([at.x, at.turn], label).toEqual([WORLD.right - WALL_BUGS.inset, -90]);
                if (bug.wall === "top") expect([at.y, at.turn], label).toEqual([WORLD.top + WALL_BUGS.inset, 180]);
                expect(at.x, label).toBeGreaterThanOrEqual(WORLD.left);
                expect(at.x, label).toBeLessThanOrEqual(WORLD.right);
                expect(at.y, label).toBeGreaterThanOrEqual(WORLD.top);
                expect(at.y, label).toBeLessThanOrEqual(WORLD.bottom);
            }
        }
    }
    expect([...counts.keys()].sort()).toEqual([2, 3, 4, 5]);
    for (const [count, times] of counts) expect(times, `${count} bugs`).toBeGreaterThan(40);
    expect(walls).toEqual(new Set(["left", "right", "top"]));
    // a bug crawls: it is somewhere else a few seconds on
    const bug = {wall: "left", along: 0.5, way: 1};
    expect(wallBugAt(bug, WORLD, 4).y).not.toBe(wallBugAt(bug, WORLD, 0).y);
});

test("the figure aims at each bug in turn and shoots it where it sits, one by one, its rifle on the bug, and the act lasts a turn for every bug", () => {
    const bugs = [{wall: "left", along: 0.3, way: 1}, {wall: "top", along: 0.7, way: -1}, {wall: "right", along: 0.6, way: 1}, {wall: "top", along: 0.2, way: 1}];
    const turn = (act.turn[1] - act.turn[0]) * act.frames;
    const {stretch} = bugShotFrame(0, bugs.length);
    // the act is over only once every bug has had its turn
    expect(actOver({once: true, clip}, stretchedFrame(act.frames + (bugs.length - 1) * turn - 1, stretch))).toBe(false);
    expect(actOver({once: true, clip}, stretchedFrame(act.frames + (bugs.length - 1) * turn, stretch))).toBe(true);
    const aimed = [];
    for (let raw = 0; raw < act.frames + (bugs.length - 1) * turn; raw++) {
        const scene = bugShotScene(bugs, WORLD, raw);
        const {bug, shot, frame} = bugShotFrame(raw, bugs.length);
        // the bugs shot so far splattered, the rest still crawling
        expect(scene.bugs.map((each) => each.shot)).toEqual(bugs.map((_, index) => index < shot));
        const t = frame / act.frames;
        // as each burst fires, the rifle is on the bug of this turn
        if (burstKick(t) <= 0.6) continue;
        aimed.push(bug);
        const target = scene.target;
        expect(Math.hypot(target.x - scene.bugs[bug].x, target.y - scene.bugs[bug].y), `${raw} aims at bug ${bug}`).toBeLessThan(1);
        const share = {x: (target.x - PICTURE.x) / SIZE, y: (target.y - PICTURE.y) / SIZE};
        for (const voice of Object.keys(stances)) {
            const pose = new Posing(RIG, "stand", 0);
            pose.target = share;
            clip.pose(pose, stanceOf(voice), t);
            const moves = pose.moves(0);
            // the rifle as held: its barrel's way, from its grip in the hand
            const rifle = pose.props.get("rifle");
            const turned = new THREE.Matrix4().extractRotation(moves.get(rifle.frame)).multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...["x", "y", "z"].map((axis) => THREE.MathUtils.degToRad(rifle.turn[axis] || 0)), "ZYX")));
            const barrel = new THREE.Vector3(1, 0, 0).applyMatrix4(turned);
            const grip = rifle.at.clone().applyMatrix4(moves.get(rifle.bone));
            const point = rifleTarget(share);
            const off = THREE.MathUtils.radToDeg(barrel.angleTo(point.clone().sub(grip).normalize()));
            expect(off, `${voice} at bug ${bug} on the ${bugs[bug].wall}`).toBeLessThan(8);
        }
    }
    // the bursts go to each bug in turn, in order, every one of them shot
    expect([...new Set(aimed)]).toEqual([0, 1, 2, 3]);
    expect(aimed.every((bug, index) => index === 0 || bug >= aimed[index - 1])).toBe(true);
    expect(bugShotScene(bugs, WORLD, act.frames + (bugs.length - 1) * turn - 1).bugs.every((each) => each.shot)).toBe(true);
});
