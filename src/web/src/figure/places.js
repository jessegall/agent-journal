// Where the figure can stand, read from the page as it is laid out at this moment and never stored: the top edge of the main
// chat's compose box is home, and each of Home's tabs is a place it can go to point at what waits there.
export const HOME = "[data-figure-home]";

// the page area, whose foot is the figure's floor on a page with no compose box
export const FLOOR = "[data-figure-floor]";

// the bars docked over the main chat's compose box, such as a report's, which the figure is pushed up onto while they are there
export const LEDGE = "[data-figure-ledge]";

// how far along its edge the figure may stand, as shares of the edge's width, the one it prefers first
const HOME_ALONG = [0.85, 0.6, 0.35, 0.15];

// What waits on the user, most pressing first; anything that merely happens never outranks these
export const POINT_RANK = ["question", "waiting", "suggestion"];

// The view to point at: the most pressing one that holds something for the user and has a tab open, but not in front
export const pointedView = (counts, tabs) => POINT_RANK.find((view) => counts[view] > 0 && tabs[view] === "behind") || null;

// Each tab on the page by its view: "front" when the user is looking at it, "behind" when another tab of its pane is
export function openTabs() {
    const tabs = {};
    for (const tab of document.querySelectorAll("[data-tab]")) {
        const shown = tab.getAttribute("aria-selected") === "true";
        tabs[tab.dataset.tab] = shown || tabs[tab.dataset.tab] === "front" ? "front" : "behind";
    }
    return tabs;
}

// What a figure standing somewhere must not hide: anything the user can press or type into
const CONTROLS = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])";

// How each posture meets the line it rests on: the share of the figure's height from that line down to the feet of its standing picture,
// and the posture it travels in to get there. It stands with its feet on the line, sits with its hips on it and hangs by its hands from
// it; it walks to a seat on its feet and sits down there, and leaps straight to a hang. On the move it walks with its feet on the line.
const SEAT_DROP = 0.26;
const HANG_DROP = 0.8;
export const POSTURES = {
    stand: {drop: 0, travels: "stand"},
    sit: {drop: SEAT_DROP, travels: "stand"},
    hang: {drop: HANG_DROP, travels: "hang"},
    walk: {drop: 0, travels: "stand"},
};

// how long the figure takes to change from one clip, posture or facing to the next, easing out of the pose before it, in seconds
export const CHANGE_SECONDS = 0.25;

// The posture a clip is drawn in at a place of `posture`: that one when the clip can be drawn in it, else the first the clip can
export const postureOf = (clip, posture) => (clip.postures.includes(posture) ? posture : clip.postures[0]);

// The box a figure's picture takes in `posture` on a spot's line: `size` pixels square, `below` the share of its picture under its feet
export const boxAt = (spot, {size, below}, posture = spot.posture) => {
    const top = spot.y - (1 - below - POSTURES[posture].drop) * size;
    return {left: spot.x - size / 2, right: spot.x + size / 2, top, bottom: top + size};
};

const overlaps = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
// the figure is in the window when its picture's left, right and top are and the line it rests on is; a seated figure's legs may hang
// past the foot of the window, as they hang past any edge it sits on
const inWindow = (spot, box) => box.left >= 0 && box.top >= 0 && box.right <= window.innerWidth && spot.y <= window.innerHeight;

// The spot whose figure stays in the window and covers the fewest controls, none where it can; of spots alike, the one nearest
// `near`, where the figure stands now, so it does not wander between equally good places
export function freeSpot(spots, figure, near) {
    const controls = [...document.querySelectorAll(CONTROLS)]
        .map((control) => control.getBoundingClientRect())
        .filter((box) => box.width && box.height);
    const covered = (spot) => {
        const box = boxAt(spot, figure);
        return (inWindow(spot, box) ? 0 : controls.length + 1) + controls.filter((control) => overlaps(box, control)).length;
    };
    const away = (spot) => (near ? Math.hypot(spot.x - near.x, spot.y - near.y) : 0);
    const ranked = spots.map((spot) => ({spot, covered: covered(spot), away: away(spot)}));
    return ranked.reduce((best, each) =>
        each.covered < best.covered || (each.covered === best.covered && each.away < best.away) ? each : best
    ).spot;
}

