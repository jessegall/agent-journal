import {expect, test} from "vitest";

const {GRAB, pointerSpeed, thrownFrame, thrownFrom} = await import("../src/figure/grab.js");
const {CLIPS} = await import("../src/figure/figure.js");
const {SKYWARD} = await import("../src/figure/skyward.js");
const {PICTURES, WHOA_SPOT, litPixels} = await import("../src/figure/visorPixels.js");
const {airborneFrame, chuteFrom} = await import("../src/domain/figureMotion.js");

const SIZE = 112;
// the feet may go anywhere across a chat from 56 to 944 pixels, whose top is at 100
const ROOM = {left: 56, right: 944, top: 100};
// the chat's floor, the compose box's top at 700 under the chat's whole width, and two bubbles above it, one overhanging the other
const HOME = {id: "home", kind: "compose", left: 56, right: 944, top: 700, element: "home"};
const UPPER = {id: "upper", kind: "bubble", left: 100, right: 500, top: 300, bottom: 360, element: "upper"};
const LOWER = {id: "lower", kind: "bubble", left: 300, right: 800, top: 500, bottom: 560, element: "lower"};
const FLOORS = [HOME, UPPER, LOWER];

// the throw flown at 60 frames a second from its first frame at 0 until it lands or is gone, with every frame it passed through in the air,
// the one it was gone on the last
function flown(thrown) {
    const frames = [thrown];
    for (let frame = 1; frame < 60 * 30; frame++) {
        const next = thrownFrame(frames.at(-1), FLOORS, ROOM, (frame * 1000) / 60);
        if (next.gone) return {frames: [...frames, next.airborne], ...next};
        if (!next.airborne) return {frames, ...next};
        frames.push(next.airborne);
    }
    return {frames, landed: null, gone: false};
}

// the highest floor under `x` whose top is at or below `y`
const nearestBelow = (x, y) => FLOORS.filter((floor) => floor.left <= x && floor.right >= x && floor.top >= y).sort((a, b) => a.top - b.top)[0];

test("a held figure keeps its startled visor", () => {
    // held, the visor shows wide eyes and a round mouth under them
    const face = {eyed: true, eyes: 1.5, glance: [0, 0], tint: null, hearts: 0, stars: 0, squeezed: 0, dozing: 0, sign: null, ticker: null};
    const mouth = (lit) => lit.filter((pixel) => Math.abs(pixel.column - WHOA_SPOT.column) <= 2 && Math.abs(pixel.row - WHOA_SPOT.row) <= 2);
    expect(mouth(litPixels(face))).toEqual([]);
    expect(mouth(litPixels({...face, whoa: true})).length).toBe(PICTURES.whoa.join("").split("#").length - 1);
    expect(litPixels({...face, whoa: true}).length).toBeGreaterThan(litPixels(face).length);
});

test("let go, the figure flies off at the pointer's speed and way over its last moves, never faster than the fastest throw", () => {
    // the pointer swept 60 pixels right and 30 up over its last 50 ms, after a slow drag before
    const moves = [{x: 0, y: 0, at: 0}, {x: 10, y: 0, at: 0.5}, {x: 40, y: -15, at: 0.525}, {x: 70, y: -30, at: 0.55}];
    const speed = pointerSpeed(moves, 0.55);
    expect(speed.x).toBeCloseTo(60 / 0.05, 6);
    expect(speed.y).toBeCloseTo(-30 / 0.05, 6);
    // a pointer held still before letting go throws nothing; one flung hard is held to the fastest throw, its way kept
    expect(pointerSpeed(moves, 0.9)).toEqual({x: 0, y: 0});
    const hard = pointerSpeed([{x: 0, y: 0, at: 0}, {x: 300, y: -400, at: 0.01}], 0.01);
    expect(Math.hypot(hard.x, hard.y)).toBeCloseTo(GRAB.fastest, 6);
    expect(hard.x / hard.y).toBeCloseTo(-0.75, 6);
    // the throw carries that speed: its first frame moves the feet by it
    const thrown = thrownFrom({x: 400, y: 200}, speed, 0);
    expect(thrown).toMatchObject({x: 400, y: 200, vx: speed.x, speed: speed.y, thrown: true});
    const next = thrownFrame(thrown, FLOORS, ROOM, 16).airborne;
    expect(next.x - thrown.x).toBeCloseTo(speed.x * 0.016, 6);
    expect(next.y).toBeLessThan(thrown.y);
});

