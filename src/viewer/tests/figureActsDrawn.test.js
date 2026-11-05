import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import CodeParcel from "../src/chat/CodeParcel.vue";
import FigureAct from "../src/chat/FigureAct.vue";
import StepLadder from "../src/chat/StepLadder.vue";
import FixedRunBug from "../src/chat/act/FixedRunBug.vue";
import {ACTS} from "../src/figure/acts.js";
import {CLIPS} from "../src/figure/figure.js";

vi.mock("../src/figure/assets.js", () => ({loadVoiceFigure: () => new Promise(() => {})}));
const {default: VoiceFigure} = await import("../src/chat/VoiceFigure.vue");

const SIZE = 112;
const PICTURES = {pictures: ["a.png", "b.png"], width: 30, height: 30, at: {x: 15, y: 15}};
const ACT_PROPS = {u: 0.5, hand: {x: 0.7, y: 0.5, out: 1, other: {x: 0.3, y: 0.5}}, head: {x: 0.5, y: 0.3}, feet: 0.95, size: SIZE, room: {left: 200, right: 200}, ball: {type: "bubble", above: 200, hangs: 120}, canopy: {picture: "c.png", width: 80, height: 40, at: {x: 40, y: 20}, ends: [{x: 10, y: 30}, {x: 70, y: 30}]}, bug: PICTURES};

let apps = [];
const mounted = (component, props) => {
    const holder = document.createElement("div");
    document.body.appendChild(holder);
    const app = createApp({render: () => h(component, props)});
    app.mount(holder);
    apps.push(app);
    return holder;
};

