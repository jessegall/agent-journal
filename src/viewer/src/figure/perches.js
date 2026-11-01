import {RESTS, clipOf} from "../domain/figureState.js";
import {climbStops, heightOf, jumpMost, pogoClimb} from "./climbs.js";
import {holds, readFloors} from "./floors.js";
import {ACTS} from "./acts.js";
import {FRAMED} from "./frame.js";
import {phoneFootprint} from "./phonePlacement.js";
import {LADDER, LEDGES, besidePile, bodyBoxAt, boxAt, buildSpot, clearOf, clearOfNewest, clearOfPile, cornerAt, FEET_INBOARD, groundEdge, hiddenAt, homeCloses, offWalls, openTabs, overlaps, pointedView, restOf, seatOf, spotOf, standRise, watchSpot, worldBox} from "./places.js";
import {letsGoFor} from "./reactions.js";
import {PILE, choicesFor, draw, taken} from "./pile.js";

// Where a figure perches on a message bubble now and then, instead of the compose box's edge: on top of it with its legs over the side,
// or hanging from its top corner by its hands. A perch names its bubble's floor (figure/floors.js), so it rides the bubble as the thread
// scrolls, and is let go when the bubble leaves the thread's view.
export const STANDS = "stand";
export const HANGS = "hang";

// A hang from a bubble's corner is short, as hanging is work, in seconds between the two
export const HANG_STAY = [8, 20];

// The next place to go and for how many seconds to stay, as {where, stay}, drawn from the pile (pile.js roam): mostly it strolls along the
// compose box's edge and stands a while on a corner of it, now and then sits on the corner itself with its legs hanging past the end
// (places.js seatAt), perches on a message bubble or crosses to stand on one of the page's tabs, and whatever the agent is doing it does
// from there; with nothing to do it may sit on the edge of the floor it stands on, facing the viewer, or swing on a rope under a bubble
// that `swings` allows. `scene` holds the `tally` of acts since the last shenanigan, whether the figure is `free` while it has nothing to
// do, its `room` for a shenanigan (reactions.js roomFor), and the `memory` of when each act last played at `now`, for the showpieces'
// cooldowns; and the `moment` drawn for, the laptop's (pile.js laptop) in place of the roam.
export function roamNext(random, scene = {}) {
    const drawn = draw({moment: "roam", ...scene}, random);
    return {where: drawn.name, stay: between(drawn.stay, random)};
}

// a number between the two in `range`
export const between = ([least, most], random) => least + random() * (most - least);

// the side of a bubble with more room outside it, so a figure there stays off the bubbles' text
const sideOf = (rect, scroller) => (rect.left - scroller.left > scroller.right - rect.right ? "left" : "right");

// whether a figure perched on this bubble's top corner stays inside the thread's view `scroller`
const inView = (rect, scroller, figure) => rect.top - standRise(figure) >= scroller.top && rect.top <= scroller.bottom - 8;


// the corner each hand takes facing the viewer; the body hangs outside the bubble so it never covers its words
const HAND_CORNER = {l: "left", r: "right"};
const HANG_OUT = 0.3;
const TURNED_TO_THE_BUBBLE = 180;

// The perch a figure takes now on the bubbles of the floors snapshot `floors`, or null when no bubble in view has one free: the newest
// bubble first, as the thread keeps it in view while older ones scroll away, and on each the kind the pile draws first (pile.js perch), a
// hang only with a free hand while the figure is `free`, with nothing to do, and not cooling down in its `memory` at `now`, then the
// other, a hang taken either way starting its cooldown. `hands` are the sides, "l" or "r", of the hands that carry nothing; `random` is a
// function returning 0 up to 1.
export function perchOn(floors, figure, hands, random, {memory = null, now = 0, free = false} = {}) {
    const open = floors.floors.filter((floor) => floor.kind === "bubble" && inView(floor, floors.view, figure));
    const scene = {moment: "perch", hands: hands.length > 0, free, memory, now};
    const hangs = choicesFor(scene).some((entry) => entry.name === HANGS);
    const first = draw({moment: "perch", hands: hangs, free}, random).name;
    const kinds = !hangs ? [STANDS] : first === HANGS ? [HANGS, STANDS] : [STANDS, HANGS];
    const perches = open.reverse().flatMap((floor) => kinds.map((kind) => perchAt(floor, kind, floors.view, hands)));
    const perch = perches.find((each) => perchSpot(each, floors, figure)) ?? null;
    if (perch?.kind === HANGS) taken(scene, HANGS, random);
    return perch;
}

