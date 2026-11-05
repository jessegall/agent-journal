// @vitest-environment node
import {expect, test} from "vitest";
import {CHAT, boxed, page} from "./support/figurePage.js";

const {LADDER, FEET_INBOARD, POSTURES, boxAt, tripTo} = await import("../src/figure/places.js");
const {ladderShown, nearerWay, rummageSpot} = await import("../src/figure/perches.js");
const {keptOnFloor} = await import("../src/figure/floors.js");
const {heightOf} = await import("../src/figure/climbs.js");
const {CLIPS} = await import("../src/figure/figure.js");

const FIGURE = {size: 112, below: 0.05};
// the page: a chat from 200 to 900 with its compose box from 300 to 700, its top at 600, so the window's sides lie past both its ends
const HOME = {left: 300, right: 700, top: 600};
const floors = () => [{id: "home", kind: "compose", element: document.querySelector("[data-figure-home]"), left: HOME.left, right: HOME.right, top: HOME.top}];
// a picture's corner, as a trip's legs run, for a spot
const corner = (spot) => {
    const box = boxAt(spot, FIGURE, POSTURES[spot.posture].travels);
    return {x: box.left, y: box.top};
};

test("the figure rummages at the corner nearest it, and where the window's side lies past the ground's end there it sets a ladder against it and rummages from its top", () => {
    page(boxed({left: 400, right: 600, top: 300, bottom: 340}));
    expect([nearerWay(320, CHAT), nearerWay(690, CHAT), nearerWay(540, CHAT), nearerWay(580, CHAT)]).toEqual([-1, 1, -1, 1]);
    for (const way of [-1, 1]) {
        const spot = rummageSpot(FIGURE, way);
        const end = way > 0 ? HOME.right - FEET_INBOARD * FIGURE.size : HOME.left + FEET_INBOARD * FIGURE.size;
        const wall = way > 0 ? CHAT.right : CHAT.left;
        expect(spot.ladder, `${way}: a ladder`).toBeTruthy();
        // its feet on the ground at the ground's end, leaning toward the window's side, never steeper than its steepest lean
        expect(spot.ladder.foot).toEqual({x: end, y: HOME.top});
        expect(spot.ladder.way).toBe(way);
        const rise = HOME.top - spot.y;
        expect(rise).toBeGreaterThan(0);
        expect(rise).toBeLessThanOrEqual(LADDER.most * heightOf(FIGURE) + 1e-9);
        expect(Math.abs(spot.x - end) / rise).toBeLessThanOrEqual(Math.tan((LADDER.steepest * Math.PI) / 180) + 1e-9);
        // its top rung out over the gap toward the side, nearer it than the ground's end, the ladder reaching on past the rung
        expect(Math.abs(wall - spot.x)).toBeLessThan(Math.abs(wall - end));
        expect(spot.ladder.top.y).toBeLessThan(spot.y);
        expect(way * (spot.ladder.top.x - spot.x)).toBeGreaterThan(0);
    }
    // a window whose side the ground reaches needs no ladder
    const wide = {left: 300, top: 100, right: 700, bottom: 800};
    globalThis.document.querySelector("[data-figure-home]").closest = () => ({...boxed(wide), querySelector: () => null});
    for (const way of [-1, 1]) expect(rummageSpot(FIGURE, way).ladder, `${way}: no ladder`).toBeUndefined();
});

test("to the ladder's top the figure walks to its foot on the ground and climbs it, facing the way it leans; down it climbs to the foot first; neither walks off the ground's end", () => {
    page(boxed({left: 400, right: 600, top: 300, bottom: 340}));
    const spot = rummageSpot(FIGURE, 1);
    const ground = {x: 450, y: HOME.top, posture: "stand", face: 0};
    const foot = corner({...spot.ladder.foot, posture: "stand"});
    const groundEnd = corner({x: HOME.right, y: HOME.top, posture: "stand"}).x;
    const up = tripTo(ground, spot, FIGURE);
    const climb = up.legs.at(-1);
    expect(climb).toMatchObject({clip: "ladder_climb", hopping: true, facing: 90, ...corner(spot)});
    expect(up.lands).toBe(false);
    for (const leg of up.legs.slice(0, -1)) {
        expect(leg.x, "every walk stays on the ground").toBeLessThanOrEqual(groundEnd);
        expect(leg.y).toBe(foot.y);
    }
    expect(up.legs.at(-2).x).toBeCloseTo(foot.x, 6);
    const down = tripTo(spot, ground, FIGURE);
    expect(down.legs[0]).toMatchObject({clip: "ladder_climb", x: foot.x, y: foot.y});
    expect(down.legs.slice(1).every((leg) => leg.x <= groundEnd)).toBe(true);
    expect(CLIPS.find((clip) => clip.name === "ladder_climb")).toMatchObject({loops: true, postures: ["stand"]});
});

test("a trip never ends past the end of the floor it stands on: a standing spot beyond either end is kept in from it, a ladder's spot is climbed to on purpose", () => {
    page(boxed({left: 400, right: 600, top: 300, bottom: 340}));
    const home = document.querySelector("[data-figure-home]");
    const inboard = FEET_INBOARD * FIGURE.size;
    expect(keptOnFloor({x: 760, y: HOME.top, posture: "stand", on: home}, floors(), FIGURE).x).toBe(HOME.right - inboard);
    expect(keptOnFloor({x: 240, y: HOME.top, posture: "stand", on: home}, floors(), FIGURE).x).toBe(HOME.left + inboard);
    expect(keptOnFloor({x: 500, y: HOME.top, posture: "stand", on: home}, floors(), FIGURE).x).toBe(500);
    const ladder = rummageSpot(FIGURE, 1);
    expect(keptOnFloor(ladder, floors(), FIGURE)).toBe(ladder);
    // a seat with its legs over the end, a hang, or a spot on a floor too narrow to keep in from, stay as they are
    for (const spot of [{x: 690, y: HOME.top, posture: "sit", on: home}, {x: 760, y: HOME.top, posture: "hang", on: home}]) expect(keptOnFloor(spot, floors(), FIGURE)).toBe(spot);
    const tab = {};
    expect(keptOnFloor({x: 20, y: 40, posture: "stand", on: tab}, [{id: "tab", kind: "tab", element: tab, left: 0, right: 30, top: 40}], FIGURE).x).toBe(20);
});

test("the ladder stands while the figure goes up it, stands on it and climbs down it, and is taken away once it is off it", () => {
    page(boxed({left: 400, right: 600, top: 300, bottom: 340}));
    const spot = rummageSpot(FIGURE, 1);
    const ground = {x: 450, y: HOME.top, posture: "stand"};
    expect(ladderShown(ground, null)).toBe(null);
    expect(ladderShown(ground, {to: spot, moves: true, legs: []})).toBe(spot.ladder);
    expect(ladderShown(spot, null)).toBe(spot.ladder);
    const down = tripTo(spot, ground, FIGURE);
    expect(ladderShown(spot, {to: ground, moves: true, clip: "ladder_climb", legs: down.legs.slice(1)})).toBe(spot.ladder);
    expect(ladderShown(spot, {to: ground, moves: true, clip: undefined, legs: down.legs.slice(2)})).toBe(null);
});
