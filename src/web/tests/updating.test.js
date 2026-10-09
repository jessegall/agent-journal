import {beforeEach, describe, expect, test} from "vitest";
import {STEPS, begin, clear, fail, follow, locked, runLate, stepAt, updatedTo, updating} from "../src/state/updating.js";

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

    test("an upgrade run outside the viewer locks it while the server reports it, and finishing asks for a reload", () => {
        expect([follow(false), locked()]).toEqual([false, false]);
        expect([follow(true), locked(), updating.version]).toEqual([false, true, ""]);
        expect([follow(true), locked()]).toEqual([false, true]);
        expect([follow(false), locked()]).toEqual([true, false]);
        begin("2.265.0");
        expect([follow(true), follow(false), locked()]).toEqual([false, false, true]);
    });

    test("the step the upgrade says it is on is kept while it runs, also for an update begun in the viewer", () => {
        follow(true, "Migrating the record");
        expect(updating.step).toBe("Migrating the record");
        begin("2.265.0");
        expect(updating.step).toBe("");
        follow(true, "Restarting the journal");
        expect([updating.step, locked()]).toEqual(["Restarting the journal", true]);
    });
});
