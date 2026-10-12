// Where the figure can stand, read from the page as it is laid out at this moment and never stored: the top edge of the main
// chat's compose box is home, and each of Home's tabs is a place it can go to point at what waits there.
export const HOME = "[data-figure-home]";

// the page area, whose foot is the figure's floor on a page with no compose box
export const FLOOR = "[data-figure-floor]";

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

// The box a figure takes with its feet on a spot: `size` pixels square, `below` the share of its picture under its feet
export const boxAt = (spot, {size, below}) => ({
    left: spot.x - size / 2,
    right: spot.x + size / 2,
    top: spot.y - (1 - below) * size,
    bottom: spot.y + below * size,
});

const overlaps = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
// the figure is in the window when all of it above its feet is; the strip of its picture under its feet is empty
const inWindow = (spot, box) => box.left >= 0 && box.top >= 0 && box.right <= window.innerWidth && spot.y <= window.innerHeight;

// The spot whose figure stays in the window and covers the fewest controls, none where it can; of spots alike, the one nearest
// `near`, where the figure stands now, so it does not wander between equally good places
export function freeSpot(spots, figure, near) {
    const controls = [...document.querySelectorAll(CONTROLS)]
        .map((control) => control.getBoundingClientRect())
        .filter((box) => box.width && box.height);
    const covered = (spot) =>
        (inWindow(spot, boxAt(spot, figure)) ? 0 : controls.length + 1) +
        controls.filter((box) => overlaps(boxAt(spot, figure), box)).length;
    const away = (spot) => (near ? Math.hypot(spot.x - near.x, spot.y - near.y) : 0);
    const ranked = spots.map((spot) => ({spot, covered: covered(spot), away: away(spot)}));
    return ranked.reduce((best, each) =>
        each.covered < best.covered || (each.covered === best.covered && each.away < best.away) ? each : best
    ).spot;
}

// The spots on an element's top edge at each share of its width
const alongTop = (box, shares) => shares.map((share) => ({x: box.left + box.width * share, y: box.top}));

// Where a figure goes to point at a tab: on top of it, just under it with its head at the tab's foot, or a figure's width to either side
function tabSpots(tab, figure) {
    const box = tab.getBoundingClientRect();
    const middle = box.left + box.width / 2;
    const under = box.bottom + (1 - figure.below) * figure.size;
    return [middle, middle - figure.size, middle + figure.size].flatMap((x) => [
        {x, y: box.top},
        {x, y: under},
    ]);
}

// Home is the main chat's compose box; a page without one gives the figure the floor of the page itself
export function spotOf(view, figure, near) {
    const tab = view && document.querySelector(`[data-tab="${view}"]`);
    if (tab) return {...freeSpot(tabSpots(tab, figure), figure, near), view};
    const home = document.querySelector(HOME);
    const box = (home || document.querySelector(FLOOR)).getBoundingClientRect();
    const edge = {left: box.left, width: box.width, top: home ? box.top : box.bottom};
    return {...freeSpot(alongTop(edge, HOME_ALONG), figure, near), view: null};
}
