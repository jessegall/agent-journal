// @vitest-environment node
import {expect, test} from "vitest";
import {boxed} from "./support/figurePage.js";

const {targetFor} = await import("../src/figure/perches.js");

const FIGURE = {size: 112, below: 0.05};
const HANDS = ["l", "r"];

// a chat with a card docked over its compose box, finished and about to close by itself while `closing` says so
function chat(closing) {
    const card = {matches: (selector) => selector === "[data-figure-closing]" && closing};
    const bars = {...boxed({left: 300, right: 700, top: 540, bottom: 600}), firstElementChild: card};
    const scroll = {...boxed({left: 200, top: 100, right: 900, bottom: 540}), querySelectorAll: () => []};
    const thread = {
        ...boxed({left: 200, top: 100, right: 900, bottom: 800}),
        querySelector: (selector) => (selector === ".thread-scroll" ? scroll : selector === "[data-figure-docked-bars]" ? bars : null),
    };
    const home = {...boxed({left: 300, right: 700, top: 600, bottom: 720}), closest: () => thread};
    globalThis.window = {innerWidth: 1280, innerHeight: 800};
    globalThis.CSS = {escape: (text) => text};
    globalThis.document = {querySelector: (selector) => (selector === "[data-figure-home]" ? home : null), querySelectorAll: () => []};
    return bars;
}

const resting = (near) => ({state: "idle", counts: {question: 0, waiting: 0, suggestion: 0}, now: 100, near, figure: FIGURE, hands: HANDS, stay: {where: "rest", until: 500}});

test("the figure never sets out for a docked card that has finished and closes by itself soon, and one already on it stays", () => {
    // a card still running is a place to rest on as ever
    const running = chat(false);
    expect(targetFor(resting({x: 400, y: 300, on: {}})).spot).toMatchObject({y: 540, on: running});
    // finished and about to close, a figure standing elsewhere plans no trip to it
    const closing = chat(true);
    expect(targetFor(resting({x: 400, y: 300, on: {}})).spot).toBe(null);
    // one already standing on it keeps its place there until it closes
    const on = targetFor(resting({x: 660, y: 540, posture: "stand", on: closing})).spot;
    expect(on).toMatchObject({y: 540, on: closing});
});
