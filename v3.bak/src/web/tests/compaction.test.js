import {describe, expect, test} from "vitest";
import {lastCompaction} from "../src/domain/agents.js";

describe("the last compaction of a conversation", () => {
    test("is the newest one on any row of the conversation, not the last one kept on the first row", () => {
        const old = {data: {compactions: [{at: 100}, {at: 200}]}};
        const current = {data: {compactions: [{at: 900}]}};
        const helper = {data: {parent: 1, compactions: [{at: 5000}]}};
        expect([lastCompaction([old, current, helper]), lastCompaction([old]), lastCompaction([{data: {}}]), lastCompaction([])]).toEqual([900, 200, null, null]);
    });
});
