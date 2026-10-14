// How each voice lands when the bar it sits on goes: the drop's length, how deep it squashes on landing and how many pixels it bounces back.
export const FALLS = {
    butler: {ms: 420, squash: 0.04, bounce: 0},
    coach: {ms: 340, squash: 0.1, bounce: 10},
    colleague: {ms: 480, squash: 0.06, bounce: 3},
    homie: {ms: 380, squash: 0.14, bounce: 14},
    squire: {ms: 300, squash: 0.18, bounce: 2},
};

export const fallOf = (voice) => FALLS[voice] ?? FALLS.butler;

// the longest step a fall takes at once, in seconds, so a frame missed while the tab was away does not drop the figure through its ground
const LONGEST_STEP = 0.05;

// One frame of a figure falling to `floor` from `y`, `speed` pixels a second downward, `seconds` after the last: it falls under the pull
// that takes it its own `size` in the voice's fall time, and lands, its speed spent, the moment it touches the floor
export function fallStep({y, speed}, floor, seconds, fall, size) {
    const step = Math.min(seconds, LONGEST_STEP);
    const pull = (2 * size) / (fall.ms / 1000) ** 2;
    const faster = speed + pull * step;
    const lower = y + faster * step;
    return lower < floor ? {y: lower, speed: faster, landed: false} : {y: floor, speed: 0, landed: true};
}
