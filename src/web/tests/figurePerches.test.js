// @vitest-environment node
import {beforeEach, expect, test} from "vitest";

const {CLEARED_SECONDS, HANGS, HANG_SHARE, ROAMS, STANDS, perchOn, perchSpot, roamNext, stayAtHome, stayForLook, stepAside, targetFor} =
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

// a bubble's floor, as figure/floors.js reads it, and the floors snapshot that holds the bubbles given, in the thread's view
let issued = 0;
const bubble = (rect) => ({id: `bubble-${++issued}`, kind: "bubble", element: {rect}, ...rect});
const floorsOf = (...bubbles) => ({view: THREAD, floors: bubbles});
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
    expect(perchOn(floorsOf(high, older, newest, low), FIGURE, HANDS, () => 0).floor).toBe(newest.id);
    expect(perchOn(floorsOf(high, older, low), FIGURE, HANDS, () => 0).floor).toBe(older.id);
    expect(perchOn(floorsOf(high, low), FIGURE, HANDS, () => 0)).toBe(null);
});

test("a perch whose figure would hide words is not taken: it hangs beside the bubble instead, or takes an older bubble", () => {
    const older = at(300);
    const newest = at(500);
    // words just above the newest bubble's right corner, where a seated body rises and a hanging one does not reach
    write([{left: 470, right: 520, top: 440, bottom: 470}]);
    expect(perchOn(floorsOf(older, newest), FIGURE, HANDS, () => 0.99)).toMatchObject({floor: newest.id, kind: HANGS});
    expect(perchOn(floorsOf(older, newest), FIGURE, [], () => 0.99)).toMatchObject({floor: older.id, kind: STANDS});
    expect(perchSpot({floor: newest.id, kind: STANDS, side: "right", grip: ""}, floorsOf(older, newest), FIGURE)).toBe(null);
});

test("it perches on the side of a bubble with more room outside it, and hangs or stands on its corner as the roll says", () => {
    expect(perchOn(floorsOf(at(300, 260, 500)), FIGURE, HANDS, () => 0).side).toBe("right");
    expect(perchOn(floorsOf(at(300, 450, 690)), FIGURE, HANDS, () => 0).side).toBe("left");
    expect(perchOn(floorsOf(at(300)), FIGURE, HANDS, fixed(0)).kind).toBe(HANGS);
    expect(perchOn(floorsOf(at(300)), FIGURE, HANDS, fixed(HANG_SHARE)).kind).toBe(STANDS);
    expect(perchOn(floorsOf(at(300)), FIGURE, [], fixed(0)).kind).toBe(STANDS);
});

test("a hanging figure grips the roomy corner with the hand on its side, or turns to face the bubble to grip it with its one free hand", () => {
    const right = perchOn(floorsOf(at(300, 260, 500)), FIGURE, HANDS, fixed(0));
    expect([right.grip, right.side, right.face]).toEqual(["r", "right", 0]);
    const left = perchOn(floorsOf(at(300, 450, 690)), FIGURE, HANDS, fixed(0));
    expect([left.grip, left.side, left.face]).toEqual(["l", "left", 0]);
    const only = at(300, 260, 500);
    const one = perchOn(floorsOf(only), FIGURE, ["l"], fixed(0));
    expect([one.grip, one.side, one.face]).toEqual(["l", "right", 180]);
    expect(perchSpot(one, floorsOf(only), FIGURE)).toMatchObject({face: 180, posture: "hang"});
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
    expect(new Set(ROAMS.map((each) => each.where))).toEqual(new Set(["rest", "edge", "bubble", "tab"]));
});

test("mostly the figure strolls along the compose box's edge and sits on its corners, and no stay keeps it still for long", () => {
    const odds = Object.fromEntries(ROAMS.map((each) => [each.where, each.odds]));
    expect(odds.edge).toBe(Math.max(...Object.values(odds)));
    expect(odds.edge + odds.rest).toBeGreaterThanOrEqual(0.7);
    expect(Math.max(...ROAMS.map((each) => each.stay[1]))).toBeLessThanOrEqual(40);
});

test("a figure standing on a corner or hanging stands where its bubble's corner is, and is let go when the bubble leaves the thread's view or the page", () => {
    const one = at(300, 260, 500);
    const sitting = {floor: one.id, kind: STANDS, side: "right", grip: ""};
    const hanging = {...sitting, kind: HANGS, grip: "r", face: 0};
    expect(perchSpot(sitting, floorsOf(one), FIGURE).face).toBe(60);
    expect(perchSpot(sitting, floorsOf(one), FIGURE).on).toBe(one.element);
    // its hips sit over the bubble's padding, inside the corner by less than the padding, so its legs hang clear of the words
    expect(500 - perchSpot(sitting, floorsOf(one), FIGURE).x).toBeLessThan(7);
    expect(perchSpot(hanging, floorsOf(one), FIGURE)).toMatchObject({face: 0});
    expect(perchSpot(hanging, floorsOf(one), FIGURE).x).toBeGreaterThan(500);
    expect(perchSpot(hanging, floorsOf(one), FIGURE)).toMatchObject({y: 300, posture: "hang", grip: "r"});
    const high = at(105);
    expect(perchSpot({...sitting, floor: high.id}, floorsOf(high), FIGURE)).toBe(null);
    expect(perchSpot(sitting, floorsOf(), FIGURE)).toBe(null);
});

