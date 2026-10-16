import {describe, expect, it} from "vitest";
import {LOCK_RULE, LOCK_WHY, nodeLocked, stayOn} from "../src/domain/workflowLocks.js";

describe("locked workflows and steps", () => {
    it("says why a locked or guarded workflow stays on, and nothing for the rest", () => {
        expect(stayOn({locked: true, guarded: true})).toContain("cannot be turned off or deleted");
        expect(stayOn({locked: false, guarded: true})).toBe("Holds a locked step: it cannot be turned off.");
        expect(stayOn({locked: false, guarded: false})).toBe("");
        expect(stayOn(null)).toBe("");
    });

    it("knows a locked step and the rule around it", () => {
        expect(nodeLocked({locked: true})).toBe(true);
        expect(nodeLocked({})).toBe(false);
        expect(LOCK_WHY).toContain("Locked");
        expect(LOCK_RULE).toContain("add steps after it");
    });
});
