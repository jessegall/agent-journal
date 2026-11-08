import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {h} from "vue";
import {expect, test} from "vitest";
import AgentCard from "../../core/modules/agents/web/src/AgentCard.vue";
import {context, mounted} from "./support/agentWindowContext.js";

const CREATED = new Date(Date.now() - 6 * 3600000).toISOString();
const STARTED = new Date(Date.now() - 7 * 60000).toISOString();
const worker = (overrides) => ({id: 6, role: "worker", access: "writing", session: "s-6", program: "claude", state: "running", created_at: CREATED, process_started_at: STARTED, ended_at: null, ...overrides});
const card = async (row, facts = {tasks: []}, open = false) => (await mounted({render: () => h(AgentCard, {row, facts, open})}, context({"usage tool --agent 6": {ok: true, value: {tool: "", note: ""}}}))).querySelector("[data-agent-open]");
const dotOf = (element) => element.querySelector("[data-agent-status]");
const words = (element) => element.querySelector("[data-agent-status-tip] b").textContent;
const since = (element) => element.querySelector("[data-agent-status-tip] span").textContent;

test("a working agent has a pulsing dot whose tooltip says it works and since when", async () => {
    const element = await card(worker());
    expect(dotOf(element).dataset.state).toBe("running");
    expect(dotOf(element).classList.contains("pulse")).toBe(true);
    expect(words(element)).toBe("Working");
    expect(since(element)).toMatch(/^Since \d.*, 7m ago$/);
    expect(dotOf(element).getAttribute("aria-label")).toBe(`Working. ${since(element)}`);
});

test("a waiting agent has a still dot that says what it waits for", async () => {
    const element = await card(worker(), {tasks: [{id: 1, state: "completed"}], work_status: "tests running"});
    expect(dotOf(element).dataset.state).toBe("waiting");
    expect(dotOf(element).classList.contains("pulse")).toBe(false);
    expect(words(element)).toBe("Status: tests running");
});

test("a blocked agent has a still dot that says why", async () => {
    const element = await card(worker(), {tasks: [], state: "blocked", blocked_reason: "it waits on task 7340", last_activity: new Date(Date.now() - 54 * 60000).toISOString()});
    expect(dotOf(element).dataset.state).toBe("blocked");
    expect(dotOf(element).classList.contains("pulse")).toBe(false);
    expect(words(element)).toBe("Blocked: it waits on task 7340");
    expect(since(element)).toMatch(/, 54m ago$/);
});

test("an idle agent has a still grey dot and a retired agent a ring", async () => {
    const idle = await card(worker({state: "idle", ended_at: new Date(Date.now() - 3600000).toISOString()}));
    expect(dotOf(idle).dataset.state).toBe("idle");
    expect(dotOf(idle).classList.contains("pulse")).toBe(false);
    expect(words(idle)).toBe("Idle: its process has stopped");
    expect(since(idle)).toMatch(/, 1h ago$/);
    const retired = await card(worker({state: "retired", ended_at: STARTED, retired_at: new Date(Date.now() - 2 * 86400000).toISOString()}));
    expect(dotOf(retired).dataset.state).toBe("retired");
    expect(words(retired)).toBe("Retired");
    expect(since(retired)).toMatch(/, 2d ago$/);
});

test("a row shows no age and no dot at its left, and the dot is a button a keyboard reaches", async () => {
    const element = await card(worker({ended_at: new Date().toISOString(), state: "idle"}));
    expect(element.querySelector(".agent-time")).toBeNull();
    expect(element.querySelector(".agent-head .agent-dot")).toBeNull();
    expect(dotOf(element).tagName).toBe("BUTTON");
    expect(element.contains(dotOf(element))).toBe(true);
});

test("an open header shows the run time, Started and Last heard as plain text, and the information bar shows no run time", async () => {
    const element = await card(worker(), {tasks: [], last_activity: new Date().toISOString()}, true);
    expect(element.querySelector("[data-agent-run-time]").textContent).toBe("7m");
    expect(element.querySelector("[data-agent-first-dispatched]").textContent).toBe("Started 6h ago");
    expect(element.querySelector("[data-agent-last-heard]").textContent).toBe("Last heard just now");
    expect(element.querySelector("[data-agent-first-dispatched] [data-icon]")).toBeNull();
    expect(element.querySelector("[data-information-bar] [data-fact='uptime']")).toBeNull();
    expect(element.querySelector("[data-information-bar] [data-icon='reminders']")).toBeNull();
    expect(dotOf(element)).not.toBeNull();
});

test("reduced motion turns the pulse into a still halo", () => {
    const source = readFileSync(resolve(__dirname, "../../core/modules/agents/web/src/AgentStatusDot.vue"), "utf8");
    expect(source).toMatch(/prefers-reduced-motion: reduce\)\s*\{\s*\.agent-dot\.pulse::before \{ animation: none;/);
});
