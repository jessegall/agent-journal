import {middleOf} from "./places.js";

// The figure now and then admires a picture in a message near it (places.js picturesNear). Once one is near it waits `waits` seconds,
// then looks at the nearest for `seconds`, following it with its head as the chat moves it, an admiring look in its eyes, and looks away
// when its time is up or the picture is no longer near; it then rests `rests` seconds before it admires one again. Every number of it is
// here, in seconds, each a range drawn from.
export const ADMIRE = {waits: [3, 10], seconds: [3, 5], rests: [60, 150]};

// the admiring at the start: no picture looked at and none waited for
export const NOT_ADMIRING = Object.freeze({picture: null, until: 0, next: 0});

const drawn = ([least, most], random) => least + (most - least) * random();

// The admiring as it stands at `now`, from `admiring` ({picture, until, next}: the picture looked at until `until`, or, with none, when
// the next look may begin) and the pictures near now, `near`, the nearest first, with `random` to draw its times
export function admiringAfter(admiring, near, now, random) {
    if (admiring.picture) return now < admiring.until && near.includes(admiring.picture) ? admiring : {...NOT_ADMIRING, next: now + drawn(ADMIRE.rests, random)};
    if (!near.length) return admiring.next > now ? admiring : NOT_ADMIRING;
    if (!admiring.next) return {...NOT_ADMIRING, next: now + drawn(ADMIRE.waits, random)};
    return now < admiring.next ? admiring : {picture: near[0], until: now + drawn(ADMIRE.seconds, random), next: 0};
}

// The look at what it admires, `box` its place on the page: at its middle, an admiring look in the eyes, `behind` the figure, on the
// page it stands before, and one that `faces` it: standing it turns round to it, its back to the viewer, and seated it turns a little
// where it sits and its head the rest of the way (figure.js lookToward, bodyTurnFor)
export const admiringLook = (box) => ({...middleOf(box), mood: "admiring", behind: true, faces: true});
