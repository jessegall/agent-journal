import {describe, expect, it} from "vitest";
import {lineDiff} from "../src/domain/lineDiff.js";

describe("lineDiff", () => {
    it("marks the lines kept, added and removed", () => {
        expect(lineDiff("one\ntwo\nthree", "one\nthree\nfour")).toEqual([
            {key: "old:0", kind: "same", text: "one"},
            {key: "old:1", kind: "removed", text: "two"},
            {key: "old:2", kind: "same", text: "three"},
            {key: "new:2", kind: "added", text: "four"},
        ]);
    });
});