// The spots on an element's top edge at each share of its width
const alongTop = (box, shares) => shares.map((share) => ({x: box.left + box.width * share, y: box.top, posture: "stand"}));

// Where a figure goes to point at a tab: on top of it, just under it with its head at the tab's foot, or half a figure lower still,
// at the tab or up to a figure and a half to either side, so some spot near it is clear of whatever else is open beside the tabs
const SIDEWAYS = [0, -0.5, 0.5, -1, 1, -1.5, 1.5];

function tabSpots(tab, figure) {
    const box = tab.getBoundingClientRect();
    const middle = box.left + box.width / 2;
    const under = box.bottom + (1 - figure.below) * figure.size;
    const heights = [box.top, under, under + figure.size / 2];
    return SIDEWAYS.flatMap((share) => heights.map((y) => ({x: middle + share * figure.size, y, posture: "stand"})));
}

// Where a figure sits: on a corner of a box it perches on, turned along the edge it dangles over and a third of the way back toward the
// viewer, so its eyes and what it holds on its lap are seen, with its hips a little inboard of the corner so the weight rests on the
// surface behind the edge and only the legs reach past it
const SEAT_SIDES = {
    right: {along: 1, inboard: -1, face: 60},
    left: {along: 0, inboard: 1, face: 300},
};
const SEAT_INBOARD = 0.14;

// The seat on one corner of a box's top edge, `side` being "left" or "right"; `face` turns the figure along the edge, 0 faces the viewer
export function seatAt(box, side, {size}) {
    const {along, inboard, face} = SEAT_SIDES[side];
    return {x: box.left + box.width * along + inboard * SEAT_INBOARD * size, y: box.top, face, posture: "sit"};
}

// the pixels of a seated figure above the edge it sits on
export const seatRise = ({size, below}) => (1 - below - SEAT_DROP) * size;

// A spot kept inside the window: the figure's picture within its left, right and top, and the line it rests on at or above the foot of the
// window, so whatever it stands or sits on there is a line it can rest on in every posture
export function insideWindow(spot, {size, below}) {
    const drop = POSTURES[spot.posture].drop * size;
    return {
        ...spot,
        x: Math.min(Math.max(spot.x, size / 2), window.innerWidth - size / 2),
        y: Math.min(Math.max(spot.y, (1 - below) * size - drop), window.innerHeight),
    };
}

// A seat on a corner of the edge the figure stands on at home; with nothing there it sits on the foot of the window, its legs past it
export function seatOf(figure, near) {
    const {element, edge} = groundEdge();
    const spot = freeSpot(Object.keys(SEAT_SIDES).map((side) => seatAt(edge, side, figure)), figure, near);
    return {...insideWindow(spot, figure), view: null, on: element};
}

// The edge a figure stands on at home: the bars docked over the main chat's compose box while there are any, else the compose box, else
// the floor of the page itself, else the foot of the window
export function groundEdge() {
    const home = document.querySelector(HOME);
    const top = home?.closest(".thread")?.querySelector(LEDGE) || home;
    const element = top || document.querySelector(FLOOR);
    if (!element) return {element: null, edge: {left: 0, width: window.innerWidth, top: window.innerHeight}};
    const box = element.getBoundingClientRect();
    return {element, edge: {left: box.left, width: box.width, top: top ? box.top : box.bottom}};
}

// Home is the main chat's compose box; a page without one gives the figure the floor of the page itself. Each spot names the element
// it rests on as `on`, so the figure can tell when that element has gone or moved.
export function spotOf(view, figure, near) {
    const tab = view && document.querySelector(`[data-tab="${view}"]`);
    if (tab) return {...freeSpot(tabSpots(tab, figure), figure, near), view, on: tab};
    const {element, edge} = groundEdge();
    return {...insideWindow(freeSpot(alongTop(edge, HOME_ALONG), figure, near), figure), view: null, on: element};
}
