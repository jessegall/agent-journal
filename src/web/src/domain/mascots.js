// The flat style: one atlas per voice, in voices/flat (the older sheets in voices stay aside, unused).
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

export const atlasOf = (voice, act) => `voices/flat/${voice}_${act}_atlas.png`;

export const BLINK_SECONDS = {min: 3, max: 6};
export const ACT_SECONDS = {min: 10, max: 30};

export const afterSeconds = ({min, max}, random = Math.random()) => (min + random * (max - min)) * 1000;

export const otherThan = (list, last, random = Math.random()) => {
    const options = list.length > 1 ? list.filter((item) => item !== last) : list;
    return options[Math.floor(random * options.length)];
};

// ?mascot=showcase plays every animation of every voice back to back, naming each beside the mascot.
export const showcaseOn = (url = window.location) => new URLSearchParams(url.search).get("mascot") === "showcase" || /[?&]mascot=showcase/.test(url.hash);

export const SHOWCASE_ACTS = ["idle_1"];

export const showcaseStep = (index) => {
    const voices = Object.keys(PLACES);
    const voice = voices[Math.floor(index / SHOWCASE_ACTS.length) % voices.length];
    const act = SHOWCASE_ACTS[index % SHOWCASE_ACTS.length];
    return {voice, act, place: PLACES[voice], label: `${voice} \u00b7 ${act.replace("_", " ")}`};
};
