import {describe, expect, it} from "vitest";
import {FALLS} from "../src/domain/falls.js";
import {airborneFrame, fallingFrom} from "../src/domain/figureMotion.js";

const floor = (id, top, kind = id === "home" ? "compose" : "bubble") => ({id, kind, left: 0, right: 1000, top, vy: 0});
const FRAME_MS = 1000 / 60;

// the frames of a fall from `airborne`, one every sixtieth of a second, until it lands or a few seconds pass
function fallen(airborne, floors) {
    let now = airborne.at;
    let step = {airborne, landed: null};
    const heights = [];
    for (let frame = 0; frame < 300 && !step.landed; frame++) {
        now += FRAME_MS;
        step = airborneFrame(step.airborne, floors, now, FALLS.butler, 112);
        heights.push(step.airborne?.y ?? step.landed.spot.y);
    }
    return {...step, heights};
}

describe("a body in the air", () => {
    it("falls frame by frame from where it was and lands on its feet on the floor under it, going on where it was headed", () => {
        const airborne = fallingFrom({x: 400, y: 440, posture: "stand"}, {x: 700, y: 500, posture: "stand"}, [floor("home", 500)], 0, () => 0.9);
        const {landed, heights} = fallen(airborne, [floor("home", 500)]);
        expect(heights.length).toBeGreaterThan(3);
        expect(landed).toMatchObject({spot: {x: 400, y: 500, posture: "stand"}, to: {x: 700}, standing: true});
    });

    it("never starts its fall below the floor at home, and keeps a seated posture when it drops with its seat", () => {
        expect(fallingFrom({x: 400, y: 520, posture: "stand"}, null, [floor("home", 500)], 0, () => 0.9).y).toBe(500);
        const {landed} = fallen(fallingFrom({x: 400, y: 456, posture: "sit"}, null, [floor("home", 500)], 0, () => 0.9), [floor("home", 500)]);
        expect(landed).toMatchObject({spot: {posture: "sit", y: 500}, standing: false});
    });

    it("is caught by a bubble it falls past only when the roll lets one catch it", () => {
        const floors = [floor("b1", 300), floor("home", 500)];
        expect(fallen(fallingFrom({x: 400, y: 200, posture: "stand"}, null, floors, 0, () => 0.1), floors).landed.spot.y).toBe(300);
        expect(fallen(fallingFrom({x: 400, y: 200, posture: "stand"}, null, floors, 0, () => 0.9), floors).landed.spot.y).toBe(500);
    });
});
