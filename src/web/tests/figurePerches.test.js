// @vitest-environment node
import {beforeEach, expect, test} from "vitest";

const {CLEARED_SECONDS, HANGS, HANG_SHARE, ROAMS, SITS, perchOn, perchSpot, roamNext, stayAtHome, stayForLook, stepAside, targetFor} =
    await import("../src/figure/perches.js");
const {boxAt, overlaps} = await import("../src/figure/places.js");
const {write} = await import("./figurePage.js");

// a page with nothing on it a perch could hide, until a test writes words onto it, and no chat, so the figure's world is the window
beforeEach(() => {
    globalThis.window = {innerWidth: 1280, innerHeight: 800};
    globalThis.document = {querySelector: () => null, querySelectorAll: () => []};
    globalThis.CSS = {escape: (text) => text};
});

const FIGURE = {size: 112, below: 0.05};
const HANDS = ["l", "r"];
const THREAD = {
    left: 250,
    right: 700,
    top: 100,
    bottom: 660,
    getBoundingClientRect() {
        return this;
    },
};

const bubble = (rect, connected = true) => ({
    isConnected: connected,
    getBoundingClientRect: () => ({width: rect.right - rect.left, ...rect}),
});
const at = (top, left = 260, right = 500) => bubble({left, right, top, bottom: top + 60});
const fixed =
    (...values) =>
    () =>
        values.shift() ?? 0;

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

test("when its ground goes the figure keeps a stay at home and gives up one away from it, and a look ends a stay hanging back to the viewer", () => {
    expect(stayAtHome({where: "edge", until: 50, along: {x: 1, y: 0}})).toEqual({where: "edge", until: 50, along: {x: 1, y: 0}});
    expect(stayAtHome({where: "seat", until: 50})).toEqual({where: "seat", until: 50});
    expect(stayAtHome({where: "bubble", until: 50, perch: {}})).toEqual({where: "seat", until: 0});
    const stay = {where: "bubble", until: 50, perch: {}};
    expect(stayForLook(stay, {posture: "hang", face: 180}).until).toBe(0);
    expect(stayForLook(stay, {posture: "hang", face: 0})).toBe(stay);
    expect(stayForLook(stay, {posture: "sit", face: 60})).toBe(stay);
});

test("the figure goes home to sit while its agent cannot act, keeps a stay until it is over, and then draws the next", () => {
    const counts = {question: 0, waiting: 0, suggestion: 0};
    const at = {state: "idle", counts, now: 100, near: {x: 640, y: 800}, figure: FIGURE, hands: HANDS};
    const resting = targetFor({...at, state: "asleep", stay: {where: "edge", until: 500, along: {x: 0, y: 0}}});
    expect(resting.spot).toMatchObject({posture: "sit", y: 800});
    const edge = {where: "edge", until: 500, along: {x: 0, y: 0}};
    expect(targetFor({...at, stay: edge})).toMatchObject({stay: edge, spot: {posture: "stand"}});
    const next = targetFor({...at, stay: {...edge, until: 50}, random: () => 0});
    expect(next.stay).toMatchObject({where: ROAMS[0].where, until: 100 + ROAMS[0].stay[0]});
});

test("a perch that would put any part of the figure past the edge of its world is refused", () => {
    const edge = at(300, 1000, 1270);
    expect(perchSpot({bubble: edge, kind: SITS, side: "right", grip: ""}, THREAD, FIGURE)).toBe(null);
    expect(perchSpot({bubble: edge, kind: HANGS, side: "right", grip: "r", face: 0}, THREAD, FIGURE)).toBe(null);
    expect(perchSpot({bubble: edge, kind: SITS, side: "left", grip: ""}, THREAD, FIGURE)).toMatchObject({posture: "sit"});
});

test("with something waiting on the user the figure keeps its stay rather than go to a tab outside its world, and points from one inside", () => {
    const tab = {
        dataset: {tab: "question"},
        getAttribute: () => "false",
        getBoundingClientRect: () => ({left: 1250, right: 1280, width: 30, top: -40, bottom: -10}),
    };
    document.querySelector = (selector) => (selector === '[data-tab="question"]' ? tab : null);
    document.querySelectorAll = (selector) => (selector === "[data-tab]" ? [tab] : []);
    const edge = {where: "edge", until: 500, along: {x: 0, y: 0}};
    const at = {
        state: "idle",
        counts: {question: 2, waiting: 0, suggestion: 0},
        now: 100,
        near: {x: 640, y: 800},
        figure: FIGURE,
        hands: HANDS,
        stay: edge,
    };
    expect(targetFor(at)).toMatchObject({stay: edge, spot: {posture: "stand", view: null, y: 800}});
    tab.getBoundingClientRect = () => ({left: 600, right: 640, width: 40, top: 400, bottom: 430});
    expect(targetFor(at)).toMatchObject({stay: edge, spot: {y: 400, view: "question", on: tab}});
});

test("a click sends the figure out of the box it was in, to a spot at home clear of it, until the box has been clear a while", () => {
    const asleep = {state: "asleep", counts: {}, now: 100, near: {x: 1200, y: 800}, figure: FIGURE, hands: HANDS};
    const seat = targetFor({...asleep, stay: {where: "seat", until: 0}}).spot;
    const {stay, cleared} = stepAside({where: "edge", until: 500}, boxAt(seat, FIGURE), 100);
    expect(stay.until).toBe(0);
    // an agent that cannot act keeps its figure seated, on the other corner
    const away = targetFor({...asleep, stay, cleared}).spot;
    expect(away.posture).toBe("sit");
    expect(overlaps(boxAt(away, FIGURE), cleared.box)).toBe(false);
    expect(targetFor({...asleep, stay, cleared, now: 100 + CLEARED_SECONDS}).spot).toEqual(seat);
    // one that roams goes wherever its next stay takes it, but never back over the box it was clicked out of
    for (const roll of [0, 0.3, 0.6, 0.99]) {
        const roams = {...asleep, state: "idle", stay, cleared, random: () => roll};
        expect(overlaps(boxAt(targetFor(roams).spot, FIGURE), cleared.box), `roll ${roll}`).toBe(false);
    }
});
