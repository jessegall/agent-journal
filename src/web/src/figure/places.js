import {flips} from "./reactions.js";

// Where the figure can stand, read from the page as it is laid out at this moment and never stored: the top edge of the main
// chat's compose box is home, and each of Home's tabs is a place it can go to point at what waits there.
export const HOME = "[data-figure-home]";

// the page area, whose foot is the figure's floor on a page with no compose box
export const FLOOR = "[data-figure-floor]";

// the bars docked over the main chat's compose box, such as a report's, which the figure is pushed up onto while they are there
export const DOCKED_BARS = "[data-figure-docked-bars]";

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
// the gripping hand of every voice's hang is 2.91 of the picture's 5.4 units above its standing feet: the short arms of these figures
// reach no higher than the head, so the hand, not the hat, is what meets the bubble's corner
const HANG_DROP = 0.54;
export const POSTURES = {
    stand: {drop: 0, travels: "stand"},
    sit: {drop: SEAT_DROP, travels: "stand"},
    hang: {drop: HANG_DROP, travels: "hang"},
    walk: {drop: 0, travels: "stand"},
};

// how long the figure takes to change from one clip, posture or facing to the next, easing out of the pose before it, in seconds
export const CHANGE_SECONDS = 0.25;

// The figure walks this many pixels a second. A jump crouches this long before it leaves the ground and is in the air for this long, a
// little longer for a higher perch, in milliseconds; a fall takes as long as a body takes to drop that far.
const WALK_SPEED = 90;
const JUMP_CROUCH_MS = 280;
const JUMP_AIR_MS = 420;
const JUMP_AIR_PER_PIXEL = 0.25;
const GRAVITY = 2400;
const FLIP_CROUCH_MS = 290;
const FLIP_AIR_MS = 600;
const JUMP_EASING = "cubic-bezier(0.2, 0.7, 0.4, 1)";
const FALL_EASING = "cubic-bezier(0.55, 0, 0.9, 0.6)";
// a difference smaller than this is no trip at all: a clip in motion can leave this much of a gap under the figure's feet, and the
// figure settles where it is rather than falling those few pixels
export const STEADY = 5;

// The trip of a picture `size` pixels tall from `from` to `to`, its left and top, or null when they are closer than STEADY: its way, -1
// left or 1 right, and its legs, each a move of the picture taking `ms` after `lead`. Up to a perch it walks to below it and then jumps,
// now and then turning over on a high jump; down from one it falls first and then walks, never walking on air. `straight` is for ground
// that came or went under it: it goes straight up or down where it is, then walks. It lands after a hop unless it `hangs` there.
export function tripBetween(from, to, size, {straight = false, hangs = false, random = Math.random} = {}) {
    if (Math.hypot(to.x - from.x, to.y - from.y) < STEADY) return null;
    const across = Math.abs(to.x - from.x);
    const walk = across < STEADY ? 0 : (across / WALK_SPEED) * 1000;
    const height = Math.abs(to.y - from.y);
    const up = to.y < from.y;
    const flip = up && flips(height, size, random);
    const air = up ? JUMP_AIR_MS + Math.min(height, 400) * JUMP_AIR_PER_PIXEL : Math.sqrt((2 * height) / GRAVITY) * 1000;
    const hop = {
        x: to.x,
        y: to.y,
        ms: height > STEADY ? (flip ? FLIP_AIR_MS : air) : 0,
        lead: flip ? FLIP_CROUCH_MS : up ? JUMP_CROUCH_MS : 0,
        easing: up ? JUMP_EASING : FALL_EASING,
        hopping: true,
        clip: flip ? "backflip" : up ? "jump" : "fall",
    };
    const stroll = {x: to.x, y: to.y, ms: walk, lead: 0, easing: "linear"};
    const legs = up && !straight ? [{...stroll, y: from.y}, hop] : [{...hop, x: from.x}, stroll];
    return {way: Math.sign(to.x - from.x) || 1, legs, lands: !hangs};
}

