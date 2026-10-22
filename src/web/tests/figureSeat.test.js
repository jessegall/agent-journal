// @vitest-environment node
import {afterEach, expect, test} from "vitest";

const {
    POSTURES,
    STEADY,
    SPRINT,
    boxAt,
    clearOf,
    clickedBody,
    facingToward,
    groundEdge,
    hiddenAt,
    inWorld,
    postureOf,
    restOf,
    standRise,
    spotOf,
    tripBetween,
    tripTo,
} = await import("../src/figure/places.js");
const {floorOf, footingNow, footingOn, groundUnder, landingOn, readFloors} = await import("../src/figure/floors.js");
const {write} = await import("./figurePage.js");

const FIGURE = {size: 112, below: 0.05};

// the main chat's window, the figure's world on a page with a compose box
const CHAT = {left: 200, top: 100, right: 900, bottom: 800};

// a page whose compose box is `box` in the chat window `chat`, with the bars docked over it at `docked` while there are any, and tabs by
// their view
const page = (box, docked = null, {chat = CHAT, tabs = {}} = {}) => {
    globalThis.window = {innerWidth: 1280, innerHeight: 800};
    globalThis.CSS = {escape: (text) => text};
    const bars = docked && {isConnected: true, getBoundingClientRect: () => docked};
    const thread = {
        getBoundingClientRect: () => chat,
        querySelector: (selector) => (selector === "[data-figure-docked-bars]" ? bars : null),
    };
    const home = {isConnected: true, getBoundingClientRect: () => box, closest: (selector) => (selector === ".thread" ? thread : null)};
    const tab = (view) => tabs[view] && {getBoundingClientRect: () => ({...tabs[view], width: tabs[view].right - tabs[view].left})};
    globalThis.document = {
        querySelector: (selector) => (selector === "[data-figure-home]" ? home : tab(selector.match(/data-tab="(.*)"/)?.[1])),
        querySelectorAll: () => [],
    };
};

// the floors the page holds now, with the floors of the bubbles `elements` at their boxes
const floorsNow = (...elements) => [
    ...readFloors().floors,
    ...elements.map((element) => {
        const box = element.getBoundingClientRect();
        return {id: floorOf(element), kind: "bubble", element, left: box.left, right: box.left + box.width, top: box.top, vy: 0};
    }),
];

afterEach(() => {
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.Node;
    delete globalThis.CSS;
});

test("a figure sitting on the right corner of a box turns right, and on the left corner turns left, part way back to the viewer", () => {
    page({left: 300, top: 600, width: 400, height: 120});
    const right = restOf(FIGURE, {x: 700, y: 600});
    const left = restOf(FIGURE, {x: 300, y: 600});
    expect(right.face).toBe(60);
    expect(left.face).toBe(300);
});

test("a figure's hips sit a little inboard of the corner it sits on, so its weight rests on the surface and only its legs reach past the edge", () => {
    page({left: 300, top: 600, width: 400, height: 120});
    const inboard = 0.14 * FIGURE.size;
    expect(restOf(FIGURE, {x: 700, y: 600}).x).toBeCloseTo(700 - inboard, 5);
    expect(restOf(FIGURE, {x: 300, y: 600}).x).toBeCloseTo(300 + inboard, 5);
});

test("a resting figure stands on the box's edge, and the room it takes above the edge is what the thread leaves", () => {
    page({left: 300, top: 600, width: 400, height: 120});
    const spot = restOf(FIGURE, {x: 700, y: 600});
    expect(spot).toMatchObject({y: 600, posture: "stand"});
    expect(600 - boxAt(spot, FIGURE).top).toBeCloseTo(standRise(FIGURE), 5);
});

test("whatever it plays, the figure's feet never go below the edge it rests on, since every rest is on its feet", () => {
    page({left: 300, top: 600, width: 400, height: 120});
    const feet = (spot, posture) => boxAt(spot, FIGURE, posture).bottom - FIGURE.below * FIGURE.size;
    const rest = restOf(FIGURE, {x: 700, y: 600});
    const standing = spotOf(null, FIGURE);
    expect(feet(standing, "stand")).toBeCloseTo(600, 5);
    expect(rest.posture).toBe("stand");
    expect(feet(rest, postureOf({postures: ["stand", "sit"]}, rest.posture))).toBeCloseTo(600, 5);
    expect(POSTURES[rest.posture].travels).toBe("stand");
});

