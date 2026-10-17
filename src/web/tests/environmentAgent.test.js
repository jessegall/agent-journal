import {expect, test} from "vitest";
import {environmentAgent} from "../src/domain/agents.js";

const row = (n, updated, status) => ({n, updated, deleted: 0, data: {status}});

test("the environment's agent is the live one, not a session that started and stopped since", () => {
    expect(environmentAgent([row(3, 100, "working"), row(34, 200, "stopped")]).n).toBe(3);
    expect(environmentAgent([row(3, 100, "stopped"), row(34, 200, "stopped")]).n).toBe(34);
    expect(environmentAgent([])).toBe(null);
});