// The posture a clip is drawn in at a place of `posture`: that one when the clip can be drawn in it, else the first the clip can
export const postureOf = (clip, posture) => (clip.postures.includes(posture) ? posture : clip.postures[0]);

// The posture the clip on screen is drawn in at a place of `posture`: on the move only while the figure `moves`, so its legs stop walking
// the moment it stops, whatever the clip over them still has to play
export const drawnIn = (shown, posture, moves) => (shown.posture === "walk" && moves ? "walk" : postureOf(shown.clip, posture));

// The box a figure's picture takes in `posture` on a spot's line: `size` pixels square, `below` the share of its picture under its feet
export const boxAt = (spot, {size, below}, posture = spot.posture) => {
    const top = spot.y - (1 - below - POSTURES[posture].drop) * size;
    return {left: spot.x - size / 2, right: spot.x + size / 2, top, bottom: top + size};
};

export const overlaps = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
// whether an element is drawn at all, its own and its ancestors' opacity and visibility counted, as a turn's tools are not until it is
// hovered; where the page cannot say, it is taken as drawn
const visible = (element) => element.checkVisibility?.({opacityProperty: true, visibilityProperty: true}) ?? true;

// The box the figure lives in, which no part of it is ever drawn outside: the main chat's window while the page has one, else the page
// area, else the window
export function worldBox() {
    const world = document.querySelector(HOME)?.closest(".thread") || document.querySelector(FLOOR);
    return world ? world.getBoundingClientRect() : {left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight};
}

// how far past its world's edge a figure may be drawn, in pixels, for the rounding of a spot kept just inside it
const EDGE = 0.5;

// Whether a figure on a spot is inside its world: its picture within the world's left, right and top, and the line it rests on at or
// above the world's foot, as a seated figure's legs hang past any edge it sits on; a hanging figure is inside it whole
export function inWorld(spot, figure, world = worldBox()) {
    const box = boxAt(spot, figure);
    const foot = spot.posture === "hang" ? box.bottom : spot.y;
    return box.left >= world.left - EDGE && box.right <= world.right + EDGE && box.top >= world.top - EDGE && foot <= world.bottom + EDGE;
}

// Where across a figure's picture it looks for words and controls under its body, as shares of the picture's width and height: the
// middle of it, where the body is drawn, from the hat to the feet
const BODY_XS = [0.35, 0.5, 0.65];
const BODY_YS = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9];
// the part of the picture the body is drawn in, as shares of its width and height, which is what the user can click
export const BODY = {left: BODY_XS[0], right: BODY_XS.at(-1), top: BODY_YS[0], bottom: BODY_YS.at(-1)};

// whether a word is drawn at this point of the page: the character the page has there holds ink, is drawn, and its box holds the point
function onWord(x, y) {
    const caret = document.caretRangeFromPoint?.(x, y);
    if (!caret || caret.startContainer.nodeType !== Node.TEXT_NODE || !visible(caret.startContainer.parentElement)) return false;
    const text = caret.startContainer;
    const at = Math.min(caret.startOffset, text.length - 1);
    for (const from of [at - 1, at].filter((each) => each >= 0)) {
        if (!text.data[from].trim()) continue;
        const glyph = document.createRange();
        glyph.setStart(text, from);
        glyph.setEnd(text, from + 1);
        if ([...glyph.getClientRects()].some((box) => x >= box.left && x <= box.right && y >= box.top && y <= box.bottom)) return true;
    }
    return false;
}

// the points across a box where the figure's body is drawn
const bodyPoints = (box) =>
    BODY_YS.flatMap((down) =>
        BODY_XS.map((across) => [box.left + across * (box.right - box.left), box.top + down * (box.bottom - box.top)])
    );