test("catching a translated, rotated or squashed picture keeps every point in place through the new grip and release pivot", async () => {
    const {caughtPicture, releasedFeet} = await import("../src/figure/grab.js");
    const at = {x: 300, y: 250};
    const pointer = {x: 375, y: 300};
    const origin = {x: 56, y: 61.6};
    const apply = (point, base, pivot, matrix) => ({
        x: base.x + pivot.x + matrix.e + matrix.a * (point.x - pivot.x) + matrix.c * (point.y - pivot.y),
        y: base.y + pivot.y + matrix.f + matrix.b * (point.x - pivot.x) + matrix.d * (point.y - pivot.y),
    });
    for (const [angle, sx, sy, e, f] of [[0, 1, 1, 80, 0], [1.2, 1, 1, 0, 0], [-0.8, 1.12, 0.88, 0, -15]]) {
        const matrix = {a: Math.cos(angle) * sx, b: Math.sin(angle) * sx, c: -Math.sin(angle) * sy, d: Math.cos(angle) * sy, e, f};
        const caught = caughtPicture(at, pointer, SIZE, matrix, origin);
        const grip = {x: caught.point.x * SIZE, y: caught.point.y * SIZE};
        const held = {...matrix, e: 0, f: 0};
        const feet = {x: caught.at.x + SIZE / 2, y: caught.at.y + SIZE * 0.95, held: true, hang: caught.angle, grip: caught.point, scale: caught.scale};
        const released = releasedFeet(feet, SIZE);
        const thrownAt = {x: released.x - SIZE / 2, y: released.y - SIZE * 0.95};
        for (const point of [{x: 0, y: 0}, {x: 112, y: 112}, {x: 50, y: 30}]) {
            const before = apply(point, at, origin, matrix);
            const after = apply(point, caught.at, grip, held);
            const thrown = apply(point, thrownAt, origin, held);
            expect(after.x).toBeCloseTo(before.x, 8);
            expect(after.y).toBeCloseTo(before.y, 8);
            expect(thrown.x).toBeCloseTo(before.x, 8);
            expect(thrown.y).toBeCloseTo(before.y, 8);
        }
        expect(thrownFrom(feet, {x: 0, y: 0}, 0).spin).toBeCloseTo(angle * 180 / Math.PI, 8);
    }
});

test("let go without a throw, it falls straight down from where it is let go to the nearest floor below: a bubble's top or the chat's floor", () => {
    // over the upper bubble, onto its top; let go in front of the upper bubble, below its top, onto the lower one; past both, onto the floor
    for (const [from, onto] of [[{x: 400, y: 200}, UPPER], [{x: 400, y: 350}, LOWER], [{x: 900, y: 200}, HOME], [{x: 200, y: 400}, HOME]]) {
        const {frames, landed, gone} = flown(thrownFrom(from, {x: 0, y: 0}, 0));
        const label = `${from.x},${from.y}`;
        expect(gone, label).toBe(false);
        expect(landed, label).toEqual({x: from.x, y: onto.top, posture: "stand", face: 0, view: null, on: onto.element});
        expect(onto, label).toBe(nearestBelow(from.x, from.y));
        for (const frame of frames) expect(frame.x, label).toBe(from.x);
    }
});

test("thrown hard, it flies tumbling, off the chat's sides, and falls to the nearest floor below where it comes down, not where it was let go", () => {
    for (const speed of [{x: 1200, y: -600}, {x: -900, y: -300}, {x: GRAB.fastest, y: 0}, {x: 400, y: 900}]) {
        const from = {x: 250, y: 250};
        const {frames, landed, gone} = flown(thrownFrom(from, speed, 0));
        const label = JSON.stringify(speed);
        expect(gone, label).toBe(false);
        const last = frames.at(-1);
        expect(landed.x, label).not.toBe(from.x);
        expect(landed.y, label).toBe(nearestBelow(landed.x, last.y).top);
        // it tumbles all the way, a good turn and more on a throw that flies up first
        const turned = Math.max(...frames.map((frame) => Math.abs(frame.spin)));
        expect(turned, label).toBeGreaterThan(speed.y < 0 ? 90 : 0);
        for (const frame of frames) {
            expect(frame.x, label).toBeGreaterThanOrEqual(ROOM.left);
            expect(frame.x, label).toBeLessThanOrEqual(ROOM.right);
        }
    }
});

