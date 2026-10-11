import {describe, expect, it} from "vitest";
import {MASCOT_SIZE, MIN_STROLL, STROLL_SPEED, WALKS, flipOf, strollOf, strollRoom, strollsIn} from "../src/domain/mascots.js";

const sequence = (...values) => {
    let at = 0;
    return () => values[at++ % values.length];
};

describe("which moves are a stroll", () => {
    it("is the stepping move of a standing voice, or any move called walk", () => {
        expect(strollsIn("butler", {name: WALKS.butler})).toBe(true);
        expect(strollsIn("coach", {name: WALKS.coach})).toBe(true);
        expect(strollsIn("butler", {name: "walk"})).toBe(true);
        expect(strollsIn("butler", {name: "tray offer"})).toBe(false);
        expect(strollsIn("butler", null)).toBe(false);
    });

    it("is never a sitting voice's move", () => {
        for (const voice of ["colleague", "homie", "squire"]) expect(strollsIn(voice, {name: "walk"})).toBe(false);
    });
});

describe("how far a stroll goes", () => {
    const box = 900;
    const ms = 2200;

    it("keeps to the right half of the box, from the box's own width", () => {
        expect(strollRoom(box)).toBe(box / 2 - MASCOT_SIZE);
        expect(strollRoom(200)).toBe(0);
    });

    it("walks from home to the left, at least the least a walk reads at, and no further than it can walk in the time", () => {
        for (const random of [0, 0.5, 0.999]) {
            const found = strollOf({boxWidth: box, at: 0, ms, random: sequence(0, random)});
            expect(found.toward).toBe("left");
            expect(found.to).toBeGreaterThanOrEqual(MIN_STROLL * MASCOT_SIZE);
            expect(found.to).toBeLessThanOrEqual(Math.min(strollRoom(box), STROLL_SPEED * MASCOT_SIZE * (ms / 1000)));
        }
    });

    it("can walk back, and never beyond home or the room", () => {
        const room = strollRoom(box);
        const back = strollOf({boxWidth: box, at: room, ms, random: sequence(0, 0.5)});
        expect(back.toward).toBe("right");
        expect(back.to).toBeGreaterThanOrEqual(0);
        expect(Math.abs(room - back.to)).toBeGreaterThanOrEqual(MIN_STROLL * MASCOT_SIZE);
    });

    it("stays put when the box leaves no room for a walk that reads", () => {
        expect(strollOf({boxWidth: 400, at: 0, ms})).toBeNull();
        expect(strollOf({boxWidth: box, at: 0, ms: 100})).toBeNull();
    });
});

describe("which way a mascot faces", () => {
    it("mirrors the art when it walks the way the art does not face", () => {
        expect(flipOf("butler", "left")).toBe(1);
        expect(flipOf("butler", "right")).toBe(-1);
    });
});
