// Where each voice's mascot stands on the chat box, beside the art it is drawn from.
// inset: pixels the mascot sits left of the box's top-right corner; lift: pixels it sits above the border;
// walk: pixels it travels left along the border and back while its animation plays (0 stays in place).
export const PLACES = {
    squire: {inset: 0, lift: 0, walk: 0},
    butler: {inset: 40, lift: 0, walk: 180},
    homie: {inset: 0, lift: 0, walk: 0},
    colleague: {inset: 0, lift: 0, walk: 0},
    coach: {inset: 70, lift: 0, walk: 0},
};

export const STILL = {inset: 0, lift: 0, walk: 0};

export const placeOf = (art) => PLACES[art.replace(/\.\w+$/, "")] ?? STILL;

export const BLINK_SECONDS = {min: 3, max: 6};
export const ACT_SECONDS = {min: 10, max: 30};

export const afterSeconds = ({min, max}, random = Math.random()) => (min + random * (max - min)) * 1000;

export const otherThan = (list, last, random = Math.random()) => {
    const options = list.length > 1 ? list.filter((item) => item !== last) : list;
    return options[Math.floor(random * options.length)];
};
