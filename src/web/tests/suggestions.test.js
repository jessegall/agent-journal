import {expect, test} from "vitest";
import {suggestionOutcome} from "../src/domain/suggestions.js";

test("an answered suggestion says what it came to, and an open one nothing", () => {
    expect(suggestionOutcome("accepted")).toBe("You accepted this suggestion.");
    expect(suggestionOutcome("declined")).toContain("will not be made again");
    expect(suggestionOutcome("")).toBe("");
});
