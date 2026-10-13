// Where each voice's mascot stands on the chat box, read off the first frame of its art (256 px cells):
// line: the row that rests on the box's top edge, the feet of a voice that stands and the seat of one that sits;
// edge: the column that stands 12 px inside the box's right edge: the right side of a standing voice, the end of the seat of a sitting one, so its legs hang over the corner;
// seat: the column the seat ends at, where anchoring looks for it;
// a sitting voice sits no further right than keeps its widest frame within 40 cells of it, or the pane's padding clips its legs and props.
export const PLACES = {
    butler: {edge: 211, line: 232},
    coach: {edge: 191, line: 232},
    colleague: {edge: 105, line: 170, sits: true, seat: 105},
    homie: {edge: 165, line: 175, sits: true, seat: 130},
    squire: {edge: 188, line: 170, sits: true, seat: 135},
};

export const STILL = {edge: 200, line: 232};

// How each voice lands when the bar it sits on goes: the drop's length, how deep it squashes on landing and how many pixels it bounces back.
export const FALLS = {
    butler: {ms: 420, squash: 0.04, bounce: 0},
    coach: {ms: 340, squash: 0.1, bounce: 10},
    colleague: {ms: 480, squash: 0.06, bounce: 3},
    homie: {ms: 380, squash: 0.14, bounce: 14},
    squire: {ms: 300, squash: 0.18, bounce: 2},
};

export const fallOf = (voice) => FALLS[voice] ?? FALLS.butler;

// How long the agent must stay idle before the mascot enters, or busy before it leaves.
export const PRESENCE_GRACE_MS = 3000;

// How a sitting voice comes and goes: it hops up onto its seat and hops off it, legs showing all the while, each in its own manner:
// the hop's length, how high it rises in pixels of the 128 px mascot, how far below the seat it starts and ends, and how deep it squashes on landing.
// A standing voice walks in along the box's edge instead and has no hop.
export const HOPS = {
    colleague: {ms: 620, rise: 16, drop: 44, squash: 0.06},
    homie: {ms: 520, rise: 30, drop: 48, squash: 0.16},
    squire: {ms: 560, rise: 12, drop: 40, squash: 0.1},
};

export const hopOf = (voice) => (PLACES[voice]?.sits ? HOPS[voice] : null);

// A standing voice strolls along the box's top edge during a move that steps, and stops somewhere new, facing the way it went.
// A move strolls when it is named walk, or is the one the voice steps in; a sitting voice never strolls.
export const WALKS = {butler: "little two step", coach: "jog on the spot"};
export const strollsIn = (voice, move) => !hopOf(voice) && Boolean(move) && (move.name === "walk" || move.name === WALKS[voice]);

// The mascot is this many pixels wide, as the stylesheet draws it.
export const MASCOT_SIZE = 128;
// A stroll shorter than this many mascot widths is a shuffle, not a walk at chat size; it goes no faster than STROLL_SPEED of them a second.
export const MIN_STROLL = 0.75;
export const STROLL_SPEED = 0.9;

// The way each voice's art faces; a stroll the other way mirrors it.
export const FACES = {};
export const facesAt = (voice) => FACES[voice] ?? "left";
export const flipOf = (voice, toward) => (toward === facesAt(voice) ? 1 : -1);

// How far left of home a mascot may stand: no further than the box's middle, so it never reaches the left edge's controls.
export const strollRoom = (boxWidth) => Math.max(0, boxWidth / 2 - MASCOT_SIZE);

// Where a stroll that lasts `ms` takes a mascot standing `at` pixels left of home: a new place at least MIN_STROLL away and no further than it can walk in that time, inside the room
// the box leaves, or null when the box is too narrow for one. `random` is called twice.
export function strollOf({boxWidth, at, ms, random = Math.random}) {
    const least = MIN_STROLL * MASCOT_SIZE;
    const reach = STROLL_SPEED * MASCOT_SIZE * (ms / 1000);
    const room = strollRoom(boxWidth);
    const ways = [
        [Math.max(0, at - reach), at - least],
        [at + least, Math.min(room, at + reach)],
    ].filter(([low, high]) => low <= high);
    if (!ways.length) return null;
    const [low, high] = ways[Math.floor(random() * ways.length)];
    const to = low + random() * (high - low);
    return {to, toward: to > at ? "left" : "right"};
}