// A perch of `kind` on a bubble's floor, on its side with more room. A hang there is by the hand on that side, facing the viewer; with
// only the other hand free it turns to face the bubble, as one hangs from a ledge facing the wall, so that hand comes to the corner.
function perchAt(floor, kind, view, hands) {
    const side = sideOf(floor, view);
    if (kind === STANDS) return {floor: floor.id, kind, side, grip: ""};
    const grip = hands.find((hand) => HAND_CORNER[hand] === side);
    return grip ? {floor: floor.id, kind, side, grip, face: 0} : {floor: floor.id, kind, side, grip: hands[0], face: TURNED_TO_THE_BUBBLE};
}

// Where the perch's figure stands now, with the way it faces, or null when its bubble is no floor of `floors` or out of the thread's view,
// when any part of the figure there would be outside its world, or when it would hide words or controls, such as those of the message above
export function perchSpot(perch, floors, figure) {
    const floor = floors.floors.find((each) => each.id === perch.floor);
    if (!floor || !inView(floor, floors.view, figure)) return null;
    const spot = spotOn(perch, floor, figure);
    return holds(spot, figure, floors.floors) && offWalls(spot, figure) && !hiddenAt(spot, figure) ? spot : null;
}

function spotOn(perch, floor, figure) {
    if (perch.kind === STANDS)
        return {...cornerAt({...floor, width: floor.right - floor.left}, perch.side, figure), on: floor.element};
    const out = (perch.side === "left" ? -1 : 1) * HANG_OUT * figure.size;
    const x = (perch.side === "left" ? floor.left : floor.right) + out;
    return {x, y: floor.top, face: perch.face, posture: "hang", grip: perch.grip, on: floor.element};
}

// The floors a figure sits on the edge of, and how wide one must be, in the figure's heights, to have a place along it away from its ends
export const LEDGE_WIDTH = 1.6;

// the places along a floor a figure sits on its edge, as shares of the way across, as the pile has them (pile.js ledge_at)
export const LEDGE_ALONG = PILE.filter((entry) => entry.when.moment === "ledge_at").map((entry) => entry.along);

// how far the figure sitting on the compose box's edge is turned from the viewer toward the nearer end, in degrees: slanted, neither facing
// the viewer nor side-on
export const LEDGE_SLANT = 35;

// Where the figure sits on the edge of the floor it stands at, `near`, its legs over the edge: on a bubble or the dock facing the viewer,
// on the composer slanted toward its nearer end (LEDGE_SLANT), never by the chat's sides: `along` of the way across it, or, where a figure
// sitting there would hide words, be outside its world or in front of the pile, the next of LEDGE_ALONG that would not, never by an end;
// null when it stands on no such floor, the floor is too narrow, or no place along it is free
export function ledgeSpot(along, figure, near) {
    const floors = readFloors();
    const floor = floors.floors.find((each) => each.element && each.element === near.on && LEDGES.has(each.kind));
    if (!floor || floor.right - floor.left < LEDGE_WIDTH * figure.size) return null;
    const faceAt = (share) => (floor.kind !== "compose" ? 0 : share <= 0.5 ? 360 - LEDGE_SLANT : LEDGE_SLANT);
    const spots = [along, ...LEDGE_ALONG.filter((each) => each !== along)].map((share) => ({
        x: floor.left + (floor.right - floor.left) * share, y: floor.top, face: faceAt(share), posture: "sit", leans: true, on: floor.element,
    }));
    return spots.find((spot) => holds(spot, figure, floors.floors) && offWalls(spot, figure) && !hiddenAt(spot, figure) && clearOfPile(spot, figure)) ?? null;
}

// where along the floor it stands on the figure sits composed, as shares of the way across: the middle first, then a little either side
export const COMPOSED_ALONG = [0.5, 0.42, 0.58];

