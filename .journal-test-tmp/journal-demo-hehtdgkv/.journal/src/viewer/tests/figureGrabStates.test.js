import {createApp, h, nextTick, ref} from "vue";
import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";
import {CLIPS} from "../src/figure/figure.js";
import {startFloors, stopFloors} from "../src/figure/floors.js";
import {GRAB} from "../src/figure/grab.js";
import {fallOf} from "../src/domain/falls.js";

vi.mock("../src/figure/assets.js", () => ({loadVoiceFigure: () => new Promise(() => {})}));
const {default: VoiceFigure} = await import("../src/chat/VoiceFigure.vue");

const SIZE = 112;
const below = 0.05;
const rect = (left, top, width, height) => ({x: left, y: top, left, top, width, height, right: left + width, bottom: top + height});
let app;
let view;
let time;
let paint;
const here = ref(true);

beforeEach(async () => {
    time = 1000;
    vi.spyOn(performance, "now").mockImplementation(() => time);
    vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    window.matchMedia = () => ({matches: false});
    document.body.innerHTML = '<main data-figure-world><section data-figure-scroll></section><div data-figure-home></div><div id="figure-test"></div></main>';
    document.querySelector("[data-figure-world]").getBoundingClientRect = () => rect(0, 0, 1000, 800);
    document.querySelector("[data-figure-scroll]").getBoundingClientRect = () => rect(0, 0, 1000, 700);
    document.querySelector("[data-figure-home]").getBoundingClientRect = () => rect(0, 700, 1000, 100);
    here.value = true;
    app = createApp({render: () => h(VoiceFigure, {voice: "butler", here: here.value})});
    app.mount(document.querySelector("#figure-test"));
    await nextTick();
    // Drive the mounted controller with its real state and DOM events; only drawing and wall-clock scheduling are replaced.
    view = app._instance.subTree.component.setupState;
    paint = vi.fn();
    view.player = {show: paint, blending: () => false, headAt: () => ({x: 0.5, y: 0.3}), handAt: () => ({x: 0.7, y: 0.5, out: 1, other: {x: 0.3, y: 0.5}}), reachWay: () => 1};
    view.clips = CLIPS.filter((clip) => !clip.voices || clip.voices.includes("butler"));
    view.below = below;
    Object.assign(view.body, {here: true, at: {x: 350, y: 300}, place: {x: 406, y: 406.4, posture: "stand", face: 0, view: null, on: null}});
    showClip("idle");
    document.querySelector(".voice-figure").getBoundingClientRect = () => rect(view.body.at.x, view.body.at.y, SIZE, SIZE);
    startFloors();
});

afterEach(() => {
    app?.unmount();
    stopFloors();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
});

function showClip(name, extra = {}) {
    const clip = view.clips.find((each) => each.name === name);
    view.playing = {name: `${name}/0`, started: time - 130, shown: {clip, facing: 0, ...extra}, index: 1, closing: null};
    view.shownClip = view.drawnClip = clip;
    view.shownFrame = view.drawnFrame = 1.3;
}

function pointer(type, {x = view.body.at.x + SIZE / 2, y = view.body.at.y + SIZE * 0.4, id = 1, button = 0} = {}) {
    const event = new MouseEvent(type, {bubbles: true, cancelable: true, clientX: x, clientY: y, button});
    Object.defineProperties(event, {pointerId: {value: id}, isPrimary: {value: id === 1}});
    (type === "pointerdown" ? document.querySelector(".voice-figure-body") : window).dispatchEvent(event);
}

const trips = (clip, hopping = false) => {
    view.body.trip = {moves: true, started: true, departed: true, hopping, pressing: clip === "run", legs: [], to: {x: 900, y: 700, posture: "stand"}, way: 1};
    showClip(clip);
};
const seated = (posture) => {
    view.body.place = {...view.body.place, posture, face: 90, leans: 1, on: document.querySelector("[data-figure-home]")};
    view.body.footing = {id: "home", posture, face: 90, dx: 406, dy: 0};
    view.perched = {until: Date.now() / 1000 + 60, seated: true};
    view.posed = {posture, facing: 90, turning: true};
    showClip("waiting");
};

