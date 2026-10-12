// @vitest-environment node
import {afterEach, expect, test} from "vitest";

const {seatOf, seatRise} = await import("../src/figure/places.js");

const FIGURE = {size: 112, below: 0.05};

const page = (box) => {
    globalThis.window = {innerWidth: 1280, innerHeight: 800};
    globalThis.document = {
        querySelector: (selector) => (selector === "[data-figure-home]" ? {getBoundingClientRect: () => box} : null),
        querySelectorAll: () => [],
    };
};

afterEach(() => {
    delete globalThis.window;
    delete globalThis.document;
});

test("a figure sitting on the right corner of a box faces right, and on the left corner faces left", () => {
    page({left: 300, top: 600, width: 400, height: 120});
    const right = seatOf(FIGURE, {x: 700, y: 600});
    const left = seatOf(FIGURE, {x: 300, y: 600});
    expect(right.face).toBe(90);
    expect(left.face).toBe(270);
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
    expect(spot.y).toBeGreaterThan(600);
    expect(seatRise(FIGURE)).toBeCloseTo((1 - FIGURE.below) * FIGURE.size - (spot.y - 600), 5);
});

test("with nothing to sit on the figure sits on the foot of the window, wholly inside it, never past an edge", () => {
    globalThis.window = {innerWidth: 1280, innerHeight: 720};
    globalThis.document = {querySelector: () => null, querySelectorAll: () => []};
    for (const near of [{x: 0, y: 700}, {x: 1280, y: 700}]) {
        const spot = seatOf(FIGURE, near);
        expect(spot.y).toBeLessThanOrEqual(720);
        expect(spot.x).toBeGreaterThanOrEqual(FIGURE.size / 2);
        expect(spot.x).toBeLessThanOrEqual(1280 - FIGURE.size / 2);
    }
});
