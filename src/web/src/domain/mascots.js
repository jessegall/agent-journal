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