describe("a primary press takes the live controller from every movement state", () => {
    const states = {
        walking: () => trips("walk"),
        running: () => trips("run"),
        jumping: () => trips("jump", true),
        falling: () => { view.body.airborne = {x: 406, y: 406.4, posture: "stand", speed: 400, at: time}; showClip("fall"); },
        thrown: () => { view.body.airborne = {x: 406, y: 406.4, posture: "stand", thrown: true, spin: 120, vx: 800, speed: -300, at: time}; showClip("fall"); },
        parachuting: () => { view.body.airborne = {x: 406, y: 406.4, posture: "stand", chute: true, speed: 200, at: time}; showClip("chute"); },
        flying: () => { view.flight = {began: time - 300, hops: [], back: time + 500}; view.flying = {way: 1}; showClip("hop_up"); },
        entering: () => { view.body.arriving = true; showClip("enter", {once: true, arrival: true}); },
        leaving: () => { view.body.leaving = true; showClip("exit", {once: true, departure: true}); },
        hanging: () => { view.body.place = {...view.body.place, posture: "hang", grip: "r"}; view.tilt = 0.4; showClip("hang_r"); },
        sitting: () => seated("sit"),
        lounging: () => seated("lounge"),
        composed: () => seated("composed"),
        shuffling: () => { seated("sit"); view.newestAside = {phase: "scoot", began: time - 200, from: 100, to: 300, face: 0}; showClip("newest_scoot"); },
        acting: () => { view.beats = [{clip: "disco"}]; showClip("disco", {once: true}); },
        building: () => { view.body.place.stays = true; showClip("work"); },
    };

    for (const [name, arrange] of Object.entries(states)) test(name, async () => {
        arrange();
        const at = {...view.body.at};
        const before = view.playing.shown.clip.name;
        pointer("pointerdown");
        await nextTick();
        expect(view.body.at).toEqual(at);
        expect(view.body.airborne).toMatchObject({held: true, posture: "stand"});
        expect(view.body.place).toMatchObject({posture: "stand", on: null});
        expect(view.body.trip).toBeNull();
        expect(view.body.slide).toBeNull();
        expect(view.body.footing).toBeNull();
        expect(view.body.arriving || view.body.leaving || view.body.landing).toBe(false);
        expect(view.flight).toBeNull();
        expect(view.flying).toBeNull();
        expect(view.newestAside).toBeNull();
        expect(view.beats).toEqual([]);
        expect(view.shownClip.name).toBe("fall");
        expect(paint.mock.lastCall[3]).toMatchObject({posture: "stand", grabbed: true, airborne: true});
        expect(view.bodyStyle.pointerEvents, `${name} remains clickable`).not.toBe("none");
        time += 20;
        pointer("pointermove", {x: at.x + SIZE / 2 + 40, y: at.y + SIZE * 0.4 - 30});
        view.watchFooting();
        expect(view.body.at.x).toBeCloseTo(at.x + 40);
        expect(view.body.at.y).toBeCloseTo(at.y - 30);
        time += 20;
        pointer("pointerup", {x: at.x + SIZE / 2 + 70, y: at.y + SIZE * 0.4 - 50});
        expect(view.grab).toBeNull();
        expect(view.body.airborne).toMatchObject({thrown: true, posture: "stand"});
        expect(view.body.airborne.vx).toBeGreaterThan(0);
        expect(view.body.airborne.speed).toBeLessThan(0);
        expect(view.playing.shown.clip.name, `${before} does not resume`).toBe("fall");
    });
});

test("an urgent run from a kept seat stays the run after departure, until the next planning tick clears its old stay", () => {
    seated("sit");
    trips("run");
    view.posed = {posture: "stand", facing: 90, turning: false};
    expect(view.body.place.posture).toBe("sit");
    expect(view.perched.seated).toBe(true);
    expect(view.current()).toMatchObject({clip: {name: "run"}, facing: 90});
    view.step();
    expect(view.shownClip.name).toBe("run");
    expect(view.drawn).toBe("stand");
    expect(paint.mock.lastCall[0].name).toBe("run");
    expect(paint.mock.lastCall[3].stride).not.toBeNull();
});

