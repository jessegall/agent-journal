import {describe, expect, test} from "vitest";
import {searchTerms} from "../src/domain/documents.js";

describe("finding a document", () => {
    test("terms are split on spaces and lowered", () => {
        expect(searchTerms("  Phone   CODE ")).toEqual(["phone", "code"]);
        expect(searchTerms("   ")).toEqual([]);
    });
});
