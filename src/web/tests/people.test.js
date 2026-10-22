import {expect, test} from "vitest";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {actorName, agentName, colleagueOwner, isMe, personName} from "../src/domain/people.js";
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

test("a colleague's environment opens with a box to comment as yourself and no controls of its agent", () => {
    expect(colleagueOwner(12, team(3))).toBe(7);
    expect(colleagueOwner(13, team(3))).toBe(0);
    expect(personName(3, team(3))).toBe("Jesse Gall");
    const thread = readFileSync(resolve(__dirname, "../src/chat/Thread.vue"), "utf8");
    expect(thread).toMatch(/:placeholder="colleague \? `Comment as \$\{me\}` : 'Message the agent'"/);
    const bar = readFileSync(resolve(__dirname, "../src/chat/AgentBar.vue"), "utf8");
    expect(bar).toMatch(/<template v-if="colleague">\s*<div class="agent-bar agent-bar-colleague">\{\{ colleague \}\}'s environment: the agent's status there is not known on this machine<\/div>/);
});
