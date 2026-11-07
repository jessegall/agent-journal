// @vitest-environment node
import {readFileSync} from "node:fs";
import {expect, test} from "vitest";
import {holdsHead} from "../src/figure/looks.js";
import * as THREE from "three";
import {CLIPS, Posing, RUMMAGE_THINGS, SIDES} from "../src/figure/figure.js";
import {ACTS, RUMMAGED, flungAt} from "../src/figure/acts.js";
import {choicesFor} from "../src/figure/pile.js";

const {rig, stances} = JSON.parse(readFileSync(new URL("./figureRig.json", import.meta.url)));
const vectors = (table) => new Map(Object.entries(table).map(([name, at]) => [name, new THREE.Vector3(...at)]));
const RIG = {order: rig.order, parents: new Map(Object.entries(rig.parents)), heads: vectors(rig.heads), along: vectors(rig.along), eyes: rig.eyes.map((at) => new THREE.Vector3(...at))};
const stanceOf = (voice) => Object.fromEntries(Object.entries(stances[voice]).map(([key, value]) => [key, Array.isArray(value) ? new Set(value) : value]));
// the figure's picture is 5.4 of its units high, and as wide
const PICTURE = 5.4;
const act = ACTS.rummage;

// the figure rummaging `u` of the way through, its eyes' middle as a share of the picture out from its middle toward the opening, and the pose
function rummagingAt(voice, u) {
    const pose = new Posing(RIG, "stand", 0);
    CLIPS.find((clip) => clip.name === "rummage").pose(pose, stanceOf(voice), u);
    const moves = pose.moves(0);
    const eyes = RIG.eyes.reduce((sum, eye) => sum.add(eye.clone().applyMatrix4(moves.get("head"))), new THREE.Vector3()).multiplyScalar(1 / RIG.eyes.length);
    // the free hand's side, where the opening is: the right, unless that hand is busy
    const out = SIDES[stanceOf(voice).busy.has("r") ? "l" : "r"];
    return {pose, moves, out: (out * eyes.x) / PICTURE, eyes};
}

test("rummaging is taken out of the searches for now, its clip kept for a later revision", () => {
    expect(choicesFor({moment: "held:search", home: true}).map((each) => each.name)).toEqual(["search", "binoculars"]);
    const clip = CLIPS.find((each) => each.name === "rummage");
    expect([holdsHead(clip), clip.postures]).toEqual([true, ["stand"]]);
});

test("it leans in past the edge and digs about, then pulls back out having found nothing, no key or anything else held up", () => {
    for (const voice of Object.keys(stances)) {
        const standing = rummagingAt(voice, 0).out;
        // all the while it digs, its head is out past where it stood, well over to its side and down
        for (let u = act.leans[1]; u < act.pops[0]; u += 0.02) {
            const {out, eyes} = rummagingAt(voice, u);
            expect(out, `${voice} ${u}`).toBeGreaterThan(standing + 0.04);
            expect(eyes.z, `${voice} ${u}`).toBeLessThan(2.4);
        }
        // pulled back out, nothing in its hands
        for (const u of [act.pops[1], (act.pops[1] + 1) / 2, 0.999]) {
            const props = [...rummagingAt(voice, u).pose.props.keys()].filter((name) => !name.startsWith("rummage_") || name === "rummage_key");
            expect(props, `${voice} ${u}`).toEqual([]);
        }
    }
    expect(RUMMAGE_THINGS.key, "it finds nothing").toBeUndefined();
});

test("each thing it pulls out is thrown along the arc gravity gives it, up over its shoulder and down onto the floor behind, spinning, a new throw each rummage", async () => {
    const {THROW, flightSeconds, throwsFor} = await import("../src/figure/acts.js");
    expect(RUMMAGED).toEqual(["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"]);
    let seed = 11;
    const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const rummages = [throwsFor(random), throwsFor(random), throwsFor(random)];
    expect(new Set(rummages.map((throws) => throws[0].velocity[2].toFixed(3))).size, "each rummage throws anew").toBe(3);
    const seconds = (u) => (u * act.frames) / act.fps;
    for (const throws of rummages) {
        for (const [index, out] of act.throws.entries()) {
            const name = RUMMAGED[index];
            expect(flungAt(index, out - 0.01, throws), name).toBe(null);
            const flight = flightSeconds(throws[index], act.from);
            const down = out + (flight * act.fps) / act.frames;
            const path = Array.from({length: 41}, (_, step) => flungAt(index, out + ((down - out) * step) / 40, throws));
            // from the opening in front of it to the floor behind it
            expect(path[0].at[1], name).toBeLessThan(-1);
            expect(path.at(-1).at[1], name).toBeGreaterThan(0);
            expect(path.at(-1).at[2], name).toBeCloseTo(THROW.floor, 5);
            // a true throw: its height a parabola in time, its speed across and back steady, as gravity alone pulls on it
            for (let step = 2; step < path.length; step++) {
                const [a, b, c] = [path[step - 2], path[step - 1], path[step]].map((each) => each.at);
                const dt = seconds((down - out) / 40);
                expect((c[2] - 2 * b[2] + a[2]) / (dt * dt), `${name} ${step}: falling at gravity`).toBeCloseTo(-THROW.gravity, 3);
                expect(c[1] - b[1], `${name} ${step}: steady back`).toBeCloseTo(b[1] - a[1], 6);
            }
            const heights = path.map((each) => each.at[2]);
            expect(Math.max(...heights), `${name}: up over its head`).toBeGreaterThan(3.4);
            expect(Math.abs(path.at(-1).turn), name).toBeGreaterThan(360);
            // down, it lies on the floor and shrinks away, then is gone
            const lies = act.shrinks;
            expect(flungAt(index, down + lies / 2, throws).landed, name).toBeCloseTo(0.5, 1);
            expect(flungAt(index, down + lies / 2, throws).at[2], name).toBeCloseTo(THROW.floor, 5);
            expect(flungAt(index, down + lies + 0.001, throws), name).toBe(null);
        }
        // one after another, each pulled out before the last has landed
        for (let index = 1; index < act.throws.length; index++) {
            expect(act.throws[index]).toBeLessThan(act.throws[index - 1] + (flightSeconds(throws[index - 1], act.from) * act.fps) / act.frames);
        }
    }
    // drawn where it flies, at the size it has left, and not at all once gone
    const [out] = act.throws;
    const flying = rummagingAt("butler", out + 0.02).pose.props.get(RUMMAGED[0]);
    expect(flying).toMatchObject({bone: "root", size: 1});
});

