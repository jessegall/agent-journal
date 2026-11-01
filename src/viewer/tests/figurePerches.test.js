// @vitest-environment node
import {beforeEach, expect, test} from "vitest";

const {CLEARED_SECONDS, HANGS, LEDGE_ALONG, LEDGE_SLANT, LEDGE_WIDTH, STANDS, climbOf, discoBall, ledgeSpot, perchOn, phoneSide, swingFloors, swingSpot, wayUp, perchSpot, roamNext, stayAtHome, stayForLook, stepAside, targetFor} =
    await import("../src/figure/perches.js");
const {HANG: HANG_COOLDOWN, PILE, SHOWPIECES, choicesFor} = await import("../src/figure/pile.js");
const {ACTS} = await import("../src/figure/acts.js");
const {JUMP, POGO, climbStops, heightOf, jumpMost, pogoClimb} = await import("../src/figure/climbs.js");
const {legAt} = await import("../src/domain/figureMotion.js");

// the pile's places to roam to, and its share of perches that are a hang
// the places the figure roams to while it waits, with nothing to do
const ROAMS = PILE.filter((entry) => entry.when.moment === "roam" && entry.when.free !== false);
const [HANG, STAND] = PILE.filter((entry) => entry.when.moment === "perch");
const HANG_SHARE = HANG.weight / (HANG.weight + STAND.weight);
const {FEET_INBOARD, SEAT_INBOARD, boxAt, overlaps, tripTo} = await import("../src/figure/places.js");
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
    expect(perchOn(floorsOf(older, newest), FIGURE, HANDS, () => 0.99, {free: true})).toMatchObject({floor: newest.id, kind: HANGS});
    expect(perchOn(floorsOf(older, newest), FIGURE, [], () => 0.99)).toMatchObject({floor: older.id, kind: STANDS});
    expect(perchSpot({floor: newest.id, kind: STANDS, side: "right", grip: ""}, floorsOf(older, newest), FIGURE)).toBe(null);
});

test("it perches on the side of a bubble with more room outside it, and hangs or stands on its corner as the roll says", () => {
    expect(perchOn(floorsOf(at(300, 260, 500)), FIGURE, HANDS, () => 0).side).toBe("right");
    expect(perchOn(floorsOf(at(300, 450, 690)), FIGURE, HANDS, () => 0).side).toBe("left");
    expect(perchOn(floorsOf(at(300)), FIGURE, HANDS, fixed(0), {free: true}).kind).toBe(HANGS);
    expect(perchOn(floorsOf(at(300)), FIGURE, HANDS, fixed(HANG_SHARE), {free: true}).kind).toBe(STANDS);
    expect(perchOn(floorsOf(at(300)), FIGURE, [], fixed(0)).kind).toBe(STANDS);
});

test("it hangs from a bubble's side at most once every two minutes, drawn or as the stand's fallback, and may hang again after", () => {
    expect(HANG_COOLDOWN.every).toBe(120);
    const memory = new Map();
    const perch = (now, random = fixed(0)) => perchOn(floorsOf(at(300)), FIGURE, HANDS, random, {memory, now, free: true}).kind;
    const kinds = [10, 40, 70, 100, 129].map((now) => perch(now));
    expect(kinds.filter((kind) => kind === HANGS).length, "one hang in two minutes, drawn every time").toBe(1);
    expect(perch(130), "a hang possible again two minutes after").toBe(HANGS);
    // the stand drawn but no room for it on the newest bubble: the hang it falls back to counts as one, and is not taken while it cools
    const words = new Map();
    const older = at(300);
    const newest = at(500);
    write([{left: 470, right: 520, top: 440, bottom: 470}]);
    const fallback = (now) => perchOn(floorsOf(older, newest), FIGURE, HANDS, () => 0.99, {memory: words, now, free: true});
    expect(fallback(0)).toMatchObject({floor: newest.id, kind: HANGS});
    expect(fallback(60)).toMatchObject({floor: older.id, kind: STANDS});
    expect(fallback(120)).toMatchObject({floor: newest.id, kind: HANGS});
});

