import {NEWEST_ASIDE} from "./newest.js";
import {GRAVITY} from "../domain/falls.js";
import {ACTS} from "./acts.js";
import {flips} from "./reactions.js";
import {PARCEL, PILED, PUSH} from "./parcels.js";

// Where the figure can stand, read from the page as it is laid out at this moment and never stored: the top edge of the main
// chat's compose box is home, and each of Home's tabs is a place it can go to point at what waits there.
export const HOME = "[data-figure-home]";

// the home the figure stands on: the compose box of the main chat that is shown, since a chat in a hidden layout or a page leaving
// keeps its box in the page for a moment, and the first in the page's order may be the one no longer seen
export const homeElement = () => {
    const first = document.querySelector(HOME);
    if (!first || first.checkVisibility?.() !== false) return first;
    return [...document.querySelectorAll(HOME)].find((box) => box.checkVisibility?.()) ?? first;
};

// the bars docked over the main chat's compose box, such as a report's, which the figure is pushed up onto while they are there
export const DOCKED_BARS = "[data-figure-docked-bars]";
// the foot of the chat, the docks and the line of what the agent is doing, which stays over the bubbles at the bottom of the chat's view
export const CHAT_FOOT = "[data-figure-chat-foot]";

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

// The Newest control may opt into this stable hook; the label fallback also supports older Thread.vue templates.
export const NEWEST = "[data-figure-newest]";

// The visible Newest button in the main chat, measured where the page put it; hidden controls and message contents do not count.
export function newestButton() {
    const thread = homeElement()?.closest(".thread");
    if (!thread) return null;
    const marked = thread.querySelector(NEWEST) ?? thread.querySelector("button.thread-down");
    const candidates = marked ? [marked] : [...(thread.querySelectorAll?.("button, [role=button]") ?? [])].filter((element) =>
        !element.closest?.("[data-figure-bubble]") && /\bnewest\b/i.test(element.getAttribute?.("aria-label") || element.textContent || "")
    );
    for (const element of candidates) {
        if (element.hidden || !visible(element)) continue;
        const box = element.getBoundingClientRect();
        if (box.right > box.left && box.bottom > box.top) return box;
    }
    return null;
}

// The complete seated silhouette counts, including feet below the ledge and a palm beside either hip.
export function clearOfNewest(spot, figure, button = newestButton()) {
    if (!spot || !button) return true;
    const picture = boxAt(spot, figure);
    const across = bodyAcross(spot);
    const body = {left: picture.left + Math.min(across.left, 0.27) * figure.size, right: picture.left + Math.max(across.right, 0.73) * figure.size, top: picture.top + BODY.top * figure.size, bottom: picture.top + BODY.bottom * figure.size};
    const gap = NEWEST_ASIDE.gap;
    return !overlaps(body, {left: button.left - gap, right: button.right + gap, top: button.top - gap, bottom: button.bottom + gap});
}

// The nearest clear place on this same floor, preserving the seat and its facing; no jump or change of floor is planned.
export function newestAsideSpot(figure, near, bounds, button = newestButton()) {
    if (!button || clearOfNewest(near, figure, button)) return null;
    const across = bodyAcross(near);
    const leftReach = (0.5 - Math.min(across.left, 0.27)) * figure.size;
    const rightReach = (Math.max(across.right, 0.73) - 0.5) * figure.size;
    const world = worldBox();
    const inside = near.posture === "stand" ? FEET_INBOARD * figure.size : SEAT_INBOARD * figure.size;
    const least = Math.max(bounds.left + inside, world.left + leftReach);
    const most = Math.min(bounds.right - inside, world.right - rightReach);
    const choices = [button.left - NEWEST_ASIDE.gap - rightReach, button.right + NEWEST_ASIDE.gap + leftReach]
        .map((x) => ({...near, x}))
        .filter((spot) => spot.x >= least && spot.x <= most && clearOfNewest(spot, figure, button) && clearOfPile(spot, figure));
    return choices.sort((a, b) => Math.abs(a.x - near.x) - Math.abs(b.x - near.x))[0] ?? null;
}

// How each posture meets the line it rests on: the share of the figure's height from that line down to the feet of its standing picture,
// and the posture it travels in to get there. It stands with its feet on the line, sits with its hips on it and hangs by its hands from
// it; it leaps straight to a hang. A rest is never a seat: see cornerAt. On the move it walks with its feet on the line.
const SEAT_DROP = 0.26;
// the gripping hand of every voice's hang is 2.91 of the picture's 5.4 units above its standing feet: the short arms of these figures
// reach no higher than the head, so the hand, not the hat, is what meets the bubble's corner
const HANG_DROP = 0.54;
// and 1.25 of those units to its own side of the middle, toward the viewer's right for the left hand of a figure facing them
const GRIP_ASIDE = 1.25 / 5.4;
export const POSTURES = {
    stand: {drop: 0, travels: "stand"},
    sit: {drop: SEAT_DROP, travels: "stand"},
    lounge: {drop: SEAT_DROP, travels: "stand"},
    composed: {drop: SEAT_DROP, travels: "stand"},
    hang: {drop: HANG_DROP, travels: "hang"},
    walk: {drop: 0, travels: "stand"},
};

