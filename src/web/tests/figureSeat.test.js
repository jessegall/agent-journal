// @vitest-environment node
import {afterEach, expect, test} from "vitest";

const {POSTURES, boxAt, groundEdge, postureOf, seatOf, seatRise, spotOf} = await import("../src/figure/places.js");

const FIGURE = {size: 112, below: 0.05};

// a page whose compose box is `box`, with the bars docked over it at `docked` while there are any
const page = (box, docked = null) => {
    globalThis.window = {innerWidth: 1280, innerHeight: 800};
    const bars = docked && {getBoundingClientRect: () => docked};
    const thread = {querySelector: (selector) => (selector === "[data-figure-docked-bars]" ? bars : null)};
    const home = {getBoundingClientRect: () => box, closest: (selector) => (selector === ".thread" ? thread : null)};
    globalThis.document = {
        querySelector: (selector) => (selector === "[data-figure-home]" ? home : null),
        querySelectorAll: () => [],
    };
};

afterEach(() => {
    delete globalThis.window;
    delete globalThis.document;
});

test("a figure sitting on the right corner of a box turns right, and on the left corner turns left, part way back to the viewer", () => {
    page({left: 300, top: 600, width: 400, height: 120});
    const right = seatOf(FIGURE, {x: 700, y: 600});
    const left = seatOf(FIGURE, {x: 300, y: 600});
    expect(right.face).toBe(60);
    expect(left.face).toBe(300);
});

test("a figure's hips sit a little inboard of the corner it sits on, so its weight rests on the surface and only its legs reach past the edge", () => {
    page({left: 300, top: 600, width: 400, height: 120});
    const inboard = 0.14 * FIGURE.size;
    expect(seatOf(FIGURE, {x: 700, y: 600}).x).toBeCloseTo(700 - inboard, 5);
    expect(seatOf(FIGURE, {x: 300, y: 600}).x).toBeCloseTo(300 + inboard, 5);
});

test("a seated figure's hips sit on the box's edge, and the room it takes above the edge is what the thread leaves", () => {
    page({left: 300, top: 600, width: 400, height: 120});
    const spot = seatOf(FIGURE, {x: 700, y: 600});
    expect(spot).toMatchObject({y: 600, posture: "sit"});
    expect(600 - boxAt(spot, FIGURE).top).toBeCloseTo(seatRise(FIGURE), 5);
});

test("whatever it plays, the figure's feet never go below the edge it rests on: on its feet they are on the line, seated they hang past it", () => {
    page({left: 300, top: 600, width: 400, height: 120});
    const feet = (spot, posture) => boxAt(spot, FIGURE, posture).bottom - FIGURE.below * FIGURE.size;
    const seat = seatOf(FIGURE, {x: 700, y: 600});
    const standing = spotOf(null, FIGURE);
    expect(feet(standing, "stand")).toBeCloseTo(600, 5);
    // a clip that cannot sit, such as the walk or the landing, is drawn on its feet at a seat, not at the seated picture's depth
    const walk = {postures: ["stand"]};
    expect(postureOf(walk, seat.posture)).toBe("stand");
    expect(feet(seat, postureOf(walk, seat.posture))).toBeCloseTo(600, 5);
    expect(feet(seat, "sit")).toBeCloseTo(600 + POSTURES.sit.drop * FIGURE.size, 5);
    // it travels to a seat on its feet, so the walk there runs along the line and never sinks into the box
    expect(POSTURES[seat.posture].travels).toBe("stand");
});

test("on the floor of a page the figure sits on the same line it stands on, so sitting down to work never lifts it and getting up never drops it", () => {
    globalThis.window = {innerWidth: 1280, innerHeight: 720};
    const floor = {getBoundingClientRect: () => ({left: 240, top: 0, width: 1040, bottom: 720})};
    for (const found of [null, floor]) {
        globalThis.document = {querySelector: (selector) => (selector === "[data-figure-floor]" ? found : null), querySelectorAll: () => []};
        for (const near of [{x: 0, y: 700}, {x: 1280, y: 700}]) {
            const seat = seatOf(FIGURE, near);
            expect(seat).toMatchObject({y: 720, posture: "sit"});
            expect(spotOf(null, FIGURE, near).y).toBe(seat.y);
            expect(seat.x).toBeGreaterThanOrEqual(FIGURE.size / 2);
            expect(seat.x).toBeLessThanOrEqual(1280 - FIGURE.size / 2);
            expect(boxAt(seat, FIGURE).top).toBeGreaterThanOrEqual(0);
        }
    }
});

test("a bar docked over the compose box is the ground the figure stands and sits on while it is there, and the box is again once it goes", () => {
    const box = {left: 300, top: 600, width: 400, height: 120};
    page(box, {left: 300, top: 556, width: 400, height: 44});
    const docked = groundEdge();
    expect(docked.edge.top).toBe(556);
    expect(seatOf(FIGURE, {x: 700, y: 556})).toMatchObject({y: 556, on: docked.element});
    expect(spotOf(null, FIGURE).y).toBe(556);
    page(box);
    expect(groundEdge().edge.top).toBe(600);
    expect(seatOf(FIGURE, {x: 700, y: 556}).y).toBe(600);
});
