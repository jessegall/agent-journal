// @vitest-environment node
import {describe, expect, it} from "vitest";
import {agentCounts, helperCounts, helperWord, isWorking} from "../src/domain/helpers.js";

const rows = [
    {n: 1, state: "working"},
    {n: 2, state: "running"},
    {n: 3, state: "reported"},
    {n: 4, state: "finished"},
    {n: 5, data: {report: "done"}},
    {n: 6, completed: 5},
];

describe("counting helpers at work", () => {
    it("counts only helpers still working, never one that has reported or finished", () => {
        expect(rows.filter(isWorking).map((row) => row.n)).toEqual([1, 2]);
    });

    it("uses the same count for the helpers list, the status bar and the phone chip", () => {
        expect(helperCounts(rows).working).toBe(2);
        expect(agentCounts(rows, []).working).toBe(2);
    });
});

describe("the word for a helper waiting on a question", () => {
    test("it is Waits for answer in orchestrator mode and Needs you outside it", () => {
        expect(helperWord("needs", "orchestrator")).toBe("Waits for answer");
        expect(helperWord("needs", "solo")).toBe("Needs you");
        expect(helperWord("working", "orchestrator")).toBe("Working");
    });
});
