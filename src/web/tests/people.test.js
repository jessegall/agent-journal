import {expect, test} from "vitest";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {actorName, agentName, colleagueOwner, colleaguesEnvironments, isMe, ownEnvironments, personName} from "../src/domain/people.js";
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
    expect(bar).toMatch(/<template v-else-if="colleague">\s*<div class="agent-bar agent-bar-colleague">\{\{ colleague \}\}'s environment: the agent's status there is not known on this machine<\/div>/);
});

test("a colleague's comment is drawn as theirs, named, and never as yours", async () => {
    const {threadTurns} = await import("../src/domain/thread.js");
    const {
        turns: [turn],
    } = threadTurns([{id: 9, author: "colleague", creator: "user:7", text: "nice work", created_at: "2026-10-23T10:00:00Z", files: [], data: {colleague: "Anna de Vries", colleague_user: 7}}], []);
    expect(turn.who).toBe("colleague");
    const header = readFileSync(resolve(__dirname, "../src/chat/TurnHeader.vue"), "utf8");
    expect(header).toMatch(/<template v-else-if="turn.who === 'colleague'">\s*<span class="thread-colleague">\{\{ \(turn.data \|\| \{\}\).colleague \}\}, colleague<\/span>/);
});

test("a side thread view sits beside the chat for people, and says no agent reads it", async () => {
    const {VIEWS} = await import("../src/domain/panes.js");
    expect(VIEWS).toContain("side");
    const side = readFileSync(resolve(__dirname, "../src/chat/SideThread.vue"), "utf8");
    expect(side).toMatch(/People talk here beside the chat\. No agent reads it\./);
    expect(side).toMatch(/actorName\(row\.creator, store\.people\)/);
});

test("a colleague's command card is drawn from its message, and opening it says the output stays on their machine", () => {
    const live = readFileSync(resolve(__dirname, "../src/composables/liveOutputs.js"), "utf8");
    expect(live).toMatch(/colleague\.value \? \[\] :/);
    const dock = readFileSync(resolve(__dirname, "../src/chat/WatchDock.vue"), "utf8");
    expect(dock).toMatch(/This output stays on \{\{ colleague \}\}'s machine/);
    expect(dock).toMatch(/if \(!colleague\.value\) output\.value = await scope\.api\.readOutput/);
    const dialog = readFileSync(resolve(__dirname, "../src/chat/OutputDialog.vue"), "utf8");
    expect(dialog).toMatch(/This output stays on \{\{ owner \}\}'s machine/);
    const thread = readFileSync(resolve(__dirname, "../src/chat/Thread.vue"), "utf8");
    expect(thread).toMatch(/<OutputDialog :key="outputOpen" :n="outputOpen" :owner="colleague"/);
});

test("the Team chat is named so in the sidebar, and each person's message there is named by its writer", () => {
    const sidebar = readFileSync(resolve(__dirname, "../src/layout/Sidebar.vue"), "utf8");
    expect(sidebar).toMatch(/e\.is_team_chat \? "Team chat" : e\.name/);
    const header = readFileSync(resolve(__dirname, "../src/chat/TurnHeader.vue"), "utf8");
    expect(header).toMatch(/mine && !isMe\(turn\.creator, store\.people\)/);
    expect(actorName("user:7", team(3))).toBe("Anna de Vries");
    expect(isMe("user:3", team(3))).toBe(true);
});

test("the Team chat's bar names who holds it and offers a Claim", () => {
    const bar = readFileSync(resolve(__dirname, "../src/chat/AgentBar.vue"), "utf8");
    expect(bar).toMatch(/<template v-if="teamChat">\s*<TeamChatBar \/>/);
    const team = readFileSync(resolve(__dirname, "../src/chat/TeamChatBar.vue"), "utf8");
    expect(team).toMatch(/api\.teamChat\(\)/);
    expect(team).toMatch(/<Btn class="team-chat-claim" @click="claim">Claim<\/Btn>/);
});

test("the sidebar lists the viewer's own environments and the Team chat, and the Team page each colleague's", () => {
    const people = {me: 1, device: "d1", people: [{id: 1, name: "Ada"}, {id: 2, name: "Bob"}], owners: {"10": 1, "11": 2, "12": 2, "13": 0}};
    const rows = [{id: 10, name: "ada-main"}, {id: 11, name: "bob-main"}, {id: 12, name: "bob-docs"}, {id: 13, name: "team"}];
    expect(ownEnvironments(rows, people).map((row) => row.name)).toEqual(["ada-main", "team"]);
    expect(colleaguesEnvironments(rows, people)).toEqual([{id: 2, name: "Bob", environments: [rows[1], rows[2]]}]);
    const sidebar = readFileSync(resolve(__dirname, "../src/layout/Sidebar.vue"), "utf8");
    expect(sidebar).toMatch(/ownEnvironments\(rows\("environments"\), store\.people\)/);
});

test("the Team page lists each colleague's environments and opens one in place", () => {
    const page = readFileSync(resolve(__dirname, "../src/pages/SettingsTeam.vue"), "utf8");
    expect(page).toMatch(/colleaguesEnvironments\(rows\("environments"\), store\.people\)/);
    expect(page).toMatch(/@click="choose\(environment\.name\)"/);
});