test("a hanging figure grips the roomy corner with the hand on its side, or turns to face the bubble to grip it with its one free hand", () => {
    const right = perchOn(floorsOf(at(300, 260, 500)), FIGURE, HANDS, fixed(0), {free: true});
    expect([right.grip, right.side, right.face]).toEqual(["r", "right", 0]);
    const left = perchOn(floorsOf(at(300, 450, 690)), FIGURE, HANDS, fixed(0), {free: true});
    expect([left.grip, left.side, left.face]).toEqual(["l", "left", 0]);
    const only = at(300, 260, 500);
    const one = perchOn(floorsOf(only), FIGURE, ["l"], fixed(0), {free: true});
    expect([one.grip, one.side, one.face]).toEqual(["l", "right", 180]);
    expect(perchSpot(one, floorsOf(only), FIGURE)).toMatchObject({face: 180, posture: "hang"});
});

test("every place the figure roams to comes up by its odds and is stayed at between its shortest and longest stay", () => {
    const total = ROAMS.reduce((sum, each) => sum + each.weight, 0);
    let before = 0;
    for (const each of ROAMS) {
        const middle = (before + each.weight / 2) / total;
        expect(roamNext(fixed(middle, 0), {free: true, room: Infinity, swings: true})).toEqual({where: each.name, stay: each.stay[0]});
        expect(roamNext(fixed(middle, 1), {free: true, room: Infinity, swings: true}).stay).toBe(each.stay[1]);
        before += each.weight;
    }
    expect(new Set(ROAMS.map((each) => each.name))).toEqual(new Set(["rest", "seat", "edge", "bubble", "tab", "ledge", "composed", "lean", "rope_swing"]));
});

test("mostly the figure rests on a corner of the compose box or strolls along its edge, and no stay keeps it still for long", () => {
    // of its everyday stays, the showpieces like the rope swing coming only once their long cooldown is over
    const everyday = ROAMS.filter((each) => !each.cooldown);
    const total = everyday.reduce((sum, each) => sum + each.weight, 0);
    const odds = Object.fromEntries(everyday.map((each) => [each.name, each.weight / total]));
    // it rests more than it strolls, as it walked about too much to be seen doing anything (task 2652)
    expect(odds.rest).toBe(Math.max(...Object.values(odds)));
    expect(odds.edge + odds.rest).toBeGreaterThan(0.5);
    // now and then it sits on a corner, less often than it stands there
    expect(odds.seat).toBeGreaterThan(0);
    expect(odds.seat).toBeLessThan(odds.rest);
    // it rests a while and rides a bubble up, but no stay keeps it still for long
    expect(Math.max(...ROAMS.map((each) => each.stay[1]))).toBeLessThanOrEqual(80);
});

