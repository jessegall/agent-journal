import {RESTS} from "../domain/figureState.js";
import {holds, latestFloors} from "./floors.js";
import {boxAt, clearOf, hiddenAt, openTabs, overlaps, pointedView, seatAt, seatOf, seatRise, spotOf} from "./places.js";
import {letsGoFor} from "./reactions.js";

// Where a figure perches on a message bubble now and then, instead of the compose box's edge: on top of it with its legs over the side,
// or hanging from its top corner by its hands. A perch names its bubble's floor (figure/floors.js), so it rides the bubble as the thread
// scrolls, and is let go when the bubble leaves the thread's view.
export const SITS = "sit";
export const HANGS = "hang";

// the share of perches that are a hang rather than a sit
export const HANG_SHARE = 0.4;

// Where the figure goes when nothing calls it elsewhere, and how long it stays, in seconds between the two: each time a stay is over it
// draws the next by its odds. Mostly it strolls along the compose box's edge and sits a while on a corner of it, now and then perches on a
// message bubble or crosses to stand on one of the page's tabs, and whatever the agent is doing it does from there. A hang is short, as
// hanging is work.
export const ROAMS = [
    {where: "seat", odds: 0.3, stay: [15, 40]},
    {where: "edge", odds: 0.4, stay: [8, 20]},
    {where: "bubble", odds: 0.15, stay: [15, 40]},
    {where: "tab", odds: 0.15, stay: [10, 25]},
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

// whether a figure perched on this bubble's top corner stays inside the thread's view `scroller`
const inView = (rect, scroller, figure) => rect.top - seatRise(figure) >= scroller.top && rect.top <= scroller.bottom - 8;

// a figure sitting on a bubble has its hips this share of its height inside the corner, over the bubble's padding rather than its words,
// so its legs hang clear of them
const PERCH_INBOARD = 0.05;

// the corner each hand takes facing the viewer; the body hangs outside the bubble so it never covers its words
const HAND_CORNER = {l: "left", r: "right"};
const HANG_OUT = 0.3;
const TURNED_TO_THE_BUBBLE = 180;

// The perch a figure takes now on the bubbles of the floors snapshot `floors`, or null when no bubble in view has one free: the newest
// bubble first, as the thread keeps it in view while older ones scroll away, and on each the way the roll says first, a hang or a sit,
// then the other. `hands` are the sides, "l" or "r", of the hands that carry nothing; `random` is a function returning 0 up to 1.
export function perchOn(floors, figure, hands, random) {
    const open = floors.floors.filter((floor) => floor.kind === "bubble" && inView(floor, floors.view, figure));
    const kinds = !hands.length ? [SITS] : random() < HANG_SHARE ? [HANGS, SITS] : [SITS, HANGS];
    const perches = open.reverse().flatMap((floor) => kinds.map((kind) => perchAt(floor, kind, floors.view, hands)));
    return perches.find((perch) => perchSpot(perch, floors, figure)) ?? null;
}

// A perch of `kind` on a bubble's floor, on its side with more room. A hang there is by the hand on that side, facing the viewer; with
// only the other hand free it turns to face the bubble, as one hangs from a ledge facing the wall, so that hand comes to the corner.
function perchAt(floor, kind, view, hands) {
    const side = sideOf(floor, view);
    if (kind === SITS) return {floor: floor.id, kind, side, grip: ""};
    const grip = hands.find((hand) => HAND_CORNER[hand] === side);
    return grip ? {floor: floor.id, kind, side, grip, face: 0} : {floor: floor.id, kind, side, grip: hands[0], face: TURNED_TO_THE_BUBBLE};
}

// Where the perch's figure stands now, with the way it faces, or null when its bubble is no floor of `floors` or out of the thread's view,
// when any part of the figure there would be outside its world, or when it would hide words or controls, such as those of the message above
export function perchSpot(perch, floors, figure) {
    const floor = floors.floors.find((each) => each.id === perch.floor);
    if (!floor || !inView(floor, floors.view, figure)) return null;
    const spot = spotOn(perch, floor, figure);
    return holds(spot, figure, floors.floors) && !hiddenAt(spot, figure) ? spot : null;
}

function spotOn(perch, floor, figure) {
    if (perch.kind === SITS) return {...seatAt({...floor, width: floor.right - floor.left}, perch.side, figure, PERCH_INBOARD), on: floor.element};
    const out = (perch.side === "left" ? -1 : 1) * HANG_OUT * figure.size;
    const x = (perch.side === "left" ? floor.left : floor.right) + out;
    return {x, y: floor.top, face: perch.face, posture: "hang", grip: perch.grip, on: floor.element};
}

// The next stay, drawn at `now` seconds by the roams' odds: where, until when, and what it holds for the stay, the perch on a bubble, the
// tab it stands on, of those with a spot inside its world, or the point along the home edge it strolls to. A hang from a bubble is a short
// one.
export function nextStay(now, figure, hands, random) {
    const {where, stay: seconds} = roamNext(random);
    const until = now + seconds;
    if (where === "bubble") {
        const perch = perchOn(latestFloors(), figure, hands, random);
        return {where, until: perch?.kind === HANGS ? now + between(HANG_STAY, random) : until, perch};
    }
    if (where === "tab") {
        const tabs = Object.keys(openTabs()).filter((view) => spotOf(view, figure));
        return {where, until, view: tabs[Math.floor(random() * tabs.length)]};
    }
    if (where === "edge") return {where, until, along: {x: random() * window.innerWidth, y: 0}};
    return {where, until};
}

// The spot of a stay now for a figure at `near`, or null when its bubble or tab is gone or its perch is no longer free; a tab it only
// visits is not one it points at
export function stayingAt(stay, figure, near) {
    if (stay.where === "bubble") {
        const spot = stay.perch && perchSpot(stay.perch, latestFloors(), figure);
        return spot ? {...spot, view: null} : null;
    }
    if (stay.where === "tab") {
        const spot = stay.view && spotOf(stay.view, figure, near);
        return spot ? {...spot, view: null} : null;
    }
    if (stay.where === "edge") return spotOf(null, figure, stay.along);
    return seatOf(figure, near);
}

// Where the figure goes now and the stay it keeps: seated at home while its agent cannot act; to the tab of what waits on the user when
// something does and that tab has a spot inside the figure's world; otherwise where its stay is, drawing the next stay when this one is
// over or its place is gone. `near` is where it is, `counts` the views' badge counts and `state` what the agent does. The spot is kept
// clear of the box the figure stepped aside from while that box is `cleared` (keptClear).
export function targetFor({state, counts, stay, now, near, figure, hands, cleared = {until: 0}, random = Math.random}) {
    const target = targetOf({state, counts, stay, now, near, figure, hands, random});
    return {...target, spot: keptClear(target.spot, {state, now, near, figure, cleared})};
}

// The spot, or, while the box the figure stepped aside from is `cleared` and the spot's picture would cover it, one at home clear of it
export function keptClear(spot, {state, now, near, figure, cleared}) {
    if (now >= cleared.until || !overlaps(boxAt(spot, figure), cleared.box)) return spot;
    return clearOf(cleared.box, figure, near, RESTS.has(state)) ?? spot;
}

function targetOf({state, counts, stay, now, near, figure, hands, random}) {
    if (RESTS.has(state)) return {spot: seatOf(figure, near), stay};
    const pressing = pointedView(counts, openTabs());
    const pointing = pressing && spotOf(pressing, figure, near);
    if (pointing) return {spot: pointing, stay};
    const kept = now < stay.until && stayingAt(stay, figure, near);
    if (kept) return {spot: kept, stay};
    const next = nextStay(now, figure, hands, random);
    return {spot: stayingAt(next, figure, near) || seatOf(figure, near), stay: next};
}

// how long the box a figure stepped aside from stays clear of it, in seconds
export const CLEARED_SECONDS = 30;

// The stay and the cleared box once the figure steps out of the way, as when the user clicks it or a message appears under it: the stay is
// over, and `box`, the picture it was drawn in then, is kept clear of it for CLEARED_SECONDS
export const stepAside = (stay, box, now) => ({stay: {...stay, until: 0}, cleared: {box, until: now + CLEARED_SECONDS}});

// The stay once the ground went from under the figure: a stroll along the home edge or a seat there is kept, any stay away from home is
// given up for a seat
export const stayAtHome = (stay) => (stay.where === "edge" ? stay : {where: "seat", until: stay.where === "seat" ? stay.until : 0});

// The stay once a look comes: over at once when the figure hangs there with its back to the viewer, so it lets go and turns round to
// show it, else kept
export const stayForLook = (stay, place) => (letsGoFor(place) ? {...stay, until: 0} : stay);
