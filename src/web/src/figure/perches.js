import {seatAt, seatRise} from "./places.js";

// Where a figure perches on a message bubble now and then, instead of the compose box's edge: on top of it with its legs over the side,
// or hanging from its top corner by its hands. It is a place in the thread's own coordinates: read from the bubble each frame, so it
// rides the bubble as the thread scrolls, and let go when the bubble leaves the thread's view.
export const BUBBLE = "[data-figure-bubble]";
export const SITS = "sit";
export const HANGS = "hang";

// seated at the compose box's edge this many seconds before it considers a bubble, then one look in ODDS takes one
export const SETTLED_SECONDS = 30;
export const ODDS = 10;
// the share of perches that are a hang rather than a sit, and how many seconds a perch lasts, between the two
export const HANG_SHARE = 0.4;
export const STAY_SECONDS = [20, 60];

// the side of a bubble with more room outside it, so a figure there stays off the bubbles' text
const sideOf = (rect, scroller) => (rect.left - scroller.left > scroller.right - rect.right ? "left" : "right");

// whether a figure perched on this bubble's top corner stays inside the thread's view
const inView = (rect, scroller, figure) => rect.top - seatRise(figure) >= scroller.top && rect.top <= scroller.bottom - 8;

// a hang is by one hand, the corner it takes the one on that hand's side; the body hangs outside the bubble so it never covers its words
const HAND_CORNER = {l: "left", r: "right"};
const HANG_OUT = 0.3;

// The perch a figure takes now, or null when no bubble but the newest is in view. `hands` are the sides, "l" or "r", of the hands that
// carry nothing; `random` is a function returning 0 up to 1.
export function perchOn(bubbles, scroller, figure, hands, random) {
    const box = scroller.getBoundingClientRect();
    const shown = bubbles.filter((bubble) => bubble.getBoundingClientRect().width);
    const open = shown.slice(0, -1).filter((bubble) => inView(bubble.getBoundingClientRect(), box, figure));
    if (!open.length) return null;
    const bubble = open[Math.floor(random() * open.length)];
    const [least, most] = STAY_SECONDS;
    const side = sideOf(bubble.getBoundingClientRect(), box);
    const hangs = hands.length > 0 && random() < HANG_SHARE;
    const grip = hangs ? hands.find((hand) => HAND_CORNER[hand] === side) || hands[0] : "";
    return {bubble, kind: hangs ? HANGS : SITS, side: hangs ? HAND_CORNER[grip] : side, grip, stay: least + random() * (most - least)};
}

// Where the perch's figure stands now, with the way it faces, or null when its bubble is gone or out of the thread's view
export function perchSpot(perch, scroller, figure) {
    if (!perch.bubble.isConnected) return null;
    const rect = perch.bubble.getBoundingClientRect();
    if (!inView(rect, scroller.getBoundingClientRect(), figure)) return null;
    if (perch.kind === SITS) return {...seatAt(rect, perch.side, figure), on: perch.bubble};
    const out = (perch.side === "left" ? -1 : 1) * HANG_OUT * figure.size;
    return {x: (perch.side === "left" ? rect.left : rect.right) + out, y: rect.top, face: 0, posture: "hang", grip: perch.grip, on: perch.bubble};
}
