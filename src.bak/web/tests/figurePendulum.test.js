import {describe, expect, it} from "vitest";
import {STILL, landedSwing, swung} from "../src/figure/pendulum.js";
import {gripIn} from "../src/figure/places.js";

const FRAME = 1 / 60;

// the swing played frame by frame for `seconds`, the hand carried `shifts(t)` pixels in each frame, in a picture 112 pixels tall
function played(start, seconds, shifts = () => 0) {
    const angles = [];
    let swing = start;
    for (let t = 0; t < seconds; t += FRAME) {
        swing = swung(swing, FRAME, t, shifts(t), 112);
        angles.push(swing.angle);
    }
    return angles;
}

describe("a figure hanging by one hand", () => {
    it("swings on at a real body's pace, a swing about every 1.3 seconds", () => {
        const angles = played({angle: 0.2, speed: 0}, 4);
        const crossings = angles.flatMap((angle, i) => (i && Math.sign(angle) !== Math.sign(angles[i - 1]) ? [i * FRAME] : []));
        const period = (crossings[crossings.length - 1] - crossings[0]) / ((crossings.length - 1) / 2);
        expect(period).toBeGreaterThan(1.1);
        expect(period).toBeLessThan(1.6);
    });

    it("swings out the way its trip went as it lands, and settles to a sway of a degree or two", () => {
        const right = played(landedSwing(1), 10);
        expect(right[10]).toBeLessThan(0);
        expect(played(landedSwing(-1), 1)[10]).toBeGreaterThan(0);
        expect(Math.max(...right.slice(0, 60).map(Math.abs))).toBeGreaterThan(0.1);
        expect(Math.max(...right.slice(-120).map(Math.abs))).toBeLessThan(0.06);
    });

    it("hangs back when the hand is carried sideways under it", () => {
        const carried = played(STILL, 0.2, (t) => (t < 0.1 ? 2 : 0));
        expect(carried[5]).toBeGreaterThan(0);
    });

    it("turns about the hand it hangs by, on the side of the picture that hand is on", () => {
        expect(gripIn("r", 0, 0.1).x).toBeLessThan(0.5);
        expect(gripIn("l", 0, 0.1).x).toBeGreaterThan(0.5);
        expect(gripIn("l", 90, 0.1).x).toBeCloseTo(0.5);
        expect(gripIn("l", 0, 0.1).y).toBeCloseTo(1 - 0.1 - 0.54);
    });
});
