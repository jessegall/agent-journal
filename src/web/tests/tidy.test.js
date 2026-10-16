import {expect, test} from "vitest";
import {overlapping, tidy} from "../src/domain/tidy.js";

const size = {width: 208, heightOf: (n) => (n.text ? 84 : 48)};

test("a tidy lays overlapping cards out without overlap, each line running downward", () => {
    const nodes = [
        {id: 1, kind: "trigger", key: "idle", x: 0, y: 0},
        {id: 2, kind: "check", key: "open_tasks", x: 0, y: 0},
        {id: 3, kind: "action", key: "say", text: "yes words", x: 10, y: 10},
        {id: 4, kind: "action", key: "say", text: "no words", x: 10, y: 10},
        {id: 5, kind: "trigger", key: "ticked", x: 0, y: 0},
    ];
    const lines = [
        {from: 1, to: 2, port: "then"},
        {from: 2, to: 3, port: "yes"},
        {from: 2, to: 4, port: "no"},
    ];
    expect(overlapping(nodes, size)).toBe(true);
    const placed = tidy(nodes, lines, size);
    expect(overlapping(placed, size)).toBe(false);
    const at = Object.fromEntries(placed.map((n) => [n.id, n]));
    expect(at[2].y).toBeGreaterThan(at[1].y);
    expect(at[3].y).toBeGreaterThan(at[2].y);
    expect(at[4].y).toBeGreaterThan(at[2].y);
    expect(placed.map((n) => n.id)).toEqual([1, 2, 3, 4, 5]);
});
