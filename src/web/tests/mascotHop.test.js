import {describe, expect, it} from "vitest";
import {HOPS, PLACES, hopOf} from "../src/domain/mascots.js";

describe("a sitting mascot's hop onto and off its seat", () => {
    it("gives every sitting voice a hop of its own and a standing voice none", () => {
        const sitting = Object.keys(PLACES).filter((voice) => PLACES[voice].sits);
        expect(Object.keys(HOPS).sort()).toEqual(sitting.sort());
        for (const voice of sitting) expect(hopOf(voice)).toBe(HOPS[voice]);
        expect(hopOf("butler")).toBeNull();
        expect(hopOf("nobody")).toBeNull();
    });

    it("the homie's hop is the quickest and bounciest", () => {
        expect(HOPS.homie.ms).toBeLessThan(HOPS.squire.ms);
        expect(HOPS.homie.rise).toBeGreaterThan(HOPS.squire.rise);
        expect(HOPS.homie.squash).toBeGreaterThan(HOPS.squire.squash);
    });
});