afterEach(() => {
    apps.forEach((app) => app.unmount());
    apps = [];
    document.body.innerHTML = "";
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

// each act the figure holds something for, and the mark of what it draws for it
const DRAWN = {
    ask_sign: [0.3, 0.5],
    ponder: [0.5],
    think_cloud: [0.5],
    type_ponder: [0.5],
    file_card: [0.2, 0.5, 0.8],
    hand_rub: [0.5],
    fume: [0.5],
    disco: [0.5],
    pogo: [0.5],
    chute: [0.5],
    pack_box: [0.5],
    press: [0.5],
    vacuum: [0.5],
};

for (const [name, shares] of Object.entries(DRAWN)) test(`the ${name} act draws what it holds over the figure, and the figure has its clip`, () => {
    expect(CLIPS.some((clip) => clip.name === name), name).toBe(true);
    expect(ACTS[name], name).toBeTruthy();
    for (const u of shares) {
        const holder = mounted(FigureAct, {...ACT_PROPS, name, u});
        const act = holder.querySelector(`[data-act="${name}"]`);
        expect(act, name).not.toBeNull();
        expect(act.querySelector("g").children.length, `${name} at ${u}`).toBeGreaterThan(0);
    }
});

test("the bug shot draws the bugs on the walls, and the mallet's bug is drawn on the page where it is", () => {
    const holder = mounted(FigureAct, {...ACT_PROPS, name: "bug_shot", wallBugs: [{x: 10, y: 10, way: 1, step: 0, turn: 0, shows: 1}]});
    expect(holder.querySelector('[data-act="bug_shot"] g').children.length).toBeGreaterThan(0);
    const box = mounted(FixedRunBug, {bug: PICTURES, at: {x: 300, y: 200, step: 0, way: 1, whole: true, flat: 0, turn: 0, below: 0, edge: null, shows: 1}});
    expect(box.querySelector("[data-act-bug-box]").style.left).toBe("252px");
});

test("a parcel stands where it is told, marks itself piled for the figure to keep clear of, and puffs dust at a blow", async () => {
    window.matchMedia = () => ({matches: false});
    const block = {pictures: ["a.png", "b.png"], width: 24, height: 27, below: 2};
    const piled = mounted(CodeParcel, {x: 100, y: 200, up: 24, block, piled: true});
    expect(piled.querySelector(".code-parcel").style.left).toBe("100px");
    expect(piled.querySelector("[data-figure-pile]")).not.toBeNull();
    expect(piled.querySelectorAll("img")).toHaveLength(2);
    expect(mounted(CodeParcel, {x: 100, y: 200, block}).querySelector("[data-figure-pile]")).toBeNull();
});

test("the ladder stands from its foot to its top on the page", () => {
    const holder = mounted(StepLadder, {foot: {x: 100, y: 500}, top: {x: 140, y: 400}});
    const svg = holder.querySelector("svg") ?? holder.firstElementChild;
    expect(svg).not.toBeNull();
    expect(holder.firstElementChild.style.top).toBe("396px");
});

// the figure on the page, its drawing replaced and its clock in hand, driven by the window event the demo plays the acts with
async function figure() {
    vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    window.matchMedia = () => ({matches: false});
    document.body.innerHTML = '<main data-figure-world><section data-figure-scroll></section><div data-figure-home></div><div id="figure-test"></div></main>';
    const app = createApp({render: () => h(VoiceFigure, {voice: "butler"})});
    app.mount(document.querySelector("#figure-test"));
    apps.push(app);
    await nextTick();
    const view = app._instance.subTree.component.setupState;
    view.player = {show: vi.fn(), blending: () => false, headAt: () => ({x: 0.5, y: 0.3}), handAt: () => ({x: 0.7, y: 0.5, out: 1, other: {x: 0.3, y: 0.5}}), reachWay: () => 1};
    view.clips = CLIPS;
    return view;
}

test("the demo's window event queues the act it names, with the bugs of a bug shot", async () => {
    const view = await figure();
    window.dispatchEvent(new CustomEvent("figure-demo", {detail: {clip: "file_card"}}));
    window.dispatchEvent(new CustomEvent("figure-demo", {detail: {clip: "bug_shot"}}));
    // what comes after them is the look's own, as a glance aside
    expect(view.beats.slice(0, 2).map((beat) => beat.clip)).toEqual(["file_card", "bug_shot"]);
    expect(view.beats[1].bugs.length).toBeGreaterThan(0);
});

test("the demo's window event asks for a box until it is told to stop, and the figure sets out to build it", async () => {
    const view = await figure();
    window.dispatchEvent(new CustomEvent("figure-demo", {detail: {parcel: true}}));
    expect(view.shellRun()).toMatchObject({card: "demo"});
    expect(view.units).toMatchObject({card: "demo", granted: true});
    // a real build going on in the chat does not take the demo's run from it, which would set the box's cooldown going
    view.grantUnit();
    expect(view.units).toMatchObject({card: "demo", granted: true});
    window.dispatchEvent(new CustomEvent("figure-demo", {detail: {parcel: false}}));
    expect(view.demoRun).toBe(null);
});

test("the demo's window event holds a state with the clip it is played as, until it is let go", async () => {
    const view = await figure();
    window.dispatchEvent(new CustomEvent("figure-demo", {detail: {held: {state: "compacting", clip: "vacuum"}}}));
    expect(view.doings.state).toBe("compacting");
    expect(view.variant).toEqual({state: "compacting", clip: "vacuum"});
    window.dispatchEvent(new CustomEvent("figure-demo", {detail: {held: null}}));
    expect(view.doings.state).not.toBe("compacting");
});

test("the demo's parachute comes after a time off the top of the chat", async () => {
    const view = await figure();
    window.dispatchEvent(new CustomEvent("figure-demo", {detail: {clip: "chute"}}));
    expect(view.flight).toMatchObject({hops: [], back: 0});
    expect(view.beats.some((beat) => beat.clip === "chute")).toBe(false);
});

test("the work committed, every parcel goes, whatever the figure was building", async () => {
    const view = await figure();
    view.parcels = [{id: 1, along: 10, up: 0, state: "piled"}, {id: 2, along: 40, up: 0, state: "building"}];
    view.sendAway();
    expect(view.parcels).toEqual([]);
    expect(view.drawnParcels).toEqual([]);
});
