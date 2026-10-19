import {describe, expect, test} from "vitest";
import {earlierDumps} from "../src/composables/dump.js";

const dump = (id, extra = {}) => ({table: "dumps", id, title: `Dump ${id}`, created_at: new Date(id * 1000).toISOString(), queued_at: 0, completed_at: 0, stopped: false, removed_at: 0, ...extra});

describe("earlier dumps", () => {
    test("the oldest open dump is filing, a later open one waits in line, and closed ones say how they ended", () => {
        const every = [dump(1, {completed_at: 5}), dump(2), dump(3), dump(4, {completed_at: 6, stopped: true})];
        expect(earlierDumps(every)).toEqual([
            {id: 4, title: "Dump 4", pill: "stopped"},
            {id: 3, title: "Dump 3", pill: "queued"},
            {id: 2, title: "Dump 2", pill: "filing"},
            {id: 1, title: "Dump 1", pill: "done"},
        ]);
    });
});