test("before the chat is drawn the figure rests on the foot of the window on the line it stands on", () => {
    globalThis.window = {innerWidth: 1280, innerHeight: 720};
    globalThis.document = {querySelector: () => null, querySelectorAll: () => []};
    for (const near of [
        {x: 0, y: 700},
        {x: 1280, y: 700},
    ]) {
        const seat = restOf(FIGURE, near);
        expect(seat).toMatchObject({y: 720, posture: "stand"});
        expect(spotOf(null, FIGURE, near).y).toBe(seat.y);
        expect(seat.x).toBeGreaterThanOrEqual(FIGURE.size / 2);
        expect(seat.x).toBeLessThanOrEqual(1280 - FIGURE.size / 2);
        expect(boxAt(seat, FIGURE).top).toBeGreaterThanOrEqual(0);
    }
});

test("a bar docked over the compose box is the ground the figure stands and sits on while it is there, and the box is again once it goes", () => {
    const box = {left: 300, top: 600, width: 400, height: 120};
    page(box, {left: 300, top: 556, width: 400, height: 44});
    const docked = groundEdge();
    expect(docked.edge.top).toBe(556);
    expect(restOf(FIGURE, {x: 700, y: 556})).toMatchObject({y: 556, on: docked.element});
    expect(spotOf(null, FIGURE).y).toBe(556);
    page(box);
    expect(groundEdge().edge.top).toBe(600);
    expect(restOf(FIGURE, {x: 700, y: 556}).y).toBe(600);
});

test("of the corners at home the figure takes one whose body covers no words, though another is nearer", () => {
    page({left: 300, top: 600, width: 400, height: 120});
    const left = restOf(FIGURE, {x: 300, y: 600});
    write([{left: left.x - 30, right: left.x + 30, top: 600 - 60, bottom: 600 - 40}]);
    const chosen = restOf(FIGURE, {x: 300, y: 600});
    expect(chosen.x).toBeGreaterThan(600);
    expect(hiddenAt(chosen, FIGURE)).toBe(0);
});

test("only what the body is drawn over above its line counts, and only words and controls that are drawn", () => {
    page({left: 300, top: 600, width: 400, height: 120});
    const seat = restOf(FIGURE, {x: 700, y: 600});
    // a turn's tools in the middle of the body, shown only on hover, and words its legs hang over below the edge, which are the box's own
    const tools = {left: seat.x - 5, right: seat.x + 5, top: 562, bottom: 590};
    write([{left: seat.x - 30, right: seat.x + 30, top: 610, bottom: 625}], [{box: tools, shown: false}]);
    expect(hiddenAt(seat, FIGURE)).toBe(0);
    // shown, the tools are under two points of the body; a control beside the body, inside its picture's square, is not under it
    write(
        [],
        [
            {box: tools, shown: true},
            {box: {left: seat.x + 40, right: seat.x + 50, top: 540, bottom: 590}, shown: true},
        ]
    );
    expect(hiddenAt(seat, FIGURE)).toBe(2);
    write([{left: seat.x - 30, right: seat.x + 30, top: 560, bottom: 580}]);
    expect(hiddenAt(seat, FIGURE)).toBe(3);
});

