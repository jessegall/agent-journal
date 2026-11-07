import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import FigureAct from "../src/chat/FigureAct.vue";
import {ACTS, SLUSH, bugShotScene, bugShotTimes, cameraDrops, slushAt, slushOf, sprayesCamera} from "../src/figure/acts.js";
import {hitSurface, slushSurfaces} from "../src/figure/splatter.js";

const WORLD = {left: 0, top: 0, right: 800, bottom: 600};
const left = {wall: "left", along: 0.5, way: 0};
const top = {wall: "top", along: 0.3, way: 0};
const SPOT = {x: 8, y: 300};

async function drawn(extra) {
    const host = document.createElement("div");
    const bug = {pictures: ["data:a", "data:b"], width: 20, height: 12, at: {x: 10, y: 11}};
    createApp({render: () => h(FigureAct, {name: "bug_shot", u: 0.7, hand: {x: 0.6, y: 0.5, out: 1}, head: {x: 0.5, y: 0.3}, feet: 0.95, size: 112, room: {left: 0, right: 0}, bug, wallBugs: [], ...extra})}).mount(host);
    await nextTick();
    return host;
}

test("a shot bug bursts into slush thrown out from its wall that falls under gravity and lands on the floor or an edge of the window", () => {
    const particles = slushOf(left, WORLD, SPOT);
    expect(particles).toHaveLength(SLUSH.count);
    for (const p of particles) {
        expect(p.vx, "thrown out from the left wall").toBeGreaterThan(0);
        expect(p.t).toBeGreaterThan(0);
        expect(["floor", "left", "right", "top"]).toContain(p.on);
        expect(p.x).toBeGreaterThanOrEqual(WORLD.left);
        expect(p.x).toBeLessThanOrEqual(WORLD.right);
        expect(p.y).toBeLessThanOrEqual(WORLD.bottom);
        const [early, late] = [p.t / 3, (2 * p.t) / 3];
        const [a, b] = slushAt([p], early).concat(slushAt([p], late));
        const straight = (seconds) => p.from.y + p.vy * seconds;
        expect(b.y - straight(late), "it falls: lower than a straight flight by gravity").toBeCloseTo(0.5 * SLUSH.gravity * late * late, 5);
        expect(a.flying && b.flying).toBe(true);
    }
    expect(particles.some((p) => p.on === "floor"), "some land on the floor").toBe(true);
    expect(slushOf(top, WORLD, {x: 240, y: 8}).every((p) => p.vy > 0), "from the top wall they are thrown down").toBe(true);
    expect(slushOf(left, WORLD, SPOT), "the same bug bursts the same way each time").toEqual(particles);
});

test("slush starts at the shot bug and its curved flight meets its landing without jumping", () => {
    const particles = slushOf(left, WORLD, SPOT);
    for (const p of particles) {
        expect(slushAt([p], 0)[0]).toMatchObject({...SPOT, flying: true});
        const flying = slushAt([p], p.t - 0.00001)[0];
        const landed = slushAt([p], p.t)[0];
        expect(Math.hypot(flying.x - landed.x, flying.y - landed.y)).toBeLessThan(0.02);
    }
    expect(slushAt(particles, -0.1)).toEqual([]);
});

test("a drop hits the first chat face it crosses, even when a thin box lies between sampled flight points", () => {
    const near = {id: "near", left: 30, right: 31, top: 20, bottom: 100};
    const far = {id: "far", left: 60, right: 90, top: 20, bottom: 100};
    expect(hitSurface({x: 0, y: 40}, {x: 100, y: 60}, [far, near])).toMatchObject({surface: "near", x: 30, y: 46, dx: 0, dy: 26});
    expect(hitSurface({x: 0, y: 0}, {x: 100, y: 10}, [near, far])).toBeNull();
});

test.each([
    ["bubble", {left: 40, right: 400, top: 320, bottom: 440}],
    ["composer", {left: 10, right: 790, top: 550, bottom: 595}],
    ["card", {left: 60, right: 500, top: 360, bottom: 420}],
])("the %s catches flying slush before it reaches the window floor", (id, box) => {
    const surface = {id, ...box};
    const particles = slushOf(left, WORLD, SPOT, [surface]);
    expect(particles.some((p) => p.surface === id)).toBe(true);
    for (const p of particles.filter((p) => p.surface === id)) {
        const flying = slushAt([p], p.t - 0.00001, [surface])[0];
        const landed = slushAt([p], p.t, [surface])[0];
        expect(landed).toMatchObject({on: "surface", flying: false});
        expect(landed.x).toBeGreaterThanOrEqual(surface.left);
        expect(landed.x).toBeLessThanOrEqual(surface.right);
        expect(landed.y).toBeGreaterThanOrEqual(surface.top);
        expect(landed.y).toBeLessThanOrEqual(surface.bottom);
        expect(Math.hypot(flying.x - landed.x, flying.y - landed.y)).toBeLessThan(0.04);
        const dripping = slushAt([p], p.t + 1, [surface])[0];
        expect(dripping.run).toBeGreaterThan(0);
        expect(dripping.y + dripping.run).toBeLessThanOrEqual(surface.bottom);
    }
});

