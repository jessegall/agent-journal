import {expect, test} from "vitest";
import {actorName, agentName, isMe} from "../src/domain/people.js";
import {workerActions} from "../src/domain/workers.js";

const team = (me) => ({me, device: me === 3 ? "d3" : "d7", people: [{id: 3, name: "Jesse Gall"}, {id: 7, name: "Anna de Vries"}], owners: {12: 7, 13: 3}});

test("a message by user 7 is Anna de Vries to user 3 and you to user 7", () => {
    expect(actorName("user:7", team(3))).toBe("Anna de Vries");
    expect(actorName("user:7", team(7))).toBe("you");
    expect(isMe("user:7", team(7)) && !isMe("user:7", team(3))).toBe(true);
});

test("an agent is named by the person who owns its environment", () => {
    expect(actorName("agent:abc", team(3), 12)).toBe("Anna de Vries's agent");
    expect(agentName(13, team(3))).toBe("the agent");
    expect(agentName(99, team(3))).toBe("the agent");
});

test("another machine's worker offers no action here", () => {
    const worker = {id: 1, state: "dispatched", pid: 5, device: "d7", started_at: "2026-10-23T10:00:00Z"};
    expect(workerActions(worker, "d3")).toEqual([]);
    expect(workerActions(worker, "d7").length).toBeGreaterThan(0);
    expect(workerActions({...worker, device: ""}).length).toBeGreaterThan(0);
});
