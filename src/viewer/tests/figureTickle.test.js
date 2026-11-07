// @vitest-environment node
import {readFileSync} from "node:fs";
import * as THREE from "three";
import {expect, test} from "vitest";
import {CLIPS, Posing} from "../src/figure/figure.js";
import {SHOWPIECES, choicesFor, draw} from "../src/figure/pile.js";
import {TICKLE, UNTICKLED, movedTo, ticklish, tickling} from "../src/figure/tickle.js";

// the figures' own skeleton and what each voice carries, as figure.js figureOf reads them from the voices' glbs
const {rig, stances} = JSON.parse(readFileSync(new URL("./figureRig.json", import.meta.url)));
const vectors = (table) => new Map(Object.entries(table).map(([name, at]) => [name, new THREE.Vector3(...at)]));
const RIG = {order: rig.order, parents: new Map(Object.entries(rig.parents)), heads: vectors(rig.heads), along: vectors(rig.along), eyes: rig.eyes.map((at) => new THREE.Vector3(...at))};
const stanceOf = (voice) => Object.fromEntries(Object.entries(stances[voice]).map(([key, value]) => [key, Array.isArray(value) ? new Set(value) : value]));

// the pointer moved along `xs`, one move every `ms` milliseconds from `start`, as the page hands them over the figure's body
const moved = (xs, ms = 40, start = 1000) => xs.reduce((pointer, x, index) => movedTo(pointer, x, start + index * ms), UNTICKLED);

test("the mouse pointer moved back and forth over the figure tickles it, a single pass does not, and it ends as the pointer leaves or stops", () => {
    // back and forth across it, kept up past TICKLE.prolonged: tickled
    const xs = [400, 420, 440, 460, 440, 420, 400, 420, 440, 460, 440, 420];
    const tickled = moved([...xs, ...xs, ...xs, ...xs, ...xs]);
    expect(tickling(tickled, tickled.at)).toBe(true);
    // one pass over it, however long: not tickled
    const pass = moved([380, 400, 420, 440, 460, 480, 500, 520, 540]);
    expect(tickling(pass, pass.at)).toBe(false);
    // a wiggle too small to count is no tickle
    const jitter = moved([400, 403, 400, 403, 400, 403, 400, 403]);
    expect(tickling(jitter, jitter.at)).toBe(false);
    // slow turns, each further apart than the tickle's span, are no tickle
    const slow = moved(xs, 700);
    expect(tickling(slow, slow.at)).toBe(false);
    // the pointer leaving ends it at once, and stopping still on it ends it a moment later
    expect(tickling(UNTICKLED, tickled.at)).toBe(false);
    expect(tickling(tickled, tickled.at + TICKLE.lingers + 1)).toBe(false);
});

test("a tickle starts the swat every time, from the pile with no cooldown, the hands swatting at the pointer and the eyes squeezed shut laughing, for every voice", () => {
    const memory = new Map();
    for (const now of [0, 1, 2]) expect(draw({moment: "tickled", memory, now}, () => 0.5).name, String(now)).toBe("tickle_swat");
    expect(SHOWPIECES.tickle_swat).toBe(0);
    expect(choicesFor({moment: "pastime", free: true, lasted: 1000}).some((entry) => entry.name === "tickle_swat")).toBe(false);
    const swat = CLIPS.find((clip) => clip.name === "tickle_swat");
    for (const voice of Object.keys(stances)) {
        const raised = [];
        for (let frame = 0; frame < swat.frames; frame++) {
            const pose = new Posing(RIG, "stand", 0);
            swat.pose(pose, stanceOf(voice), frame / swat.frames);
            expect(pose.squeezed, `${voice} ${frame}`).toBe(1);
            const moves = pose.moves(0);
            raised.push(Object.fromEntries(["l", "r"].map((side) => [side, pose.head(`hand_${side}`, moves.get(`hand_${side}`)).z])));
        }
        // each hand comes up at the pointer in its turn
        for (const side of ["l", "r"]) expect(Math.max(...raised.map((each) => each[side])), `${voice} ${side}`).toBeGreaterThan(2.2);
    }
});

test("tickling sets the figure off only after about two seconds of it", async () => {
    const {movedTo, tickling, UNTICKLED, TICKLE} = await import("../src/figure/tickle.js");
    const wiggle = (milliseconds) => {
        let pointer = UNTICKLED;
        let x = 100;
        for (let at = 0; at <= milliseconds; at += 100) {
            x = x === 100 ? 140 : 100;
            pointer = movedTo(pointer, x, at);
        }
        return {pointer, at: milliseconds};
    };
    const brief = wiggle(1000);
    expect(tickling(brief.pointer, brief.at)).toBe(false);
    const long = wiggle(2500);
    expect(tickling(long.pointer, long.at)).toBe(true);
    expect(TICKLE.prolonged).toBe(2000);
});

test("once tickled, the figure stays ticklish three seconds: a pass in that time sets it off at once and starts the time again, and after three quiet seconds a tickle is a first one again", () => {
    const xs = [400, 420, 440, 460, 440, 420, 400, 420, 440, 460, 440, 420];
    const tickled = moved([...xs, ...xs, ...xs, ...xs, ...xs]);
    expect(tickling(tickled, tickled.at)).toBe(true);
    expect(tickled.ticklishUntil).toBe(tickled.at + TICKLE.ticklish);
    // the pointer stops: the swatting ends, but the figure is still ticklish
    const still = tickled.at + TICKLE.lingers + 1;
    expect(tickling(tickled, still)).toBe(false);
    expect(ticklish(tickled, still)).toBe(true);
    // a single pass two seconds later sets it off at once, with no wind-up, and starts the three seconds again
    const pass = movedTo(tickled, 520, tickled.at + 2000);
    expect(tickling(pass, pass.at)).toBe(true);
    expect(pass.ticklishUntil).toBe(pass.at + TICKLE.ticklish);
    // so a pass two and a half seconds after that, four and a half after the tickle, still does
    const again = movedTo(pass, 400, pass.at + 2500);
    expect(tickling(again, again.at)).toBe(true);
    // after three quiet seconds it has calmed: a single pass is no tickle, and only a tickle wound up again sets it off
    const calm = again.at + TICKLE.ticklish + 1;
    const late = movedTo(again, 520, calm);
    expect(ticklish(late, late.at)).toBe(false);
    expect(tickling(late, late.at)).toBe(false);
    const rewound = (milliseconds) =>
        [...xs, ...xs, ...xs, ...xs, ...xs]
            .slice(0, milliseconds / 40)
            .reduce((pointer, x, index) => movedTo(pointer, x, calm + 40 * (index + 1)), late);
    const brief = rewound(1000);
    expect(tickling(brief, brief.at)).toBe(false);
    const wound = rewound(2400);
    expect(tickling(wound, wound.at)).toBe(true);
    expect(TICKLE.ticklish).toBe(3000);
});
