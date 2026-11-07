// @vitest-environment node
import {expect, test} from "vitest";
import {ADMIRE, NOT_ADMIRING, admiringAfter} from "../src/figure/admire.js";
import {PICTURE_NEAR, middleOf, picturesNear} from "../src/figure/places.js";
import {EYES} from "../src/figure/figure.js";
import {seeded} from "./support/seeded.js";

// a picture in a message, 120 by 80 pixels, its top left at `left` and `top` on the page, moved as the chat scrolls
function picture(left, top) {
    const box = {left, top};
    return {box, getBoundingClientRect: () => ({left: box.left, top: box.top, right: box.left + 120, bottom: box.top + 80, width: 120, height: 80})};
}

// the page holding `pictures` in its messages
const holding = (...pictures) => (globalThis.document = {querySelectorAll: (selector) => (selector === "[data-figure-picture]" ? pictures : [])});

// the figure's head on the compose box, its middle at 600, 640 on the page
const HEAD = {x: 600, y: 640};

test("a picture in a message near the figure is found, the nearest first: over it on the compose box or beside it, never far off or far below", () => {
    const over = picture(560, 420);
    const beside = picture(800, 560);
    const far = picture(100, 300);
    const below = picture(560, 760);
    holding(over, beside, far, below);
    expect(picturesNear(HEAD)).toEqual([over, beside]);
    holding(far, below);
    expect(picturesNear(HEAD)).toEqual([]);
    // scrolled up out of reach above its head, it is near no more
    over.box.top = HEAD.y - PICTURE_NEAR.above - 80;
    holding(over);
    expect(picturesNear(HEAD)).toEqual([]);
});

test("now and then it admires a picture near it: its look on the picture and following it as the chat scrolls it up, an admiring look in its eyes, then it looks away and rests", () => {
    const random = seeded(2687);
    const shot = picture(540, 460);
    holding(shot);
    // looked at once a second, as the page does, the chat scrolling the picture up 20 pixels a second once the figure looks at it
    let admiring = NOT_ADMIRING;
    const looks = [];
    for (let second = 0; second < 40; second++) {
        admiring = admiringAfter(admiring, picturesNear(HEAD), second, random);
        if (admiring.picture) {
            // where the figure looks, as VoiceFigure.vue lookedAt has it: the middle of the picture
            looks.push({second, at: middleOf(admiring.picture.getBoundingClientRect())});
            shot.box.top -= 20;
        }
    }
    // it waits a little once the picture is near, then looks at it for a few seconds and no longer
    expect(looks.length).toBeGreaterThanOrEqual(ADMIRE.seconds[0] - 1);
    expect(looks.length).toBeLessThanOrEqual(ADMIRE.seconds[1] + 1);
    expect(looks[0].second).toBeGreaterThanOrEqual(ADMIRE.waits[0]);
    expect(looks[0].second).toBeLessThanOrEqual(ADMIRE.waits[1] + 1);
    // on the picture each time, following it up as it scrolls
    for (const [index, look] of looks.entries()) {
        expect(look.at.x).toBe(600);
        if (index) expect(look.at.y).toBe(looks[index - 1].at.y - 20);
    }
    // then it rests: the picture still near, it does not look again for a minute or more
    shot.box.top = 460;
    const rest = Array.from({length: ADMIRE.rests[0] - 1}, (_, second) => (admiring = admiringAfter(admiring, picturesNear(HEAD), 40 + second, random)));
    expect(rest.filter((each) => each.picture)).toEqual([]);
    // the look in its eyes while it admires: open wide and warm
    expect(EYES.admiring.open).toBeGreaterThan(1);
    expect(EYES.admiring.tint).toBeTruthy();
});

test("a picture scrolled out of reach while the figure admires it ends the look at once, and with no picture near it never looks", () => {
    const random = seeded(7);
    const shot = picture(540, 460);
    holding(shot);
    let admiring = NOT_ADMIRING;
    let second = 0;
    while (!admiring.picture && second < 20) admiring = admiringAfter(admiring, picturesNear(HEAD), second++, random);
    expect(admiring.picture).toBe(shot);
    shot.box.top = -400;
    admiring = admiringAfter(admiring, picturesNear(HEAD), second, random);
    expect(admiring.picture).toBe(null);
    holding();
    let none = NOT_ADMIRING;
    for (let at = 0; at < 300; at++) {
        none = admiringAfter(none, picturesNear(HEAD), at, random);
        expect(none.picture, `${at}`).toBe(null);
    }
});
