import {describe, expect, it} from "vitest";
import {FALLS, PLACES, PRESENCE_GRACE_MS, fallOf} from "../src/domain/mascots.js";

describe("the mascot's fall from a bar", () => {
    it("gives every voice a landing of its own, and a voice without one the butler's", () => {
        expect(Object.keys(FALLS).sort()).toEqual(Object.keys(PLACES).sort());
        expect(new Set(Object.values(FALLS).map((fall) => JSON.stringify(fall))).size).toBe(Object.keys(FALLS).length);
        expect(fallOf("nobody")).toBe(FALLS.butler);
    });
});

describe("the mascot's grace before it enters or leaves", () => {
    it("waits three seconds of steady idleness or work before it changes", () => {
        expect(PRESENCE_GRACE_MS).toBe(3000);
    });
});
