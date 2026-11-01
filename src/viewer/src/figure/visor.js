// A run's end shows in the figure's eyes on its pixel screen (visorPixels.js), never by lighting the visor whole: two red crosses for a
// failure, two green ticks for a pass, in the visor's own red and green `colours`, and never while the figure sleeps. They show only once
// the figure has turned its head to the chat mark of the run that ended (lightOnce), for `looks` seconds on end, or `waits` on when it
// cannot. A dance's screen (discoScreen) is lit brighter to its core by `core`, with a soft halo about the visor as strong as `halo`; the
// server units' lights shine in the same red and green. Every number of it is here, in seconds.
export const VISOR = {waits: 1.5, looks: 1, colours: {bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32]}, core: 0.45, halo: 0.75};

// The crosses or ticks of a run's end: over `seconds` they come on as an old CRT warms up, flickering on and off `flickers` times over
// `flicker`, each time a little brighter; flash white and bright over `flash`, settling into their colour; hold; and fade back into the
// usual eyes over `fade`.
export const SIGN = {seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: {bad: "cross", good: "tick"}};

const span = (k, from, to) => Math.min(Math.max((k - from) / (to - from), 0), 1);
const ease = (k) => k * k * (3 - 2 * k);

// How the sign in the eyes stands `seconds` after it came on, or null once its time is over: how far the eyes are the sign rather than
// their usual shape, 0 to 1; how brightly it glows, 0 to 1; and how white its flash still is
export function signAt(seconds) {
    if (seconds < 0 || seconds >= SIGN.seconds) return null;
    const warming = span(seconds, ...SIGN.flicker);
    const on = Math.floor(warming * SIGN.flickers * 2) % 2 === 0;
    const lit = seconds < SIGN.flicker[1] ? (on ? 0.35 + 0.5 * warming : SIGN.dim) : 1;
    return {strength: 1 - ease(span(seconds, ...SIGN.fade)), lit, white: seconds < SIGN.flash[0] ? 0 : 1 - ease(span(seconds, ...SIGN.flash))};
}

// how far the figure turns toward the viewer while its visor is lit or its eyes are a sign, 0 to 1 (figure.js turnToViewer): round as its
// eyes go out, held all the while it glows, and back as the glow fades and the eyes return
export const glowTurn = (crt) => Math.max(crt.glow, 1 - crt.eyes, crt.sign?.strength ?? 0);

// The visor as the page draws it `now` seconds, for a run's end `lit` ({tone, at, card, since}) or none, while the figure is `asleep` or
// not: dark, its eyes the sign of the run's tone in its colour as it stands (signAt); null while it shows the eyes, waits to show the sign or
// sleeps
export function visorAt(lit, now, asleep) {
    if (!lit || lit.at === null || asleep) return null;
    const sign = signAt(now - lit.at);
    return sign && {colour: VISOR.colours[lit.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: {name: SIGN.signs[lit.tone], ...sign}};
}

// The run's end a process card ending shows, from `ends` (figureState.js processEndsAfter), the newest of them, or `lit` as it was: waiting
// since `now` to show, its `at` null, while the figure turns to the run's chat mark `card`
export function visorFor(ends, lit, now) {
    if (!ends.length) return lit;
    return {tone: ends.at(-1).tone, at: null, since: now, card: ends.at(-1).card};
}

// The run's end `lit` shown `now` once the figure has faced what told it of its run's end, its chat mark or the docked bar, `faces`, for VISOR
// looks seconds on end, or `waits` seconds after the run ended when it never faces it; as it was otherwise, noting when it began to face it
export function lightOnce(lit, faces, now) {
    if (!lit || lit.at !== null) return lit;
    const facedAt = faces ? (lit.facedAt ?? now) : null;
    if ((facedAt !== null && now - facedAt >= VISOR.looks) || (facedAt === null && now - lit.since >= VISOR.waits)) return {...lit, at: now};
    return {...lit, facedAt};
}

// The visor through a disco dance `u` of the way through it (acts.js disco): lit as a screen all the dance long, its colour stepping round
// the colour wheel each beat, the eyes out but at the dance's first and last few frames
export function discoScreen(u, beats) {
    const step = Math.floor(u * beats * 2);
    const hue = ((step * 137) % 360) / 360;
    const k = (n) => (n + hue * 12) % 12;
    const part = (n) => 0.5 - 0.5 * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    const shown = Math.min(u / 0.06, (1 - u) / 0.06, 1);
    return {colour: [part(0), part(8), part(4)], eyes: 1 - shown, across: shown, open: shown, flash: 0, glow: shown};
}
