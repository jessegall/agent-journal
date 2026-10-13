// How each voice lands when the bar it sits on goes: the drop's length, how deep it squashes on landing and how many pixels it bounces back.
export const FALLS = {
    butler: {ms: 420, squash: 0.04, bounce: 0},
    coach: {ms: 340, squash: 0.1, bounce: 10},
    colleague: {ms: 480, squash: 0.06, bounce: 3},
    homie: {ms: 380, squash: 0.14, bounce: 14},
    squire: {ms: 300, squash: 0.18, bounce: 2},
};

export const fallOf = (voice) => FALLS[voice] ?? FALLS.butler;