// Where the figure sits composed on the floor it stands at, `near`, a bubble, the dock or the composer: on its top near the middle, sitting
// as `way` has it (pile.js composed_as), facing the viewer or turned `turn` degrees a little to one side, and leaning on the arm `leans`
// names or on none (POSTURES composed), at the first of COMPOSED_ALONG where it is inside its world, clear of the chat's sides, hides no
// words and keeps clear of the pile; null when it stands on no such floor or no place near the middle is free
export function composedSpot(figure, near, way = {turn: 0, leans: 0}) {
    const floors = readFloors();
    const floor = floors.floors.find((each) => each.element && each.element === near.on && LEDGES.has(each.kind));
    if (!floor) return null;
    const at = (share) => ({x: floor.left + (floor.right - floor.left) * share, y: floor.top, face: way.turn, leans: way.leans, posture: "composed", view: null, on: floor.element});
    const spots = COMPOSED_ALONG.map(at);
    return spots.find((spot) => holds(spot, figure, floors.floors) && offWalls(spot, figure) && !hiddenAt(spot, figure) && clearOfPile(spot, figure)) ?? null;
}

// The seat of a rope swing under the bubble `floor`, the figure sitting on it facing the viewer: the rope's length (acts.js rope_swing)
// below the place along the bubble's bottom edge nearest its middle where the swing hangs free (hangsFree), riding the bubble; null when
// there is no such bubble, no place on it hangs free far enough from the sides of the chat for the swing to swing clear, or the figure
// there would hide words or hang its legs below the ground at home
export function swingSpot(floor, figure, floors = readFloors()) {
    if (!floor) return null;
    const {rope, ties, room} = ACTS.rope_swing;
    const world = worldBox();
    const y = floor.bottom + rope * figure.size;
    const tied = (ties * figure.size) / 2;
    const along = [Math.max(floor.left + tied, world.left + room * figure.size), Math.min(floor.right - tied, world.right - room * figure.size)];
    const x = hangsFree(floor, figure, floors, y, along);
    if (x === null) return null;
    const spot = {x, y, posture: "sit", face: 0, swings: true, view: null, on: floor.element};
    const home = floors.floors.find((each) => each.id === "home");
    if (home && boxAt(spot, figure).bottom > home.top) return null;
    return holds(spot, figure, floors.floors) && !hiddenAt(spot, figure) ? spot : null;
}

// The point across, from `from` to `to`, nearest the middle of the bubble `floor`'s bottom edge, where a rope swing tied to it with its seat
// at `y` hangs free over the overhang: no other bubble below it from that edge down to the foot of the figure's picture on the seat, within
// half the seat's width, with room for the pumping legs about its arc; null when there is none
function hangsFree(floor, figure, floors, y, [from, to]) {
    if (from > to) return null;
    const {seat, clearance} = ACTS.rope_swing;
    const bottom = floor.bottom + (boxAt({x: 0, y, posture: "sit"}, figure).bottom - floor.bottom) * (1 + clearance);
    const reach = ((seat * figure.size) / 2) * (1 + clearance);
    const below = floors.floors.filter((each) => each.kind === "bubble" && each.bottom > floor.bottom && each.top < bottom);
    const taken = below.map((each) => [each.left - reach, each.right + reach]);
    const middle = (floor.left + floor.right) / 2;
    const free = (x) => !taken.some(([left, right]) => x > left && x < right);
    const near = [middle, ...taken.flat()].map((x) => Math.min(Math.max(x, from), to)).filter(free);
    return near.sort((a, b) => Math.abs(a - middle) - Math.abs(b - middle))[0] ?? null;
}

// The hand-side selector a seated call can use without putting the complete telephone beyond its floor or the window. A turned
// figure's two placements may project to the same side of its hips; the actual depth, yaw and handset span decide which fits.
// Of two supported placements, prefer more floor beyond the telephone; when neither fits, keep the least of it beyond the edge.
export function phoneSide(spot, figure, floors) {
    const unit = figure.size / FRAMED.height;
    const floor = floors.find((each) => each.element && each.element === spot.on);
    const world = worldBox();
    const supported = {left: Math.max(world.left, floor?.left ?? world.left), right: Math.min(world.right, floor?.right ?? world.right)};
    const room = (way) => {
        const footprint = phoneFootprint(spot.face ?? 0, way, ACTS.phone_call);
        const [left, right] = [spot.x + footprint.left * unit, spot.x + footprint.right * unit];
        const spill = Math.max(0, supported.left - left) + Math.max(0, right - supported.right);
        return {free: spill < 1e-7, spill, beyond: footprint.middle >= 0 ? supported.right - right : left - supported.left};
    };
    const [right, left] = [room(1), room(-1)];
    if (right.free !== left.free) return right.free ? 1 : -1;
    if (!right.free && Math.abs(right.spill - left.spill) > 1e-7) return right.spill < left.spill ? 1 : -1;
    return right.beyond >= left.beyond ? 1 : -1;
}

