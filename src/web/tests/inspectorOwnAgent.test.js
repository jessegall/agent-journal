import {expect, test} from "vitest";
import {agentOf} from "../src/domain/agents.js";

const at = (seconds) => new Date(seconds * 1000).toISOString();
const agent = (id, session, updated, status = "idle") => ({table: "agents", id, session, status, updated_at: at(updated)});
const rows = [agent(1, "main-session", 9), agent(2, "worker-session", 1)];

test("an inspector finds the agent of its own session and never falls back to the newest main agent", () => {
    expect(agentOf(rows, "worker-session", false).id).toBe(2);
    expect(agentOf(rows, "unknown-session", false)).toBe(null);
});

test("an inspector lent to an environment finds its live agent when no row carries its session", () => {
    const own = [agent(5, "other", 3), agent(6, "gone", 9, "stopped")];
    expect(agentOf(own, "worker-session", true).id).toBe(5);
    expect(agentOf(own, "worker-session", false)).toBe(null);
});