test("it rummages at the chat window's edge, its hands reaching past it while its body stays inside, and never walks past the end of its ground", async () => {
    const {RUMMAGE_INSET, rummageSpot} = await import("../src/figure/perches.js");
    const {BODY, FEET_INBOARD, inWorld} = await import("../src/figure/places.js");
    const {CHAT, boxed, page} = await import("./support/figurePage.js");
    const figure = {size: 112, below: 0.05};
    // the compose box runs from 300 to 700 in a window from 200 to 900: the window's edge is past the ground's end, so it climbs a ladder
    // footed at that end (figureLadder.test.js)
    page(boxed({left: 400, right: 600, top: 300, bottom: 340}));
    expect(rummageSpot(figure, -1).ladder.foot.x).toBeCloseTo(300 + FEET_INBOARD * figure.size, 5);
    expect(rummageSpot(figure, 1).ladder.foot.x).toBeCloseTo(700 - FEET_INBOARD * figure.size, 5);
    // a window whose edges the ground reaches: it stands at the edge, its body inside, its hands past it
    const wide = {left: 300, top: 100, right: 700, bottom: 800};
    globalThis.document.querySelector("[data-figure-home]").closest = () => ({...boxed(wide), querySelector: () => null});
    for (const way of [-1, 1]) {
        const spot = rummageSpot(figure, way);
        const edge = way > 0 ? wide.right : wide.left;
        expect(Math.abs(spot.x - edge), `${way}: at the edge`).toBeCloseTo(Math.max(RUMMAGE_INSET, FEET_INBOARD) * figure.size, 5);
        expect(inWorld(spot, figure, wide), `${way}: its body inside the window, so it keeps its footing there`).toBe(true);
        expect((0.5 - BODY.left) * figure.size, `${way}: its body short of the edge`).toBeLessThan(Math.abs(spot.x - edge));
    }
    expect(CHAT.left).toBeLessThan(300);
});

test("with no way given it leans out toward its free hand's side of the picture", async () => {
    for (const voice of Object.keys(stances)) {
        const free = stanceOf(voice).busy.has("r") ? "l" : "r";
        // leaning in, its eyes move out to the free hand's side, SIDES[free], in the picture as handAt's out names it
        const {eyes} = rummagingAt(voice, (act.leans[1] + act.pops[0]) / 2);
        expect(Math.sign(eyes.x), voice).toBe(SIDES[free]);
    }
});

test("leaning out to rummage, the figure leans with the hand on the edge's side, or its free hand when that one is busy", async () => {
    const {reachSide} = await import("../src/figure/figure.js");
    for (const voice of Object.keys(stances)) {
        const stance = stanceOf(voice);
        for (const way of [-1, 1]) {
            const side = reachSide(stance, way);
            const wanted = way === SIDES.l ? "l" : "r";
            expect(side, `${voice} ${way}`).toBe(stance.busy.has(wanted) ? (stance.busy.has("r") ? "l" : "r") : wanted);
            const pose = new Posing(RIG, "stand", 0);
            pose.leanWay = way;
            CLIPS.find((clip) => clip.name === "rummage").pose(pose, stance, (act.leans[1] + act.pops[0]) / 2);
            const moves = pose.moves(0);
            const eyes = RIG.eyes.reduce((sum, eye) => sum.add(eye.clone().applyMatrix4(moves.get("head"))), new THREE.Vector3()).multiplyScalar(1 / RIG.eyes.length);
            expect(Math.sign(eyes.x), `${voice} ${way}: leaning out to its hand's side`).toBe(SIDES[side]);
        }
    }
});

test("each thing it throws turns about its own middle, and the searches wait two minutes between them and five each", async () => {
    const {propsOf} = await import("../src/figure/figure.js");
    const {draw} = await import("../src/figure/pile.js");
    const props = propsOf();
    for (const name of RUMMAGED) {
        const thing = props.get(name).children[0];
        thing.updateMatrixWorld(true);
        const middle = new THREE.Box3().setFromObject(thing).getCenter(new THREE.Vector3());
        expect(middle.length(), name).toBeLessThan(1e-6);
    }
    const memory = new Map();
    const searchAt = (now) => draw({moment: "held:search", home: true, memory, now}, () => 0.5)?.name ?? null;
    const first = searchAt(0);
    expect(first).toBeTruthy();
    expect(searchAt(60), "none within two minutes").toBe(null);
    const second = searchAt(120);
    expect(second, "another after two minutes").toBeTruthy();
    expect(second).not.toBe(first);
});
