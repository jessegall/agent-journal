import {expect, test} from "vitest";
import {workerReuses} from "../src/domain/workers.js";

test("a worker's cell says how often it was reused, and nothing before its first reuse", () => {
    expect(workerReuses({reuse_count: 0})).toBe("");
    expect(workerReuses({})).toBe("");
    expect(workerReuses({reuse_count: 1})).toBe("Reused 1 time");
    expect(workerReuses({reuse_count: 2})).toBe("Reused 2 times");
});
