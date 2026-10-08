import {beforeEach, describe, expect, test} from "vitest";
import {STEPS, begin, clear, fail, locked, runLate, stepAt, updatedTo, updating} from "../src/state/updating.js";

beforeEach(() => {
    localStorage.clear();
    clear();
});

describe("while the journal updates", () => {
    test("the viewer is locked from the moment the update is accepted and the step line follows the seconds", () => {
        expect(locked()).toBe(false);
        begin("2.265.0");
        expect([locked(), updating.version, updatedTo()]).toEqual([true, "2.265.0", "2.265.0"]);
        expect([stepAt(0), stepAt(10), stepAt(40)]).toEqual(STEPS);
    });

    test("a failed update lifts the lock and says why, and one that takes too long lifts it too", () => {
        begin("2.265.0");
        fail("disk full");
        expect([locked(), updating.failure, updatedTo()]).toEqual([false, "disk full", ""]);
        begin("2.265.0");
        runLate();
        expect(locked()).toBe(false);
    });
});