// Where a disco ball hangs over a figure standing at `spot`, as {kind, above, hangs}: "bubble" when it stands on a bubble with another above
// it near enough, the ball's string tied to that one's bottom edge; `above` is how far over the feet the string is tied and `hangs` how far
// the ball's middle is, in pixels; null with no bubble above to hang it from
export function discoBall(spot, figure, floors = readFloors()) {
    if (spot.posture !== "stand") return null;
    const {ball, clear, tie, far} = ACTS.disco;
    const hat = spot.y - heightOf(figure);
    const hangs = heightOf(figure) + (clear + ball / 2) * figure.size;
    const over = floors.floors.filter((floor) => floor.kind === "bubble" && floor.bottom < spot.y && floor.left < spot.x && floor.right > spot.x);
    const tied = over.filter((floor) => floor.bottom <= hat - (clear + ball + tie) * figure.size).sort((a, b) => b.bottom - a.bottom)[0];
    const onBubble = floors.floors.some((floor) => floor.kind === "bubble" && floor.element === spot.on);
    return onBubble && tied && hat - tied.bottom <= far * heightOf(figure) ? {kind: "bubble", above: spot.y - tied.bottom, hangs} : null;
}

// the bubbles in the thread's view a rope swing can hang free under (swingSpot)
export const swingFloors = (floors, figure) => floors.floors.filter((floor) => floor.kind === "bubble" && swingSpot(floor, figure, floors));

// how long the figure keeps to the chat mark it went to celebrate on, in seconds
export const MARK_STAY = 20;

// Where the figure stands on the chat mark `card`, a message's key: on a corner of the bubble it is in, the side with more room first, or
// at home when it is docked over the compose box; null when it is not on the page or its bubble has no free stand
export function markSpot(card, figure) {
    const mark = document.querySelector(`[data-figure-mark="${CSS.escape(card)}"]`);
    if (!mark) return null;
    if (groundEdge().element?.contains(mark)) return spotOf(null, figure);
    const floors = readFloors();
    const floor = floors.floors.find((each) => each.kind === "bubble" && each.element.contains(mark));
    if (!floor) return null;
    const roomier = sideOf(floor, floors.view);
    const sides = [roomier, roomier === "left" ? "right" : "left"];
    return sides.map((side) => perchSpot({floor: floor.id, kind: STANDS, side, grip: ""}, floors, figure)).find(Boolean) ?? null;
}

// The footholds a figure with its feet at `from` hops onto to climb up to feet at height `y` (climbs.js climbStops): the corners of the
// bubbles in the thread's view on the way with a free stand, each a place it stands at; null when it cannot climb that high
export function climbOf(floors, figure, from, y) {
    const bubbles = floors.floors.filter((floor) => floor.kind === "bubble" && floor.top < from.y);
    const stands = bubbles.map((floor) => perchSpot({floor: floor.id, kind: STANDS, side: sideOf(floor, floors.view), grip: ""}, floors, figure)).filter(Boolean);
    return climbStops(from, y, stands, jumpMost(figure));
}

// whether `spot` is one the figure stands on on top of a bubble of `floors`, the one place the pogo stick takes it
const onBubbleTop = (floors, spot) => spot.posture === "stand" && floors.some((floor) => floor.kind === "bubble" && floor.element === spot.on);

// whether a climb from `from` up to `spot` may go on the pogo stick: onto a bubble's top, at least POGO.share of the height of the thread
// in `floors` as it is now, and the stick not cooling down, as `scene` ({memory, now}) says
const pogoFits = (floors, from, spot, scene) =>
    onBubbleTop(floors.floors, spot) && pogoClimb(from.y - spot.y, floors.view.bottom - floors.view.top) && choicesFor({moment: "climb", ...scene}).some((entry) => entry.name === "pogo");

// How a figure at `from` gets up to `spot`: `via`, the footholds it hops up on (climbOf), or `pogo`, the stick it pulls from behind its
// back, drawn now and then for a climb it fits (pile.js climb) and always when there are no footholds; null when it cannot
export function wayUp(floors, figure, from, spot, scene, random) {
    const via = climbOf(floors, figure, from, spot.y);
    if (!pogoFits(floors, from, spot, scene)) return via && {via, pogo: false};
    return draw({moment: "climb", footholds: Boolean(via), ...scene}, random)?.name === "pogo" ? {via: [], pogo: true} : {via, pogo: false};
}

