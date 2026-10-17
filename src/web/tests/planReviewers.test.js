import {describe, expect, test} from "vitest";
import {reviewersLine} from "../src/domain/plans.js";

describe("the reviewers of a plan under review", () => {
    test("are said in plain words, and left unsaid when none is at work", () => {
        expect(reviewersLine(2)).toBe("2 reviewers still reviewing");
        expect(reviewersLine(1)).toBe("1 reviewer still reviewing");
        expect(reviewersLine(0)).toBe("");
    });
});
