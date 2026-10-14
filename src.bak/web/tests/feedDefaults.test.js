import {describe, expect, test} from "vitest";
import {INSPECTOR_FEED} from "../src/domain/panes.js";

describe("the inspector's Files changed view", () => {
    test("starts with removals shown, flush and five lines, and everything else off", () => {
        expect(INSPECTOR_FEED).toEqual({lines: 5, flush: true, headers: false, collapse: false, editsOnly: false, removals: true, capped: false, columns: false});
    });
});
