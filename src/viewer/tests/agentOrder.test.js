import {expect, test} from "vitest";
import {busyFirst, isWaiting} from "../../core/modules/agents/web/src/agentOrder.js";

const busy = (id) => ({id, state: "running", ended_at: null});
const waiting = (id) => ({id, state: "running", ended_at: "2026-11-14T19:00:00Z"});

test("the agents busy now come first and the waiting ones after them, each group in the order given", () => {
    const rows = [waiting(1), busy(2), waiting(3), busy(4)];
    expect(busyFirst(rows).map((row) => row.id)).toEqual([2, 4, 1, 3]);
});

test("an agent is waiting only when it is in the Working list with its process ended", () => {
    expect(isWaiting(waiting(1))).toBe(true);
    expect(isWaiting(busy(2))).toBe(false);
    expect(isWaiting({id: 3, state: "idle", ended_at: "2026-11-14T19:00:00Z"})).toBe(false);
});