// Where the gripping hand is in the picture of a figure hanging by its `side` hand, turned `facing` degrees, as shares of the picture's
// width and height; `below` is the share of the picture under the ground its feet stand on
export const gripIn = (side, facing, below) => ({
    x: 0.5 + (side === "l" ? 1 : -1) * GRIP_ASIDE * Math.cos((facing * Math.PI) / 180),
    y: 1 - below - HANG_DROP,
});

// the postures the figure sits in, on a floor or over a ledge's edge, in none of which it ever turns (turnStep)
export const SEATED = new Set(["sit", "lounge", "composed"]);

// the floors with an edge to sit on, the legs hanging over their front: a bubble, the bars docked over the compose box and the compose box
export const LEDGES = new Set(["bubble", "dock", "compose"]);

// the posture a figure keeps landing in `posture` on a floor of `kind`: sitting on an edge only where it has an edge to sit on (LEDGES),
// sitting composed or lounging on any floor's top; anything else, and a seat with nowhere to sit, lands on its feet
export const landsIn = (posture, kind) => ((posture === "sit" ? LEDGES.has(kind) : SEATED.has(posture)) ? posture : "stand");

// The next posture and facing, each {posture, facing}, the figure is drawn in on its way from `from` to `to`: it never turns sitting, so
// from a seat it first stands up facing as it sat, then turns standing, and only sits again once it faces the way it sits; any other
// change is made at once
export function turnStep(from, to) {
    if (from.facing === to.facing || (!SEATED.has(from.posture) && !SEATED.has(to.posture))) return to;
    return {posture: "stand", facing: SEATED.has(from.posture) ? from.facing : to.facing};
}

// how long the figure takes to change from one clip, posture or facing to the next, easing out of the pose before it, in seconds
export const CHANGE_SECONDS = 0.25;

// whether a change from posture `from` to `to` gets up off a seat onto the feet: the seat's drop belongs to the seated poses alone, so it
// goes at once, the picture never sliding, and the body unfolds on its feet on the floor line (figure.js blendedMoves)
export const leavesSeat = (from, to) => SEATED.has(from) && POSTURES[to].drop === 0;

// A figure stepping out of the way runs at this many times its walking pace, with the run's own distance-driven cycle.
export const SPRINT = 2;

// The figure walks this many pixels a second. A jump crouches this long before it leaves the ground and is in the air for this long, a
// little longer for a higher perch, in milliseconds; a fall takes as long as a body takes to drop that far.
const WALK_SPEED = 90;
const WALK_RAMP_MS = 180;
const RUN_RAMP_MS = 140;
const JUMP_CROUCH_MS = 280;
const JUMP_AIR_MS = 420;
const JUMP_AIR_PER_PIXEL = 0.25;
const FLIP_CROUCH_MS = 290;
const FLIP_AIR_MS = 600;
const JUMP_EASING = "cubic-bezier(0.2, 0.7, 0.4, 1)";
const FALL_EASING = "cubic-bezier(0.55, 0, 0.9, 0.6)";
// a difference smaller than this is no trip at all: a clip in motion can leave this much of a gap under the figure's feet, and the
// figure settles where it is rather than falling those few pixels
export const STEADY = 5;

// The trip of a picture `size` pixels tall from `from` to `to`, its left and top, or null when they are closer than STEADY: its way, -1
// left or 1 right, and its legs, each a move of the picture taking `ms` after `lead`. Up to a perch it walks to below it and then jumps,
// now and then turning over on a high jump, as the pile draws it with `memory` of when it last did at `now` and the `room` the figure has
// for it (reactions.js roomFor), or bouncing up on the `pogo`
// stick; down from one it falls first
// and then walks, never walking on air. `straight` is for ground
// that came or went under it: it goes straight up or down where it is, then walks. It lands after a hop unless it `hangs` there, from a
// bubble's corner or on a rope swing's seat. It walks
// at `pace` times its walking speed, which the trip keeps.
export function tripBetween(from, to, size, {straight = false, hangs = false, pace = 1, pressing = false, sprinting = false, random = Math.random, memory = null, now = 0, room = 0, pogo = false} = {}) {
    if (Math.hypot(to.x - from.x, to.y - from.y) < STEADY) return null;
    if (pressing || sprinting) pace = Math.max(pace, SPRINT);
    const running = pace > 1;
    const across = Math.abs(to.x - from.x);
    const walk = across < STEADY ? 0 : (across / (WALK_SPEED * pace)) * 1000;
    const ramp = Math.min(walk, running ? RUN_RAMP_MS : WALK_RAMP_MS);
    const height = Math.abs(to.y - from.y);
    const up = to.y < from.y;
    const flip = up && !pogo && flips(height, size, random, memory, now, room);
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
    const stroll = {x: to.x, y: to.y, ms: walk + ramp, lead: 0, easing: "linear", ramp, ...(running ? {clip: "run"} : {})};
    const rise = pogo ? pogoLeg(to, size) : hop;
    const legs = up && !straight ? [{...stroll, y: from.y}, rise] : [{...hop, x: from.x}, stroll];
    return {way: Math.sign(to.x - from.x) || 1, legs, lands: !hangs, pace, running};
}