test("a trip up walks under the place and then jumps, one down falls and then walks, and ground that moved under it goes straight first", () => {
    expect(tripBetween({x: 100, y: 500}, {x: 102, y: 497}, 112)).toBe(null);
    const up = tripBetween({x: 100, y: 500}, {x: 300, y: 300}, 112, {random: () => 0.99});
    expect(up.legs.map((each) => [each.x, each.y, each.clip ?? "walk"])).toEqual([
        [300, 500, "walk"],
        [300, 300, "jump"],
    ]);
    expect([up.way, up.lands]).toEqual([1, true]);
    const down = tripBetween({x: 300, y: 300}, {x: 100, y: 500}, 112);
    expect(down.legs.map((each) => [each.x, each.y, each.clip ?? "walk"])).toEqual([
        [300, 500, "fall"],
        [100, 500, "walk"],
    ]);
    const pushed = tripBetween({x: 100, y: 500}, {x: 140, y: 460}, 112, {straight: true, random: () => 0.99});
    expect(pushed.legs.map((each) => [each.x, each.y, each.clip ?? "walk"])).toEqual([
        [100, 460, "jump"],
        [140, 460, "walk"],
    ]);
    // a high jump now and then turns over, and a figure that goes on to hang does not land
    expect(tripBetween({x: 100, y: 500}, {x: 100, y: 300}, 112, {random: () => 0, hangs: true})).toMatchObject({lands: false});
    expect(tripBetween({x: 100, y: 500}, {x: 100, y: 300}, 112, {random: () => 0}).legs[1].clip).toBe("backflip");
    expect(STEADY).toBeGreaterThan(0);
    // stepping out of the way it sprints, its stroll that much shorter
    const sprint = tripBetween({x: 100, y: 500}, {x: 400, y: 500}, 112, {pace: SPRINT});
    expect(sprint.legs[1].ms * SPRINT).toBeCloseTo(tripBetween({x: 100, y: 500}, {x: 400, y: 500}, 112).legs[1].ms, 5);
    expect(sprint.pace).toBe(SPRINT);
    // a few pixels across are no walk at all, so no leg walks the figure on the spot
    const above = tripBetween({x: 100, y: 500}, {x: 100 + STEADY - 1, y: 300}, 112, {random: () => 0.99});
    expect(above.legs.filter((each) => each.ms > 0).map((each) => each.clip ?? "walk")).toEqual(["jump"]);
});

test("a figure keeps its place on the floor it rests on as that moves, and loses its ground when the floor goes", () => {
    const box = {left: 300, top: 600, width: 400, height: 120};
    page(box);
    const seat = restOf(FIGURE, {x: 700, y: 600});
    expect(footingOn(seat, floorsNow(), 5)).toEqual({id: "home", dx: seat.x - 300, dy: 0, posture: "stand", home: true, ground: {y: 600, at: 5}});
    expect(footingOn({...seat, on: null}, floorsNow())).toBe(null);
    const moved = {getBoundingClientRect: () => ({...box, left: 320, top: 580})};
    const kept = {id: floorOf(moved), dx: 10, dy: 0, posture: "stand", home: false};
    expect(footingNow(kept, FIGURE, floorsNow(moved))).toEqual({x: 330, y: 580});
    expect(footingNow(kept, FIGURE, floorsNow())).toBe(null);
    // on the ground at home it keeps to whatever the ground there is, here a bar docked over the compose box
    page(box, {left: 300, top: 556, width: 400, height: 44});
    expect(footingNow({id: "home", dx: 10, dy: 0, posture: "stand", home: true}, FIGURE, floorsNow())).toEqual({x: 310, y: 556});
    // hanging from a bubble it is carried with it, until the bubble brings its feet down onto that ground, where it lets go
    const bubble = {getBoundingClientRect: () => ({left: 400, top: 200, width: 200, height: 40})};
    const low = {getBoundingClientRect: () => ({left: 400, top: 500, width: 200, height: 40})};
    const hanging = {dx: 20, dy: 40, posture: "hang", home: false};
    expect(footingNow({...hanging, id: floorOf(bubble)}, FIGURE, floorsNow(bubble))).toEqual({x: 420, y: 240});
    expect(footingNow({...hanging, id: floorOf(low)}, FIGURE, floorsNow(low))).toBe(null);
});

test("at home the figure is launched when the ground under it rises more than a few pixels in a moment, falls when it drops so, and a drift carries it", () => {
    const box = {left: 300, top: 600, width: 400, height: 120};
    page(box);
    const spot = spotOf(null, FIGURE, {x: 640, y: 600});
    let at = 0;
    let now = {spot, footing: footingOn(spot, floorsNow(), at)};
    const frame = () => (now = groundUnder(now.footing, now.spot, FIGURE, floorsNow(), (at += 16)));
    // the compose box drifts up a few pixels, and carries it
    box.top = 596;
    expect(frame()).toMatchObject({spot: {x: spot.x, y: 596}, motion: "carried"});
    // the box grows a line as the user types, and it is thrown up
    box.top = 576;
    expect(frame()).toMatchObject({spot: {y: 576}, motion: "launched"});
    expect(frame().motion).toBe("carried");
    // a bar docks over the box a few pixels a frame, carrying it until the ground has risen more than a few pixels, and then throwing it up
    for (const [top, motion] of [
        [573, "carried"],
        [570, "carried"],
        [566, "launched"],
    ]) {
        page(box, {left: 300, top, width: 400, height: 576 - top});
        expect(frame()).toMatchObject({spot: {y: top}, motion});
    }
    // the bar goes in one frame, and it falls to the compose box, from where it stood
    page(box);
    expect(frame()).toMatchObject({spot: {x: spot.x, y: 576}, motion: "dropping"});
    // carried out of its world, its ground is gone
    box.top = 2000;
    expect(frame()).toBe(null);
});

