import {expect, test} from "vitest";
import {dockedItems, groupedRuns, isLeaving, isRunItem, keptRuns} from "../src/domain/dockItems.js";
import {dockButtons} from "../src/domain/dockLook.js";

const item = (id, extra = {}) => ({id, type: "run", state: "docked", kept: false, leaves_at: null, target_model: "tasks", target_id: id, ...extra});

test("hover: an item past its leave time stays while it is held and goes when released", () => {
    const due = item(1, {leaves_at: 100});
    expect(dockedItems([due], 99)).toHaveLength(1);
    expect(dockedItems([due], 101)).toHaveLength(0);
    expect(dockedItems([due], 101, new Set([1]))).toHaveLength(1);
});

test("leave: only an unkept item with a leave time counts down", () => {
    expect(isLeaving(item(1, {leaves_at: 5}))).toBe(true);
    expect(isLeaving(item(1, {leaves_at: 5, kept: true}))).toBe(false);
    expect(isLeaving(item(1))).toBe(false);
});

test("pin: a kept item never leaves, and keep is offered only while it would", () => {
    const pinned = item(1, {leaves_at: 5, kept: true});
    expect(dockedItems([pinned], 999)).toHaveLength(1);
    expect(dockButtons(item(2, {leaves_at: 5}), {}).map((b) => b.action)).toContain("keep");
    expect(dockButtons(pinned, {}).map((b) => b.action)).not.toContain("keep");
});

test("runs: a run is a type that leaves by itself, and from three they share one row until one is left", () => {
    const declarationOf = (type) => ({run: {leaves_after_seconds: 5}, memory: {leaves_after_seconds: 0}})[type];
    expect(isRunItem(item(1), declarationOf)).toBe(true);
    expect(isRunItem(item(1, {type: "memory"}), declarationOf)).toBe(false);
    let grouped = groupedRuns(2, false);
    expect(grouped).toBe(false);
    grouped = groupedRuns(3, grouped);
    expect(grouped).toBe(true);
    expect(groupedRuns(2, grouped)).toBe(true);
    expect(groupedRuns(1, grouped)).toBe(false);
});

test("runs past the most are cleared oldest first when their leave time passed, and a running one stays", () => {
    const runs = [item(1, {leaves_at: 10}), item(2), item(3, {leaves_at: 10}), item(4)];
    expect(keptRuns(runs, 50, 3).map((r) => r.id)).toEqual([2, 3, 4]);
    expect(keptRuns(runs, 5, 3)).toHaveLength(4);
});