export const placeOf = (voice) => PLACES[voice] ?? STILL;

// A place moved right and down by the spot a voice saved, in pixels of its 256 px cell.
export const placedAt = (place, spot) => ({...place, edge: place.edge - (spot?.x || 0), line: place.line - (spot?.y || 0)});

// A voice's blink is its idle animation named blinking (or the older blink kind); its other idle animations are the acts the mascot plays while it waits.
// Any other kind a voice carries shows in its dialog only.
export const BLINK_NAME = "blinking";
export const isBlink = (animation) => animation.kind === "blink" || (animation.kind === "idle" && animation.name === BLINK_NAME);
export const isAct = (animation) => animation.kind === "idle" && !isBlink(animation);

export const CELL = 256;
export const FRAME_MS = 286;

export const frameMs = (edit, index) => edit?.frames?.[index]?.ms || edit?.ms || FRAME_MS;

export const frameShift = (edit, index) => ({x: edit?.frames?.[index]?.x || 0, y: edit?.frames?.[index]?.y || 0});

// When a voice's mascot plays what, until the voice saves a schedule of its own: seconds between blinks, seconds between its other idle animations.
export const DEFAULT_SCHEDULE = {blink: {min: 2, max: 6}, idle: {min: 20, max: 30}, weights: {}, place: {x: 0, y: 0}};

// A blink as people blink: every few seconds at an irregular gap, the lids shut for a varied moment, and now and then twice in quick succession.
export const BLINK = {shut: {min: 90, max: 160}, doubleOneIn: 6, doubleAfter: 130};

export const blinkOf = (random = Math.random) => ({
    shut: BLINK.shut.min + random() * (BLINK.shut.max - BLINK.shut.min),
    twice: random() < 1 / BLINK.doubleOneIn,
    again: BLINK.doubleAfter,
});

export const weightOf = (schedule, path) => schedule.weights?.[path] ?? 1;

// The chance, in percent, that an idle animation is the one picked: its weight among the weights of all the voice's idle animations.
export const chanceOf = (schedule, paths, path) => {
    const total = paths.reduce((sum, other) => sum + weightOf(schedule, other), 0);
    return total ? Math.round((100 * weightOf(schedule, path)) / total) : 0;
};

// The idle animation to play next: picked by weight, never the one that played last when there is another.
export const pickWeighted = (items, schedule, last, random = Math.random()) => {
    const options = items.length > 1 ? items.filter((item) => item !== last) : items;
    const total = options.reduce((sum, item) => sum + weightOf(schedule, item.path), 0);
    if (!total) return options[Math.floor(random * options.length)];
    let left = random * total;
    return options.find((item) => (left -= weightOf(schedule, item.path)) < 0) ?? options[options.length - 1];
};

// A tuning with one frame changed, the others kept, as many frames as the sheet holds.
export const withFrame = (edit, count, at, patch) => {
    const frames = Array.from({length: count}, (_, index) => ({x: 0, y: 0, ms: 0, ...edit?.frames?.[index]}));
    frames[at] = {...frames[at], ...patch};
    return {ms: edit?.ms || 0, frames};
};

export const afterSeconds = ({min, max}, random = Math.random()) => (min + random * (max - min)) * 1000;

// ?mascot=showcase plays every animation of every voice back to back, naming each beside the mascot.
export const showcaseOn = (url = window.location) =>
    new URLSearchParams(url.search).get("mascot") === "showcase" || /[?&]mascot=showcase/.test(url.hash);

// The animations as the dialog lists them: grouped by kind, the moments' kinds first, then the rest by name.
export const KIND_ORDER = ["idle", "blink"];

export const groupedByKind = (list) => {
    const kinds = [...new Set(list.map((animation) => animation.kind))];
    kinds.sort((a, b) => (KIND_ORDER.indexOf(a) + 1 || 99) - (KIND_ORDER.indexOf(b) + 1 || 99) || a.localeCompare(b));
    return kinds.map((kind) => ({
        kind,
        items: list
            .filter((animation) => animation.kind === kind)
            .sort((a, b) => isBlink(b) - isBlink(a) || a.name.localeCompare(b.name, undefined, {numeric: true})),
    }));
};

export const animationLabel = (animation) => (animation.name ? `${animation.kind} ${animation.name.replace(/_/g, " ")}` : animation.kind);