// the leg up to `to` on the pogo stick, for a picture `size` pixels tall: as long as the stick's act (acts.js pogo), stepped by pogoAt
const pogoLeg = (to, size) => ({x: to.x, y: to.y, ms: (ACTS.pogo.frames / ACTS.pogo.fps) * 1000, lead: 0, easing: "linear", hopping: true, pogo: true, size, clip: "pogo"});

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

// The box the figure lives in, which no part of it is ever drawn outside: the main chat's window, else the window
export function worldBox() {
    const world = homeElement()?.closest(".thread");
    return world ? world.getBoundingClientRect() : {left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight};
}

// how far past its world's edge a figure may be drawn, in pixels, for the rounding of a spot kept just inside it
const EDGE = 0.5;

// how far inside the chat's left and right sides a figure on a bubble keeps its picture, in pixels, so the sides never cut its frame
export const WALL_ROOM = 20;

// whether a figure on a spot keeps WALL_ROOM inside its world's left and right sides
export function offWalls(spot, figure, world = worldBox()) {
    const box = boxAt(spot, figure);
    return box.left >= world.left + WALL_ROOM && box.right <= world.right - WALL_ROOM;
}

// Whether a figure on a spot is inside its world: its body across (bodyAcross) within the world's left and right, its picture within the
// world's top, and the line it rests on at or above the world's foot, as a seated figure's legs hang down past any edge it sits on; a
// hanging figure is inside it whole. A standing figure needs only its body inside, the empty sides of its picture over the world's edge,
// as it stands at the window's edge reaching past it; a seated one its legs too, so seated at a corner by the window's edge they never
// hang out over it
export function inWorld(spot, figure, world = worldBox()) {
    const box = boxAt(spot, figure);
    const width = box.right - box.left;
    const across = bodyAcross(spot);
    const [left, right] = [box.left + across.left * width, box.left + across.right * width];
    const foot = spot.posture === "hang" ? box.bottom : spot.y;
    return left >= world.left - EDGE && right <= world.right + EDGE && box.top >= world.top - EDGE && foot <= world.bottom + EDGE;
}

// Where across a figure's picture it looks for words and controls under its body, as shares of the picture's width and height: the
// middle of it, where the body is drawn, from the hat to the feet
const BODY_XS = [0.35, 0.5, 0.65];
const BODY_YS = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9];
// the part of the picture the body is drawn in, as shares of its width and height, which is what the user can click
export const BODY = {left: BODY_XS[0], right: BODY_XS.at(-1), top: BODY_YS[0], bottom: BODY_YS.at(-1)};

// how far a seated figure's legs reach out from the middle of its picture the way it faces, its boots and all, as a share of the picture's
// width: turned along an edge, as at a corner, they reach that far across past its hips
export const SEATED_LEGS = 0.24;

// The part of a figure's picture across which its body is drawn on `spot`, as shares of the picture's width: standing, its body (BODY);
// seated, its body and its legs out the way it faces, as far across as it is turned from the viewer; lounging, sitting composed or
// hanging, the whole picture, as those reach as wide as it
export function bodyAcross(spot) {
    if (spot.posture === "stand") return {left: BODY.left, right: BODY.right};
    if (spot.posture !== "sit") return {left: 0, right: 1};
    const legs = 0.5 + SEATED_LEGS * Math.sin(((spot.face ?? 0) * Math.PI) / 180);
    return {left: Math.min(BODY.left, legs), right: Math.max(BODY.right, legs)};
}

// A spot moved across, as little as it takes, so the figure's body on it (bodyAcross) is inside its world's left and right: further left
// near the right side, further right near the left
export function keptAcross(spot, {size}, world = worldBox()) {
    const across = bodyAcross(spot);
    return {...spot, x: Math.min(Math.max(spot.x, world.left + (0.5 - across.left) * size), world.right - (across.right - 0.5) * size)};
}

// how far in from a floor's end a figure standing at its corner has its middle, as a share of its height: half its body's width and a
// margin more, so both feet are on the floor and well clear of its end, never one over the edge
export const FEET_INBOARD = (BODY.right - BODY.left) / 2 + 0.08;

// the part of the body that takes the click: above the line the figure rests on, as hiddenAt counts it, so a figure sitting on the chat
// box never takes a press meant for the box below its seat
export function clickedBody(posture, below) {
    if (posture === "hang") return BODY;
    return {...BODY, bottom: Math.min(BODY.bottom, 1 - below - POSTURES[posture].drop)};
}

// an agent's message, the only one whose words the figure steps out of the way of, as the user knows the words of its own
export const AGENT_TURN = "[data-figure-agent]";

