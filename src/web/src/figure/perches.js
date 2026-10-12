import {hiddenAt, seatAt, seatRise} from "./places.js";

// Where a figure perches on a message bubble now and then, instead of the compose box's edge: on top of it with its legs over the side,
// or hanging from its top corner by its hands. It is a place in the thread's own coordinates: read from the bubble each frame, so it
// rides the bubble as the thread scrolls, and let go when the bubble leaves the thread's view.
export const BUBBLE = "[data-figure-bubble]";
export const SITS = "sit";
export const HANGS = "hang";

// the share of perches that are a hang rather than a sit
export const HANG_SHARE = 0.4;

// Where the figure goes when nothing calls it elsewhere, and how long it stays, in seconds between the two: each time a stay is over it
// draws the next by its odds. It sits on a corner of the compose box to take it easy, strolls along that edge, perches on a message bubble
// or crosses to stand on one of the page's tabs, and whatever the agent is doing it does from there. A hang is short, as hanging is work.
export const ROAMS = [
    {where: "seat", odds: 0.45, stay: [40, 120]},
    {where: "edge", odds: 0.15, stay: [15, 40]},
    {where: "bubble", odds: 0.2, stay: [20, 60]},
    {where: "tab", odds: 0.2, stay: [15, 40]},
];
export const HANG_STAY = [8, 20];

// The next place to go and for how many seconds to stay, as {where, stay}; `random` is a function returning 0 up to 1
export function roamNext(random) {
    let roll = random() * ROAMS.reduce((sum, each) => sum + each.odds, 0);
    const found = ROAMS.find((each) => (roll -= each.odds) < 0) ?? ROAMS[0];
    return {where: found.where, stay: between(found.stay, random)};
}

// a number between the two in `range`
export const between = ([least, most], random) => least + random() * (most - least);

// the side of a bubble with more room outside it, so a figure there stays off the bubbles' text
const sideOf = (rect, scroller) => (rect.left - scroller.left > scroller.right - rect.right ? "left" : "right");

// whether a figure perched on this bubble's top corner stays inside the thread's view
const inView = (rect, scroller, figure) => rect.top - seatRise(figure) >= scroller.top && rect.top <= scroller.bottom - 8;

// a figure sitting on a bubble has its hips this share of its height inside the corner, over the bubble's padding rather than its words,
// so its legs hang clear of them
const PERCH_INBOARD = 0.05;

// the corner each hand takes facing the viewer; the body hangs outside the bubble so it never covers its words
const HAND_CORNER = {l: "left", r: "right"};
const HANG_OUT = 0.3;
const TURNED_TO_THE_BUBBLE = 180;

// The perch a figure takes now, or null when no bubble in view has one free: the newest bubble first, as the thread keeps it in view
// while older ones scroll away, and on each the way the roll says first, a hang or a sit, then the other. `hands` are the sides, "l" or
// "r", of the hands that carry nothing; `random` is a function returning 0 up to 1.
export function perchOn(bubbles, scroller, figure, hands, random) {
    const box = scroller.getBoundingClientRect();
    const open = bubbles.filter((bubble) => bubble.getBoundingClientRect().width && inView(bubble.getBoundingClientRect(), box, figure));
    const kinds = !hands.length ? [SITS] : random() < HANG_SHARE ? [HANGS, SITS] : [SITS, HANGS];
    const perches = open.reverse().flatMap((bubble) => kinds.map((kind) => perchAt(bubble, kind, box, hands)));
    return perches.find((perch) => perchSpot(perch, scroller, figure)) ?? null;
}

// A perch of `kind` on a bubble, on its side with more room. A hang there is by the hand on that side, facing the viewer; with only the
// other hand free it turns to face the bubble, as one hangs from a ledge facing the wall, so that hand comes to the corner.
function perchAt(bubble, kind, box, hands) {
    const side = sideOf(bubble.getBoundingClientRect(), box);
    if (kind === SITS) return {bubble, kind, side, grip: ""};
    const grip = hands.find((hand) => HAND_CORNER[hand] === side);
    return grip ? {bubble, kind, side, grip, face: 0} : {bubble, kind, side, grip: hands[0], face: TURNED_TO_THE_BUBBLE};
}

// Where the perch's figure stands now, with the way it faces, or null when its bubble is gone or out of the thread's view, or when the
// figure there would hide words or controls, such as those of the message above
export function perchSpot(perch, scroller, figure) {
    if (!perch.bubble.isConnected) return null;
    const rect = perch.bubble.getBoundingClientRect();
    if (!inView(rect, scroller.getBoundingClientRect(), figure)) return null;
    const spot = spotOn(perch, rect, figure);
    return hiddenAt(spot, figure) ? null : spot;
}

function spotOn(perch, rect, figure) {
    if (perch.kind === SITS) return {...seatAt(rect, perch.side, figure, PERCH_INBOARD), on: perch.bubble};
    const out = (perch.side === "left" ? -1 : 1) * HANG_OUT * figure.size;
    const x = (perch.side === "left" ? rect.left : rect.right) + out;
    return {x, y: rect.top, face: perch.face, posture: "hang", grip: perch.grip, on: perch.bubble};
}
