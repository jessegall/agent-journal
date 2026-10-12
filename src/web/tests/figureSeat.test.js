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
    expect([right.x, right.face]).toEqual([700, 90]);
    expect([left.x, left.face]).toEqual([300, 270]);
});

test("a seated figure's hips sit on the box's edge, and the room it takes above the edge is what the thread leaves", () => {
    page({left: 300, top: 600, width: 400, height: 120});
    const spot = seatOf(FIGURE, {x: 700, y: 600});
    expect(spot.y).toBeGreaterThan(600);
    expect(seatRise(FIGURE)).toBeCloseTo((1 - FIGURE.below) * FIGURE.size - (spot.y - 600), 5);
});
