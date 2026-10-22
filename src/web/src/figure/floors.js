import {HOME, boxAt, groundEdge, inWorld, worldBox} from "./places.js";

// the chat's bubbles, which the figure walks, sits and hangs on
const BUBBLE = "[data-figure-bubble]";

// How long a gap between two reads may be and still count as one stretch of motion: after a longer one, as when the tab was away, the
// floors start still, so a figure is carried to where they are now instead of being thrown
const GAP_MS = 250;

let snapshot = Object.freeze({at: 0, world: null, view: null, floors: Object.freeze([])});
let frame = 0;

// The floors the figure lives on, as they were at the last frame the loop read the page; the avatar's loop reads only this
export const latestFloors = () => snapshot;

// A floor's id stays with the element it is the top of, so a bubble keeps its id while the chat scrolls it
const ids = new WeakMap();
let issued = 0;
export function floorOf(element) {
    if (!ids.has(element)) ids.set(element, `floor-${++issued}`);
    return ids.get(element);
}

const inView = (box, view) => box.top >= view.top && box.top <= view.bottom && box.right > view.left && box.left < view.right;

// the thread the main chat shows, whose bubbles are floors
const threadOf = () => document.querySelector(HOME)?.closest(".thread")?.querySelector(".thread-scroll") ?? null;

// The tops of the chat's bubbles in the thread's view and of the page's tabs, each a floor named by its element
function elementFloors(thread, view) {
    const bubbles = thread ? [...thread.querySelectorAll(BUBBLE)].map((element) => ({element, kind: "bubble"})) : [];
    const tabs = [...document.querySelectorAll("[data-tab]")].map((element) => ({element, kind: "tab"}));
    return [...bubbles, ...tabs]
        .map(({element, kind}) => ({element, kind, box: element.getBoundingClientRect()}))
        .filter(({kind, box}) => box.width > 0 && box.height > 0 && (kind !== "bubble" || inView(box, view)))
        .map(({element, kind, box}) => ({id: floorOf(element), kind, element, left: box.left, right: box.right, top: box.top}));
}

const velocity = (prev, floor, at) => {
    const was = prev.floors.find((each) => each.id === floor.id);
    const ms = at - prev.at;
    return was && ms > 0 && ms <= GAP_MS ? ((floor.top - was.top) / ms) * 1000 : 0;
};

// One read of the page: home is the ground at home (places.js groundEdge), and under everything the foot of the figure's world
export function readFloors(prev = snapshot, at = performance.now()) {
    const world = worldBox();
    const thread = threadOf();
    const view = thread?.getBoundingClientRect() ?? null;
    const {element, docked, edge} = groundEdge();
    const read = [];
    if (element) read.push({id: "home", kind: docked ? "dock" : "compose", element, left: edge.left, right: edge.left + edge.width, top: edge.top});
    read.push(...elementFloors(thread, view));
    read.push({id: "foot", kind: "foot", left: world.left, right: world.right, top: world.bottom});
    return Object.freeze({at, world, view, floors: Object.freeze(read.map((floor) => Object.freeze({...floor, vy: velocity(prev, floor, at)})))});
}

// who is handed each read the moment it is made, in the same frame, as the drawing of the floors is
const readers = new Set();
export function onFloors(read) {
    readers.add(read);
    return () => readers.delete(read);
}

export function startFloors() {
    stopFloors();
    const loop = () => {
        frame = requestAnimationFrame(loop);
        if (document.hidden) return;
        snapshot = readFloors(snapshot);
        readers.forEach((read) => read(snapshot));
    };
    loop();
}

export function stopFloors() {
    cancelAnimationFrame(frame);
}

// how far the ground at home may move from the figure's feet in one frame and still carry it, in pixels: further down and it falls from
// where it stood, further up and it is thrown up onto it
const CARRIED_WITHIN = 5;

const floorNamed = (floors, id) => floors.find((floor) => floor.id === id) ?? null;

// What a figure resting on a spot keeps of it: the floor it rests on by id, the spot's place from that floor's left end and top, the
// posture it rests in there, whether it rests at home, which is then whatever is the ground at home as bars dock over the compose box
// and go, and the height of home and the moment `at` it was there; null when it rests on no floor on the page
export function footingOn(spot, floors = readFloors().floors) {
    const home = floorNamed(floors, "home");
    const id = !spot.on ? null : spot.on === home?.element ? "home" : floorOf(spot.on);
    const floor = id && floorNamed(floors, id);
    if (!floor) return null;
    return {id, dx: spot.x - floor.left, dy: spot.y - floor.top, posture: spot.posture, home: id === "home"};
}

// Where a footing's spot is now, carried along as its floor moves, or null when the ground went from under the figure: the floor left the
// snapshot, as a bubble scrolls out of the chat, it carried the figure out of its world, or it carried a hanging figure's feet down onto
// the ground at home, where it lets go and stands
export function footingNow({id, dx, dy, posture}, figure, floors = latestFloors().floors) {
    const floor = floorNamed(floors, id);
    if (!floor) return null;
    const spot = {x: floor.left + dx, y: floor.top + dy, posture};
    return holds(spot, figure, floors) ? {x: spot.x, y: spot.y} : null;
}

// Whether a figure resting at `spot` is held there: inside its world, and, hanging, with its feet clear of the ground at home, where a
// hanging figure lets go and stands. The one rule for choosing a perch and for keeping it, so a perch chosen is a perch that holds.
export function holds(spot, figure, floors = latestFloors().floors) {
    const home = floorNamed(floors, "home");
    if (spot.posture === "hang" && home && boxAt(spot, figure).bottom >= home.top) return false;
    return inWorld(spot, figure);
}

// Where a figure resting at `spot` by `footing` is now, with the footing it keeps and how it got there, or null once its ground has gone from
// under it. Anywhere but home it is carried along with its floor. At home it stays where it stood along the ground, at its height above
// whatever is home now, measured every frame: carried while home is within CARRIED_WITHIN pixels of its feet, "dropping" when home fell
// further, as when a bar goes, and "launched" when it rose further, as when a bar docks over the compose box.
export function groundUnder(footing, spot, figure, floors = latestFloors().floors) {
    const now = footingNow(footing, figure, floors);
    if (!now) return null;
    if (!footing.home) return {spot: {...spot, ...now}, footing, motion: "carried"};
    const home = floorNamed(floors, "home");
    const shift = now.y - spot.y;
    const motion = Math.abs(shift) <= CARRIED_WITHIN ? "carried" : shift > 0 ? "dropping" : "launched";
    return {spot: {...spot, y: now.y}, footing: {...footing, dx: spot.x - home.left}, motion};
}

// Where a trip to a spot ends: the spot carried along by `footing`, so it lands on the line where its floor is now; the spot as it was
// once its floor has gone
export function landingOn(spot, footing, figure, floors = latestFloors().floors) {
    const now = footing && footingNow(footing, figure, floors);
    return now ? {...spot, ...now} : spot;
}
