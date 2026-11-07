// A blink, drawn at the screen's own frame rate whatever rate the body's clips run at: the eyes close over `close` milliseconds down to
// `shut` of their height and open again over `open`, every so often, a random number of milliseconds between the two in `every`
export const BLINK = {close: 60, open: 90, shut: 0.06, every: [2500, 6000]};

// how open the eyes are `ms` into a blink, 1 before it and once it is over
export function blinkOpenness(ms) {
    if (ms < 0 || ms >= BLINK.close + BLINK.open) return 1;
    const k = ms < BLINK.close ? ms / BLINK.close : 1 - (ms - BLINK.close) / BLINK.open;
    return 1 + (BLINK.shut - 1) * k;
}

// how long until the next blink, `random` giving 0 up to 1
export const nextBlinkMs = (random) => BLINK.every[0] + random() * (BLINK.every[1] - BLINK.every[0]);
