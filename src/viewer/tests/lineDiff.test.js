import {describe, expect, it} from "vitest";
import {lineDiff} from "../src/domain/lineDiff.js";

describe("lineDiff", () => {
    it("marks the lines kept, added and removed", () => {
        expect(lineDiff("one\ntwo\nthree", "one\nthree\nfour")).toEqual([
            {kind: "same", text: "one"},
            {kind: "removed", text: "two"},
            {kind: "same", text: "three"},
            {kind: "added", text: "four"},
        ]);
    });
});