// the spot, when a figure at `near` can get up to it, hopping or on the pogo stick, else null
export function climbable(spot, figure, near, scene = {}) {
    const floors = readFloors();
    return spot && (climbOf(floors, figure, near, spot.y) || pogoFits(floors, near, spot, scene)) ? spot : null;
}

// The next stay, drawn at `now` seconds from the pile, from the roam or the `moment` named: where, until when, and what it holds for the
// stay, the perch on a bubble, the bubble whose edge it sits on, the tab it stands on, of those with a spot inside its world, or the point
// along the home edge it strolls to. A hang from a bubble is a short one.
export function nextStay(now, figure, hands, random, {tally = null, free = false, room = 0, memory = null, moment = "roam"} = {}) {
    const swings = swingFloors(readFloors(), figure);
    const {where, stay: seconds} = roamNext(random, {moment, tally, free, room, swings: swings.length > 0, memory, now});
    const until = now + seconds;
    if (where === "ledge") return {where, until, along: draw({moment: "ledge_at"}, random).along};
    if (where === "bubble_ledge") return {where, until, ...bubbleLedge(figure, random)};
    if (where === "rope_swing") return {where, until, floor: swings[Math.floor(random() * swings.length)].id};
    if (where === "bubble") {
        const perch = perchOn(readFloors(), figure, hands, random, {memory, now, free});
        return {where, until: perch?.kind === HANGS ? now + between(HANG_STAY, random) : until, perch};
    }
    if (where === "tab") {
        const tabs = Object.keys(openTabs()).filter((view) => spotOf(view, figure));
        return {where, until, view: tabs[Math.floor(random() * tabs.length)]};
    }
    if (where === "edge") return {where, until, along: {x: random() * window.innerWidth, y: 0}};
    if (where === "composed") {
        const {turn, leans} = draw({moment: "composed_as"}, random);
        return {where, until, turn, leans};
    }
    return {where, until};
}

// A bubble in the thread's view whose edge the figure may sit on, and where along it (pile.js ledge_at), {floor, along}; the floor "" when
// no bubble has its edge free there
function bubbleLedge(figure, random) {
    const along = draw({moment: "ledge_at"}, random).along;
    const floors = readFloors();
    const free = floors.floors.filter((floor) => floor.kind === "bubble" && inView(floor, floors.view, figure) && ledgeSpot(along, figure, {on: floor.element}));
    return {floor: free[Math.floor(random() * free.length)]?.id ?? "", along};
}

// The spot where a figure at `near` leans against a wall on the floor it stands on, among `floors`: beside the side of a bubble rising over
// that floor at the hand's height, its middle as far from the side as the lean has it (acts.js lean), the figure standing on the floor clear of its ends and of the bubble, inside its world and hiding
// no words, the nearest such wall; naming its `lean`, {wall, way}, the wall's page x and the way to it, 1 the right; null with none
export function leanSpot(figure, near, floors = readFloors()) {
    const floor = floors.floors.find((each) => each.element && each.element === near.on);
    if (!floor) return null;
    const {wall: away, contact: hand} = ACTS.lean;
    const contact = floor.top - (hand / FRAMED.height) * figure.size;
    const inboard = FEET_INBOARD * figure.size;
    const walls = floors.floors
        .filter((each) => each.kind === "bubble" && each.element !== floor.element && each.bottom <= floor.top && each.top <= contact && each.bottom >= contact)
        .flatMap((bubble) => [{wall: bubble.left, way: 1, bubble}, {wall: bubble.right, way: -1, bubble}]);
    const spots = walls
        .map(({wall, way, bubble}) => ({spot: {x: wall - way * away * figure.size, y: floor.top, face: 0, posture: "stand", view: null, on: floor.element, lean: {wall, way}}, bubble}))
        .filter(({spot, bubble}) => spot.x >= floor.left + inboard && spot.x <= floor.right - inboard && !overlaps(bodyBoxAt(spot, figure), bubble))
        .map(({spot}) => spot)
        .filter((spot) => holds(spot, figure, floors.floors) && offWalls(spot, figure) && !hiddenAt(spot, figure));
    return spots.sort((one, other) => Math.abs(one.x - near.x) - Math.abs(other.x - near.x))[0] ?? null;
}

