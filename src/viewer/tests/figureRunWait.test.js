// @vitest-environment node
import {readFileSync} from "node:fs";
import * as THREE from "three";
import {beforeEach, expect, test} from "vitest";

const {CLIPS, Posing, holdsHead} = {...(await import("../src/figure/figure.js")), ...(await import("../src/figure/looks.js"))};
const {RUN_WAIT, SITTING_ACTS, barWatchAt, progressJumped, runSeat, runStage, sittingActAt} = await import("../src/figure/runWait.js");
const {EAGER, eagerFor, reactionTo, watchesBar} = await import("../src/figure/reactions.js");
const {eagerSpot} = await import("../src/figure/perches.js");
const {lightOnce, visorAt, visorFor, VISOR} = await import("../src/figure/visor.js");
const {litPixels} = await import("../src/figure/visorPixels.js");
const {cardsOfMarks, processEndsAfter} = await import("../src/domain/figureState.js");
const {seeded} = await import("./support/seeded.js");

const {rig, stances} = JSON.parse(readFileSync(new URL("./figureRig.json", import.meta.url)));
const vectors = (table) => new Map(Object.entries(table).map(([name, at]) => [name, new THREE.Vector3(...at)]));
const RIG = {order: rig.order, parents: new Map(Object.entries(rig.parents)), heads: vectors(rig.heads), along: vectors(rig.along), eyes: rig.eyes.map((at) => new THREE.Vector3(...at))};
const stanceOf = (voice) => Object.fromEntries(Object.entries(stances[voice]).map(([key, value]) => [key, Array.isArray(value) ? new Set(value) : value]));
const FIGURE = {size: 112, below: 0.05};
const clipNamed = (name) => CLIPS.find((clip) => clip.name === name);

// a page with the chat, its compose box and, docked over it, the card of a running command, its bar's fill `share` of the way along
const box = (left, top, right, bottom) => ({getBoundingClientRect: () => ({left, top, right, bottom, width: right - left, height: bottom - top})});
let docks = null;
function page(share = 0.4) {
    const fill = box(300, 560, 300 + 500 * share, 566);
    const track = {...box(300, 560, 800, 566), firstElementChild: fill, dataset: {figureBar: "", figureBegan: "0"}, querySelector: () => fill};
    docks = {...box(280, 520, 920, 600), querySelector: () => track};
    const thread = {...box(0, 0, 1280, 800), querySelector: (selector) => (selector === "[data-figure-docked-bars]" ? docks : null)};
    const home = {...box(280, 600, 920, 700), closest: () => thread, querySelector: () => null};
    globalThis.document = {querySelector: (selector) => (selector === "[data-figure-home]" ? home : null), querySelectorAll: () => []};
}
beforeEach(() => {
    globalThis.window = {innerWidth: 1280, innerHeight: 800};
    globalThis.CSS = {escape: (text) => text};
    page();
});

// a run's bar as places.js progressOf reads it: begun at 0, `share` of the way along, ended or not
const bar = (share, ended = "") => ({share, ended, began: 0});

test("at the start of a run the figure watches the bar's line, every look of the watch", () => {
    expect(runStage(bar(0.05), 1)).toBe("watch");
    expect(runStage(bar(0.3), RUN_WAIT.watch - 0.5)).toBe("watch");
    expect(RUN_WAIT.watch).toBeGreaterThanOrEqual(10);
    expect(RUN_WAIT.watch).toBeLessThanOrEqual(20);
    let choice = null;
    for (let second = 0; second < RUN_WAIT.watch; second += 0.5) {
        choice = barWatchAt(choice, runStage(bar(0.1), second), second, Math.random);
        expect(watchesBar(choice, {clip: {name: "idle"}}), `${second}`).toBe(true);
    }
    // no bar, or one that has ended, is no run to wait on
    expect(runStage(null, 30)).toBe(null);
    expect(runStage(bar(1, "good"), 30)).toBe(null);
});

test("after the watch it sits on the edge of the running card, its legs over the edge, its head free but for a glance at the bar now and then", () => {
    expect(runStage(bar(0.4), RUN_WAIT.watch + 1)).toBe("sit");
    const seat = runSeat(FIGURE, {on: docks, x: 700, y: 520, posture: "stand"});
    expect(seat).toMatchObject({posture: "sit", face: 0, leans: true, on: docks, y: 520});
    expect(seat.x).toBeGreaterThan(280);
    expect(seat.x).toBeLessThan(920);
    // seated, the bar holds its eyes only in short glances, most of the time they are free for the looks
    const random = seeded(2880);
    let choice = barWatchAt(null, "watch", 14, random);
    let watching = 0;
    let glances = 0;
    for (let second = 15; second < 615; second += 0.25) {
        const next = barWatchAt(choice, "sit", second, random);
        if (next.watches && !(choice.watches && choice.seated)) glances++;
        choice = next;
        if (watchesBar(choice, {clip: {name: "ledge_sit"}})) watching += 0.25;
    }
    expect(watching / 600, "the head not locked on the line").toBeLessThan(0.25);
    expect(glances, "a glance at the bar now and then").toBeGreaterThan(20);
});

