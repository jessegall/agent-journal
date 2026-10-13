import {describe, expect, it} from "vitest";
import {FALLS, fallOf} from "../src/domain/falls.js";

describe("a voice's fall", () => {
    it("gives every voice a landing of its own, and a voice without one the butler's", () => {
        expect(Object.keys(FALLS).sort()).toEqual(["butler", "coach", "colleague", "homie", "squire"]);
        expect(new Set(Object.values(FALLS).map((fall) => JSON.stringify(fall))).size).toBe(Object.keys(FALLS).length);
        expect(fallOf("nobody")).toBe(FALLS.butler);
    });
});