// How near a bubble's text must be for the figure to hold its magnifying glass up to it: no further across from the middle of its picture
// than `reach` of the figure's size, and the bubble's side reaching the height of its eyes, `eyes` of its height above its feet
export const GLASS_BUBBLE_NEAR = {reach: 1.1, eyes: 0.72};

// The bubble among `floors` within reach of a figure standing at `spot` to hold its glass up to (GLASS_BUBBLE_NEAR), the nearest, or null:
// never the one it stands on
export function bubbleNear(floors, spot, figure) {
    const eyes = spot.y - GLASS_BUBBLE_NEAR.eyes * heightOf(figure);
    const across = (floor) => Math.max(floor.left - spot.x, spot.x - floor.right, 0);
    const near = floors.floors.filter((floor) => floor.kind === "bubble" && floor.element !== spot.on && floor.top <= eyes && floor.bottom >= eyes && across(floor) <= GLASS_BUBBLE_NEAR.reach * figure.size);
    return near.sort((one, other) => across(one) - across(other))[0] ?? null;
}

// the side of the window `world` nearer a figure at page `x`, the corner it rummages at: 1 the right, -1 the left
export const nearerWay = (x, world) => (x - world.left <= world.right - x ? -1 : 1);

// how far in from the chat window's edge the middle of the figure's picture stands to rummage past it, as a share of the picture: near
// enough that its hands, reaching out to its side, go past the edge into the space beyond, which the window hides
export const RUMMAGE_INSET = 0.18;

// The spot at the chat window's edge on the side `way` (-1 the left, 1 the right) where the figure rummages past it: on the ground at home,
// never past the end of the ground it stands on; or, where the window's edge lies past that end, on the top rung of a ladder (LADDER) set
// against the window's side there, footed on the ground by its end, the spot then naming its `ladder`, {foot, top, way}, on the page
export function rummageSpot(figure, way) {
    const world = worldBox();
    const {edge} = groundEdge();
    const spot = spotOf(null, figure, {x: way > 0 ? world.right : world.left, y: 0});
    const end = way > 0 ? edge.left + edge.width - FEET_INBOARD * figure.size : edge.left + FEET_INBOARD * figure.size;
    const wall = way > 0 ? world.right : world.left;
    const reach = wall - way * RUMMAGE_INSET * figure.size;
    const gap = way * (reach - end);
    if (gap < LADDER.within) return {...spot, x: way > 0 ? Math.min(reach, end) : Math.max(reach, end)};
    // the rung the figure stands on as high up the leaning ladder as reaches out over the gap to the edge, within the ladder's height and
    // its steepest lean, the ladder reaching on past it
    const tan = (degrees) => Math.tan((degrees * Math.PI) / 180);
    const rise = Math.min(gap / tan(LADDER.lean), LADDER.most * heightOf(figure));
    const span = Math.min(gap, rise * tan(LADDER.steepest));
    const over = LADDER.over * heightOf(figure);
    const x = end + way * span;
    const foot = {x: end, y: edge.top};
    return {...spot, x, y: edge.top - rise, ladder: {foot, top: {x: x + (way * over * span) / rise, y: edge.top - rise - over}, way}};
}

// The ladder standing against the window's side now (rummageSpot), as the figure's `place` and `trip` say: the one a trip goes up, from
// when it sets out, the one the figure stands on, and the one it climbs down, until it is off it; null with none
export const ladderShown = (place, trip) =>
    trip?.to?.ladder ?? (place.ladder && (!trip?.moves || trip.clip === "ladder_climb" || trip.legs.some((leg) => leg.clip === "ladder_climb")) ? place.ladder : null);

