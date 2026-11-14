// How each voice lands when the bar it sits on goes: how long its landing takes, how deep it squashes on it and how many pixels it bounces
// back. Every fall drops at GRAVITY, a real fall's speed, in pixels a second each second at the chat's figure.
export const FALLS = {
    butler: {ms: 420, squash: 0.04, bounce: 0},
    coach: {ms: 340, squash: 0.1, bounce: 10},
    colleague: {ms: 480, squash: 0.06, bounce: 3},
    homie: {ms: 380, squash: 0.14, bounce: 14},
    squire: {ms: 300, squash: 0.18, bounce: 2},
};

export const fallOf = (voice) => FALLS[voice] ?? FALLS.butler;

export const GRAVITY = 2400;

// the longest step a fall takes at once, in seconds, so a frame missed while the tab was away does not drop the figure through its ground
const LONGEST_STEP = 0.05;

// One frame of a figure falling to `floor` from `y`, `speed` pixels a second downward, `seconds` after the last: it falls at GRAVITY, never
// faster than `most` pixels a second, as under a parachute, and lands, its speed spent, the moment it touches the floor
export function fallStep({y, speed}, floor, seconds, most = Infinity) {
    const step = Math.min(seconds, LONGEST_STEP);
    const faster = Math.min(speed + GRAVITY * step, most);
    const lower = y + faster * step;
    return lower < floor ? {y: lower, speed: faster, landed: false} : {y: floor, speed: 0, landed: true};
}
