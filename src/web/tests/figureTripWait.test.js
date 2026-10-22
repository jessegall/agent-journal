// @vitest-environment node
import {expect, test} from "vitest";

const {floorOf, footingOn, groundUnder, readFloors} = await import("../src/figure/floors.js");
const {stayingAt} = await import("../src/figure/perches.js");
const {KEPT_WITHIN, floorAt, liftedLegs} = await import("../src/domain/figureMotion.js");

const FIGURE = {size: 112, below: 0.05};
const CHAT = {left: 200, top: 100, right: 900, bottom: 800};
const VIEW = {left: 200, top: 100, right: 900, bottom: 540};
const boxed = (box) => ({getBoundingClientRect: () => ({width: box.right - box.left, height: box.bottom - box.top, ...box})});

function page(bubble) {
    globalThis.window = {innerWidth: 1280, innerHeight: 800};
    globalThis.CSS = {escape: (text) => text};
    const scroll = {...boxed(VIEW), querySelectorAll: () => [bubble]};
    const thread = {...boxed(CHAT), querySelector: (selector) => (selector === ".thread-scroll" ? scroll : null)};
    const home = {...boxed({left: 300, right: 700, top: 600, bottom: 720}), closest: () => thread};
    globalThis.document = {querySelector: (selector) => (selector === "[data-figure-home]" ? home : null), querySelectorAll: () => []};
}

test("a figure waiting for its clip to end before a walk is carried with its card, legs and all, so it sets off on the card", () => {
    let top = 400;
    const bubble = {getBoundingClientRect: () => ({left: 260, right: 600, top, bottom: top + 60, width: 340, height: 60})};
    page(bubble);
    const stay = {where: "bubble", perch: {floor: floorOf(bubble), kind: "stand", side: "right", grip: ""}, until: 1e9};
    let place = stayingAt(stay, FIGURE, {x: 600, y: 600});
    const footing = footingOn(place);
    let legs = [{x: place.x - 80, y: place.y, ms: 400}];
    for (const next of [392, 380, 361, 340]) {
        top = next;
        const ground = groundUnder(footing, place, FIGURE, readFloors().floors, 0).spot;
        legs = liftedLegs(legs, ground.x - place.x, ground.y - place.y);
        place = ground;
    }
    expect(Math.abs(place.y - 340)).toBeLessThanOrEqual(0.3);
    expect(legs[0].y).toBeCloseTo(place.y, 1);
    expect(floorAt(readFloors().floors, place.x, place.y, KEPT_WITHIN)?.id).toBe(floorOf(bubble));
});
