import {describe, expect, test} from "vitest";
import {helperHolding, helpersHolding} from "../src/domain/helpers.js";

const todo = (n, assigned = "") => ({n, data: {assigned}});
const helper = (n) => ({n, data: {name: `Helper ${n}`}});

describe("the helper that holds a plan's to-dos", () => {
    test("a to-do handed to a helper is held by that helper, one that is not is held by nobody", () => {
        expect(helperHolding(todo(1, "helper:2"), [helper(1), helper(2)]).n).toBe(2);
        expect(helperHolding(todo(1), [helper(1)])).toBeNull();
    });

    test("a phase lists each holding helper once", () => {
        const held = helpersHolding([todo(1, "helper:2"), todo(2, "helper:2"), todo(3, "helper:1"), todo(4)], [helper(1), helper(2)]);
        expect(held.map((row) => row.n)).toEqual([2, 1]);
    });

    test("two helper rows with one name show once, and an open one is shown before a closed one", () => {
        const named = (n, name, state) => ({n, state, data: {name}});
        const held = helpersHolding([todo(1, "helper:3"), todo(2, "helper:4"), todo(3, "helper:5")], [named(3, "Hedy", "finished"), named(4, "Hedy", "running"), named(5, "Linus", "finished")]);
        expect(held.map((row) => row.n)).toEqual([4, 5]);
    });
});

test("a plan page asks only for the helpers that hold its to-dos", async () => {
    const {holdingHelpers} = await import("../src/domain/helpers.js");
    const todos = [{data: {assigned: "helper:7"}}, {data: {assigned: "helper:7"}}, {data: {assigned: "helper:12"}}, {data: {assigned: "agent-3"}}, {data: {}}];
    expect(holdingHelpers(todos)).toEqual([7, 12]);
});
