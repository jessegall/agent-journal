import {BUBBLE, threadOf} from "./perches.js";
import {DOCKED_BARS, HOME, worldBox} from "./places.js";

// How long a gap between two reads may be and still count as one stretch of motion: after a longer one, as when the tab was away, the
// floors start still, so a figure is carried to where they are now instead of being thrown
const GAP_MS = 250;

let snapshot = Object.freeze({at: 0, world: null, floors: Object.freeze([])});
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

// The tops of the chat's bubbles in the thread's view and of the page's tabs, each a floor named by its element
function elementFloors() {
    const thread = threadOf();
    const view = thread?.getBoundingClientRect();
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

// One read of the page: home is the topmost of the bars docked over the compose box, else the compose box itself, and under everything
// the foot of the figure's world
export function readFloors(prev = snapshot, at = performance.now()) {
    const world = worldBox();
    const home = document.querySelector(HOME);
    const bars = home?.closest(".thread")?.querySelector(DOCKED_BARS);
    const read = [];
    const element = bars || home;
    if (element) {
        const box = element.getBoundingClientRect();
        read.push({id: "home", kind: bars ? "dock" : "compose", element, left: box.left, right: box.right, top: box.top});
    }
    read.push(...elementFloors());
    read.push({id: "foot", kind: "foot", left: world.left, right: world.right, top: world.bottom});
    return Object.freeze({at, world, floors: Object.freeze(read.map((floor) => Object.freeze({...floor, vy: velocity(prev, floor, at)})))});
}

export function startFloors() {
    stopFloors();
    const loop = () => {
        frame = requestAnimationFrame(loop);
        if (!document.hidden) snapshot = readFloors(snapshot);
    };
    loop();
}

export function stopFloors() {
    cancelAnimationFrame(frame);
}
