import {describe, expect, it} from "vitest";
import {airborneFrame, fallingFrom, legEnded, slideAt} from "../src/domain/figureMotion.js";

const floor = (id, top, kind = id === "home" ? "compose" : "bubble") => ({id, kind, left: 0, right: 1000, top, vy: 0});
const FRAME_MS = 1000 / 60;

// the frames of a fall from `airborne`, one every sixtieth of a second, until it lands or a few seconds pass
function fallen(airborne, floors) {
    let now = airborne.at;
    let step = {airborne, landed: null};
    const heights = [];
    for (let frame = 0; frame < 300 && !step.landed; frame++) {
        now += FRAME_MS;
        step = airborneFrame(step.airborne, floors, now);
        heights.push(step.airborne?.y ?? step.landed.spot.y);
    }
    return {...step, heights};
}

describe("a body in the air", () => {
    it("falls frame by frame from where it was and lands on its feet on the floor under it, going on where it was headed", () => {
        const airborne = fallingFrom({x: 400, y: 440, posture: "stand"}, {x: 700, y: 500, posture: "stand"}, [floor("home", 500)], 0);
        const {landed, heights} = fallen(airborne, [floor("home", 500)]);
        expect(heights.length).toBeGreaterThan(3);
        expect(landed).toMatchObject({spot: {x: 400, y: 500, posture: "stand"}, to: {x: 700}, standing: true});
    });

    it("never starts its fall below the floor at home, and keeps a seated posture when it drops with its seat", () => {
        expect(fallingFrom({x: 400, y: 520, posture: "stand"}, null, [floor("home", 500)], 0).y).toBe(500);
        const {landed} = fallen(fallingFrom({x: 400, y: 456, posture: "sit"}, null, [floor("home", 500)], 0), [floor("home", 500)]);
        expect(landed).toMatchObject({spot: {posture: "sit", y: 500}, standing: false});
    });

    it("falls past a bubble under it to the floor at home, every time", () => {
        const floors = [floor("b1", 300), floor("home", 500)];
        expect(fallen(fallingFrom({x: 400, y: 200, posture: "stand"}, null, floors, 0), floors).landed.spot.y).toBe(500);
    });
});

describe("a leg on the frame clock", () => {
    it("ends on the first frame at or after its lead and its course, and not a frame before", () => {
        const leg = {x: 0, y: 0, ms: 400, lead: 100, easing: "linear"};
        expect(legEnded(leg, 1000, 1499)).toBe(false);
        expect(legEnded(leg, 1000, 1500)).toBe(true);
        expect(legEnded({...leg, ms: 0, lead: 0}, 1000, 1000)).toBe(true);
    });
});

describe("the posture slide", () => {
    it("eases the picture to its new place over the time a change takes, half-way along at the middle, and is there at the end", () => {
        const slide = {from: {x: 0, y: 0}, to: {x: 0, y: 40}, began: 1000};
        expect(slideAt(slide, 1000, 500)).toEqual({at: {x: 0, y: 0}, done: false});
        expect(slideAt(slide, 1250, 500).at.y).toBeCloseTo(20, 0);
        expect(slideAt(slide, 1100, 500).at.y).toBeLessThan(8);
        expect(slideAt(slide, 1600, 500)).toEqual({at: {x: 0, y: 40}, done: true});
    });
});

describe("letting go of a hang", () => {
    it("lets go when the bubble it hangs from carries its feet down onto the floor at home, and lands standing on it", async () => {
        const {floorOf, footingNow} = await import("../src/figure/floors.js");
        const {boxAt} = await import("../src/figure/places.js");
        const figure = {size: 112, below: 0.05};
        const bubble = {};
        const hanging = {id: floorOf(bubble), dx: 20, dy: 0, posture: "hang"};
        const floorsWith = (top) => [{id: floorOf(bubble), kind: "bubble", element: bubble, left: 300, right: 600, top, vy: 0}, floor("home", 500)];
        expect(footingNow(hanging, figure, floorsWith(300))).toEqual({x: 320, y: 300});
        expect(footingNow(hanging, figure, floorsWith(460))).toBe(null);
        const box = boxAt({x: 320, y: 460, posture: "hang"}, figure);
        const feet = {x: 320, y: box.top + (1 - figure.below) * figure.size, posture: "stand"};
        const {landed} = fallen(fallingFrom(feet, null, [floor("home", 500)], 0), [floor("home", 500)]);
        expect(landed).toMatchObject({spot: {x: 320, y: 500, posture: "stand"}, standing: true});
    });
});
