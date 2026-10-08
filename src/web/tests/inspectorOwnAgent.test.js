import {expect, test} from "vitest";
import {sessionRow} from "../src/domain/agents.js";

const rows = [
    {n: 1, title: "main-session", updated: 9, data: {}},
    {n: 2, title: "helper-session", updated: 1, data: {}},
];

test("an inspector finds the agent of its own session and never falls back to the newest main agent", () => {
    expect(sessionRow(rows, "helper-session").n).toBe(2);
    expect(sessionRow(rows, "unknown-session")).toBe(null);
});
