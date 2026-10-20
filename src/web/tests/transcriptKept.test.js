import {expect, test} from "vitest";
import {heldOnly, newestTurns} from "../src/composables/transcript.js";

const turns = (from, to) => Array.from({length: to - from + 1}, (_, i) => ({line: from + i}));

test("a live transcript holds its newest turns only, so a tab left open does not grow without end", () => {
    expect(newestTurns(turns(1, 1200)).map((t) => t.line)).toEqual(turns(201, 1200).map((t) => t.line));
    expect(newestTurns(turns(1, 10))).toHaveLength(10);
});

test("what was kept by line goes with the turns no longer held", () => {
    expect(heldOnly({1: "old body", 300: "kept body"}, turns(200, 400))).toEqual({300: "kept body"});
});
