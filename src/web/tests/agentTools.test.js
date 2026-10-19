// @vitest-environment node
import {expect, test} from "vitest";

const {leadOf, runningAgent} = await import("../src/domain/agents.js");

const at = (seconds) => new Date(seconds * 1000).toISOString();
const agent = (id, status = "idle", heard = id) => ({table: "agents", id, status, heard_at: at(heard)});

test("the lead agent is the live one most lately heard from, else the one most lately seen", () => {
    expect(leadOf([agent(1), agent(3, "stopped"), agent(2)]).id).toBe(2);
    expect(leadOf([agent(3, "stopped"), agent(4, "stopped", 9)]).id).toBe(4);
    expect(leadOf([])).toBe(null);
});

test("a stopped agent is not a running one", () => {
    expect(runningAgent(agent(5, "stopped"))).toBe(null);
    expect(runningAgent(agent(5, "working")).id).toBe(5);
});