test("taking a rising trip invalidates its queued departure before resolving the slide", async () => {
    trips("walk");
    const trip = view.body.trip;
    view.body.slide = {from: {...view.body.at}, to: {x: 350, y: 100}, began: time};
    const departed = vi.fn(() => { if (view.body.trip === trip) view.depart(); });
    view.slideWaits.push(departed);
    pointer("pointerdown");
    await Promise.resolve();
    expect(departed).toHaveBeenCalledOnce();
    expect(view.body.trip).toBeNull();
    expect(view.body.airborne.held).toBe(true);
    expect(view.body.at).toEqual({x: 350, y: 300});
});

test("a head press takes the body too, retaining the currently drawn yaw instead of completing its old turn", () => {
    seated("sit");
    view.player.facing = 37;
    view.player.turn = {speed: 120};
    pointer("pointerdown", {y: view.body.at.y + SIZE * 0.18});
    expect(view.grab).not.toBeNull();
    expect(view.body.airborne).toMatchObject({held: true, posture: "stand", face: 37});
    expect(view.player.turn).toBeNull();
    expect(view.current().facing).toBe(37);
    pointer("pointerup");
    expect(view.body.airborne).toMatchObject({thrown: true, posture: "stand", face: 37});
    expect(view.current().clip.name).toBe("fall");
});

test("a hanging pivot follows the yaw actually drawn while its body turns toward the requested facing", () => {
    view.body.place = {...view.body.place, posture: "hang", grip: "r", face: 180};
    view.posed = {posture: "hang", facing: 180, turning: false};
    view.player.facing = 90;
    showClip("hang_r");
    view.step();
    expect(view.shownFacing).toBe(90);
    expect(view.grip.x).toBeCloseTo(0.5, 8);
});

test("a second pointer cannot steal a drag, and cancellation or loss of focus releases without a throw", () => {
    pointer("pointerdown", {button: 2});
    expect(view.grab).toBeNull();
    pointer("pointerdown");
    const at = {...view.body.at};
    time += 20;
    pointer("pointermove", {x: 900, y: 100, id: 2});
    pointer("pointerup", {id: 2});
    expect(view.body.at).toEqual(at);
    expect(view.grab).not.toBeNull();
    pointer("pointercancel");
    expect(view.body.airborne).toMatchObject({thrown: true, vx: 0, speed: 0, posture: "stand"});
    expect(view.grab).toBeNull();
    pointer("pointerdown");
    window.dispatchEvent(new Event("blur"));
    expect(view.body.airborne).toMatchObject({thrown: true, vx: 0, speed: 0});
    expect(view.grab).toBeNull();
});

test("a long drag remains inside the chat after its velocity sample history rolls over", () => {
    pointer("pointerdown");
    for (let move = 0; move < 35; move++) {
        time += 20;
        pointer("pointermove", {x: 2000 + move * 100, y: 300});
        expect(view.body.airborne.x).toBeLessThanOrEqual(1000 - SIZE / 2);
    }
});

test("the hit target follows the transformed actor and a disappearing prop keeps its last drawing while it fades", async () => {
    const target = document.querySelector(".voice-figure-body");
    expect(target.parentElement.classList.contains("voice-figure-actor")).toBe(true);
    showClip("pogo");
    view.drawnFrame = 20;
    await nextTick();
    const prop = document.querySelector('[data-act="pogo"]');
    expect(prop).not.toBeNull();
    const picture = prop.innerHTML;
    pointer("pointerdown");
    await nextTick();
    expect(view.shownClip.name).toBe("fall");
    expect(prop.classList.contains("figure-prop-leave-active")).toBe(true);
    expect(prop.isConnected).toBe(true);
    expect(prop.innerHTML).toBe(picture);
});

test("a tumbling throw touches down at its current angle and eases through the shortest turn into its landing", () => {
    const spin = 945;
    view.body.airborne = {x: 406, y: 697, posture: "stand", thrown: true, spin, vx: 0, speed: 600, at: time};
    view.body.at = {x: 350, y: 697 - SIZE * (1 - below)};
    showClip("fall");
    time += 16;
    view.watchFooting();
    expect(view.body.landing).toBe(true);
    const angle = parseFloat(view.actorStyle.rotate);
    expect(Math.sin(angle * Math.PI / 180)).toBeCloseTo(Math.sin(spin * Math.PI / 180), 8);
    expect(Math.cos(angle * Math.PI / 180)).toBeCloseTo(Math.cos(spin * Math.PI / 180), 8);
    expect(Math.abs(angle)).toBeLessThanOrEqual(180);
    expect(view.actorStyle.transformOrigin).toBe("50% 55%");
    let previous = angle;
    for (let frame = 0; frame < 15; frame++) {
        time += 1000 / 60;
        view.recoverTouchdown();
        const next = parseFloat(view.actorStyle.rotate ?? 0);
        expect(Math.abs(next)).toBeLessThanOrEqual(Math.abs(previous));
        expect(Math.abs(next - previous)).toBeLessThan(18);
        previous = next;
    }
    expect(view.touchdown).toBeNull();
    expect(view.actorStyle.rotate).toBeUndefined();
});

