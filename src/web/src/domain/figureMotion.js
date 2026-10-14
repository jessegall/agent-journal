import {fallStep} from "./falls.js";

// How far, in pixels, a figure's feet may be from a floor's top and still stand on it
export const ON_FLOOR = 2;

const holds = (floor, x) => x >= floor.left && x <= floor.right;

// The floor a figure's feet at `x`, `y` stand on, or null when they stand on none the snapshot holds
export const floorAt = (floors, x, y) => floors.find((floor) => holds(floor, x) && Math.abs(floor.top - y) <= ON_FLOOR) ?? null;

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

// Where a leg under way has carried the picture `elapsed` milliseconds after it set off from `from`: still at the start through the
// leg's lead, then at an even pace to its end
export function legAt(leg, from, elapsed) {
    const share = leg.ms > 0 ? Math.min(1, Math.max(0, (elapsed - leg.lead) / leg.ms)) : 1;
    return {x: from.x + (leg.x - from.x) * share, y: from.y + (leg.y - from.y) * share};
}

// One frame of a figure falling from `body` (its feet line and speed) to the floor under it, `seconds` after the last: it lands on that
// floor the moment it touches, with the floor it landed on, and falls to the window's foot when nothing else is under it
export function fallFrame(body, floors, seconds, fall, size) {
    const floor = floorBelow(floors, body.x, body.y);
    if (!floor) return {...body, landed: null};
    const step = fallStep({y: body.y, speed: body.speed}, floor.top, seconds, fall, size);
    return {x: body.x, y: step.y, speed: step.speed, landed: step.landed ? floor : null};
}