// The spot of a stay now for a figure at `near`, or null when its bubble or tab is gone or its perch is no longer free; a tab it only
// visits is not one it points at
export function stayingAt(stay, figure, near) {
    if (stay.where === "bubble") {
        const spot = stay.perch && perchSpot(stay.perch, readFloors(), figure);
        return spot ? {...spot, view: null} : null;
    }
    if (stay.where === "tab") {
        const spot = stay.view && spotOf(stay.view, figure, near);
        return spot ? {...spot, view: null} : null;
    }
    if (stay.where === "edge") return spotOf(null, figure, stay.along);
    if (stay.where === "rummage") return rummageSpot(figure, stay.way);
    if (stay.where === "mark") return markSpot(stay.card, figure);
    if (stay.where === "ledge") return ledgeSpot(stay.along, figure, near);
    if (stay.where === "bubble_ledge") return ledgeSpot(stay.along, figure, {on: readFloors().floors.find((floor) => floor.id === stay.floor)?.element});
    if (stay.where === "composed") return composedSpot(figure, near, stay);
    if (stay.where === "lean") return leanSpot(figure, near);
    if (stay.where === "rope_swing") return swingSpot(readFloors().floors.find((floor) => floor.id === stay.floor), figure);
    if (stay.where === "seat") return seatOf(figure, near) ?? restOf(figure, near);
    if (stay.where === "aside") return stay.spot;
    return restOf(figure, near);
}

// Where the figure goes now and the stay it keeps: onto the compose box's top to push a parcel it built onto the pile, where `work.x`
// says, or to build a unit the run was granted (parcels.js unitGranted), beside the parcel it builds there or else clear of the pile
// (places.js buildSpot), `work` being null with none of these in hand;
// resting at home while its agent cannot act; to the tab of what waits on the user when something does and that tab has a spot inside
// the figure's world; otherwise where its stay is, drawing the next stay when this one is over or its place is gone. `near` is where it
// is, `counts` the views' badge counts, `state` what the agent does and `room` the seconds it may be away for a shenanigan (reactions.js
// roomFor). The spot is kept clear of the box the figure stepped aside from while that box is `cleared` (keptClear), except where it
// builds; resting by the parcel `pile`, it stands beside it (places.js besidePile).
export function targetFor({state, counts, stay, now, near, figure, hands, work = null, pile = null, cleared = {until: 0}, random = Math.random, tally = null, memory = null, room = 0}) {
    const building = work && buildSpot(figure, near, work);
    if (building) return {spot: clearOfNewest(building, figure) ? building : null, stay};
    const target = targetOf({state, counts, stay, now, near, figure, hands, random, tally, memory, room});
    // a spot on a ladder stays where the ladder stands
    if (target.spot?.ladder) return {...target, spot: clearOfNewest(target.spot, figure) ? target.spot : null};
    const spot = unlessClosing(watching(besidePile(keptClear(target.spot, {state, now, near, figure, cleared}), pile, figure), figure), near);
    return {...target, spot: clearOfNewest(spot, figure) ? spot : null};
}

// the spot, or null when it is on a docked card about to close by itself and the figure at `near` is not on it already: it never sets out
// for one, and one already on it may stay
const unlessClosing = (spot, near) => (spot?.on && spot.on !== near.on && spot.on === groundEdge().element && homeCloses() ? null : spot);

// Where a figure at `near` eager for the bar docked over the compose box goes: onto the bars, at the spot it watches the bar from
// (places.js watchSpot), else anywhere on them, on its feet, as from the edge it sat on waiting (runWait.js); null once it stands there,
// where it stays until the run ends
export function eagerSpot(near, figure) {
    const spot = watchSpot(figure) ?? spotOf(null, figure);
    return near?.on === spot.on && near.posture === spot.posture && Math.abs(near.x - spot.x) < 2 ? null : spot;
}

// a spot at home on the bars docked over the compose box, while a bar runs there, is the spot the figure watches it from
const watching = (spot, figure) => (spot && groundEdge().docked && spot.on === groundEdge().element ? (watchSpot(figure) ?? spot) : spot);

// whether the figure builds in `state`: its clip there is the hammering
export const builds = (state) => clipOf(state) === "work";

// The spot, or, while the box the figure stepped aside from is `cleared` and the spot's picture would cover it, one at home clear of it
export function keptClear(spot, {state, now, near, figure, cleared}) {
    if (now >= cleared.until || !overlaps(boxAt(spot, figure), cleared.box)) return spot;
    return clearOf(cleared.box, figure, near, RESTS.has(state)) ?? spot;
}

