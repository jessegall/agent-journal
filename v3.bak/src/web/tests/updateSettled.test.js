import {describe, expect, test} from "vitest";
import {settled} from "../src/domain/updates.js";

const need = (ref) => ({section: "need", ref, title: "t"});

describe("an item of the Needs you section the user has since answered", () => {
    const held = {
        question: [{n: 1, completed: 0}, {n: 2, completed: 5}],
        plan: [{n: 3, data: {status: "ready"}}, {n: 4, data: {status: "running"}}],
        suggestion: [{n: 5, completed: 9}],
    };

    test.each([
        ["question:1", false],
        ["question:2", true],
        ["plan:3", false],
        ["plan:4", true],
        ["suggestion:5", true],
        ["question:99", false],
    ])("%s is struck through: %s", (ref, expected) => {
        expect(settled(need(ref), held)).toBe(expected);
    });

    test("an item outside the section is never struck through", () => {
        expect(settled({section: "done", ref: "question:2"}, held)).toBe(false);
    });
});
