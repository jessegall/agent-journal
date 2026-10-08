import {expect, test} from "vitest";
import {agentOf, sessionRow} from "../src/domain/agents.js";

const rows = [
    {n: 1, title: "main-session", updated: 9, data: {}},
    {n: 2, title: "helper-session", updated: 1, data: {}},
];

test("an inspector finds the agent of its own session and never falls back to the newest main agent", () => {
    expect(sessionRow(rows, "helper-session").n).toBe(2);
    expect(sessionRow(rows, "unknown-session")).toBe(null);
});

test("a helper's inspector finds the one agent of its own environment when no row carries its session", () => {
    const own = [{n: 5, title: "other", updated: 3, data: {}}, {n: 6, title: "sub", updated: 9, data: {parent: 5}}];
    expect(agentOf(own, "helper-session", true).n).toBe(5);
    expect(agentOf(own, "helper-session", false)).toBe(null);
    expect(agentOf(rows, "helper-session", true).n).toBe(2);
});
