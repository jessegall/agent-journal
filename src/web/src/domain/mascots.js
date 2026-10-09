// Where each voice's mascot stands on the chat box, read off the first frame of its art (256 px cells):
// edge: the pixel its right side ends at; foot: the pixel its feet stand on.
export const PLACES = {
    butler: {edge: 211, foot: 232},
    coach: {edge: 191, foot: 232},
    colleague: {edge: 171, foot: 232},
    homie: {edge: 204, foot: 232},
    squire: {edge: 226, foot: 208},
};

export const STILL = {edge: 200, foot: 232};

export const placeOf = (art) => PLACES[art.replace(/\.\w+$/, "")] ?? STILL;

// The kind of animation the mascot plays at each moment; any other kind a voice carries shows in its dialog only.
export const MOMENTS = {blinking: "blink", waiting: "idle"};

export const BLINK_SECONDS = {min: 3, max: 6};
export const ACT_SECONDS = {min: 10, max: 30};

export const afterSeconds = ({min, max}, random = Math.random()) => (min + random * (max - min)) * 1000;

export const otherThan = (list, last, random = Math.random()) => {
    const options = list.length > 1 ? list.filter((item) => item !== last) : list;
    return options[Math.floor(random * options.length)];
};

// ?mascot=showcase plays every animation of every voice back to back, naming each beside the mascot.
export const showcaseOn = (url = window.location) => new URLSearchParams(url.search).get("mascot") === "showcase" || /[?&]mascot=showcase/.test(url.hash);

// The animations as the dialog lists them: grouped by kind, the moments' kinds first, then the rest by name.
export const KIND_ORDER = Object.values(MOMENTS);

export const groupedByKind = (list) => {
    const kinds = [...new Set(list.map((animation) => animation.kind))];
    kinds.sort((a, b) => (KIND_ORDER.indexOf(a) + 1 || 99) - (KIND_ORDER.indexOf(b) + 1 || 99) || a.localeCompare(b));
    return kinds.map((kind) => ({kind, items: list.filter((animation) => animation.kind === kind)}));
};

export const animationLabel = (animation) => (animation.name ? `${animation.kind} ${animation.name.replace(/_/g, " ")}` : animation.kind);