// whether a word is drawn at this point of the page: the character the page has there holds ink, is drawn, and its box holds the point;
// a word inside an element `passed` names is not counted, nor, given `only`, one outside the elements it names
function onWord(x, y, passed = "", only = "") {
    const caret = document.caretRangeFromPoint?.(x, y);
    if (!caret || caret.startContainer.nodeType !== Node.TEXT_NODE || !visible(caret.startContainer.parentElement)) return false;
    if (passed && caret.startContainer.parentElement.closest(passed)) return false;
    if (only && !caret.startContainer.parentElement.closest(only)) return false;
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
// sits on, as below that line it only hangs over the thing it rests on, and all of a figure hanging from its line; words inside an element
// `passed` names left out
export function hiddenAt(spot, figure, passed = "") {
    if (!clearOfNewest(spot, figure)) return BODY_XS.length * BODY_YS.length;
    const picture = boxAt(spot, figure);
    const box = spot.posture === "hang" ? picture : {...picture, bottom: Math.min(picture.bottom, spot.y)};
    const controls = [...document.querySelectorAll(CONTROLS)]
        .map((control) => ({control, rect: control.getBoundingClientRect()}))
        .filter(({control, rect}) => rect.width && rect.height && overlaps(box, rect) && visible(control))
        .map(({rect}) => rect);
    const onControl = (x, y) =>
        controls.some((control) => x >= control.left && x <= control.right && y >= control.top && y <= control.bottom);
    return bodyPoints(box).filter(([x, y]) => onControl(x, y) || onWord(x, y, passed)).length;
}

// How many of the points of its body a figure at this spot draws over the words of an agent's message (AGENT_TURN), the part of it above
// the line it stands or sits on: what may send it out of the way, a user's message never
export function agentWordsAt(spot, figure) {
    const picture = boxAt(spot, figure);
    return bodyPoints({...picture, bottom: Math.min(picture.bottom, spot.y)}).filter(([x, y]) => onWord(x, y, "", AGENT_TURN)).length;
}

// Where a figure at `near` steps aside to from an agent's message over it, by the least needed: the nearest place along the line it stands
// on, between `bounds.left` and `bounds.right` on the page, `step` pixels at a time either way, where it covers none of an agent's words
// (agentWordsAt); null when there is none
export const ASIDE_STEP = 4;
export function asideOf(figure, near, bounds) {
    const half = figure.size / 2;
    const reach = Math.max(near.x - bounds.left, bounds.right - near.x);
    for (let moved = ASIDE_STEP; moved <= reach; moved += ASIDE_STEP) {
        for (const x of [near.x - moved, near.x + moved]) {
            if (x - half < bounds.left || x + half > bounds.right) continue;
            const spot = {...near, x};
            if (!agentWordsAt(spot, figure) && clearOfNewest(spot, figure)) return spot;
        }
    }
    return null;
}

// The spot of those inside the figure's world that hides the fewest controls and words, none where it can, or null when none is inside
// it; of spots alike, the one nearest `near`, where the figure stands now, so it does not wander between equally good places
export function freeSpot(spots, figure, near) {
    const world = worldBox();
    const away = (spot) => (near ? Math.hypot(spot.x - near.x, spot.y - near.y) : 0);
    const ranked = spots
        .filter((spot) => inWorld(spot, figure, world) && clearOfNewest(spot, figure))
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

// Where a figure rests at the end of an edge: standing on the corner of a box, its feet on the top, turned along the edge and a third of
// the way back toward the viewer, a little inboard of the corner so it stands on the surface. Sitting there it sits just inside the corner
// (seatAt), its seat on the box and its knees past the end, as a seat further in hangs the legs over the face of the box, so it looks as if
// it sinks into it to the knees.
const CORNER_SIDES = {
    right: {along: 1, inboard: -1, face: 60},
    left: {along: 0, inboard: 1, face: 300},
};
const CORNER_INBOARD = FEET_INBOARD;

// The place on one corner of a box's top edge, `side` being "left" or "right", the feet `reach` of the figure's height inside the corner;
// `face` turns the figure along the edge, 0 faces the viewer
export const cornerAt = (box, side, {size}, reach = CORNER_INBOARD) => endOf(box, CORNER_SIDES[side], reach * size, "stand");

// the place `inside` pixels in from one end of a box's top edge, the end and the way along it as `end` says, in `posture`
function endOf(box, {along, inboard, face}, inside, posture) {
    return {x: box.left + box.width * along + inboard * inside, y: box.top, face, posture};
}

// Where a figure sits at a corner of the edge, as it types on its laptop or rests: seated (POSTURES sit) on the very end, turned out along
// the edge so its legs hang past the end of the box, never over its face where it would seem to sink into it, its hips SEAT_INBOARD of its
// height inside the corner, set a little back from the end so it never seems to sit on the corner's very tip
const SEAT_SIDES = {
    right: {along: 1, inboard: -1, face: 70},
    left: {along: 0, inboard: 1, face: 290},
};
export const SEAT_INBOARD = 0.1;
export const seatAt = (box, side, {size}) => endOf(box, SEAT_SIDES[side], SEAT_INBOARD * size, "sit");


// the turn `facing` degrees is from the viewer, the least way round, from -180 to 180
export const signedTurn = (facing) => ((((facing + 180) % 360) + 360) % 360) - 180;

// the least a figure at its laptop is turned from the viewer, in degrees: three-quarters
export const ASIDE = 60;

// the way a figure seated playing `clip` faces on a spot facing `face`: the spot's way, turned to three-quarters for a clip drawn aside
// (figure.js CLIPS aside) where the spot faces nearer the viewer, to the side it already leans to
export function seatedFacing(clip, face) {
    const turn = signedTurn(face);
    if (!clip.aside || Math.abs(turn) >= ASIDE) return face;
    return turn < 0 ? 360 - ASIDE : ASIDE;
}

// A figure seated facing `face` poses on its seat now and then, every `every` seconds or so, turning over `seconds` to one of `turns`
// degrees either side of the viewer, its legs over the front of what it sits on or a little to one side, or back to the way its seat faces,
// as along the edge at a corner; so it is never turned further round than its seat
export const SEAT_POSE = {every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20]};

// the ways a figure on a seat facing `face` may sit, in degrees
export const seatFacings = (face) => [...new Set([face, ...SEAT_POSE.turns.map((turn) => (turn + 360) % 360)])];

// The pose `pose` ({face, from, to, since, next}) of a figure seated facing `face` at `now`: kept until its time is up, then the next,
// drawn with `random`, from the way it sits now; a new seat starts from the way it faces
export function poseAfter(pose, face, now, random) {
    const same = pose?.face === face;
    if (same && now < pose.next) return pose;
    const facings = seatFacings(face);
    const every = SEAT_POSE.every[0] + random() * (SEAT_POSE.every[1] - SEAT_POSE.every[0]);
    return {face, from: same ? posedFacing(pose, now) : face, to: facings[Math.floor(random() * facings.length)], since: now, next: now + every};
}

// the way a figure posing on its seat by `pose` faces at `now`, in degrees, eased the short way round from where it sat to where it turns
export function posedFacing(pose, now) {
    const share = Math.min(1, Math.max(0, (now - pose.since) / SEAT_POSE.seconds));
    const turn = ((((pose.to - pose.from + 180) % 360) + 360) % 360) - 180;
    return (pose.from + turn * share * share * (3 - 2 * share) + 360) % 360;
}

// Where the figure sits at home: on a corner of the edge it stands on, beside the pile (freeEdge), whose seat is inside its world and hides
// nothing, the one nearest `near`; null when neither corner holds a seat
export function seatOf(figure, near) {
    const {element, edge} = freeEdge();
    const seats = ["left", "right"]
        .map((side) => insideWorld(seatAt(edge, side, figure), figure))
        .filter((seat) => element && inWorld(seat, figure) && !hiddenAt(seat, figure));
    const away = (seat) => (near ? Math.abs(seat.x - near.x) : 0);
    const seat = seats.sort((a, b) => away(a) - away(b))[0];
    return seat ? {...seat, view: null, on: element} : null;
}

// A spot on its feet on the floor the parcel pile stands on (`pile`, its left and right ends and the top of its floor, in pixels), moved
// beside the pile so the figure never stands in front of the parcels; a seat on the edge, or a spot on another floor, as it is
export function besidePile(spot, pile, {size}) {
    const half = ((BODY.right - BODY.left) / 2) * size;
    const onIt = pile && spot.posture === "stand" && Math.abs(spot.y - pile.top) < 1 && spot.x + half > pile.left && spot.x - half < pile.right;
    return onIt ? {...spot, x: pile.left - half - PILE_GAP} : spot;
}

// how far beside the pile a figure stands, in pixels, past its body, enough to keep its hands off the parcels
const PILE_GAP = 7;

// The box the boxes on the pile take on the page (parcels.js PILED, marked by chat/CodeParcel.vue), or null with none piled
export function pileBox() {
    const boxes = [...document.querySelectorAll(PILED)].map((each) => each.getBoundingClientRect()).filter((box) => box.width && box.height);
    if (!boxes.length) return null;
    return {left: Math.min(...boxes.map((box) => box.left)), right: Math.max(...boxes.map((box) => box.right)), top: Math.min(...boxes.map((box) => box.top)), bottom: Math.max(...boxes.map((box) => box.bottom))};
}

// the part of a figure's picture at `spot` its body is drawn in (BODY), on the page
export function bodyBoxAt(spot, figure) {
    const box = boxAt(spot, figure);
    const width = box.right - box.left;
    return {left: box.left + BODY.left * width, right: box.left + BODY.right * width, top: box.top + BODY.top * width, bottom: box.bottom};
}

// whether a figure at `spot` keeps clear of the pile, its body (bodyBoxAt) overlapping none of the boxes on it
export function clearOfPile(spot, figure) {
    const pile = pileBox();
    return !pile || !overlaps(bodyBoxAt(spot, figure), pile);
}

// how far from the edge at home the pile's foot may be and still stand on it, in pixels, as the boxes' pictures reach a little below it
const PILE_FOOT = 4;

// The edge at home the figure rests, sits and strolls on (groundEdge), with the pile's corner cut off when the pile stands on it: the free
// part of it beside the pile, PILE_GAP clear of the boxes, as the corner is the pile's
export function freeEdge() {
    const ground = groundEdge();
    const pile = pileBox();
    const {left, width, top} = ground.edge;
    if (!pile || Math.abs(pile.bottom - top) > PILE_FOOT || pile.left > left + width || pile.right < left) return ground;
    return {...ground, edge: {...ground.edge, width: Math.max(pile.left - PILE_GAP - left, 0)}};
}

// the pixels of a figure standing on an edge above it
export const standRise = ({size, below}) => (1 - below) * size;

// A spot at home standing or sitting, moved inside the figure's world: its body within the world's left and right (keptAcross), its
// picture within the world's top, and the line it rests on at or above the world's foot
function insideWorld(spot, figure) {
    const world = worldBox();
    const {size, below} = figure;
    const drop = POSTURES[spot.posture].drop * size;
    return {...keptAcross(spot, figure, world), y: Math.min(Math.max(spot.y, world.top + (1 - below) * size - drop), world.bottom)};
}

// the places on either corner of the edge at home, and the places along it, each moved inside the figure's world
const homeCorners = (edge, figure) => Object.keys(CORNER_SIDES).map((side) => insideWorld(cornerAt(edge, side, figure), figure));
const homeStands = (edge, figure) => alongTop(edge, HOME_ALONG).map((spot) => insideWorld(spot, figure));

// the spot at home of `spots`, each moved inside the world: the free one (freeSpot), else, while none of them is inside it, as while the chat
// is laid out smaller than the figure, the first, at the foot of the world; never a spot without its place and posture
const homeSpot = (spots, figure, near) => freeSpot(spots, figure, near) ?? spots[0];

// Where the figure rests at home: on a corner of the edge it stands on, beside the pile (freeEdge), on its feet; with nothing there, on the
// foot of its world
export function restOf(figure, near) {
    const {element, edge} = freeEdge();
    return {...homeSpot(homeCorners(edge, figure), figure, near), view: null, on: element};
}

// Where a figure that steps out of the way goes at home, its picture clear of `box`, the one it stepped aside from: a corner while it
// rests, else a corner or a place along the edge. The first free one on the right of the box is taken, free being that it hides nothing,
// else the one on either side that hides least; null when none at home is clear of the box.
export function clearOf(box, figure, near, resting) {
    const {element, edge} = freeEdge();
    const spots = (resting ? homeCorners(edge, figure) : [...homeCorners(edge, figure), ...homeStands(edge, figure)]).filter(
        (each) => !overlaps(boxAt(each, figure), box)
    );
    const right = freeSpot(
        spots.filter((each) => each.x > (box.left + box.right) / 2),
        figure,
        near
    );
    const spot = right && !hiddenAt(right, figure) ? right : freeSpot(spots, figure, near);
    return spot && {...spot, view: null, on: element};
}

// The edge a figure stands on at home: the bars docked over the main chat's compose box while there are any, `docked` then, else the
// compose box, else the foot of the window
export function groundEdge() {
    const home = homeElement();
    const bars = home?.closest(".thread")?.querySelector(DOCKED_BARS);
    if (!bars) return {...composeEdge(), docked: false};
    const box = bars.getBoundingClientRect();
    return {element: bars, docked: true, edge: {left: box.left, width: box.width, top: box.top}};
}

// Whether the figure resting at `place` has room to step aside from what appeared under it: never while it stands on bars docked over the
// compose box that span the box whole, `within` pixels, as a full-width card does, with nowhere beside them to step to; on narrower bars,
// or anywhere else, it has
export const SPANS = {within: 2};
export function roomToStepAside(place) {
    const {element, docked, edge} = groundEdge();
    if (!docked || place.on !== element) return true;
    const home = composeEdge().edge;
    return edge.left > home.left + SPANS.within || edge.left + edge.width < home.left + home.width - SPANS.within;
}

// A docked card that has finished and closes by itself soon is marked for the figure; while the top one of the bars docked over the compose
// box, the one the figure would stand on, is such a card, the ground at home is about to go
export const CLOSING = "[data-figure-closing]";
export function homeCloses() {
    const {element, docked} = groundEdge();
    return docked && Boolean(element.firstElementChild?.matches(CLOSING));
}

// a progress bar's fill marked for the figure, which it watches while it runs
export const PROGRESS = "[data-figure-progress]";

// The leading edge of the progress bar running on `element`, as bars docked over the compose box, as the point on the page where its fill
// ends, half way down it; null when none runs there
export function progressEdge(element) {
    const fill = element.querySelector(PROGRESS);
    if (!fill) return null;
    const box = fill.getBoundingClientRect();
    return {x: box.right, y: box.top + box.height / 2};
}

// What the figure looks at as a run ends, before its visor lights: of the run's chat mark, `mark` (a box), and the docked bar it reacted to,
// `bar` (a box), whichever is nearer its head at `head`, the bar at its point nearest the head along it; null with neither
export function nearestTell(mark, bar, head) {
    const points = [mark && {x: (mark.left + mark.right) / 2, y: (mark.top + mark.bottom) / 2}, bar && {x: Math.min(Math.max(head.x, bar.left), bar.right), y: (bar.top + bar.bottom) / 2}].filter(Boolean);
    const away = (point) => Math.hypot(point.x - head.x, point.y - head.y);
    return points.length ? points.reduce((near, point) => (away(point) < away(near) ? point : near)) : null;
}

// whether the figure says whom it calls at `u` of its call (acts.js phone_call): from the talk's start until the handset is down
export const callSays = (u) => u >= ACTS.phone_call.talk[0] && u < ACTS.phone_call.hang[1];

// The call's talk held longer so its words, `seconds` of them scrolling across the visor, have all passed before it begins to hang up
// (timeline.js stretchedFrame): the talk played round again as many more times as that takes, none when the talk is long enough as it is;
// the talk's frames are where the act's own time is in it, its last frame at 1 (figure.js onceTime)
export function callStretch(seconds) {
    const act = ACTS.phone_call;
    const [from, to] = act.talk.map((u) => u * (act.frames - 1));
    // the words start on the act's own clock as the talk does (VoiceFigure callTicker), and it begins to hang up as the talk ends, each round
    // played again putting that off by a round
    const [start, hang] = [act.talk[0] * act.frames, act.hang[0] * (act.frames - 1)];
    const rounds = Math.max(Math.ceil((seconds * act.fps - (hang - start)) / (to - from)), 0);
    return {from, to, extra: rounds * (to - from)};
}

// How near a picture in a message is for the figure to admire it (figure/admire.js), in pixels from the middle of its head on the page:
// no further to either side than `across`, no higher above it than `above` and no lower under it than `below`, so a picture in a message
// over it as it stands on the compose box, or in the bubble it stands on or one beside it
export const PICTURE_NEAR = {across: 300, above: 380, below: 60};

// The pictures in the chat's messages near the figure's head at `head` on the page (PICTURE_NEAR), the nearest first, as their elements
export function picturesNear(head) {
    const {across, above, below} = PICTURE_NEAR;
    return [...document.querySelectorAll("[data-figure-picture]")]
        .map((element) => ({element, at: middleOf(element.getBoundingClientRect())}))
        .filter(({at}) => Math.abs(at.x - head.x) <= across && at.y >= head.y - above && at.y <= head.y + below)
        .sort((a, b) => Math.hypot(a.at.x - head.x, a.at.y - head.y) - Math.hypot(b.at.x - head.x, b.at.y - head.y))
        .map(({element}) => element);
}

// the middle of the box `box` on the page
export const middleOf = (box) => ({x: (box.left + box.right) / 2, y: (box.top + box.bottom) / 2});


// a progress bar marked for the figure, its value how it ended, as the card's tone, and empty while it runs
export const BAR = "[data-figure-bar]";

// How the figure watches a bar running on the bars docked over the compose box: it stands on them `aside` of its picture to the left of
// the bar's end, where the bar is heading, so it looks along the bar and never straight down on it, standing back `back` pixels from the
// bar's end, about the figure's own width, so it looks down along the bar at a gentle angle; and it looks at the leading edge kept at
// least `along` of its picture to one side of where it stands, toward the bar's end
export const WATCH = {back: 144, along: 0.4};

// the spot the figure watches the running bar from (WATCH), on top of the docked bars; null with no bar running there
export function watchSpot(figure) {
    const {element, docked, edge} = groundEdge();
    const track = docked ? element.querySelector(BAR) : null;
    if (!track?.querySelector(PROGRESS)) return null;
    const end = track.getBoundingClientRect().right;
    return {...insideWorld({x: end - WATCH.back, y: edge.top, face: 0, posture: "stand"}, figure), view: null, on: element};
}

// What the figure looks at while it watches the bar whose leading edge is `edge`, standing at `feet`, page points, its picture `figure`:
// the edge, kept to one side of it toward the bar's end (WATCH along) so the look runs along the bar. The bar is on the screen behind
// the figure even when it stands on the mark: it looks back and down over its shoulder instead of at a point in front of the page.
export function watchLook(edge, feet, mark, figure) {
    const near = Math.abs(edge.x - feet.x) < WATCH.along * figure.size;
    return {x: near ? feet.x + WATCH.along * figure.size : edge.x, y: edge.y, behind: true};
}

// How the progress bar on `element` stands, as the bars docked over the compose box: the bar itself, how far its fill has run, 0 to 1,
// how it ended, "" while it runs, and when its run began, in seconds; null when there is none
export function progressOf(element) {
    const bar = element.querySelector(BAR);
    const fill = bar?.firstElementChild;
    if (!fill) return null;
    const share = fill.getBoundingClientRect().width / Math.max(bar.getBoundingClientRect().width, 1);
    return {bar, share, ended: bar.dataset.figureBar, began: Number(bar.dataset.figureBegan)};
}

// The main chat's compose box and its top edge, whatever is docked over it, else the foot of the window: the floor the figure builds on
export function composeEdge() {
    const element = homeElement();
    if (!element) return {element: null, edge: {left: 0, width: window.innerWidth, top: window.innerHeight}};
    const box = element.getBoundingClientRect();
    return {element, edge: {left: box.left, width: box.width, top: box.top}};
}

// Where the figure stands to build or to push what it built: on its feet on the compose box's top edge, whatever is docked over it, and
// kept there as bars dock and go (`stays`, floors.js footingOn); at `x` on the page when given, beside the parcel it builds or behind one
// it pushes, else at a free place along the edge whose parcel, `beside` pixels from its feet, stands clear of the pile from `before` on
// and with room behind it, on its left, for the figure to stand and push it, the one nearest `aim` across the page when given
export function buildSpot(figure, near, {x = null, beside = 0, before = Infinity, aim = null} = {}) {
    const {element, edge} = composeEdge();
    const spot = x === null ? freeBuildSpot(edge, figure, aim === null ? near : {x: aim, y: edge.top}, beside, before) : insideWorld({x, y: edge.top, posture: "stand"}, figure);
    return spot && {...spot, view: null, on: element, stays: true};
}

function freeBuildSpot(edge, figure, near, beside, before) {
    const stands = homeStands(edge, figure);
    const leftmost = Math.min(...stands.map((spot) => spot.x));
    const clear = stands.filter((spot) => spot.x + beside + PARCEL.width < before && spot.x + beside - PUSH.reach - PUSH.room >= leftmost);
    return freeSpot(clear.length ? clear : stands, figure, near);
}

// The wooden ladder the figure sets toward the chat window's side to rummage past it where the ground at home ends short of it (perches.js
// rummageSpot): leaning `lean` degrees from upright, or up to `steepest` from it where it would otherwise be taller than `most` of the
// figure's heights to the rung it stands on, reaching on `over` of its height past that rung; set up for a gap past the ground's end of
// `within` pixels or more, a narrower one rummaged from the ground. The figure climbs it at `climb` pixels a second, facing the way it
// leans, and its rungs are `rung` pixels apart.
export const LADDER = {lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11};

// The trip of a figure resting at `place` to `spot` (tripBetween), from its picture in the posture it travels in where it is to its picture
// in the posture it travels in there; on a climb it hops on up from each foothold of `via` (perches.js climbOf) to the next, and on to the
// spot, or goes up in one on the `pogo` stick; to or from a spot on a ladder it goes by the ladder's foot and climbs it (ladderTrip)
export function tripTo(place, spot, figure, {straight = false, pace = 1, pressing = false, sprinting = false, random = Math.random, via = [], memory = null, now = 0, room = 0, pogo = false} = {}) {
    if (pressing || sprinting) pace = Math.max(pace, SPRINT);
    const corner = (each) => {
        const box = boxAt(each, figure, POSTURES[each.posture].travels);
        return {x: box.left, y: box.top};
    };
    const ladder = spot.ladder ?? place.ladder;
    if (ladder && !(spot.ladder && place.ladder)) return ladderTrip(corner(place), corner(spot), corner({...ladder.foot, posture: "stand"}), ladder.way, Boolean(spot.ladder), figure, pace);
    const [from, ...stops] = [place, ...via, spot].map(corner);
    const trip = tripBetween(from, stops[0], figure.size, {straight, hangs: spot.posture === "hang" || Boolean(spot.swings), pace, pressing, sprinting, random, memory, now, room, pogo});
    const hops = stops.slice(1).map((to, index) => tripBetween(stops[index], to, figure.size, {random, memory, now, room})?.legs.find((leg) => leg.hopping));
    return trip && {...trip, legs: [...trip.legs, ...hops.filter(Boolean)]};
}

// The trip from the picture at `from` to the picture at `to` by a ladder footed where the picture `foot` stands, leaning toward `way`: going
// `up` it goes to the foot, as any trip goes, and climbs to the top, facing the way the ladder leans; coming down it climbs down to the foot
// first and goes on from there. Neither ends in a landing.
function ladderTrip(from, to, foot, way, up, figure, pace) {
    const climb = (start, end) => ({x: end.x, y: end.y, ms: (Math.hypot(end.x - start.x, end.y - start.y) / LADDER.climb) * 1000, lead: 0, easing: "linear", hopping: true, clip: "ladder_climb", facing: way > 0 ? 90 : 270});
    const ground = up ? tripBetween(from, foot, figure.size, {pace}) : tripBetween(foot, to, figure.size, {pace});
    const legs = up ? [...(ground?.legs ?? []), climb(foot, to)] : [climb(from, foot), ...(ground?.legs ?? [])];
    return {way: Math.sign(to.x - from.x) || 1, legs, lands: false, pace, running: pace > 1};
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
// it stands at home, on the main chat's compose box or the bars docked over it. Each spot names the element it rests on as
// `on`, so the figure can tell when that element has gone or moved.
export function spotOf(view, figure, near) {
    if (view) {
        const tab = document.querySelector(`[data-tab="${CSS.escape(view)}"]`);
        const spot = tab && freeSpot(tabSpots(tab), figure, near);
        return spot ? {...spot, view, on: tab} : null;
    }
    const {element, edge} = freeEdge();
    return {...homeSpot(homeStands(edge, figure), figure, near), view: null, on: element};
}
