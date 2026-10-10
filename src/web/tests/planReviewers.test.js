import {describe, expect, test} from "vitest";
import {reviewersAtWork, reviewersLine} from "../src/domain/plans.js";

const agent = (rows) => ({data: {subagent_rows: rows}});
const sub = (type, running, task = "look at the plan") => ({id: type, type, running, task});

describe("the reviewers of a plan under review", () => {
    test("are counted among the subagents still running, and fall as each one reports", () => {
        const working = [agent([sub("plan-reviewer", true), sub("reviewer", true), sub("Explore", true)])];
        expect(reviewersAtWork(working)).toBe(2);
        const one = [agent([sub("plan-reviewer", false), sub("reviewer", true), sub("Explore", true)])];
        expect(reviewersAtWork(one)).toBe(1);
        expect(reviewersAtWork([agent([sub("plan-reviewer", false), sub("reviewer", false)])])).toBe(0);
    });

    test("are said in plain words, and left unsaid when none is at work", () => {
        expect(reviewersLine(2)).toBe("2 reviewers still reviewing");
        expect(reviewersLine(1)).toBe("1 reviewer still reviewing");
        expect(reviewersLine(0)).toBe("");
    });

    test("are found in the task of a subagent whose type does not say review", () => {
        expect(reviewersAtWork([agent([sub("claude", true, "Review the plan for gaps")])])).toBe(1);
        expect(reviewersAtWork([agent([{id: "x", running: true}])])).toBe(0);
    });
});
