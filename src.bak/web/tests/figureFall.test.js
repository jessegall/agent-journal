import {describe, expect, it} from "vitest";
import {FALLS, fallOf, fallStep} from "../src/domain/falls.js";

describe("a voice's fall", () => {
    it("gives every voice a landing of its own, and a voice without one the butler's", () => {
        expect(Object.keys(FALLS).sort()).toEqual(["butler", "coach", "colleague", "homie", "squire"]);
        expect(new Set(Object.values(FALLS).map((fall) => JSON.stringify(fall))).size).toBe(Object.keys(FALLS).length);
        expect(fallOf("nobody")).toBe(FALLS.butler);
    });
});

describe("a figure whose ground drops away", () => {
    const butler = FALLS.butler;

    it("falls faster each frame and lands on the floor the moment it touches, never below it", () => {
        let state = {y: 0, speed: 0};
        const ys = [];
        for (let frame = 0; frame < 60 && !state.landed; frame++) {
            state = fallStep(state, 100, 1 / 60, butler, 112);
            ys.push(state.y);
        }
        const steps = ys.slice(1).map((y, i) => y - ys[i]);
        expect(state).toEqual({y: 100, speed: 0, landed: true});
        expect(Math.max(...ys)).toBe(100);
        expect(steps.slice(0, -1).every((step, i) => i === 0 || step >= steps[i - 1])).toBe(true);
    });

    it("falls its own height in about the voice's fall time, and a frame missed while away does not drop it through the floor", () => {
        let state = {y: 0, speed: 0};
        let seconds = 0;
        while (!state.landed) {
            state = fallStep(state, 112, 1 / 60, butler, 112);
            seconds += 1 / 60;
        }
        expect(seconds).toBeGreaterThan((butler.ms / 1000) * 0.9);
        expect(seconds).toBeLessThan((butler.ms / 1000) * 1.2);
        expect(fallStep({y: 0, speed: 0}, 500, 5, butler, 112).y).toBeLessThan(10);
    });
});
