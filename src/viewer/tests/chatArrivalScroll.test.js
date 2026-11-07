import {afterEach, expect, test} from "vitest";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {arrivalQueue, FADE_MS, PUSH_MS} from "../src/chat/arrival.js";

const chatSource = readFileSync(resolve(__dirname, "../../core/modules/messages/web/src/Chat.vue"), "utf8");

const CLIENT_HEIGHT = 300;
const FRAME_MS = 16;
const ROWS_END = 600;
let host;

afterEach(() => host?.remove());

// A pane whose scrollable area is worked out the way a browser does: the layout's end plus the pane's bottom padding, or, past that, the foot of the
// row sliding in below its place; the row's height grows with the time and its slide is the one the arrival sets on it. The pane's scrollTop stays inside the area.
function modelled(padding, clipped = false) {
    host = document.createElement("div");
    document.body.append(host);
    const pane = document.createElement("div");
    const el = document.createElement("div");
    host.append(pane);
    pane.append(el);
    pane.style.paddingBottom = `${padding}px`;
    const state = {top: 0, now: 0, height: 80, began: null};
    const slide = () => Number(/translateY\((-?[\d.]+)px\)/.exec(el.style.transform)?.[1] ?? 0);
    const grown = () => (el.style.height ? Math.min(state.height, state.height * Math.min(1, (state.now - (state.began ?? state.now)) / PUSH_MS)) : state.height);
    const layoutEnd = () => ROWS_END + grown();
    const transformed = () => layoutEnd() + slide();
    const scrollHeight = () => clipped ? layoutEnd() + padding : Math.max(layoutEnd() + padding, transformed());
    Object.defineProperty(pane, "scrollHeight", {get: scrollHeight});
    Object.defineProperty(pane, "clientHeight", {get: () => CLIENT_HEIGHT});
    Object.defineProperty(pane, "clientTop", {get: () => 0});
    Object.defineProperty(pane, "scrollTop", {
        get: () => state.top,
        set: (value) => (state.top = Math.max(0, Math.min(value, scrollHeight() - CLIENT_HEIGHT))),
    });
    pane.getBoundingClientRect = () => ({top: 0, bottom: CLIENT_HEIGHT});
    el.getBoundingClientRect = () => ({top: ROWS_END + slide() - state.top, bottom: transformed() - state.top});
    Object.defineProperty(el, "offsetHeight", {get: () => state.height});
    return {pane, el, state};
}

// the first turn of an arrival queue, stepped one frame at a time; the pane's scrollTop is read after each frame
function sampled(padding, lasts, resize = false) {
    const clipped = resize && /\.history-content\s*\{[^}]*overflow:\s*clip\s*;/s.test(chatSource);
    const {pane, el, state} = modelled(padding, clipped);
    state.top = scrollEnd(pane);
    let waiting = null;
    const samples = [];
    let finished = false;
    arrivalQueue({later: () => {}})(el, {pane, follows: () => true, frame: (step) => (waiting = step), clock: () => state.now}, () => (finished = true));
    state.began = state.now;
    while (!finished && state.now < lasts + 4 * FRAME_MS) {
        state.now += FRAME_MS;
        const step = waiting;
        waiting = null;
        step?.();
        samples.push(state.top);
        if (resize) {
            pane.scrollTop = pane.scrollHeight;
            samples.push(state.top);
            expect(state.top).toBe(scrollEnd(pane));
        }
    }
    el.style.height = "";
    el.style.transform = "";
    return {samples, finalFoot: scrollEnd(pane), settledTop: state.top};
}

const scrollEnd = (pane) => pane.scrollHeight - CLIENT_HEIGHT;
const largestDrop = (samples) => samples.reduce((worst, top, at) => Math.max(worst, at ? Math.max(...samples.slice(0, at)) - top : 0), 0);

test.each([0, 4, 8, 16])("a message that arrives glides the pane up and never lets it fall back, with %ipx of padding under the rows", (padding) => {
    const {samples} = sampled(padding, PUSH_MS + FADE_MS);
    expect(largestDrop(samples)).toBe(0);
});

test("the pane ends at the real foot of the chat once the message has come in", () => {
    const {samples, finalFoot} = sampled(0, PUSH_MS + FADE_MS);
    expect(samples.at(-1)).toBe(finalFoot);
});

test("each resize keeps the pane at the bottom without reversing the scroll", () => {
    const {samples, finalFoot} = sampled(8, PUSH_MS + FADE_MS, true);
    expect(largestDrop(samples)).toBe(0);
    expect(samples.at(-1)).toBe(finalFoot);
});