test("a figure stepping out of the way takes the first free spot on the right of where it was, and one on its left only then", () => {
    page({left: 300, top: 600, width: 400, height: 120});
    const was = spotOf(null, FIGURE, {x: 440, y: 600});
    expect(was.x).toBe(440);
    expect(clearOf(boxAt(was, FIGURE), FIGURE, was, false)).toMatchObject({x: 640, posture: "stand"});
    expect(clearOf(boxAt(was, FIGURE), FIGURE, was, true).x).toBeGreaterThan(640);
    // from the right end nothing on the right is clear of it, so it goes left
    const end = spotOf(null, FIGURE, {x: 640, y: 600});
    expect(clearOf(boxAt(end, FIGURE), FIGURE, end, false).x).toBeLessThan(end.x);
});

test("a trip lands on the line where it is when the figure arrives, not where it was when it set off, and never sinks through it", () => {
    const box = {left: 300, top: 600, width: 400, height: 120};
    page(box);
    const spot = spotOf(null, FIGURE, {x: 640, y: 600});
    const footing = footingOn(spot, floorsNow());
    // while the figure travels the compose box grows by two lines, so its top edge rises by 40 pixels
    box.top = 560;
    expect(landingOn(spot, footing, FIGURE, floorsNow())).toMatchObject({x: spot.x, y: 560, posture: "stand"});
    // a footing taken only on arrival keeps the old height as an offset from the edge, which is the figure sunk 40 pixels into the box
    expect(footingOn(spot, floorsNow()).dy).toBe(40);
    expect(footingOn(landingOn(spot, footing, FIGURE, floorsNow()), floorsNow()).dy).toBe(0);
    // with its floor gone the spot is kept as it was, and the footing that is gone uproots the figure as it rests
    expect(landingOn(spot, {...footing, id: "gone", home: false}, FIGURE, floorsNow())).toEqual(spot);
});

test("a trip is drawn from where the figure is as it sets off, so one getting up from a seat that moved walks level along the line", () => {
    const box = {left: 300, top: 600, width: 400, height: 120};
    page(box);
    const right = restOf(FIGURE, {x: 700, y: 600});
    const left = restOf(FIGURE, {x: 300, y: 600});
    const [rightFooting, leftFooting] = [footingOn(right, floorsNow()), footingOn(left, floorsNow())];
    // while it gets up the compose box grows, and the seat it sits on rises with it
    box.top = 560;
    const seated = {...right, ...footingNow(rightFooting, FIGURE, floorsNow())};
    const level = (y) => Math.round(y * 100) / 100;
    const steps = (trip) => trip.legs.filter((each) => each.ms > 0).map((each) => [each.clip ?? "walk", level(each.y)]);
    const standing = level(560 - (1 - FIGURE.below) * FIGURE.size);
    expect(steps(tripTo(seated, landingOn(left, leftFooting, FIGURE, floorsNow()), FIGURE))).toEqual([["walk", standing]]);
    // drawn from where it sat before the box grew, it would walk 40 pixels down in the box and then jump up
    expect(steps(tripTo(right, landingOn(left, leftFooting, FIGURE, floorsNow()), FIGURE, {random: () => 0.99}))).toEqual([
        ["walk", level(standing + 40)],
        ["jump", standing],
    ]);
});

