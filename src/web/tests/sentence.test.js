import {expect, test} from "vitest";
import {firstSentence} from "../src/format/sentence.js";

test("a long brief or report shows only its first sentence on one line", () => {
    expect(firstSentence("Read the router.  Then report\nwhat you find.")).toBe("Read the router.");
    expect(firstSentence("  no stop here\nat all ")).toBe("no stop here at all");
    expect(firstSentence("Is it done? Yes.")).toBe("Is it done?");
    expect(firstSentence("")).toBe("");
});
