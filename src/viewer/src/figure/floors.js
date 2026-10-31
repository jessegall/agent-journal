import {CHAT_FOOT, FEET_INBOARD, boxAt, composeEdge, groundEdge, homeElement, inWorld, worldBox} from "./places.js";
import {GRAVITY} from "../domain/falls.js";

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
const threadOf = () => homeElement()?.closest(".thread")?.querySelector(".thread-scroll") ?? null;

// What the chat shows of its bubbles: the thread's view down to the top of its foot, which stays over the bubbles that scroll behind it, so
// a bubble's top hidden behind the docks is no floor and a figure is never stood inside them
function seenOf(thread, view) {
    const foot = thread.querySelector(CHAT_FOOT)?.getBoundingClientRect();
    return {left: view.left, right: view.right, top: view.top, bottom: foot ? Math.min(view.bottom, foot.top) : view.bottom};
}

// The tops of the chat's bubbles it shows (seenOf) and of the page's tabs, each a floor named by its element, with its bottom too
function elementFloors(thread, view) {
    const seen = thread && seenOf(thread, view);
    const bubbles = thread ? [...thread.querySelectorAll(BUBBLE)].map((element) => ({element, kind: "bubble"})) : [];
    const tabs = [...document.querySelectorAll("[data-tab]")].map((element) => ({element, kind: "tab"}));
    return [...bubbles, ...tabs]
        .map(({element, kind}) => ({element, kind, box: element.getBoundingClientRect()}))
        .filter(({kind, box}) => box.width > 0 && box.height > 0 && (kind !== "bubble" || inView(box, seen)))
        .map(({element, kind, box}) => ({id: floorOf(element), kind, element, left: box.left, right: box.right, top: box.top, bottom: box.bottom}));
}

const velocity = (prev, floor, at) => {
    const was = prev.floors.find((each) => each.id === floor.id);
    const ms = at - prev.at;
    return was && ms > 0 && ms <= GAP_MS ? ((floor.top - was.top) / ms) * 1000 : 0;
};

