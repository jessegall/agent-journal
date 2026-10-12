// @vitest-environment node
import {afterEach, expect, test} from "vitest";

const {
    POSTURES,
    STEADY,
    boxAt,
    facingToward,
    footingNow,
    footingOn,
    groundEdge,
    hiddenAt,
    inWorld,
    postureOf,
    seatOf,
    seatRise,
    spotOf,
    tripBetween,
} = await import("../src/figure/places.js");
const {write} = await import("./figurePage.js");

const FIGURE = {size: 112, below: 0.05};

// the main chat's window, the figure's world on a page with a compose box
const CHAT = {left: 200, top: 100, right: 900, bottom: 800};

// a page whose compose box is `box` in the chat window `chat`, with the bars docked over it at `docked` while there are any, and tabs by
// their view
const page = (box, docked = null, {chat = CHAT, tabs = {}} = {}) => {
    globalThis.window = {innerWidth: 1280, innerHeight: 800};
    globalThis.CSS = {escape: (text) => text};
    const bars = docked && {getBoundingClientRect: () => docked};
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

afterEach(() => {
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.Node;
    delete globalThis.CSS;
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
    const floor = {getBoundingClientRect: () => ({left: 240, top: 0, width: 1040, right: 1280, bottom: 720})};
    for (const found of [null, floor]) {
        globalThis.document = {
            querySelector: (selector) => (selector === "[data-figure-floor]" ? found : null),
            querySelectorAll: () => [],
        };
        for (const near of [
            {x: 0, y: 700},
            {x: 1280, y: 700},
        ]) {
            const seat = seatOf(FIGURE, near);
            expect(seat).toMatchObject({y: 720, posture: "sit"});
            expect(spotOf(null, FIGURE, near).y).toBe(seat.y);
            expect(seat.x).toBeGreaterThanOrEqual((found ? 240 : 0) + FIGURE.size / 2);
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

test("of the corners at home the figure takes one whose body covers no words, though another is nearer", () => {
    page({left: 300, top: 600, width: 400, height: 120});
    const left = seatOf(FIGURE, {x: 300, y: 600});
    write([{left: left.x - 30, right: left.x + 30, top: 600 - 60, bottom: 600 - 40}]);
    const chosen = seatOf(FIGURE, {x: 300, y: 600});
    expect(chosen.x).toBeGreaterThan(600);
    expect(hiddenAt(chosen, FIGURE)).toBe(0);
});

test("only what the body is drawn over above its line counts, and only words and controls that are drawn", () => {
    page({left: 300, top: 600, width: 400, height: 120});
    const seat = seatOf(FIGURE, {x: 700, y: 600});
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
    // a few pixels across are no walk at all, so no leg walks the figure on the spot
    const above = tripBetween({x: 100, y: 500}, {x: 100 + STEADY - 1, y: 300}, 112, {random: () => 0.99});
    expect(above.legs.filter((each) => each.ms > 0).map((each) => each.clip ?? "walk")).toEqual(["jump"]);
});

test("a figure keeps its place on what it rests on as that moves, and loses its ground when it goes or the ground at home changes", () => {
    const box = {left: 300, top: 600, width: 400, height: 120};
    page(box);
    const home = groundEdge().element;
    const seat = seatOf(FIGURE, {x: 700, y: 600});
    expect(footingOn(seat)).toEqual({element: home, dx: seat.x - 300, dy: 0, posture: "sit", home: true});
    expect(footingOn({...seat, on: null})).toBe(null);
    const moved = {isConnected: true, getBoundingClientRect: () => ({...box, left: 320, top: 580})};
    const kept = {element: moved, dx: 10, dy: 0, posture: "stand", home: false};
    expect(footingNow(kept, FIGURE)).toEqual({x: 330, y: 580});
    expect(footingNow({...kept, element: {isConnected: false}}, FIGURE)).toBe(null);
    expect(footingNow({...kept, element: {isConnected: true, getBoundingClientRect: () => ({...box, height: 0})}}, FIGURE)).toBe(null);
    // on the ground at home it loses its footing when a bar docks over the compose box
    page(box, {left: 300, top: 556, width: 400, height: 44});
    expect(footingNow({element: home, dx: 10, dy: 0, posture: "stand", home: true}, FIGURE)).toBe(null);
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
    for (const spot of [seatOf(FIGURE, {x: 950, y: 600}), seatOf(FIGURE, {x: 150, y: 600}), spotOf(null, FIGURE, {x: 900, y: 600})]) {
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
    const bubble = {isConnected: true, getBoundingClientRect: () => ({left: 300, right: 500, width: 200, top, height: 60})};
    const footing = footingOn({x: 480, y: 400, posture: "sit", on: bubble});
    expect(footingNow(footing, FIGURE)).toEqual({x: 480, y: 400});
    // the thread scrolls the bubble up until the seated figure's head would leave the top of the chat window
    top = CHAT.top + 40;
    expect(footingNow(footing, FIGURE)).toBe(null);
});
