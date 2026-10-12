import {RESTS} from "../domain/figureState.js";
import {HOME, hiddenAt, openTabs, pointedView, seatAt, seatOf, seatRise, spotOf} from "./places.js";
import {letsGoFor} from "./reactions.js";

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

// the thread the main chat shows, whose bubbles the figure may perch on
export const threadOf = () => document.querySelector(HOME)?.closest(".thread")?.querySelector(".thread-scroll") ?? null;

// The next stay, drawn at `now` seconds by the roams' odds: where, until when, and what it holds for the stay, the perch on a bubble, the
// tab it stands on or the point along the home edge it strolls to. A hang from a bubble is a short one.
export function nextStay(now, figure, hands, random) {
    const {where, stay: seconds} = roamNext(random);
    const until = now + seconds;
    if (where === "bubble") {
        const thread = threadOf();
        const perch = thread && perchOn([...thread.querySelectorAll(BUBBLE)], thread, figure, hands, random);
        return {where, until: perch?.kind === HANGS ? now + between(HANG_STAY, random) : until, perch};
    }
    if (where === "tab") {
        const tabs = Object.keys(openTabs());
        return {where, until, view: tabs[Math.floor(random() * tabs.length)]};
    }
    if (where === "edge") return {where, until, along: {x: random() * window.innerWidth, y: 0}};
    return {where, until};
}

// The spot of a stay now for a figure at `near`, or null when its bubble or tab is gone or its perch is no longer free; a tab it only
// visits is not one it points at
export function stayingAt(stay, figure, near) {
    if (stay.where === "bubble") {
        const thread = threadOf();
        const spot = stay.perch && thread && perchSpot(stay.perch, thread, figure);
        return spot ? {...spot, view: null} : null;
    }
    if (stay.where === "tab") {
        const tab = stay.view && document.querySelector(`[data-tab="${CSS.escape(stay.view)}"]`);
        return tab ? {...spotOf(stay.view, figure, near), view: null} : null;
    }
    if (stay.where === "edge") return spotOf(null, figure, stay.along);
    return seatOf(figure, near);
}

// Where the figure goes now and the stay it keeps: seated at home while its agent cannot act; to the tab of what waits on the user when
// something does; otherwise where its stay is, drawing the next stay when this one is over or its place is gone. `near` is where it is,
// `counts` the views' badge counts and `state` what the agent does.
export function targetFor({state, counts, stay, now, near, figure, hands, random = Math.random}) {
    if (RESTS.has(state)) return {spot: seatOf(figure, near), stay};
    const pressing = pointedView(counts, openTabs());
    if (pressing) return {spot: spotOf(pressing, figure, near), stay};
    const kept = now < stay.until && stayingAt(stay, figure, near);
    if (kept) return {spot: kept, stay};
    const next = nextStay(now, figure, hands, random);
    return {spot: stayingAt(next, figure, near) || seatOf(figure, near), stay: next};
}

// The stay once the ground went from under the figure: a stroll along the home edge or a seat there is kept, any stay away from home is
// given up for a seat
export const stayAtHome = (stay) => (stay.where === "edge" ? stay : {where: "seat", until: stay.where === "seat" ? stay.until : 0});

// The stay once a look comes: over at once when the figure hangs there with its back to the viewer, so it lets go and turns round to
// show it, else kept
export const stayForLook = (stay, place) => (letsGoFor(place) ? {...stay, until: 0} : stay);