test("a figure turns right or left toward the chat mark it reacts to, and toward the viewer when the mark is not on the page", () => {
    globalThis.CSS = {escape: (text) => text};
    page({left: 300, top: 600, width: 400, height: 120});
    const mark = {getBoundingClientRect: () => ({left: 600, width: 100})};
    document.querySelector = (selector) => (selector === '[data-figure-mark="right"]' ? mark : null);
    expect(facingToward("right", 400)).toBe(90);
    expect(facingToward("right", 700)).toBe(270);
    expect(facingToward("gone", 400)).toBe(0);
    expect(facingToward("", 400)).toBe(0);
    delete globalThis.CSS;
});

test("no part of the figure is ever outside the chat window: not past its sides, its top or, hanging, its foot", () => {
    page({left: 150, top: 600, width: 800, height: 120});
    const standing = {x: 500, y: 400, posture: "stand"};
    expect(inWorld(standing, FIGURE)).toBe(true);
    expect(inWorld({...standing, x: CHAT.right - 40}, FIGURE)).toBe(false);
    expect(inWorld({...standing, y: CHAT.top + 50}, FIGURE)).toBe(false);
    // seated, its legs hang past the line it sits on; hanging, the whole of it is inside
    expect(inWorld({x: 500, y: CHAT.bottom, posture: "sit"}, FIGURE)).toBe(true);
    expect(inWorld({x: 500, y: CHAT.bottom - 20, posture: "hang"}, FIGURE)).toBe(false);
    // a compose box wider than the chat window gives seats and spots at home that are pulled inside it
    for (const spot of [restOf(FIGURE, {x: 950, y: 600}), restOf(FIGURE, {x: 150, y: 600}), spotOf(null, FIGURE, {x: 900, y: 600})]) {
        expect(spot.y).toBe(600);
        expect(inWorld(spot, FIGURE)).toBe(true);
    }
});

test("a figure goes to a tab only to stand on it inside its world, never in the air under or beside it nor on a tab in another pane", () => {
    const box = {left: 300, top: 600, width: 400, height: 120};
    page(box, null, {
        tabs: {question: {left: 950, right: 980, top: 60, bottom: 90}, inside: {left: 480, right: 520, top: 300, bottom: 330}},
    });
    expect(spotOf("question", FIGURE)).toBe(null);
    expect(spotOf("gone", FIGURE)).toBe(null);
    const on = spotOf("inside", FIGURE);
    expect(on).toMatchObject({y: 300, posture: "stand", view: "inside"});
    expect(on.x).toBeGreaterThanOrEqual(480);
    expect(on.x).toBeLessThanOrEqual(520);
});

test("a figure carried by what it rests on loses its footing once that would take any part of it out of the chat window", () => {
    const box = {left: 300, top: 600, width: 400, height: 120};
    page(box);
    let top = 400;
    const bubble = {getBoundingClientRect: () => ({left: 300, right: 500, width: 200, top, height: 60})};
    const footing = footingOn({x: 480, y: 400, posture: "sit", on: bubble}, floorsNow(bubble));
    expect(footingNow(footing, FIGURE, floorsNow(bubble))).toEqual({x: 480, y: 400});
    // the thread scrolls the bubble up until the seated figure's head would leave the top of the chat window
    top = CHAT.top + 40;
    expect(footingNow(footing, FIGURE, floorsNow(bubble))).toBe(null);
});

test("a figure sitting on the chat box takes no press below its seat, so a click on the box's top edge reaches the box", () => {
    const seated = clickedBody("sit", FIGURE.below);
    expect(seated.bottom).toBeLessThanOrEqual(1 - FIGURE.below - POSTURES.sit.drop);
    expect(clickedBody("stand", FIGURE.below).bottom).toBeLessThanOrEqual(1 - FIGURE.below);
    expect(clickedBody("hang", FIGURE.below).bottom).toBeGreaterThan(seated.bottom);
});

test("the figure rests on its feet on every corner, never with its legs over the box", () => {
    page({left: 210, top: 600, width: 680, height: 120});
    for (const near of [{x: 210, y: 600}, {x: 890, y: 600}]) {
        const rest = restOf(FIGURE, near);
        expect(rest).toMatchObject({y: 600, posture: "stand"});
        expect(boxAt(rest, FIGURE).bottom - FIGURE.below * FIGURE.size).toBeCloseTo(600, 5);
    }
    page({left: 300, top: 600, width: 400, height: 120});
    expect(restOf(FIGURE, {x: 700, y: 600}).posture).toBe("stand");
});
