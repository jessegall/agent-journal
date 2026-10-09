// Where each voice's mascot stands on the chat box, read off the first frame of its art (256 px cells):
// edge: the pixel its right side ends at; foot: the pixel its feet stand on.
export const PLACES = {
    butler: {edge: 228, foot: 242},
    coach: {edge: 214, foot: 246},
    colleague: {edge: 211, foot: 244},
    homie: {edge: 235, foot: 239},
    squire: {edge: 226, foot: 221},
};

export const STILL = {edge: 230, foot: 244};

export const placeOf = (art) => PLACES[art.replace(/\.\w+$/, "")] ?? STILL;

export const BLINK_SECONDS = {min: 3, max: 6};
export const ACT_SECONDS = {min: 10, max: 30};

export const afterSeconds = ({min, max}, random = Math.random()) => (min + random * (max - min)) * 1000;

export const otherThan = (list, last, random = Math.random()) => {
    const options = list.length > 1 ? list.filter((item) => item !== last) : list;
    return options[Math.floor(random * options.length)];
};

// ?mascot=showcase plays every animation of every voice back to back, naming each beside the mascot.
export const showcaseOn = (url = window.location) => new URLSearchParams(url.search).get("mascot") === "showcase" || /[?&]mascot=showcase/.test(url.hash);

export const SHOWCASE_ACTS = ["blink", "idle_1", "idle_2", "idle_3", "idle_4", "idle_5"];

export const showcaseStep = (index) => {
    const voices = Object.keys(PLACES);
    const voice = voices[Math.floor(index / SHOWCASE_ACTS.length) % voices.length];
    const act = SHOWCASE_ACTS[index % SHOWCASE_ACTS.length];
    return {voice, act, place: PLACES[voice], label: `${voice} · ${act.replace("_", " ")}`};
};