// One read of the page: home is the ground at home (places.js groundEdge); the compose box's top, under whatever is docked over it, is
// the floor the figure builds on, which nothing but a figure building stands on; and under everything the foot of the figure's world
export function readFloors(prev = snapshot, at = performance.now()) {
    const world = worldBox();
    const thread = threadOf();
    const view = thread?.getBoundingClientRect() ?? null;
    const {element, docked, edge} = groundEdge();
    const read = [];
    if (element) read.push({id: "home", kind: docked ? "dock" : "compose", element, left: edge.left, right: edge.left + edge.width, top: edge.top});
    const build = composeEdge();
    if (build.element) read.push({id: floorOf(build.element), kind: "build", element: build.element, left: build.edge.left, right: build.edge.left + build.edge.width, top: build.edge.top});
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

// how far home may rise under the figure's feet in one frame and still carry it up, in pixels: one docked bar's height and its gap, so a
// bar docking over the compose box lifts the figure along with its floor, and only a rise further than that throws it up
const CARRIED_UP_WITHIN = 56;

// A bubble the figure rides or hangs from rising in a burst, as a scroll down the chat moves it: it carries the figure up while it rises
// faster than `rising` pixels a second, and once a burst that reached `speed` slows again, the figure is thrown on up off it, as high as
// `share` of how far the bubble rose in the burst, so a small nudge throws it a little way and a long fast scroll high, off the top of the
// screen; a burst that never reached `speed` carries it along and leaves it there
export const FLUNG = {speed: 1500, rising: 200, share: 0.6};

// the speed a figure is thrown up at, in pixels a second (up is less than 0), off a bubble that rose `risen` pixels in its burst (FLUNG)
export const throwSpeed = (risen) => -Math.sqrt(2 * GRAVITY * FLUNG.share * risen);

export const floorNamed = (floors, id) => floors.find((floor) => floor.id === id) ?? null;

// What a figure resting on a spot keeps of it: the floor it rests on by id, the spot's place from that floor's left end and top, the
// posture it rests in there, and whether it rests at home on the bars docked over the compose box, which it then rides on as they grow
// and shrink, unless the spot `stays` on its own element, as where the figure builds. A figure on the compose box keeps to the compose box,
// so a bar that docks over it slides in past it and never lifts it; null when it rests on no floor on the page
export function footingOn(spot, floors = readFloors().floors) {
    const home = floorNamed(floors, "home");
    const docked = home?.kind === "dock";
    const id = !spot.on ? null : spot.on === home?.element && docked && !spot.stays ? "home" : floorOf(spot.on);
    const floor = id && floorNamed(floors, id);
    if (!floor) return null;
    return {id, dx: spot.x - floor.left, dy: spot.y - floor.top, posture: spot.posture, face: spot.face, swings: Boolean(spot.swings), home: id === "home"};
}

// Where a footing's spot is now, carried along as its floor moves, or null when the ground went from under the figure: the floor left the
// snapshot, as a bubble scrolls out of the chat or is replaced, it no longer runs under the feet of a figure standing or seated on it away
// from home, as when the bubble narrowed, it carried the figure out of its world, a seated figure's legs turned the way it faces included, as when the
// chat narrows beside it, or it carried a hanging figure's feet down onto the ground at home, where it lets go and stands
export function footingNow({id, dx, dy, posture, face, swings, home}, figure, floors = latestFloors().floors) {
    const floor = floorNamed(floors, id);
    if (!floor) return null;
    const spot = {x: floor.left + dx, y: floor.top + dy, posture, face};
    return (home || runsUnder(floor, spot, swings)) && holds(spot, figure, floors) ? {x: spot.x, y: spot.y} : null;
}

// whether a figure standing or seated at `spot` has its floor under its feet, between its ends; one hanging from it, swinging under it or
// up a ladder over it holds on wherever it is
export const standsOrSits = ({posture, swings, ladder}) => (posture === "stand" || posture === "sit") && !swings && !ladder;
const runsUnder = (floor, spot, swings) => !standsOrSits({posture: spot.posture, swings}) || (spot.x >= floor.left && spot.x <= floor.right);

// The footing of a figure resting at `spot` that keeps none, from the floors as they are now: the floor whose top is at its feet, within
// CARRIED_WITHIN pixels, and runs under them, so a figure the page stood somewhere keeps to what is there; null when no floor is, and the
// figure falls to the next floor below
export function footingUnder(spot, floors = latestFloors().floors) {
    if (!standsOrSits(spot)) return null;
    const floor = floors.find((each) => Math.abs(each.top - spot.y) <= CARRIED_WITHIN && spot.x >= each.left && spot.x <= each.right);
    return floor ? {id: floor.id, dx: spot.x - floor.left, dy: 0, posture: spot.posture, face: spot.face, home: floor.id === "home"} : null;
}

// Whether a figure resting at `spot` is held there: inside its world, and, hanging, with its feet clear of the ground at home, where a
// hanging figure lets go and stands. The one rule for choosing a perch and for keeping it, so a perch chosen is a perch that holds.
export function holds(spot, figure, floors = latestFloors().floors) {
    const home = floorNamed(floors, "home");
    if (spot.posture === "hang" && home && boxAt(spot, figure).bottom >= home.top) return false;
    return inWorld(spot, figure);
}

// Where a figure resting at `spot` by `footing` is now, with the footing it keeps and how it got there, or null once its ground has gone from
// under it. Anywhere but home it is carried along with its floor, counting on its footing how far the floor has `risen` in a burst and
// whether the burst was `fast`, and "flung" off it once a fast burst is over, or its floor carried it out of sight in one, thrown up at
// `speed` (throwSpeed), unless it swings on a rope under it. At home it stays where it stood along the ground, at its height above
// whatever is home now, measured every frame: carried while home fell no more than CARRIED_WITHIN pixels or rose no more than
// CARRIED_UP_WITHIN, as when one bar docks over the compose box, "dropping" when home fell further, as when a bar goes, and "launched"
// when it rose further, as when several bars dock at once.
export function groundUnder(footing, spot, figure, floors = latestFloors().floors) {
    const now = footingNow(footing, figure, floors);
    if (!footing.home) return awayUnder(footing, spot, now, floors);
    if (!now) return null;
    const home = floorNamed(floors, "home");
    const drop = now.y - spot.y;
    const motion = drop > CARRIED_WITHIN ? "dropping" : -drop > CARRIED_UP_WITHIN ? "launched" : "carried";
    return {spot: {...spot, y: now.y}, footing: {...footing, dx: spot.x - home.left}, motion};
}

// the ground under a figure resting away from home, its footing's spot `now` (footingNow), null once gone: carried along through a burst,
// flung once a fast one is over, "dropping" when the floor a figure stands or sits on went down further than CARRIED_WITHIN pixels from
// its feet in a frame, as a bubble laid out lower, and then the figure falls to the floor below (groundUnder)
function awayUnder(footing, spot, now, floors) {
    const vy = now ? floorNamed(floors, footing.id).vy : 0;
    const rising = Boolean(now) && vy <= -FLUNG.rising && !spot.swings;
    if (!rising && footing.fast) return {spot: now ? {...spot, ...now} : spot, footing: {...footing, risen: 0, fast: false}, motion: "flung", speed: throwSpeed(footing.risen)};
    if (!now) return null;
    if (standsOrSits(spot) && now.y - spot.y > CARRIED_WITHIN) return {spot: {...spot, ...now}, footing, motion: "dropping"};
    const burst = rising ? {risen: (footing.risen ?? 0) + Math.max(spot.y - now.y, 0), fast: Boolean(footing.fast) || vy <= -FLUNG.speed} : {risen: 0, fast: false};
    return {spot: {...spot, ...now}, footing: {...footing, ...burst}, motion: "carried"};
}

// A spot to stand at kept on its floor among `floors`: its feet moved in from either end of the floor its spot is on by as much as a
// standing figure's feet keep in from an edge (places.js FEET_INBOARD), so no trip walks it off the end; a spot on a ladder, which the
// figure climbs to on purpose, one it sits or hangs at, one on a floor too narrow to keep in from both ends, as a tab, and one on no floor
// stay as they are
export function keptOnFloor(spot, floors, figure) {
    const inboard = FEET_INBOARD * figure.size;
    const floor = spot.posture === "stand" && !spot.ladder && spot.on ? floors.find((each) => each.element === spot.on) : null;
    if (!floor || floor.right - floor.left < 2 * inboard) return spot;
    return {...spot, x: Math.min(Math.max(spot.x, floor.left + inboard), floor.right - inboard)};
}

// Where a trip to a spot ends: the spot carried along by `footing`, so it lands on the line where its floor is now; the spot as it was
// once its floor has gone
export function landingOn(spot, footing, figure, floors = latestFloors().floors) {
    const now = footing && footingNow(footing, figure, floors);
    return now ? {...spot, ...now} : spot;
}