test("a departure already pending when a landing ends continues scheduling the exit", () => {
    view.body.landing = true;
    view.body.leaving = true;
    showClip("land", {once: true, landed: true});
    view.playing.started = time - view.playing.shown.clip.frames / view.playing.shown.clip.fps * 1000 - 1;
    view.step();
    expect(view.body.landing).toBe(false);
    expect(view.shownClip.name).toBe("exit");
    expect(paint.mock.lastCall[0].name).toBe("exit");
    expect(requestAnimationFrame).toHaveBeenCalled();
});

test("called back while its exit plays, the figure stays and enters again, and only one left out says it has gone", async () => {
    const gone = vi.fn();
    app.unmount();
    document.body.insertAdjacentHTML("beforeend", '<div id="figure-again"></div>');
    app = createApp({render: () => h(VoiceFigure, {voice: "butler", here: here.value, onGone: gone})});
    app.mount(document.querySelector("#figure-again"));
    await nextTick();
    const figure = app._instance.subTree.component.setupState;
    figure.player = view.player;
    figure.clips = view.clips;
    const exit = {clip: figure.clips.find((clip) => clip.name === "exit"), facing: 0, once: true, departure: true};
    figure.body.here = true;
    figure.body.leaving = true;
    figure.endAct(exit);
    expect([figure.body.here, figure.body.leaving, gone.mock.calls.length]).toEqual([true, false, 0]);
    here.value = false;
    await nextTick();
    figure.body.leaving = true;
    figure.endAct(exit);
    expect([figure.body.here, figure.body.leaving, gone.mock.calls.length]).toEqual([false, false, 1]);
});

test("a hide deferred through a seated drop can leave even while the previous seat stay is active", async () => {
    seated("sit");
    view.body.airborne = {x: 406, y: 300, posture: "sit"};
    here.value = false;
    await nextTick();
    expect(view.body.leaving).toBeFalsy();
    view.body.airborne = null;
    view.landOn({...view.body.place, y: 700}, false);
    expect(view.body.leaving).toBe(true);
    expect(view.current().clip.name).toBe("exit");
});

for (const posture of ["sit", "lounge", "composed", "hang", "stand"]) test(`a throw from ${posture} flails, returns on its parachute, and lands on its feet`, () => {
    seated(posture);
    if (posture === "hang") view.body.place.grip = "r";
    pointer("pointerdown");
    const {x, y} = view.grab.moves[0];
    time += 30;
    pointer("pointermove", {x, y: y - 90});
    pointer("pointerup", {x, y: y - 90});
    expect(view.body.airborne.speed).toBeCloseTo(-GRAB.fastest, 6);
    let sawChute = false;
    for (let frame = 0; frame < 60 * 20 && !view.body.landing; frame++) {
        time += 1000 / 60;
        view.watchFooting();
        view.step();
        if (view.body.airborne) {
            expect(view.body.airborne.posture).toBe("stand");
            expect(view.drawn).toBe("stand");
        }
        if (view.body.airborne?.chute) {
            sawChute = true;
            expect(view.shownClip.name).toBe("chute");
        }
    }
    expect(sawChute).toBe(true);
    expect(view.body.airborne).toBeNull();
    expect(view.body.place).toMatchObject({posture: "stand", y: 700});
    expect(view.body.landing).toBe(true);
    expect(view.shownClip.name).toBe("land");
    expect(view.moved).toBe("dropping");
    expect(view.actorStyle["--fall-ms"]).toBe(`${fallOf("butler").ms}ms`);
    expect(view.flight).toBeNull();
});