test("thrown up hard, it flies freely past the chat's top, five hundred pixels up and out of sight, and comes back down from above on its parachute to the floor", async () => {
    const {GRAVITY} = await import("../src/domain/falls.js");
    const {frames, landed, gone} = flown(thrownFrom({x: 400, y: 250}, {x: 300, y: -GRAB.fastest}, 0));
    expect(GRAB.away).toBe(500);
    expect(gone).toBe(true);
    expect(landed).toBe(null);
    // nothing stopped it at the top: every frame it rose on, slowed by gravity alone, past the chat's top and on
    for (let index = 1; index < frames.length; index++) {
        expect(frames[index].y, `${index}`).toBeLessThan(frames[index - 1].y);
        expect(frames[index].speed - frames[index - 1].speed, `${index}`).toBeCloseTo(GRAVITY / 60, 6);
    }
    // out of sight above the chat, its whole picture past the top, long before it is gone
    expect(frames.some((frame) => frame.y + SIZE < ROOM.top)).toBe(true);
    // gone only once five hundred pixels above the chat's top, not before
    const highest = frames.at(-1);
    expect(frames.slice(0, -1).every((frame) => frame.y > ROOM.top - GRAB.away)).toBe(true);
    expect(highest.y).toBeLessThanOrEqual(ROOM.top - GRAB.away);
    expect(highest.y).toBeGreaterThan(ROOM.top - GRAB.away - 60);
    expect(highest.speed).toBeLessThan(0);
    // the way back is the parachute's from above the screen, as after the run up the bubbles (VoiceFigure goneOff, flyOn), onto the floor
    let back = chuteFrom(highest.x, ROOM.top - SIZE / 4, SKYWARD.chute * SIZE, 0);
    let came = null;
    for (let frame = 1; frame < 60 * 30 && !came; frame++) ({airborne: back, landed: came} = airborneFrame(back, FLOORS, (frame * 1000) / 60));
    expect(came.spot).toMatchObject({x: highest.x, y: HOME.top, posture: "stand"});
});

test("a figure grabbed into the air has the act it was playing cut at once, a seated one included, so the parachute shows on the throw", async () => {
    const {grabbedInAir} = await import("../src/figure/grab.js");
    const {canSwitch} = await import("../src/figure/timeline.js");
    const sit = {name: "waiting", frames: 40, fps: 10, loops: true, leaves: 20, interruptible: false};
    expect(canSwitch(sit, 3, 2), "left to itself a seated loop waits for its next leave point").toBe(false);
    expect(grabbedInAir({x: 1, y: 2, posture: "stand", held: true})).toBe(true);
    expect(grabbedInAir(thrownFrom({x: 1, y: 2}, {x: 0, y: -900}, 0))).toBe(true);
    expect(grabbedInAir(null)).toBe(false);
    expect(grabbedInAir(chuteFrom(100, 0, 300, 0))).toBe(false);
    expect(CLIPS.find((clip) => clip.name === "chute").cuts).toBe(true);
});

test("a held body hangs as a damped pendulum that settles straight down", async () => {
    const {STILL, swung} = await import("../src/figure/pendulum.js");
    let hang = swung(STILL, 1 / 60, 0, 40, 112);
    expect(Math.abs(hang.angle), "carried sideways it swings out").toBeGreaterThan(0.1);
    for (let frame = 1; frame < 60 * 20; frame++) hang = swung(hang, 1 / 60, frame / 60, 0, 112);
    expect(Math.abs(hang.angle), "with the pointer still it settles nearly straight down").toBeLessThan(0.05);
});