test("a landed splash stays with the same scrolling box, disappears with it, and fades away", () => {
    const surface = {id: "bubble", left: 0, right: 800, top: 520, bottom: 580};
    const bursts = new Map();
    const raw = (bugShotTimes(0).shot + 1.4) * ACTS.bug_shot.fps;
    const scene = (surfaces, frame = raw) => bugShotScene([left], WORLD, frame, {surfaces, bursts});
    const before = scene([surface]).slush.filter((p) => p.on === "surface");
    expect(before.length).toBeGreaterThan(0);
    const scrolled = {...surface, left: 25, right: 825, top: 470, bottom: 530};
    const after = scene([scrolled]).slush.filter((p) => p.on === "surface");
    expect(after).toHaveLength(before.length);
    for (const [index, p] of after.entries()) {
        expect(p.x - before[index].x).toBeCloseTo(25);
        expect(p.y - before[index].y).toBeCloseTo(-50);
    }
    expect(scene([{...surface, id: "replacement"}]).slush.filter((p) => p.on === "surface")).toEqual([]);
    expect(scene([scrolled], raw + 8 * ACTS.bug_shot.fps).slush).toEqual([]);
    expect(bursts.size).toBe(1);
});

test("airborne drops use the boxes' current positions instead of snapping to an impact planned before a scroll", () => {
    const surface = {id: "bubble", left: 0, right: 400, top: 520, bottom: 580};
    const moved = {...surface, left: 650, right: 790};
    const bursts = new Map();
    const raw = (seconds) => (bugShotTimes(0).shot + seconds) * ACTS.bug_shot.fps;
    const scene = (seconds, surfaces) => bugShotScene([left], WORLD, raw(seconds), {surfaces, bursts});
    scene(0, [surface]);
    scene(0.2, [surface]);
    for (let seconds = 0.25; seconds <= 1.5; seconds += 0.05) {
        expect(scene(seconds, [moved]).slush, "a box that moved away no longer catches the drops").toEqual(bugShotScene([left], WORLD, raw(seconds)).slush);
    }
    bursts.clear();
    scene(0, []);
    scene(0.2, []);
    for (let seconds = 0.25; seconds <= 1.4; seconds += 0.05) scene(seconds, [surface]);
    expect(scene(1.4, [surface]).slush.some((drop) => drop.on === "surface"), "a box that moved into the path catches them").toBe(true);
});

test("slush sees only this chat's visible bubble, composer, card and dock faces, clipped above its foot", () => {
    const host = document.createElement("div");
    host.innerHTML = `<div data-figure-world><div data-figure-scroll><div data-figure-bubble></div><div data-figure-mark="card"></div><div data-figure-bubble hidden></div></div><div data-figure-chat-foot><div data-figure-docked-bars></div><div data-figure-home></div></div></div>`;
    const thread = host.querySelector("[data-figure-world]");
    const [bubble, card, hidden] = thread.querySelectorAll("[data-figure-bubble], [data-figure-mark]");
    const home = thread.querySelector("[data-figure-home]");
    const dock = thread.querySelector("[data-figure-docked-bars]");
    const box = (element, left, top, right, bottom) => {
        element.getBoundingClientRect = () => ({left, top, right, bottom, width: right - left, height: bottom - top});
        element.checkVisibility = () => !element.hidden;
    };
    box(thread, 0, 0, 800, 600);
    box(thread.querySelector("[data-figure-scroll]"), 0, 40, 800, 600);
    box(thread.querySelector("[data-figure-chat-foot]"), 0, 500, 800, 600);
    box(bubble, 40, 20, 400, 200);
    box(card, 100, 450, 700, 560);
    box(hidden, 30, 200, 500, 400);
    box(dock, 10, 500, 790, 530);
    box(home, 10, 530, 790, 590);
    const surfaces = slushSurfaces(thread);
    expect(surfaces.map((surface) => surface.id)).toEqual([bubble, card, dock, home]);
    expect(surfaces[0].clip).toEqual({left: 40, right: 400, top: 40, bottom: 200});
    expect(surfaces[1].clip.bottom).toBe(500);
    expect(surfaces[3].clip.bottom).toBe(590);
});

test("a splash is left where each particle lands, grows, holds and fades away", () => {
    const [p] = slushOf(left, WORLD, SPOT);
    expect(slushAt([p], p.t - 0.01)[0].flying).toBe(true);
    const landed = slushAt([p], p.t + 0.001)[0];
    expect(landed).toMatchObject({flying: false, x: p.x, y: p.y, on: p.on, opacity: 1});
    const grown = slushAt([p], p.t + 0.5)[0];
    expect(grown.r).toBeGreaterThan(landed.r);
    const fading = slushAt([p], p.t + SLUSH.hold + SLUSH.fade / 2)[0];
    expect(fading.opacity).toBeGreaterThan(0);
    expect(fading.opacity).toBeLessThan(1);
    expect(slushAt([p], p.t + SLUSH.hold + SLUSH.fade + 0.01), "gone once faded").toEqual([]);
});