test("when its ground goes the figure keeps a stay at home and gives up one away from it, and a look ends a stay hanging back to the viewer", () => {
    expect(stayAtHome({where: "edge", until: 50, along: {x: 1, y: 0}})).toEqual({where: "edge", until: 50, along: {x: 1, y: 0}});
    expect(stayAtHome({where: "rest", until: 50})).toEqual({where: "rest", until: 50});
    expect(stayAtHome({where: "bubble", until: 50, perch: {}})).toEqual({where: "rest", until: 0});
    const stay = {where: "bubble", until: 50, perch: {}};
    expect(stayForLook(stay, {posture: "hang", face: 180}).until).toBe(0);
    expect(stayForLook(stay, {posture: "hang", face: 0})).toBe(stay);
    expect(stayForLook(stay, {posture: "sit", face: 60})).toBe(stay);
});

test("the figure goes home to rest while its agent cannot act, keeps a stay until it is over, and then draws the next", () => {
    const counts = {question: 0, waiting: 0, suggestion: 0};
    const at = {state: "idle", counts, now: 100, near: {x: 640, y: 800}, figure: FIGURE, hands: HANDS};
    const resting = targetFor({...at, state: "asleep", stay: {where: "edge", until: 500, along: {x: 0, y: 0}}});
    expect(resting.spot).toMatchObject({posture: "stand", y: 800});
    const edge = {where: "edge", until: 500, along: {x: 0, y: 0}};
    expect(targetFor({...at, stay: edge})).toMatchObject({stay: edge, spot: {posture: "stand"}});
    const next = targetFor({...at, stay: {...edge, until: 50}, random: () => 0});
    expect(next.stay).toMatchObject({where: ROAMS[0].where, until: 100 + ROAMS[0].stay[0]});
});

test("a perch that would put any part of the figure past the edge of its world is refused", () => {
    const edge = at(300, 1000, 1270);
    expect(perchSpot({floor: edge.id, kind: STANDS, side: "right", grip: ""}, floorsOf(edge), FIGURE)).toBe(null);
    expect(perchSpot({floor: edge.id, kind: HANGS, side: "right", grip: "r", face: 0}, floorsOf(edge), FIGURE)).toBe(null);
    expect(perchSpot({floor: edge.id, kind: STANDS, side: "left", grip: ""}, floorsOf(edge), FIGURE)).toMatchObject({posture: "stand"});
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
    const seat = targetFor({...asleep, stay: {where: "rest", until: 0}}).spot;
    const {stay, cleared} = stepAside({where: "edge", until: 500}, boxAt(seat, FIGURE), 100);
    expect(stay.until).toBe(0);
    // an agent that cannot act keeps its figure resting, on the other corner
    const away = targetFor({...asleep, stay, cleared}).spot;
    expect(away.posture).toBe("stand");
    expect(overlaps(boxAt(away, FIGURE), cleared.box)).toBe(false);
    expect(targetFor({...asleep, stay, cleared, now: 100 + CLEARED_SECONDS}).spot).toEqual(seat);
    // one that roams goes wherever its next stay takes it, but never back over the box it was clicked out of
    for (const roll of [0, 0.3, 0.6, 0.99]) {
        const roams = {...asleep, state: "idle", stay, cleared, random: () => roll};
        expect(overlaps(boxAt(targetFor(roams).spot, FIGURE), cleared.box), `roll ${roll}`).toBe(false);
    }
});

test("a hang whose feet would reach the ground at home is no perch, since the figure would let go the moment it landed and roll it again", () => {
    const low = at(560);
    const home = {id: "home", kind: "home", element: {}, left: 250, right: 700, top: 600, bottom: 660};
    expect(perchSpot({floor: low.id, kind: HANGS, side: "right", grip: "r", face: 0}, floorsOf(low, home), FIGURE)).toBe(null);
    expect(perchSpot({floor: low.id, kind: STANDS, side: "right", grip: ""}, floorsOf(low, home), FIGURE)).toMatchObject({posture: "stand"});
    expect(perchSpot({floor: low.id, kind: HANGS, side: "right", grip: "r", face: 0}, floorsOf(low), FIGURE)).toMatchObject({posture: "hang"});
});
