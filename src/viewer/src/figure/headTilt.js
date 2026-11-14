// How the head leans at rest, side to side: a small lean, `most` degrees either way at the most, held `hold` seconds, a random time between
// the two, then eased over `ease` seconds into the next, so it rests now to one side, now to the other, now upright, and never sways
export const HEAD_TILT = {most: 5, hold: [6, 22], ease: 1.8};

// the lean at rest before any change: upright
export const UPRIGHT = Object.freeze({from: 0, to: 0, began: 0, until: 0});

// The lean after a look at `now` seconds: once the last has been held its time, the next is drawn by `random()`: a lean either way, or
// upright about one time in four, never the same as the last
export function tiltAfter(tilt, now, random) {
    if (now < tilt.until) return tilt;
    const upright = random() < 0.25;
    const lean = upright ? 0 : (random() < 0.5 ? -1 : 1) * HEAD_TILT.most * (0.4 + 0.6 * random());
    const to = Math.abs(lean - tilt.to) < 1 ? -lean || HEAD_TILT.most * 0.6 : lean;
    const [least, most] = HEAD_TILT.hold;
    return {from: tiltAt(tilt, now), to, began: now, until: now + HEAD_TILT.ease + least + random() * (most - least)};
}

// the lean in degrees at `now` seconds: eased from the last lean to the next over HEAD_TILT.ease
export function tiltAt(tilt, now) {
    const k = Math.min(Math.max((now - tilt.began) / HEAD_TILT.ease, 0), 1);
    return tilt.from + (tilt.to - tilt.from) * k * k * (3 - 2 * k);
}