test("shooting a bug leaves nothing at its place: before its shot no slush, after it slush and splashes about, never a mark where it sat", () => {
    const bugs = [left];
    const {shot} = bugShotTimes(0);
    const before = bugShotScene(bugs, WORLD, (shot - 0.2) * ACTS.bug_shot.fps);
    expect(before.slush).toEqual([]);
    const after = bugShotScene(bugs, WORLD, (shot + 0.3) * ACTS.bug_shot.fps);
    expect(after.bugs[0].shot).toBe(true);
    expect(after.slush.length).toBeGreaterThan(0);
    const later = bugShotScene(bugs, WORLD, (shot + 2.5) * ACTS.bug_shot.fps);
    expect(later.slush.every((each) => !each.flying), "later only splashes").toBe(true);
    expect(bugShotScene(bugs, WORLD, (shot + SLUSH.longest + SLUSH.hold + SLUSH.fade + 1) * ACTS.bug_shot.fps).slush, "every splash faded").toEqual([]);
});

test("some bugs' slush is chosen to fly at the camera, and its drops land on the screen, then run down and fade", () => {
    const chosen = [0.01, 0.02, 0.5, 0.9].map((along) => ({...left, along}));
    expect(chosen.some(sprayesCamera) && chosen.some((bug) => !sprayesCamera(bug)), "now and then, not always").toBe(true);
    const bug = chosen.find(sprayesCamera);
    const {shot} = bugShotTimes(0);
    const scene = bugShotScene([bug], WORLD, (shot + 1) * ACTS.bug_shot.fps);
    expect(scene.camera).toHaveLength(1);
    expect(bugShotScene([chosen.find((each) => !sprayesCamera(each))], WORLD, (shot + 1) * ACTS.bug_shot.fps).camera).toEqual([]);
    const middle = {x: 56, y: 56};
    const flying = cameraDrops(0.1, 112, {x: -300, y: 40}, middle);
    const landed = cameraDrops(1, 112, {x: -300, y: 40}, middle);
    const gone = cameraDrops(10, 112, {x: -300, y: 40}, middle);
    expect(flying.every((drop) => !drop.landed)).toBe(true);
    expect(landed.every((drop) => drop.landed)).toBe(true);
    expect(landed[0].r, "bigger as it comes").toBeGreaterThan(flying[0].r);
    expect(cameraDrops(2, 112, {x: 0, y: 0}, middle)[0].run, "slides down").toBeGreaterThan(landed[0].run);
    expect(gone.every((drop) => drop.fade === 0), "faded away").toBe(true);
    expect(cameraDrops(-1, 112, {x: 0, y: 0}, middle)).toEqual([]);
});

test("the act draws the flying slush, the splashes and the camera drops, and none of them before there are any", async () => {
    const none = await drawn({});
    expect(none.querySelectorAll("[data-act-slush], [data-act-splash], [data-act-lens]").length).toBe(0);
    const host = await drawn({
        slush: [{x: 10, y: 20, r: 3, flying: true}, {x: 60, y: 100, r: 4, flying: false, on: "floor", opacity: 0.5}, {x: 5, y: 40, r: 3, flying: false, on: "left", opacity: 1}],
        camera: [{seconds: 1, from: {x: -300, y: 40}}],
    });
    expect(host.querySelectorAll("[data-act-slush]")).toHaveLength(1);
    const splashes = [...host.querySelectorAll("[data-act-splash]")];
    expect(splashes).toHaveLength(2);
    expect(splashes[0].getAttribute("opacity")).toBe("0.45");
    expect(host.querySelectorAll("[data-act-lens]").length, "one drop for each of the lens places").toBe(ACTS.bug_shot.lens.length);
    expect(host.querySelector(".figure-act-lens rect"), "landed drops run down").not.toBeNull();
});

test("a splash and its drip are clipped to the chat box they stick to", async () => {
    const host = await drawn({slush: [{x: 30, y: 40, r: 4, flying: false, on: "surface", opacity: 0.8, run: 16, clip: {left: 20, right: 90, top: 35, bottom: 85}}]});
    const surface = host.querySelector("[data-act-surface]");
    const clipping = host.querySelector("clipPath");
    expect(surface.getAttribute("clip-path")).toBe(`url(#${clipping.id})`);
    expect(clipping.querySelector("rect").getAttribute("width")).toBe("70");
    expect(surface.querySelector("[data-act-run]").getAttribute("height")).toBe("16");
    expect(surface.querySelector("circle").getAttribute("cy")).toBe("56");
});