// How many of the points of its body a figure at this spot draws over a control or a word: the part of it above the line it stands or
// sits on, as below that line it only hangs over the thing it rests on, and all of a figure hanging from its line
export function hiddenAt(spot, figure) {
    const picture = boxAt(spot, figure);
    const box = spot.posture === "hang" ? picture : {...picture, bottom: Math.min(picture.bottom, spot.y)};
    const controls = [...document.querySelectorAll(CONTROLS)]
        .filter(visible)
        .map((control) => control.getBoundingClientRect())
        .filter((control) => control.width && control.height && overlaps(box, control));
    const onControl = (x, y) =>
        controls.some((control) => x >= control.left && x <= control.right && y >= control.top && y <= control.bottom);
    return bodyPoints(box).filter(([x, y]) => onControl(x, y) || onWord(x, y)).length;
}

// The spot of those inside the figure's world that hides the fewest controls and words, none where it can, or null when none is inside
// it; of spots alike, the one nearest `near`, where the figure stands now, so it does not wander between equally good places
export function freeSpot(spots, figure, near) {
    const world = worldBox();
    const away = (spot) => (near ? Math.hypot(spot.x - near.x, spot.y - near.y) : 0);
    const ranked = spots
        .filter((spot) => inWorld(spot, figure, world))
        .map((spot) => ({spot, covered: hiddenAt(spot, figure), away: away(spot)}));
    if (!ranked.length) return null;
    return ranked.reduce((best, each) =>
        each.covered < best.covered || (each.covered === best.covered && each.away < best.away) ? each : best
    ).spot;
}

// The spots on an element's top edge at each share of its width
const alongTop = (box, shares) => shares.map((share) => ({x: box.left + box.width * share, y: box.top, posture: "stand"}));

// Where a figure goes to point at a tab: standing on top of it, at its middle or toward either end, so its feet are on the tab and some
// spot on it is clear of whatever else is open beside the tabs
const ON_TAB = [0.5, 0.25, 0.75];

const tabSpots = (tab) => alongTop(tab.getBoundingClientRect(), ON_TAB);

// Where a figure sits: on a corner of a box it perches on, turned along the edge it dangles over and a third of the way back toward the
// viewer, so its eyes and what it holds on its lap are seen, with its hips a little inboard of the corner so the weight rests on the
// surface behind the edge and only the legs reach past it
const SEAT_SIDES = {
    right: {along: 1, inboard: -1, face: 60},
    left: {along: 0, inboard: 1, face: 300},
};
const SEAT_INBOARD = 0.14;

// The seat on one corner of a box's top edge, `side` being "left" or "right", the hips `reach` of the figure's height inside the corner;
// `face` turns the figure along the edge, 0 faces the viewer
export function seatAt(box, side, {size}, reach = SEAT_INBOARD) {
    const {along, inboard, face} = SEAT_SIDES[side];
    return {x: box.left + box.width * along + inboard * reach * size, y: box.top, face, posture: "sit"};
}

// the pixels of a seated figure above the edge it sits on
export const seatRise = ({size, below}) => (1 - below - SEAT_DROP) * size;

// A spot at home standing or sitting, moved inside the figure's world: its picture within the world's left, right and top, and the line
// it rests on at or above the world's foot
function insideWorld(spot, {size, below}) {
    const world = worldBox();
    const drop = POSTURES[spot.posture].drop * size;
    return {
        ...spot,
        x: Math.min(Math.max(spot.x, world.left + size / 2), world.right - size / 2),
        y: Math.min(Math.max(spot.y, world.top + (1 - below) * size - drop), world.bottom),
    };
}

// the seats on either corner of the edge at home, and the places along it to stand, each moved inside the figure's world
const homeSeats = (edge, figure) => Object.keys(SEAT_SIDES).map((side) => insideWorld(seatAt(edge, side, figure), figure));
const homeStands = (edge, figure) => alongTop(edge, HOME_ALONG).map((spot) => insideWorld(spot, figure));