test("a figure standing on a corner or hanging stands where its bubble's corner is, and is let go when the bubble leaves the thread's view or the page", () => {
    const one = at(300, 260, 500);
    const sitting = {floor: one.id, kind: STANDS, side: "right", grip: ""};
    const hanging = {...sitting, kind: HANGS, grip: "r", face: 0};
    expect(perchSpot(sitting, floorsOf(one), FIGURE).face).toBe(60);
    expect(perchSpot(sitting, floorsOf(one), FIGURE).on).toBe(one.element);
    // standing on the corner it keeps both feet on the bubble, its middle half its body and a margin inside the end
    expect(500 - perchSpot(sitting, floorsOf(one), FIGURE).x).toBeCloseTo(FEET_INBOARD * FIGURE.size, 5);
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
    expect(next.stay).toMatchObject({where: ROAMS[0].name, until: 100 + ROAMS[0].stay[0]});
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
    // a tab inside it past its jump is one it points at from where it is, as the pogo stick goes only onto a bubble's top
    for (const top of [200, 400]) {
        tab.getBoundingClientRect = () => ({left: 600, right: 640, width: 40, top, bottom: top + 30});
        expect(targetFor(at)).toMatchObject({stay: edge, spot: {y: 800, view: null}});
    }
    tab.getBoundingClientRect = () => ({left: 600, right: 640, width: 40, top: 640, bottom: 670});
    expect(targetFor(at)).toMatchObject({stay: edge, spot: {y: 640, view: "question", on: tab}});
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

test("while its agent runs a test suite or a build and the run was granted a unit, the figure goes down onto the compose box's top to build, under any bars docked over it, beside its parcel", () => {
    const box = (rect) => ({...rect, width: rect.right - rect.left, height: rect.bottom - rect.top});
    const bars = {getBoundingClientRect: () => box({left: 300, right: 900, top: 640, bottom: 700}), querySelector: () => null};
    const thread = {querySelector: (selector) => (selector === "[data-figure-docked-bars]" ? bars : null), getBoundingClientRect: () => box({left: 250, right: 950, top: 0, bottom: 800})};
    const home = {getBoundingClientRect: () => box({left: 300, right: 900, top: 700, bottom: 780}), closest: () => thread};
    document.querySelector = (selector) => (selector === "[data-figure-home]" ? home : null);
    const running = {state: "testing", counts: {question: 1, waiting: 0, suggestion: 0}, now: 100, near: {x: 800, y: 640}, figure: FIGURE, hands: HANDS, stay: {where: "rest", until: 0}, work: {beside: 0}};
    const spot = targetFor(running).spot;
    // with no unit granted it does not go to build at all
    expect(targetFor({...running, work: null}).spot.stays).toBeUndefined();
    expect(spot).toMatchObject({y: 700, posture: "stand", on: home, stays: true, view: null});
    // a box the figure was clicked out of does not move it from where it builds
    const cleared = {box: boxAt(spot, FIGURE), until: 200};
    expect(targetFor({...running, cleared}).spot).toEqual(spot);
    expect(targetFor({...running, work: {x: 528, beside: -28}}).spot).toMatchObject({x: 528, y: 700, stays: true});
    // a parcel left to push takes the figure onto the compose box's top whatever its agent does
    expect(targetFor({...running, state: "thinking", work: {x: 610}}).spot).toMatchObject({x: 610, y: 700, stays: true});
    // a new parcel is built clear of the pile at the floor's right end
    const clear = targetFor({...running, work: {beside: 28, before: 700}}).spot;
    expect(clear.x + 28 + 24).toBeLessThan(700);
    expect(targetFor({...running, state: "thinking", work: null}).spot.stays).toBeUndefined();
});

test("now and then the figure sits at a corner, a little in from the end, turned out along the edge with its legs over the end, and sits there at its laptop while its agent edits", () => {
    const box = (rect) => ({...rect, width: rect.right - rect.left, height: rect.bottom - rect.top});
    const thread = {querySelector: () => null, getBoundingClientRect: () => box({left: 236, right: 778, top: 0, bottom: 900})};
    const home = {getBoundingClientRect: () => box({left: 258, right: 754, top: 768, bottom: 888}), closest: () => thread};
    document.querySelector = (selector) => (selector === "[data-figure-home]" ? home : null);
    const at = {counts: {question: 0, waiting: 0, suggestion: 0}, now: 100, figure: FIGURE, hands: HANDS};
    // a stay sitting: on the corner nearest, a little in from its end, turned out along the edge, its legs over the end
    const right = targetFor({...at, state: "idle", near: {x: 700, y: 768}, stay: {where: "seat", until: 500}}).spot;
    expect(right).toMatchObject({x: 754 - SEAT_INBOARD * FIGURE.size, y: 768, posture: "sit", face: 70, on: home});
    const left = targetFor({...at, state: "idle", near: {x: 300, y: 768}, stay: {where: "seat", until: 500}}).spot;
    expect(left).toMatchObject({x: 258 + SEAT_INBOARD * FIGURE.size, posture: "sit", face: 290});
    // its body inside the chat, only the empty side of its picture over the end
    expect(boxAt(right, FIGURE).left + 0.65 * FIGURE.size).toBeLessThanOrEqual(778);
    expect(SEAT_INBOARD).toBeLessThan(FEET_INBOARD);
    // editing, it goes to sit at its laptop on a corner
    expect(targetFor({...at, state: "writing", near: {x: 700, y: 768}, stay: {where: "edge", until: 500, along: {x: 400, y: 0}}}).spot).toMatchObject({posture: "sit", x: 754 - SEAT_INBOARD * FIGURE.size});
});

test("resting by its parcel pile the figure stands beside it, never in front of the parcels, and may sit on the edge there", () => {
    const box = (rect) => ({...rect, width: rect.right - rect.left, height: rect.bottom - rect.top});
    const thread = {querySelector: () => null, getBoundingClientRect: () => box({left: 236, right: 778, top: 0, bottom: 900})};
    const home = {getBoundingClientRect: () => box({left: 258, right: 754, top: 768, bottom: 888}), closest: () => thread};
    document.querySelector = (selector) => (selector === "[data-figure-home]" ? home : null);
    const pile = {left: 691, right: 740, top: 768};
    const at = {state: "idle", counts: {question: 0, waiting: 0, suggestion: 0}, now: 100, figure: FIGURE, hands: HANDS, near: {x: 720, y: 768}, pile};
    const body = (spot) => [spot.x - 0.15 * FIGURE.size, spot.x + 0.15 * FIGURE.size];
    // the corner it rests on stands where the pile is: it stands beside the pile instead
    const plain = targetFor({...at, pile: null, stay: {where: "rest", until: 500}}).spot;
    expect(body(plain)[1]).toBeGreaterThan(pile.left);
    const beside = targetFor({...at, stay: {where: "rest", until: 500}}).spot;
    expect(beside).toMatchObject({posture: "stand", y: 768});
    expect(body(beside)[1]).toBeLessThanOrEqual(pile.left);
    // sitting on the edge by the pile is left as it is
    expect(targetFor({...at, stay: {where: "seat", until: 500}}).spot).toMatchObject({posture: "sit", x: 754 - SEAT_INBOARD * FIGURE.size});
    // a figure standing on another floor is not moved
    expect(targetFor({...at, pile: {...pile, top: 600}, stay: {where: "rest", until: 500}}).spot.x).toBe(plain.x);
});

test("now and then the figure sits down halfway or a third or two thirds along a floor, never near an end, on the composer slanted toward its nearer end", () => {
    const box = (rect) => ({...rect, width: rect.right - rect.left, height: rect.bottom - rect.top});
    const thread = {querySelector: () => null, getBoundingClientRect: () => box({left: 236, right: 778, top: 0, bottom: 900})};
    const home = {getBoundingClientRect: () => box({left: 258, right: 754, top: 768, bottom: 888}), closest: () => thread};
    document.querySelector = (selector) => (selector === "[data-figure-home]" ? home : null);
    const width = 754 - 258;
    // the only places along are the middle, a third and two thirds, so it is always a third of the floor or more from either end
    expect([...LEDGE_ALONG].sort()).toEqual([1 / 3, 1 / 2, 2 / 3].sort());
    for (const along of LEDGE_ALONG) {
        const spot = ledgeSpot(along, FIGURE, {on: home});
        expect(spot).toMatchObject({x: 258 + width * along, y: 768, posture: "sit", face: along <= 0.5 ? 360 - LEDGE_SLANT : LEDGE_SLANT, leans: true, on: home});
        expect(Math.min(spot.x - 258, 754 - spot.x)).toBeGreaterThanOrEqual(width / 3 - 1e-9);
    }
    // a stay on the ledge takes the figure there
    const at = {state: "idle", counts: {question: 0, waiting: 0, suggestion: 0}, now: 100, figure: FIGURE, hands: HANDS, near: {x: 300, y: 768, on: home}};
    expect(targetFor({...at, stay: {where: "ledge", until: 500, along: 1 / 3}}).spot).toMatchObject({x: 258 + width * (1 / 3), posture: "sit"});
    // where its body would hide words it takes another of the three places, never one nearer an end
    write([{left: 258 + width / 2 - 60, right: 258 + width / 2 + 60, top: 700, bottom: 760}]);
    expect(ledgeSpot(1 / 2, FIGURE, {on: home}).x).toBe(258 + width * (1 / 3));
    // a floor too short to sit a third along with room to spare is no ledge
    home.getBoundingClientRect = () => box({left: 258, right: 258 + LEDGE_WIDTH * FIGURE.size - 1, top: 768, bottom: 888});
    expect(ledgeSpot(1 / 2, FIGURE, {on: home})).toBe(null);
});

test("no jump goes higher than its one limit: a climb is as many hops as its height needs, each onto a bubble on the way, and a salto turns only on a jump up", () => {
    const most = jumpMost(FIGURE);
    expect(most).toBeCloseTo(JUMP.most * (1 - FIGURE.below - 0.15) * FIGURE.size);
    // footholds a bubble's height apart, as a thread's bubbles stand, from the ground at 800 up
    const holds = Array.from({length: 12}, (_, index) => ({x: 300 + (index % 2) * 120, y: 740 - index * 60}));
    const from = {x: 300, y: 800};
    const counts = [];
    for (const height of [100, 300, 520, 700]) {
        const stops = climbStops(from, from.y - height, holds, most);
        const feet = [from, ...stops, {y: from.y - height}];
        for (let hop = 1; hop < feet.length; hop++) {
            expect(feet[hop - 1].y - feet[hop].y, `${height}: hop ${hop}`).toBeLessThanOrEqual(most);
            expect(feet[hop].y).toBeLessThan(feet[hop - 1].y);
        }
        counts.push(feet.length - 1);
    }
    // the higher the climb the more hops, never a fixed count
    expect(counts).toEqual([...counts].sort((a, b) => a - b));
    expect(new Set(counts).size).toBe(counts.length);
    expect(counts[0]).toBe(1);
    // with no foothold in reach on the way a climb too high for one hop is refused, and one in reach is a single hop
    expect(climbStops(from, from.y - most - 1, [], most)).toBe(null);
    expect(climbStops(from, from.y - most + 1, [], most)).toEqual([]);
    // on the page the footholds are the bubbles' corners, and a trip up hops from each to the next, never higher than the limit
    const floors = floorsOf(at(560), at(400, 420, 660), at(240));
    const via = climbOf(floors, FIGURE, {x: 300, y: 660}, 240);
    expect(via.length).toBeGreaterThan(0);
    const top = perchSpot({floor: floors.floors[2].id, kind: STANDS, side: "right", grip: ""}, floors, FIGURE);
    const legs = tripTo({x: 300, y: 660, posture: "stand"}, top, FIGURE, {via}).legs;
    const hops = legs.filter((leg) => leg.hopping);
    expect(hops.length).toBe(via.length + 1);
    hops.reduce((y, hop) => (expect(y - hop.y).toBeLessThanOrEqual(most), hop.y), legs[0].y);
    expect(climbOf(floorsOf(at(240)), FIGURE, {x: 300, y: 660}, 240)).toBe(null);
    // the salto is no idle act any more: it only turns now and then on a high jump up onto a bubble
    expect(PILE.filter((entry) => entry.name === "salto")).toEqual([]);
    expect(PILE.filter((entry) => entry.name === "backflip").map((entry) => entry.when)).toEqual([{moment: "jump", high: true}]);
    expect(choicesFor({moment: "jump", high: false}).map((entry) => entry.name)).toEqual(["jump"]);
});

test("now and then the figure swings on a rope tied under a bubble near the middle of the chat, never under one too near its side", () => {
    // a bubble near the middle: the seat hangs a rope's length below the middle of its bottom edge, the figure on it facing the viewer
    const middle = bubble({left: 500, right: 780, top: 300, bottom: 360});
    const spot = swingSpot(middle, FIGURE, floorsOf(middle));
    expect(spot).toMatchObject({x: 640, y: 360 + ACTS.rope_swing.rope * FIGURE.size, posture: "sit", face: 0, swings: true, on: middle.element});
    // its knots stand at least `room` of the figure's height in from the chat's sides and on the bubble's edge: under a bubble near a side
    // it hangs as far in along the edge as that takes, and under one that ends before that, not at all
    const {room, ties} = ACTS.rope_swing;
    for (const side of [bubble({left: 10, right: 150, top: 300, bottom: 360}), bubble({left: 1150, right: 1270, top: 300, bottom: 360})]) {
        const near = swingSpot(side, FIGURE, floorsOf(side));
        expect(Math.min(near.x, 1280 - near.x)).toBeCloseTo(room * FIGURE.size, 6);
        expect(near.x - (ties * FIGURE.size) / 2).toBeGreaterThanOrEqual(side.left);
        expect(near.x + (ties * FIGURE.size) / 2).toBeLessThanOrEqual(side.right);
    }
    const narrow = bubble({left: 10, right: 100, top: 300, bottom: 360});
    expect(swingSpot(narrow, FIGURE, floorsOf(narrow))).toBe(null);
    // nor one so low that the figure's legs would hang below the ground at home
    const home = {id: "home", kind: "compose", left: 260, right: 1000, top: 440};
    expect(swingSpot(middle, FIGURE, floorsOf(middle, home))).toBe(null);
    // it is a showpiece of the pile, for the idle figure under a bubble it may swing from, waiting fifteen minutes before it swings again
    const entry = PILE.find((each) => each.name === "rope_swing");
    expect(entry).toMatchObject({when: {moment: "roam", free: true, swings: true}, cooldown: SHOWPIECES.rope_swing, shenanigan: true});
    expect(SHOWPIECES.rope_swing).toBe(15 * 60);
    const offers = (scene) => choicesFor({moment: "roam", free: true, room: Infinity, ...scene}).some((each) => each.name === "rope_swing");
    expect(offers({swings: false})).toBe(false);
    const memory = new Map([["roam/rope_swing", 0]]);
    expect(offers({swings: true, memory, now: 600})).toBe(false);
    expect(offers({swings: true, memory, now: 900})).toBe(true);
});

test("the swing hangs only where a bubble's edge overhangs no bubble below it, so it swings free, never under one with a bubble below", () => {
    const {seat, clearance, rope} = ACTS.rope_swing;
    // the chat's last bubble has nothing below it: the swing hangs from the middle of its edge
    const above = bubble({left: 300, right: 900, top: 200, bottom: 260});
    const last = bubble({left: 300, right: 900, top: 272, bottom: 340});
    expect(swingSpot(last, FIGURE, floorsOf(above, last))).toMatchObject({x: 600, y: 340 + rope * FIGURE.size});
    // one with a bubble below it as wide as it has no overhang, and is offered no swing
    expect(swingSpot(above, FIGURE, floorsOf(above, last))).toBe(null);
    expect(swingFloors(floorsOf(above, last), FIGURE).map((floor) => floor.id)).toEqual([last.id]);
    // one whose edge overhangs a narrower bubble below hangs it on the overhang, as near the middle as clears that bubble by the seat's
    // half width plus the room kept around its arc
    const wide = bubble({left: 260, right: 900, top: 200, bottom: 260});
    const reply = bubble({left: 560, right: 1000, top: 272, bottom: 340});
    const spot = swingSpot(wide, FIGURE, floorsOf(wide, reply));
    const box = boxAt(spot, FIGURE);
    const reach = ((seat * FIGURE.size) / 2) * (1 + clearance);
    expect(spot.x).toBeCloseTo(reply.left - reach, 6);
    expect(spot.x).toBeLessThan((wide.left + wide.right) / 2);
    // a bubble below beside the swing's reach leaves it at the middle, as a bubble below further than the figure hangs
    const beside = bubble({left: 700, right: 1000, top: 272, bottom: 340});
    expect(swingSpot(wide, FIGURE, floorsOf(wide, beside)).x).toBe((wide.left + wide.right) / 2);
    const front = wide.bottom + (box.bottom - wide.bottom) * (1 + clearance);
    const far = bubble({left: 260, right: 900, top: front + 1, bottom: front + 60});
    expect(swingSpot(wide, FIGURE, floorsOf(wide, far)).x).toBe((wide.left + wide.right) / 2);
});

test("one limit of two and a half of its heights holds every plain jump: no hop or hang from a bubble's side is chosen higher above the feet, and one just under it still is", () => {
    const tall = heightOf(FIGURE);
    expect(JUMP.most).toBe(2.5);
    const from = {x: 400, y: 700};
    const under = at(700 - 2.45 * tall, 330, 470);
    const over = at(700 - 2.55 * tall, 330, 470);
    const onTop = (floor) => ({x: 400, y: floor.top, posture: "stand", on: floor.element});
    const hanging = (floor) => ({x: floor.right + 0.3 * FIGURE.size, y: floor.top, posture: "hang", grip: "r", face: 0, on: floor.element});
    // a hop onto its top, the roll keeping off the stick
    expect(wayUp(floorsOf(under), FIGURE, from, onTop(under), {room: Infinity}, () => 0.99), "a hop just under the limit").toEqual({via: [], pogo: false});
    expect(wayUp(floorsOf(over), FIGURE, from, onTop(over), {room: Infinity}, () => 0.99), "no hop just over it").toBe(null);
    // under half the chat's height, the roll for the stick still hops, and no higher
    expect(wayUp(floorsOf(under), FIGURE, from, onTop(under), {room: Infinity}, () => 0), "the roll for the stick just under the limit").toEqual({via: [], pogo: false});
    expect(wayUp(floorsOf(over), FIGURE, from, onTop(over), {room: Infinity}, () => 0), "nor just over it").toBe(null);
    // a reach up to hang from its side, the grip at its top
    expect(wayUp(floorsOf(under), FIGURE, from, hanging(under), {room: Infinity}, () => 0), "a hang just under the limit").toEqual({via: [], pogo: false});
    expect(wayUp(floorsOf(over), FIGURE, from, hanging(over), {room: Infinity}, () => 0), "no hang just over it").toBe(null);
    // every hop of a climb in steps keeps to the limit too
    const high = at(700 - 4.5 * tall, 330, 470);
    const steps = floorsOf(at(700 - 2.3 * tall, 330, 470), high);
    const way = wayUp(steps, FIGURE, from, onTop(high), {room: Infinity}, () => 0.99);
    const stops = [from, ...way.via, {y: high.top}];
    stops.slice(1).forEach((stop, index) => expect(stops[index].y - stop.y, `step ${index}`).toBeLessThanOrEqual(jumpMost(FIGURE)));
});

test("the disco dance plays only standing on a bubble with another above it to hang the ball from, and then only on a rare occasion", () => {
    const tall = heightOf(FIGURE);
    // standing on a bubble with another above it, near enough and with room between for the ball: the ball hangs from that one's bottom
    const under = bubble({left: 300, right: 600, top: 500, bottom: 560});
    const over = bubble({left: 280, right: 620, top: 300, bottom: 500 - tall - 60});
    const standing = {x: 450, y: 500, posture: "stand", on: under.element};
    const tied = discoBall(standing, FIGURE, floorsOf(under, over));
    expect(tied).toMatchObject({kind: "bubble", above: 500 - over.bottom});
    expect(tied.hangs).toBeGreaterThan(tall);
    expect(tied.above).toBeGreaterThan(tied.hangs);
    // the bubble above too near the hat for the ball: no room at all
    const low = bubble({left: 280, right: 620, top: 300, bottom: 500 - tall - 10});
    expect(discoBall(standing, FIGURE, floorsOf(under, low))).toBe(null);
    // nothing above to hang it from, or standing on the compose box under a bubble: no ball
    expect(discoBall(standing, FIGURE, floorsOf(under))).toBe(null);
    expect(discoBall({x: 450, y: 700, posture: "stand", on: {}}, FIGURE, floorsOf(over))).toBe(null);
    // the bubble above moved further up, as the chat lays out again: the string is tied to where it is now
    const higher = bubble({left: 280, right: 620, top: 260, bottom: 500 - tall - 90});
    expect(discoBall(standing, FIGURE, floorsOf(under, higher))).toMatchObject({kind: "bubble", above: 500 - higher.bottom});
    // no ball sitting or hanging
    expect(discoBall({...standing, posture: "sit"}, FIGURE, floorsOf(under, over))).toBe(null);
    // the pile has it only under a bubble, and rarely: under one draw in fifty of the idle acts
    const choices = (ball) => choicesFor({moment: "pastime", ball, free: true, room: Infinity, lasted: 1000});
    const weight = (ball) => choices(ball).filter((each) => each.name === "disco").reduce((sum, each) => sum + each.weight, 0);
    expect(weight("")).toBe(0);
    expect(weight("bubble")).toBeGreaterThan(0);
    expect(weight("bubble") / choices("bubble").reduce((sum, each) => sum + each.weight, 0)).toBeLessThan(1 / 50);
    const memory = new Map([["pastime/disco", 0]]);
    expect(choicesFor({moment: "pastime", ball: "bubble", room: Infinity, memory, now: 2 * 60 * 60 - 1}).some((each) => each.name === "disco")).toBe(false);
    expect(choicesFor({moment: "pastime", ball: "bubble", room: Infinity, memory, now: SHOWPIECES.disco}).some((each) => each.name === "disco")).toBe(true);
    expect(SHOWPIECES.disco).toBe(2 * 60 * 60);
});

test("on a bubble the figure keeps 20 pixels inside the chat's sides, so a side never cuts its frame; a corner against a side is no perch", async () => {
    const {WALL_ROOM} = await import("../src/figure/places.js");
    const against = at(300, 900, 1270);
    const roomy = at(300, 900, 1180);
    const corner = (bubble) => perchSpot({floor: bubble.id, kind: STANDS, side: "right", grip: ""}, floorsOf(bubble), FIGURE);
    expect(corner(against)).toBe(null);
    expect(boxAt(corner(roomy), FIGURE).right).toBeLessThanOrEqual(1280 - WALL_ROOM);
});

test("the figure never pulls a pogo stick: a big climb with bubbles on the way is hopped, and one with none is not climbed", () => {
    const tall = heightOf(FIGURE);
    const chat = THREAD.bottom - THREAD.top;
    const from = {x: 400, y: 700};
    const goal = (up) => at(700 - up, 330, 470);
    const onTop = (floor) => ({x: 400, y: floor.top, posture: "stand", on: floor.element});
    const high = goal(0.6 * chat);
    for (const roll of [0, 0.5, 0.99]) expect(wayUp(floorsOf(high), FIGURE, from, onTop(high), {room: Infinity}, () => roll), `no bubbles: ${roll}`).toBe(null);
    const steps = floorsOf(goal(1.6 * tall), high);
    for (const roll of [0, 0.99]) expect(wayUp(steps, FIGURE, from, onTop(high), {room: Infinity}, () => roll)?.pogo, `steps: ${roll}`).not.toBe(true);
});

test("a figure seated has its telephone on the side its seat leaves free: along its edge at a corner, the roomier side in the middle, inside the window", () => {
    const {beside, wide} = ACTS.phone_call.seated;
    const unit = FIGURE.size / 5.4;
    const compose = {element: {}, left: 300, right: 700};
    const seat = (x, on = compose) => ({x, y: 600, posture: "sit", on: on.element});
    // the seat at the composer's right corner, its hips SEAT_INBOARD in: the telephone to its left, along the edge, never past its end
    expect(phoneSide(seat(700 - SEAT_INBOARD * FIGURE.size), FIGURE, [compose])).toBe(-1);
    expect(phoneSide(seat(300 + SEAT_INBOARD * FIGURE.size), FIGURE, [compose])).toBe(1);
    // in the middle either side is free: the one with more of the edge beyond the telephone
    expect(phoneSide(seat(450), FIGURE, [compose])).toBe(1);
    expect(phoneSide(seat(560), FIGURE, [compose])).toBe(-1);
    // the whole telephone stays on the floor and inside the window: by the window's right side, on a floor running past it, to the left
    const wide_floor = {element: {}, left: 300, right: 1300};
    expect(phoneSide(seat(1280 - (beside + wide) * unit + 5, wide_floor), FIGURE, [wide_floor])).toBe(-1);
});
