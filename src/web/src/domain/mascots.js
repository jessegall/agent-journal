// Where each voice's mascot stands on the chat box, read off the first frame of its art (256 px cells):
// line: the row that rests on the box's top edge, the feet of a voice that stands and the seat of one that sits;
// edge: the column that meets the box's right edge, the right side of a standing voice and the end of the seat of a sitting one, so its legs dangle over the corner.
export const PLACES = {
    butler: {edge: 211, line: 232},
    coach: {edge: 191, line: 232},
    colleague: {edge: 105, line: 170, sits: true},
    homie: {edge: 130, line: 175, sits: true},
    squire: {edge: 135, line: 170, sits: true},
};

export const STILL = {edge: 200, line: 232};

export const placeOf = (art) => PLACES[art.replace(/\.\w+$/, "")] ?? STILL;

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
export const DEFAULT_SCHEDULE = {blink: {min: 5, max: 10}, idle: {min: 20, max: 30}, weights: {}, place: {x: 0, y: 0}};

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
export const showcaseOn = (url = window.location) => new URLSearchParams(url.search).get("mascot") === "showcase" || /[?&]mascot=showcase/.test(url.hash);

// The animations as the dialog lists them: grouped by kind, the moments' kinds first, then the rest by name.
export const KIND_ORDER = ["idle", "blink"];

export const groupedByKind = (list) => {
    const kinds = [...new Set(list.map((animation) => animation.kind))];
    kinds.sort((a, b) => (KIND_ORDER.indexOf(a) + 1 || 99) - (KIND_ORDER.indexOf(b) + 1 || 99) || a.localeCompare(b));
    return kinds.map((kind) => ({
        kind,
        items: list.filter((animation) => animation.kind === kind).sort((a, b) => isBlink(b) - isBlink(a) || a.name.localeCompare(b.name, undefined, {numeric: true})),
    }));
};

export const animationLabel = (animation) => (animation.name ? `${animation.kind} ${animation.name.replace(/_/g, " ")}` : animation.kind);
