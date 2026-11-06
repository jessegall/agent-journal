import {expect, test} from "vitest";
import {dockFolded, dockOpening} from "../src/domain/dockFold.js";

test("scrolling down to the foot opens the docked cards, and scrolling up away from it folds them", () => {
    expect(dockOpening({top: 700, before: 600, height: 1000, shown: 300})).toBe(true);
    expect(dockOpening({top: 300, before: 600, height: 1000, shown: 300})).toBe(false);
});

test("a scroll that goes down but stays away from the foot, changes nothing until it reaches the foot", () => {
    expect(dockOpening({top: 400, before: 300, height: 1000, shown: 300})).toBeNull();
    expect(dockOpening({top: 695, before: 700, height: 1000, shown: 300})).toBe(true);
});

test("a card folded by hand keeps that, else it follows the scroll", () => {
    expect(dockFolded(undefined, true)).toBe(true);
    expect(dockFolded(false, true)).toBe(false);
    expect(dockFolded(true, false)).toBe(true);
});
