// @vitest-environment node
import {expect, test} from "vitest";

const {HANGS, HANG_SHARE, SITS, STAY_SECONDS, perchOn, perchSpot} = await import("../src/figure/perches.js");

const FIGURE = {size: 112, below: 0.05};
const HANDS = ["l", "r"];
const THREAD = {left: 250, right: 700, top: 100, bottom: 660, getBoundingClientRect() { return this; }};

const bubble = (rect, connected = true) => ({isConnected: connected, getBoundingClientRect: () => ({width: rect.right - rect.left, ...rect})});
const at = (top, left = 260, right = 500) => bubble({left, right, top, bottom: top + 60});
const fixed = (...values) => () => values.shift() ?? 0;

test("a figure never perches on the newest bubble, nor on one too high or too low for it to be seen from", () => {
    const high = at(110);
    const low = at(655);
    const fine = at(300);
    const newest = at(500);
    expect(perchOn([high, low, fine, newest], THREAD, FIGURE, HANDS, () => 0).bubble).toBe(fine);
    expect(perchOn([newest], THREAD, FIGURE, HANDS, () => 0)).toBe(null);
});

test("it perches on the side of a bubble with more room outside it, and hangs or sits as the roll says", () => {
    expect(perchOn([at(300, 260, 500), at(500)], THREAD, FIGURE, HANDS, () => 0).side).toBe("right");
    expect(perchOn([at(300, 450, 690), at(500)], THREAD, FIGURE, HANDS, () => 0).side).toBe("left");
    expect(perchOn([at(300), at(500)], THREAD, FIGURE, HANDS, fixed(0, 0)).kind).toBe(HANGS);
    expect(perchOn([at(300), at(500)], THREAD, FIGURE, HANDS, fixed(0, HANG_SHARE)).kind).toBe(SITS);
    expect(perchOn([at(300), at(500)], THREAD, FIGURE, [], fixed(0, 0)).kind).toBe(SITS);
});

test("a hanging figure grips with the hand on the corner's side, or with its one free hand and then takes that hand's corner", () => {
    const right = perchOn([at(300, 260, 500), at(500)], THREAD, FIGURE, HANDS, fixed(0, 0));
    expect([right.grip, right.side]).toEqual(["r", "right"]);
    const left = perchOn([at(300, 450, 690), at(500)], THREAD, FIGURE, HANDS, fixed(0, 0));
    expect([left.grip, left.side]).toEqual(["l", "left"]);
    const one = perchOn([at(300, 260, 500), at(500)], THREAD, FIGURE, ["l"], fixed(0, 0));
    expect([one.grip, one.side]).toEqual(["l", "left"]);
});

test("a perch lasts between the shortest and the longest stay", () => {
    const [least, most] = STAY_SECONDS;
    expect(perchOn([at(300), at(500)], THREAD, FIGURE, HANDS, fixed(0, 1, 0)).stay).toBe(least);
    expect(perchOn([at(300), at(500)], THREAD, FIGURE, HANDS, fixed(0, 1, 1)).stay).toBe(most);
});

test("a figure sitting or hanging stands where its bubble's corner is, and is let go when the bubble leaves the thread's view or the page", () => {
    const one = at(300, 260, 500);
    const sitting = {bubble: one, kind: SITS, side: "right", grip: "", stay: 30};
    const hanging = {...sitting, kind: HANGS, grip: "r"};
    expect(perchSpot(sitting, THREAD, FIGURE).face).toBe(90);
    expect(perchSpot(sitting, THREAD, FIGURE).on).toBe(one);
    expect(perchSpot(hanging, THREAD, FIGURE)).toMatchObject({face: 0});
    expect(perchSpot(hanging, THREAD, FIGURE).x).toBeGreaterThan(500);
    expect(perchSpot(hanging, THREAD, FIGURE).y).toBeGreaterThan(300);
    expect(perchSpot({...sitting, bubble: at(105)}, THREAD, FIGURE)).toBe(null);
    expect(perchSpot({...sitting, bubble: bubble({left: 260, right: 500, top: 300, bottom: 360}, false)}, THREAD, FIGURE)).toBe(null);
});