function targetOf({state, counts, stay, now, near, figure, hands, random, tally, memory, room}) {
    if (RESTS.has(state)) return {spot: restOf(figure, near), stay};
    const scene = {memory, now, room};
    const laptop = clipOf(state) === "type" && laptopAt(stay, now, figure, hands, random, near, scene);
    if (laptop) return laptop;
    const pressing = pointedView(counts, openTabs());
    const pointing = pressing && climbable(spotOf(pressing, figure, near), figure, near, scene);
    if (pointing) return {spot: pointing, stay};
    const kept = !stay.laptop && now < stay.until && climbable(stayingAt(stay, figure, near), figure, near, scene);
    if (kept) return {spot: kept, stay};
    const next = nextStay(now, figure, hands, random, {tally, free: room > 0, room, memory});
    return {spot: climbable(stayingAt(next, figure, near), figure, near, scene) || restOf(figure, near), stay: next};
}

// Where the figure sits at its laptop while its agent works at it, and the stay it keeps there: the laptop's stay while it lasts and its
// spot is there, else the next drawn from the pile (pile.js laptop), mostly a corner at home, now and then, bored of the spot, a bubble's
// edge, or a corner when that one has no spot; null when no corner is free either. `scene` holds the `memory`, `now` and `room` its climb
// is drawn with.
function laptopAt(stay, now, figure, hands, random, near, scene) {
    const kept = stay.laptop && now < stay.until && climbable(stayingAt(stay, figure, near), figure, near, scene);
    if (kept) return {spot: kept, stay};
    const next = {...nextStay(now, figure, hands, random, {moment: "laptop", memory: scene.memory}), laptop: true};
    const there = climbable(stayingAt(next, figure, near), figure, near, scene);
    if (there) return {spot: there, stay: next};
    const seat = seatOf(figure, near);
    return seat && {spot: seat, stay: {...next, where: "seat"}};
}

// Having jumped up onto a bubble on purpose, by a hop or the pogo stick, the figure stays there `seconds` before any trip away, but one
// that drops everything (reactions.js EAGER urgent)
export const PERCHED = {seconds: 4};

// whether a trip's `legs` climb, one of them a hop or the pogo stick up rather than a fall down
export const climbs = (legs) => legs.some((leg) => leg.hopping && leg.clip !== "fall");

// the stay a trip that `climbed` and ended on a floor of `kind` at `now`, in seconds, holds the figure to, or null when it holds it to none
export const perchedAfter = (climbed, kind, now) => (climbed && kind === "bubble" ? {until: now + PERCHED.seconds} : null);

// whether the figure may set off on a trip away at `now`, `perched` as it is: once its stay is over, or at once for an `urgent` trip
export const mayLeave = (perched, now, urgent) => urgent || !perched || now >= perched.until;

// Seated, in a corner, on a bubble's edge or on a card, the figure keeps its seat at least `least` seconds, and up to `more` longer by roll,
// before any act or trip but an urgent one stands it up, so it never sits down and gets up again a moment later
export const SEAT_STAY = {least: 30, more: 30};

// The stay that holds the figure at `now`: a new seat's once it sits down, `seated` now and not before (`wasSeated`), drawn with `random`;
// `perched` as it was while it stays seated, or while it stands on a bubble it climbed onto; none once it stands up from its seat
export function seatStay(perched, seated, wasSeated, now, random) {
    if (!seated) return perched?.seated ? null : perched;
    if (wasSeated && perched?.seated) return perched;
    return {until: now + SEAT_STAY.least + random() * SEAT_STAY.more, seated: true};
}

// whether the clip `clip` may play now at a place of `posture` while `perched` holds the figure at `now`: any but one that would stand it up
// from a seat it keeps
export const playsSeated = (clip, posture, perched, now) => !perched?.seated || now >= perched.until || clip.postures.includes(posture) || Boolean(clip.rises);

// how long the box a figure stepped aside from stays clear of it, in seconds
export const CLEARED_SECONDS = 30;

// The stay and the cleared box once the figure steps out of the way, as when the user clicks it or a message appears under it: the stay is
// over, and `box`, the picture it was drawn in then, is kept clear of it for CLEARED_SECONDS
export const stepAside = (stay, box, now) => ({stay: {...stay, until: 0}, cleared: {box, until: now + CLEARED_SECONDS}});

// The stay once the ground went from under the figure: a stroll along the home edge or a rest there is kept, any stay away from home is
// given up for a rest
export const stayAtHome = (stay) => (stay.where === "edge" ? stay : {where: "rest", until: stay.where === "rest" ? stay.until : 0});

// The stay once a look comes: over at once when the figure hangs there with its back to the viewer, so it lets go and turns round to
// show it, else kept
export const stayForLook = (stay, place) => (letsGoFor(place) ? {...stay, until: 0} : stay);
