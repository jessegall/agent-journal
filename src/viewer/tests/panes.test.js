import {describe, expect, test} from "vitest";
import {holding, leaves, matches, snapshot, wellShaped} from "../src/domain/panes.js";

const layout = {tree: {dir: "row", r: 0.6, a: {id: 1}, b: {id: 2}}, panes: {1: {tabs: ["messages.chat"], active: "messages.chat"}, 2: {tabs: ["tasks.tasks", "plans.plans"], active: "tasks.tasks"}}, next: 3};

describe("the panes of a layout", () => {
    test("lists its panes in order and finds the pane that holds a window", () => {
        expect(leaves(layout.tree)).toEqual([1, 2]);
        expect(holding(layout, "plans.plans")).toBe(2);
        expect(holding(layout, "notes.board")).toBe(null);
    });

    test("a snapshot of a layout matches the layout it came from", () => {
        expect(matches(layout, snapshot(layout))).toBe(true);
    });
});

describe("a well-shaped layout", () => {
    test("is accepted with any window names, since no list of views is fixed in the viewer", () => {
        expect(wellShaped({tree: {id: 1}, panes: {1: {tabs: ["notes.board"], active: "notes.board"}}, next: 2})).toBe(true);
    });

    test("is refused when a window sits in two panes or the layout has no next pane number", () => {
        expect(wellShaped({...layout, panes: {...layout.panes, 2: {tabs: ["messages.chat"], active: "messages.chat"}}})).toBe(false);
        expect(wellShaped({tree: {id: 1}, panes: {1: {tabs: ["notes.board"], active: "notes.board"}}})).toBe(false);
    });
});
