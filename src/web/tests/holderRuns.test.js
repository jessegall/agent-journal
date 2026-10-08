import {describe, expect, test} from "vitest";
import {grouped, holdingRuns} from "../src/domain/helpers.js";

const todo = (n, helper) => ({n, type: "todo", data: {assigned: helper ? `helper:${helper}` : ""}});
const helpers = [
    {n: 1, data: {name: "Linus"}},
    {n: 2, data: {name: "Hedy"}},
];

describe("the to-dos one helper holds in a row", () => {
    test("neighbours held by the same helper form one run, and a helper's rows apart stay apart", () => {
        const runs = holdingRuns([todo(1, 1), todo(2, 1), todo(3, 2), todo(4), todo(5, 1)], helpers);
        expect(runs.map((run) => [run.holder?.n ?? null, run.rows.map((row) => row.n)])).toEqual([
            [1, [1, 2]],
            [2, [3]],
            [null, [4]],
            [1, [5]],
        ]);
    });

    test("only a run of two or more rows held by a helper gets a bracket", () => {
        const [pair, single, free] = holdingRuns([todo(1, 1), todo(2, 1), todo(3, 2), todo(4), todo(5)], helpers);
        expect([grouped(pair), grouped(single), grouped(free)]).toEqual([true, false, false]);
    });
});
