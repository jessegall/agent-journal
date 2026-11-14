import {describe, expect, it} from "vitest";
import {lineDiff} from "../src/domain/lineDiff.js";

describe("lineDiff", () => {
    it("marks the lines kept, added and removed", () => {
        expect(lineDiff("one\ntwo\nthree", "one\nthree\nfour")).toEqual([
            {key: "old:0", type: "same", text: "one"},
            {key: "old:1", type: "removed", text: "two"},
            {key: "old:2", type: "same", text: "three"},
            {key: "new:2", type: "added", text: "four"},
        ]);
    });

    it("keeps duplicate text lines distinct by their source position", () => {
        const lines = lineDiff("same\nsame\nold", "same\nnew\nsame");
        expect(new Set(lines.map((line) => line.key)).size).toBe(lines.length);
        expect(lines.filter((line) => line.text === "same").map((line) => line.key)).toEqual(["old:0", "old:1"]);
    });
});