// A seat on a corner of the edge the figure stands on at home; with nothing there it sits on the foot of its world, its legs past it
export function seatOf(figure, near) {
    const {element, edge} = groundEdge();
    return {...freeSpot(homeSeats(edge, figure), figure, near), view: null, on: element};
}

// Where a figure clicked out of the way goes at home, its picture clear of `box`, the one it was clicked in: a seat while it must sit,
// else a seat or a place along the edge, whichever hides least; null when none at home is clear of it
export function clearOf(box, figure, near, seated) {
    const {element, edge} = groundEdge();
    const spots = seated ? homeSeats(edge, figure) : [...homeSeats(edge, figure), ...homeStands(edge, figure)];
    const spot = freeSpot(
        spots.filter((each) => !overlaps(boxAt(each, figure), box)),
        figure,
        near
    );
    return spot && {...spot, view: null, on: element};
}

// The edge a figure stands on at home: the bars docked over the main chat's compose box while there are any, else the compose box, else
// the floor of the page itself, else the foot of the window
export function groundEdge() {
    const home = document.querySelector(HOME);
    const top = home?.closest(".thread")?.querySelector(DOCKED_BARS) || home;
    const element = top || document.querySelector(FLOOR);
    if (!element) return {element: null, edge: {left: 0, width: window.innerWidth, top: window.innerHeight}};
    const box = element.getBoundingClientRect();
    return {element, edge: {left: box.left, width: box.width, top: top ? box.top : box.bottom}};
}

// What a figure resting on a spot keeps of it: the element it rests on, the spot's place on that element, the posture it rests in there,
// and whether that element is the ground at home; null when it rests on nothing on the page
export function footingOn(spot) {
    const element = spot.on;
    if (!element?.isConnected) return null;
    const box = element.getBoundingClientRect();
    return {element, dx: spot.x - box.left, dy: spot.y - box.top, posture: spot.posture, home: element === groundEdge().element};
}

// Where a footing's spot is now, carried along as its element moves, or null when the ground went from under the figure: the element left
// the page or has no size, it was the ground at home and the ground at home is another element now, as a bar docks or is closed, or it
// carried the figure out of its world, as a bubble scrolls out of the chat
export function footingNow({element, dx, dy, posture, home}, figure) {
    const box = element.isConnected ? element.getBoundingClientRect() : null;
    if (!box?.width || !box.height || (home && groundEdge().element !== element)) return null;
    const spot = {x: box.left + dx, y: box.top + dy};
    return inWorld({...spot, posture}, figure) ? spot : null;
}

// Where a trip to a spot ends: the spot carried along by `footing`, taken when the spot was read from the page, as what it rests on may
// have moved while the figure travelled, so it lands on the line where the line is now; the spot as it was once its ground has gone
export function landingOn(spot, footing, figure) {
    const now = footing && footingNow(footing, figure);
    return now ? {...spot, ...now} : spot;
}

// The way a figure whose middle is at `x` turns to look at a chat mark, by its key: to its right or its left, or toward the viewer when
// the mark is not on the page
export function facingToward(key, x) {
    const mark = key && document.querySelector(`[data-figure-mark="${CSS.escape(key)}"]`);
    if (!mark) return 0;
    const box = mark.getBoundingClientRect();
    return box.left + box.width / 2 > x ? 90 : 270;
}

// Where the figure stands at a view's tab, or null when the tab is gone or no spot on it is inside the figure's world; with no view, where
// it stands at home, on the main chat's compose box, or on the floor of a page without one. Each spot names the element it rests on as
// `on`, so the figure can tell when that element has gone or moved.
export function spotOf(view, figure, near) {
    if (view) {
        const tab = document.querySelector(`[data-tab="${CSS.escape(view)}"]`);
        const spot = tab && freeSpot(tabSpots(tab), figure, near);
        return spot ? {...spot, view, on: tab} : null;
    }
    const {element, edge} = groundEdge();
    return {...freeSpot(homeStands(edge, figure), figure, near), view: null, on: element};
}
