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
});
