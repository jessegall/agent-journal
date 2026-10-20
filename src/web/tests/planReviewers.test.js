import {describe, expect, test} from "vitest";
import {reviewersLine, reviewRounds} from "../src/domain/plans.js";

describe("the reviewers of a plan under review", () => {
    test("are said in plain words, and left unsaid when none is at work", () => {
        expect(reviewersLine(2)).toBe("2 reviewers still reviewing");
        expect(reviewersLine(1)).toBe("1 reviewer still reviewing");
        expect(reviewersLine(0)).toBe("");
    });
});

describe("the review rounds of a plan", () => {
    const plan = {
        reviews: [
            {id: 9, created_at: "2026-10-20T10:00:00+00:00", reviewers: [], changed: null, report_ids: []},
            {id: 4, created_at: "2026-10-19T10:00:00+00:00", reviewers: ["Lady Lovelace reads the engine", "Mr. Brunel reads the viewer"], changed: "tasks 12 and 13 merged", report_ids: [22]},
        ],
    };

    test("are numbered from the first, newest first, with what each changed and the reports it filed", () => {
        const [open, first] = reviewRounds(plan);
        expect(first).toMatchObject({title: "Review round 1", reviewers: "2 reviewers", changed: "tasks 12 and 13 merged", reports: [22]});
        expect(first.names).toBe("Lady Lovelace reads the engine, Mr. Brunel reads the viewer");
        expect(open).toMatchObject({title: "Review round 2", reviewers: "", changed: "Still in review", reports: []});
    });

    test("are none for a plan never reviewed", () => {
        expect(reviewRounds({})).toEqual([]);
    });
});
