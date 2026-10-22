// @vitest-environment node
import {expect, test} from "vitest";

const {floorOf, footingOn, groundUnder, readFloors} = await import("../src/figure/floors.js");
const {stayingAt} = await import("../src/figure/perches.js");

const FIGURE = {size: 112, below: 0.05};
const CHAT = {left: 200, top: 100, right: 900, bottom: 800};
const VIEW = {left: 200, top: 100, right: 900, bottom: 540};

const boxed = (box) => ({getBoundingClientRect: () => ({width: box.right - box.left, height: box.bottom - box.top, ...box})});

// a page whose one bubble's top the test moves, with no frame of the figure's loop run between the moves, as the chat glides to its foot
function page(bubble) {
    globalThis.window = {innerWidth: 1280, innerHeight: 800};
    globalThis.CSS = {escape: (text) => text};
    const scroll = {...boxed(VIEW), querySelectorAll: () => [bubble]};
    const thread = {...boxed(CHAT), querySelector: (selector) => (selector === ".thread-scroll" ? scroll : null)};
    const home = {...boxed({left: 300, right: 700, top: 600, bottom: 720}), closest: () => thread};
    globalThis.document = {querySelector: (selector) => (selector === "[data-figure-home]" ? home : null), querySelectorAll: () => []};
}

test("a figure perched on a bubble that moved since the last frame stands on its top, and stays on it as it moves on, never sinking into it", () => {
    let top = 400;
    const bubble = {getBoundingClientRect: () => ({left: 260, right: 600, top, bottom: top + 60, width: 340, height: 60})};
    page(bubble);
    const stay = {where: "bubble", perch: {floor: floorOf(bubble), kind: "stand", side: "right", grip: ""}, until: 1e9};
    top = 340;
    const spot = stayingAt(stay, FIGURE, {x: 600, y: 600});
    expect(spot.y).toBe(340);
    const footing = footingOn(spot);
    expect(footing.dy).toBe(0);
    let place = spot;
    for (const next of [330, 318, 310, 305, 305, 290, 290]) {
        top = next;
        place = groundUnder(footing, place, FIGURE, readFloors().floors, 0).spot;
        expect(Math.abs(place.y - next), `bubble at ${next}`).toBeLessThanOrEqual(0.3);
    }
});
