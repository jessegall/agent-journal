import {describe, expect, test} from "vitest";
import {earlierDumps} from "../src/composables/dump.js";
import {renamedTo, statBlocks, statFiles} from "../src/domain/commits.js";

const dump = (n, extra = {}) => ({n, title: `Dump ${n}`, created: n, completed: 0, data: {}, ...extra});

describe("earlier dumps", () => {
    test("the oldest open dump is filing, a later open one waits in line, and closed ones say how they ended", () => {
        const every = [dump(1, {completed: 5}), dump(2), dump(3), dump(4, {completed: 6, data: {stopped: true}})];
        expect(earlierDumps(every)).toEqual([
            {n: 4, title: "Dump 4", pill: "stopped"},
            {n: 3, title: "Dump 3", pill: "queued"},
            {n: 2, title: "Dump 2", pill: "filing"},
            {n: 1, title: "Dump 1", pill: "done"},
        ]);
    });
});

describe("commit stat", () => {
    const stat = " src/a.js | 4 +++-\n src/{old.js => new.js} | 2 --\n 2 files changed";

    test("each changed file is read with its count of changed lines", () => {
        expect(statFiles(stat)).toEqual([
            {path: "src/a.js", adds: 3, dels: 1, count: 4},
            {path: "src/{old.js => new.js}", adds: 0, dels: 2, count: 2},
        ]);
        expect(statFiles(undefined)).toEqual([]);
    });

    test("a renamed file opens under its new name, and its bar is split by what was added and removed", () => {
        expect(renamedTo("src/{old.js => new.js}")).toBe("src/new.js");
        expect(statBlocks({adds: 3, dels: 1, count: 4}, 4)).toEqual(["adds", "adds", "adds", "adds", "dels"]);
    });
});
