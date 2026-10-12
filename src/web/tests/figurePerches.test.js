// @vitest-environment node
import {beforeEach, expect, test} from "vitest";

const {HANGS, HANG_SHARE, ROAMS, SITS, perchOn, perchSpot, roamNext} = await import("../src/figure/perches.js");
const {write} = await import("./figurePage.js");

// a page with nothing on it a perch could hide, until a test writes words onto it
beforeEach(() => {
    globalThis.document = {querySelectorAll: () => []};
});

const FIGURE = {size: 112, below: 0.05};
const HANDS = ["l", "r"];
const THREAD = {left: 250, right: 700, top: 100, bottom: 660, getBoundingClientRect() { return this; }};

const bubble = (rect, connected = true) => ({isConnected: connected, getBoundingClientRect: () => ({width: rect.right - rect.left, ...rect})});
const at = (top, left = 260, right = 500) => bubble({left, right, top, bottom: top + 60});
const fixed = (...values) => () => values.shift() ?? 0;

test("a figure perches on the newest bubble in view first, and never on one too high or too low for it to be seen from", () => {
    const high = at(110);
    const low = at(655);
    const older = at(300);
    const newest = at(500);
    expect(perchOn([high, older, newest, low], THREAD, FIGURE, HANDS, () => 0).bubble).toBe(newest);
    expect(perchOn([high, older, low], THREAD, FIGURE, HANDS, () => 0).bubble).toBe(older);
    expect(perchOn([high, low], THREAD, FIGURE, HANDS, () => 0)).toBe(null);
});

test("a perch whose figure would hide words is not taken: it hangs beside the bubble instead, or takes an older bubble", () => {
    const older = at(300);
    const newest = at(500);
    // words just above the newest bubble's right corner, where a seated body rises and a hanging one does not reach
    write([{left: 470, right: 520, top: 440, bottom: 470}]);
    expect(perchOn([older, newest], THREAD, FIGURE, HANDS, () => 0.99)).toMatchObject({bubble: newest, kind: HANGS});
    expect(perchOn([older, newest], THREAD, FIGURE, [], () => 0.99)).toMatchObject({bubble: older, kind: SITS});
    expect(perchSpot({bubble: newest, kind: SITS, side: "right", grip: ""}, THREAD, FIGURE)).toBe(null);
});

test("it perches on the side of a bubble with more room outside it, and hangs or sits as the roll says", () => {
    expect(perchOn([at(300, 260, 500)], THREAD, FIGURE, HANDS, () => 0).side).toBe("right");
    expect(perchOn([at(300, 450, 690)], THREAD, FIGURE, HANDS, () => 0).side).toBe("left");
    expect(perchOn([at(300)], THREAD, FIGURE, HANDS, fixed(0)).kind).toBe(HANGS);
    expect(perchOn([at(300)], THREAD, FIGURE, HANDS, fixed(HANG_SHARE)).kind).toBe(SITS);
    expect(perchOn([at(300)], THREAD, FIGURE, [], fixed(0)).kind).toBe(SITS);
});

test("a hanging figure grips the roomy corner with the hand on its side, or turns to face the bubble to grip it with its one free hand", () => {
    const right = perchOn([at(300, 260, 500)], THREAD, FIGURE, HANDS, fixed(0));
    expect([right.grip, right.side, right.face]).toEqual(["r", "right", 0]);
    const left = perchOn([at(300, 450, 690)], THREAD, FIGURE, HANDS, fixed(0));
    expect([left.grip, left.side, left.face]).toEqual(["l", "left", 0]);
    const one = perchOn([at(300, 260, 500)], THREAD, FIGURE, ["l"], fixed(0));
    expect([one.grip, one.side, one.face]).toEqual(["l", "right", 180]);
    expect(perchSpot(one, THREAD, FIGURE)).toMatchObject({face: 180, posture: "hang"});
});

test("every place the figure roams to comes up by its odds and is stayed at between its shortest and longest stay", () => {
    const total = ROAMS.reduce((sum, each) => sum + each.odds, 0);
    let before = 0;
    for (const each of ROAMS) {
        const middle = (before + each.odds / 2) / total;
        expect(roamNext(fixed(middle, 0))).toEqual({where: each.where, stay: each.stay[0]});
        expect(roamNext(fixed(middle, 1)).stay).toBe(each.stay[1]);
        before += each.odds;
    }
    expect(new Set(ROAMS.map((each) => each.where))).toEqual(new Set(["seat", "edge", "bubble", "tab"]));
});

test("a figure sitting or hanging stands where its bubble's corner is, and is let go when the bubble leaves the thread's view or the page", () => {
    const one = at(300, 260, 500);
    const sitting = {bubble: one, kind: SITS, side: "right", grip: ""};
    const hanging = {...sitting, kind: HANGS, grip: "r", face: 0};
    expect(perchSpot(sitting, THREAD, FIGURE).face).toBe(60);
    expect(perchSpot(sitting, THREAD, FIGURE).on).toBe(one);
    // its hips sit over the bubble's padding, inside the corner by less than the padding, so its legs hang clear of the words
    expect(500 - perchSpot(sitting, THREAD, FIGURE).x).toBeLessThan(7);
    expect(perchSpot(hanging, THREAD, FIGURE)).toMatchObject({face: 0});
    expect(perchSpot(hanging, THREAD, FIGURE).x).toBeGreaterThan(500);
    expect(perchSpot(hanging, THREAD, FIGURE)).toMatchObject({y: 300, posture: "hang", grip: "r"});
    expect(perchSpot({...sitting, bubble: at(105)}, THREAD, FIGURE)).toBe(null);
    expect(perchSpot({...sitting, bubble: bubble({left: 260, right: 500, top: 300, bottom: 360}, false)}, THREAD, FIGURE)).toBe(null);
});
