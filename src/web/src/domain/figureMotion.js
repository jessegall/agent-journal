import {fallStep} from "./falls.js";

// How far, in pixels, a figure's feet may be from a floor's top and still stand on it
export const ON_FLOOR = 2;

const holds = (floor, x) => x >= floor.left && x <= floor.right;

// How far a walker's feet may be from a floor's top and still keep to it, as when the floor moved while the figure got up to go: it is
// carried onto that floor's top, or falls to it
export const KEPT_WITHIN = 8;

// The floor nearest a figure's feet at `x`, `y` within `within` pixels of them, or null when the snapshot holds none so near
export const floorAt = (floors, x, y, within = ON_FLOOR) =>
    floors
        .filter((floor) => holds(floor, x) && Math.abs(floor.top - y) <= within)
        .sort((a, b) => Math.abs(a.top - y) - Math.abs(b.top - y))[0] ?? null;

// The highest floor under a figure's feet at `x`, `y`: never one the feet were already below
export const floorBelow = (floors, x, y) =>
    floors.filter((floor) => holds(floor, x) && floor.top >= y - ON_FLOOR).sort((a, b) => a.top - b.top)[0] ?? null;

// The floors at home, the only ones that throw a figure up or let it drop: anywhere else a floor that moves, as a bubble the chat scrolls,
// carries the figure with it
export const HOME_FLOORS = ["dock", "compose", "foot"];

// What became of the floor a walker set off on: gone, or a home floor dropped away under its feet, so it falls; or still there, `dy`
// pixels above or below the line it walks and `dx` pixels to bring it back inside a floor that narrowed past its feet, which carry it
export function underWalker(floors, id, x, y) {
    const floor = floors.find((each) => each.id === id);
    if (!floor || (HOME_FLOORS.includes(floor.kind) && floor.top > y + ON_FLOOR)) return {falls: true, dx: 0, dy: 0};
    return {falls: false, dx: Math.min(Math.max(x, floor.left), floor.right) - x, dy: floor.top - y};
}

// The floors a fall can end on: every floor when the figure lets a bubble catch it, else only the floors at home (the user's ruling: it is
// up to the avatar, fall by fall)
export const catching = (floors, bubblesCatch) => (bubblesCatch ? floors : floors.filter((floor) => HOME_FLOORS.includes(floor.kind)));

// The share of the way a leg with `easing` has gone at `share` of its time: as the browser eases a transition, so a CSS cubic-bezier
// steps the same in code; "linear" or any other easing goes at an even pace
export function eased(easing, share) {
    const curve = /^cubic-bezier\(([^)]*)\)$/.exec(easing ?? "");
    if (!curve || share <= 0 || share >= 1) return Math.min(1, Math.max(0, share));
    const [x1, y1, x2, y2] = curve[1].split(",").map(Number);
    const along = (t, a, b) => 3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t;
    let [low, high] = [0, 1];
    for (let step = 0; step < 30; step++) {
        const t = (low + high) / 2;
        if (along(t, x1, x2) < share) low = t;
        else high = t;
    }
    return along((low + high) / 2, y1, y2);
}

// Where a leg under way has carried the picture `elapsed` milliseconds after it set off from `from`: still at the start through the
// leg's lead, then along it by the leg's easing to its end; with motion kept `still`, a hop is at its end at once
export function legAt(leg, from, elapsed, still = false) {
    const share = still && leg.hopping ? 1 : eased(leg.easing, leg.ms > 0 ? (elapsed - leg.lead) / leg.ms : 1);
    return {x: from.x + (leg.x - from.x) * share, y: from.y + (leg.y - from.y) * share};
}

// One frame of a figure falling from `body` (its feet line and speed) to the floor under it, `seconds` after the last: it lands on that
// floor the moment it touches, with the floor it landed on, and falls to the window's foot when nothing else is under it; with motion
// kept `still`, it is on that floor at once
export function fallFrame(body, floors, seconds, fall, size, still = false) {
    const floor = floorBelow(floors, body.x, body.y);
    if (!floor) return {...body, landed: null};
    if (still) return {x: body.x, y: floor.top, speed: 0, landed: floor};
    const step = fallStep({y: body.y, speed: body.speed}, floor.top, seconds, fall, size);
    return {x: body.x, y: step.y, speed: step.speed, landed: step.landed ? floor : null};
}

// A trip re-aimed at where its destination is now, `landed`: the legs that end on the destination's line, and the leg under way among
// them, `leg`, carried with it, and `from`, where that leg set off, moved along with it, so a hop stays upright and lands on the ground
// where it is rather than where it was
export function aimedAt(trip, leg, from, landed) {
    const dx = landed.x - trip.to.x;
    const dy = landed.y - trip.to.y;
    if (Math.hypot(dx, dy) <= 0.3) return {trip, leg, from};
    const end = (trip.legs.at(-1) ?? leg).y;
    const carried = (each) => (each.y === end ? {...each, x: each.x + dx, y: each.y + dy} : each);
    const under = leg.y === end;
    return {trip: {...trip, to: landed, legs: trip.legs.map(carried)}, leg: under ? carried(leg) : leg, from: under ? {...from, x: from.x + dx} : from};
}

// How far the squire's chase may run, out to its right and back: as far as `most` pixels along the floor under its feet, never past that
// floor's right end or the right of its world, so it never runs into the air; nothing when it stands on no floor
export function chaseRoom(floors, world, feet, picture, most) {
    const floor = floorAt(floors, feet.x, feet.y, KEPT_WITHIN);
    if (!floor) return 0;
    return Math.max(0, Math.min(most, floor.right - feet.x, world.right - picture.right));
}

// the odds that a bubble a figure falls past catches it, rather than it dropping straight home: the avatar's own choice, fall by fall
export const BUBBLES_CATCH = 0.5;

// A fall from the line a figure rests on at `spot`, in its posture there, starting at `now`: never from below the floor at home, going on
// to `to` once it lands, and caught by a bubble it falls past when `random()` says so
export function fallingFrom(spot, to, floors, now, random) {
    const home = floors.find((floor) => floor.id === "home");
    const y = home ? Math.min(spot.y, home.top) : spot.y;
    return {x: spot.x, y, posture: spot.posture, speed: 0, at: now, to, catches: random() < BUBBLES_CATCH};
}

// One frame of a fall at `now` (fallFrame): the fall stepped on, or, once it lands, null with the spot it settles on in the posture it
// fell in, where it goes on to and whether it landed on its feet
export function airborneFrame(airborne, floors, now, fall, size, still = false) {
    const fell = fallFrame(airborne, catching(floors, airborne.catches), (now - airborne.at) / 1000, fall, size, still);
    if (!fell.landed) return {airborne: {...airborne, ...fell, at: now}, landed: null};
    const spot = {x: fell.x, y: fell.landed.top, posture: airborne.posture, view: null, on: fell.landed.element ?? null};
    return {airborne: null, landed: {spot, to: airborne.to, standing: airborne.posture === "stand"}};
}