test("seated it plays its sitting acts in turn: leaning back on its hands, checking a pocket watch, dozing with a Z on its visor", () => {
    const random = seeded(47750);
    let act = null;
    const played = [];
    for (let second = 0; second < 600; second++) {
        const next = sittingActAt(act, second, random);
        if (next !== act) played.push(next.clip);
        act = next;
    }
    expect(played[0]).toBe("ledge_sit");
    expect(new Set(played)).toEqual(new Set(SITTING_ACTS));
    expect(played.every((clip, index) => index === 0 || clip !== played[index - 1]), "never the same act twice in a row").toBe(true);
    for (const name of SITTING_ACTS) expect(clipNamed(name).postures, name).toContain("sit");
    for (const voice of Object.keys(stances)) {
        // the watch out of the pocket and before the chest, the head bowed over it
        const pose = new Posing(RIG, "sit", 0);
        clipNamed("pocket_watch").pose(pose, stanceOf(voice), 0.5);
        expect(pose.props.get("pocket_watch"), voice).toBeTruthy();
        // dozing, the eyes shut and a Z on the visor, the head held as the doze has it
        const dozing = new Posing(RIG, "sit", 0);
        clipNamed("doze").pose(dozing, stanceOf(voice), 0.3);
        expect(dozing.dozing, voice).toBeGreaterThan(0);
        const lit = litPixels({eyed: true, eyes: dozing.eyes, glance: [0, 0], tint: null, hearts: 0, stars: 0, squeezed: 0, dozing: dozing.dozing, sign: null});
        const awake = litPixels({eyed: true, eyes: dozing.eyes, glance: [0, 0], tint: null, hearts: 0, stars: 0, squeezed: 0, dozing: 0, sign: null});
        expect(lit.length, voice).toBeGreaterThan(awake.length + 8);
        expect(holdsHead(clipNamed("doze"))).toBe(true);
    }
    // leaning back on its hands, its legs swinging
    const sways = Array.from({length: 16}, (_, frame) => {
        const pose = new Posing(RIG, "sit", 0);
        clipNamed("ledge_sit").pose(pose, stanceOf("butler"), frame / 16);
        return pose.sway;
    });
    expect(Math.max(...sways) - Math.min(...sways)).toBeGreaterThan(0.5);
});

test("seated it looks up when the bar jumps ahead or passes its near end, and not for a small step", () => {
    expect(progressJumped(0.3, 0.3 + RUN_WAIT.jump + 0.01)).toBe(true);
    expect(progressJumped(0.3, 0.35)).toBe(false);
    expect(progressJumped(0.86, 0.91), "passing ninety percent").toBe(true);
    expect(progressJumped(0.91, 0.93)).toBe(false);
    expect(progressJumped(null, 0.95), "no look before the first").toBe(false);
    expect(reactionTo("progress_jump", new Map(), 100, () => 0)?.clip).toBe("look_up");
    expect(clipNamed("look_up").postures).toContain("sit");
});

test("a run past a minute takes it off the card in time for its anticipation, and at the end the visor shows the run's sign", () => {
    // seated on the card of a run that has gone on past two minutes, a few seconds from its end: eager, urgently, and up onto the bar
    page(0.98);
    const seated = runSeat(FIGURE, {on: docks, x: 700, y: 520, posture: "stand"});
    const eager = eagerFor(bar(0.98), null, () => 0, EAGER.long + 10).eager;
    expect(eager).toMatchObject({on: true, urgent: true});
    const spot = eagerSpot(seated, FIGURE);
    expect(spot).toMatchObject({posture: "stand", on: docks});
    // a run past a minute but not two: eager as the pile draws it, the same way off the card
    expect(eagerFor(bar(0.95), null, () => 0, EAGER.after + 30).eager.run).toBe(0);
    // the run ends: the check on the visor once the head has faced its mark
    const mark = (active) => ({id: 9, type: "processes.command", variant: active ? "running" : "finished", key: "process:9", text: "Running tests", outcome: active ? "running" : "passed", ended_at: active ? null : new Date(11000).toISOString(), created_at: new Date(10000).toISOString()});
    const known = new Map();
    processEndsAfter({data: {cards: cardsOfMarks([mark(true)])}}, known);
    const ends = processEndsAfter({data: {cards: cardsOfMarks([mark(false)])}}, known);
    const lit = lightOnce(lightOnce(visorFor(ends, null, 200), true, 200), true, 200 + VISOR.looks);
    expect(visorAt(lit, lit.at + 1, false).sign.name).toBe("tick");
});
