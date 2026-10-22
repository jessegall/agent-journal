import {expect, test} from "vitest";
import {leadOf} from "../src/domain/agents.js";

test("the lead agent is the environment's main agent, never a worker heard from later", () => {
    const main = {id: 39, role: "main", status: "idle", heard_at: "2026-10-22T20:00:00Z"};
    const worker = {id: 43, role: "worker", status: "working", heard_at: "2026-10-22T20:05:00Z"};
    expect(leadOf([main, worker]).id).toBe(39);
    expect(leadOf([worker])).toBe(null);
});
