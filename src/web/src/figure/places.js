// Where the figure can stand, read from the page as it is laid out at this moment and never stored: the top edge of the main
// chat's compose box is home, and each of Home's tabs is a place it can go to point at what waits there.
export const HOME = "[data-figure-home]";

// how far along home's edge the figure stands, as a share of its width
const HOME_ALONG = 0.85;

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

// The spot on an element's top edge the figure's feet go to, in the window's pixels: the middle of a tab, the right of home;
// where a figure `tall` pixels high has no room above the edge, it stands just under the element instead, its head at the element's foot
const spotOn = (element, along, tall = 0) => {
    const box = element.getBoundingClientRect();
    return {x: box.left + box.width * along, y: box.top >= tall ? box.top : box.bottom + tall};
};

export function spotOf(view, tall) {
    const tab = view && document.querySelector(`[data-tab="${view}"]`);
    if (tab) return {...spotOn(tab, 0.5, tall), view};
    const home = document.querySelector(HOME);
    return home ? {...spotOn(home, HOME_ALONG), view: null} : {x: window.innerWidth * HOME_ALONG, y: window.innerHeight, view: null};
}
