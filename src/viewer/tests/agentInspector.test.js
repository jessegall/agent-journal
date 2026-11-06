import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {afterEach, expect, test} from "vitest";
import AgentInspector from "../src/resource/agent/AgentInspector.vue";
import {appended, settle} from "./support/windowContext.js";

afterEach(() => (document.body.innerHTML = ""));

const MINUTE = 60000;
const before = (milliseconds) => new Date(Date.now() - milliseconds).toISOString();
const text = (element, selector) => element.querySelector(selector)?.textContent.replace(/\s+/g, " ").trim();
const texts = (element, selector) => [...element.querySelectorAll(selector)].map((found) => found.textContent.replace(/\s+/g, " ").trim());

const row = (overrides) => ({id: 12, role: "worker", program: "claude", session: "7c1f0d9e-52a4", created_at: before(7 * MINUTE), process_started_at: before(7 * MINUTE), ended_at: null, paused_at: null, parent_id: null, pid: 48211, ...overrides});
const facts = (overrides) => ({id: 12, given_name: "Lovelace", profile: "builder", model: "Sonnet 5.5", effort: "medium", context_percent: 41, cost_dollars: 3.18, state: "", instruction: "Rebuild the process queue inspector from the design.", tasks: [{state: "completed"}, {state: "completed"}, {state: "started"}], ...overrides});
const inspection = (overrides) => ({id: 12, started_by: "Ada, the main agent", last_activity: before(12000), failed_runs: 0, recent: [], task: null, plan: null, ...overrides});

// one read the way the viewer sends it: the answers are the ones of the reads, found by the start of the line
function opened(answers, props = {}) {
    const lines = [];
    const read = async (line) => {
        lines.push(line.join(" "));
        const found = Object.keys(answers).find((start) => line.join(" ").startsWith(start));
        return found ? {ok: true, value: answers[found]} : {ok: false, error: `no answer for ${line.join(" ")}`};
    };
    const element = appended(AgentInspector, {id: 12, read, environment: "main", ...props});
    return {element, lines};
}

const WORKER = {
    "agent show 12": row(),
    "usage agents": {rows: [facts()]},
    "usage agent 12": inspection({
        failed_runs: 1, task: {id: 340, title: "Process queue inspector"}, plan: {id: 12, title: "Queue", phase: 2, done: 3, total: 5},
        recent: [{time: before(8 * MINUTE), text: "Finished task 331: Read the settings", tone: "good", table: "tasks", id: 331}, {time: before(3 * MINUTE), text: "A run failed: npm run build", tone: "bad", table: "", id: 9}],
    }),
    "usage tool --agent 12": {tool: "Bash pytest -q", thinking: false, wait_target: ""},
    "agent list --parent 12": {rows: [], total: 0},
    "agent-skill list --agent 12": {rows: [{id: 1, agent_id: 12, skill: "journal", state: "loaded"}, {id: 2, agent_id: 12, skill: "plain-viewer-text", state: "loaded"}], total: 2},
    "worker-worktree points --agent 12": {points: [{id: 1, text: "Every label is the one in the spec", proof: {state: "checked", text: "labels match"}}, {id: 2, text: "The tests pass", proof: null}]},
};

test("a running worker says its number once, then who it is, how it does, what it does now and what it was told", async () => {
    const {element} = opened(WORKER);
    await settle();
    expect(text(element, "[data-resource-title]")).toBe("Worker 12");
    expect(element.textContent.match(/Worker 12/g)).toHaveLength(1);
    expect(text(element, ".name")).toBe("Lovelace");
    expect(text(element, "[data-agent-identity]")).toBe("Builder · claude · Sonnet 5.5 · medium effort");
    expect(text(element, "[data-agent-started-by]")).toBe("Started by: Ada, the main agent");
    expect(texts(element, "[data-agent-cell] small")).toEqual(["Running for", "Context used", "Cost", "Tasks an hour", "Failed runs"]);
    expect(text(element, '[data-agent-cell="context"] b')).toBe("41%");
    expect(text(element, '[data-agent-cell="cost"] b')).toBe("$3.18");
    expect(text(element, '[data-agent-cell="time"] b')).toMatch(/^[67]m \d{2}s$/);
    expect(element.querySelector('[data-agent-cell="failed"] b').classList.contains("bad")).toBe(true);
    expect(text(element, "[data-agent-task-link]")).toBe("Task 340: Process queue inspector");
    expect(text(element, "[data-agent-doing]")).toBe("Command: Bash pytest -q");
    expect(text(element, "[data-agent-last-activity]")).toBe("Last heard: just now");
    expect(text(element, "[data-agent-plan]")).toContain("Plan 12, phase 2");
    expect(text(element, "[data-agent-plan]")).toContain("3 of 5 tasks done");
    expect(text(element, "[data-agent-plan-link]")).toBe("Show the plan");
    expect(text(element, "[data-agent-brief]")).toBe("Rebuild the process queue inspector from the design.");
    expect(texts(element, "[data-agent-point]")).toEqual(["1Every label is the one in the specChecked: labels match", "2The tests passNo proof yet"]);
});

test("the recent moves list the newest with their times, and one that has a row opens it", async () => {
    const {element} = opened(WORKER);
    await settle();
    const moves = [...element.querySelectorAll("[data-agent-move]")];
    expect(moves.map((move) => move.tagName)).toEqual(["BUTTON", "DIV"]);
    expect(moves[0].textContent).toContain("Finished task 331: Read the settings");
    expect(moves[0].textContent).toContain("8m ago");
    expect(moves[1].querySelector(".dot").classList.contains("bad")).toBe(true);
});

test("the helpers, the skills and the details are folds that start closed, and the details use plain labels", async () => {
    const {element} = opened(WORKER);
    await settle();
    expect(element.querySelectorAll("[data-agent-fold]")).toHaveLength(3);
    expect(element.querySelector("[data-agent-fold-body]")).toBeNull();
    const details = [...element.querySelectorAll("[data-agent-fold]")].find((fold) => fold.textContent.includes("Details"));
    details.click();
    await settle();
    expect(texts(element, "[data-agent-detail] .label")).toEqual(["Number:", "Session:", "Program:", "Type:", "Started by:", "Started:", "Process:"]);
    expect(element.textContent).not.toMatch(/created_at|creator_id|process_started_at|_id\b/);
    expect(text(element, "[data-agent-detail]")).toBe("Number:12");
});

test("a worker's actions sit below the header with Merge as the main one and Stop in the danger colour, and Stop asks first", async () => {
    const {element, lines} = opened(WORKER);
    await settle();
    const foot = element.querySelector("[data-agent-actions]");
    expect(foot.previousElementSibling.matches("header.top")).toBe(true);
    expect([...foot.querySelectorAll("[data-move]")].map((move) => move.dataset.move)).toEqual(["send", "merge", "release", "pause", "stop"]);
    expect(foot.querySelector('[data-move="merge"]').classList.contains("primary")).toBe(true);
    expect(foot.querySelector('[data-move="stop"]').classList.contains("danger")).toBe(true);
    foot.querySelector('[data-move="stop"]').click();
    await settle();
    expect(foot.querySelector("[data-resource-confirm]").textContent).toContain("Stop the agent? It stops what it is doing.");
    expect(foot.querySelector("[data-resource-confirm-yes]").classList.contains("danger")).toBe(true);
    expect(lines.filter((line) => line.startsWith("agent stop"))).toEqual([]);
});

const MAIN = {
    "agent show 1": row({id: 1, role: "main", created_at: before(134 * MINUTE), process_started_at: before(134 * MINUTE)}),
    "usage agents": {rows: [facts({id: 1, given_name: "Ada", profile: "", cost_dollars: 537.93, context_percent: 57, instruction: "", tasks: []})]},
    "usage agent 1": inspection({id: 1, started_by: "You", task: {id: 5649, title: "Sidebar: pages only for what is a page"}, plan: {id: 91, title: "Sidebar", phase: 2, done: 6, total: 9}}),
    "usage tool --agent 1": {tool: "", thinking: true, wait_target: ""},
    "agent list --parent 1": {rows: [{id: 22, role: "helper", given_name: "Curie", profile: "explorer"}], total: 1},
    "agent-skill list --agent 1": {rows: [], total: 0},
};

test("the main agent is titled without a number, shows the tasks done of its plan, and has no brief and no points", async () => {
    const {element, lines} = opened(MAIN, {id: 1});
    await settle();
    expect(text(element, "[data-resource-title]")).toBe("Main agent");
    expect(text(element, ".name")).toBe("Ada");
    expect(text(element, "[data-agent-started-by]")).toBe("Started by: You");
    expect(texts(element, "[data-agent-cell] small")).toEqual(["Running for", "Context used", "Cost", "Tasks done", "Failed runs"]);
    expect(text(element, '[data-agent-cell="done"] b')).toBe("6 of 9");
    expect(text(element, '[data-agent-cell="cost"] b')).toBe("$537.93");
    expect(text(element, "[data-agent-doing]")).toBe("Thinking");
    expect(element.querySelector("[data-agent-brief]")).toBeNull();
    expect(element.querySelector("[data-agent-point]")).toBeNull();
    expect(lines.some((line) => line.startsWith("worker-worktree"))).toBe(false);
    expect([...element.querySelectorAll("[data-agent-actions] [data-move]")].map((move) => move.dataset.move)).toEqual(["pause", "stop"]);
    element.querySelectorAll("[data-agent-fold]")[0].click();
    await settle();
    expect(text(element, "[data-agent-helper]")).toBe("CurieHelper 22");
});

const ENDED = {
    "agent show 12": row({ended_at: before(12 * MINUTE), created_at: before(53 * MINUTE), process_started_at: before(53 * MINUTE)}),
    "usage agents": {rows: [facts({context_percent: 71, cost_dollars: 6.02, tasks: [{state: "completed"}, {state: "completed"}, {state: "completed"}]})]},
    "usage agent 12": inspection({last_activity: before(12 * MINUTE)}),
    "agent list --parent 12": {rows: [], total: 0},
    "agent-skill list --agent 12": {rows: [], total: 0},
    "worker-worktree points --agent 12": {points: []},
};

test("an ended worker says how long it ran and what it finished, reads no tool and offers no action", async () => {
    const {element, lines} = opened(ENDED);
    await settle();
    expect(text(element, '[data-agent-cell="time"] small')).toBe("Ran for");
    expect(text(element, '[data-agent-cell="time"] b')).toMatch(/^4\dm \d{2}s$/);
    expect(element.querySelector('[data-agent-state="ended"]')).not.toBeNull();
    expect(text(element, "[data-agent-now]")).toContain("Finished 3 tasks");
    expect(lines.some((line) => line.startsWith("usage tool"))).toBe(false);
    expect(element.querySelector("[data-agent-actions] [data-move]")).toBeNull();
    expect(text(element, "[data-agent-ended]")).toBe("Ended 12m ago. It takes no more actions.");
    expect(text(element, "[data-agent-no-moves]")).toBe("Nothing yet.");
});

const SUBAGENT = {
    "agent show 22": row({id: 22, role: "helper", access: "read-only", parent_id: 1}),
    "usage agents": {rows: [facts({id: 22, given_name: "Curie", profile: "explorer", model: "Haiku 4.5", effort: "", context_percent: 9, cost_dollars: 0.07, instruction: "Find where the queue gives a command its place, and say which file holds the rule. Reply with the file and the line."})]},
    "usage agent 22": inspection({id: 22}),
    "usage tool --agent 22": {tool: "Read src/core/modules/processes/support/run_slots.py", thinking: false, wait_target: ""},
    "agent list --parent 22": {rows: [], total: 0},
    "agent-skill list --agent 22": {rows: [], total: 0},
};

test("a helper shows its instruction, no tasks an hour and its parent, and asks nothing of a worker", async () => {
    const {element, lines} = opened(SUBAGENT, {id: 22});
    await settle();
    expect(text(element, "[data-resource-title]")).toBe("Helper 22");
    expect(texts(element, "[data-agent-cell] small")).toEqual(["Running for", "Context used", "Cost", "Failed runs"]);
    expect(text(element, "[data-agent-now]")).toContain("It has no task. It was given an instruction.");
    expect(text(element, ".band, [data-agent-brief]")).not.toBe("");
    expect(element.textContent).toContain("Instruction");
    expect(lines.some((line) => line.startsWith("worker-worktree"))).toBe(false);
    [...element.querySelectorAll("[data-agent-fold]")].find((fold) => fold.textContent.includes("Details")).click();
    await settle();
    expect(texts(element, "[data-agent-detail]")).toContain("Parent agent:Agent 1");
    expect([...element.querySelectorAll("[data-agent-actions] [data-move]")].map((move) => move.dataset.move)).toEqual(["pause", "stop"]);
});

test("a long brief is cut to four lines until it is asked for", async () => {
    const long = "Rebuild the queue. ".repeat(20);
    const {element} = opened({...WORKER, "usage agents": {rows: [facts({instruction: long})]}});
    await settle();
    expect(element.querySelector("[data-agent-brief]").classList.contains("clamp")).toBe(true);
    element.querySelector("[data-agent-brief-more]").click();
    await settle();
    expect(element.querySelector("[data-agent-brief]").classList.contains("clamp")).toBe(false);
    expect(element.querySelector("[data-agent-brief-more]")).toBeNull();
});

test("the panel is 600 wide, the strip and the foot wrap on a phone and only the middle scrolls", () => {
    const source = (path) => readFileSync(resolve(__dirname, path), "utf8");
    expect(source("../src/resource/ResourcePanel.vue")).toMatch(/\.panel\.agent \{\s*width: min\(600px, 100vw\);/);
    expect(source("../src/resource/agent/AgentStrip.vue")).toMatch(/\.strip \{[^}]*flex-wrap: wrap/);
    expect(source("../src/resource/RowMoves.vue")).toMatch(/\.moves,\s*\.ask \{[^}]*flex-wrap: wrap/);
    expect(source("../src/resource/agent/AgentInspector.vue")).toMatch(/\.scroll \{[^}]*overflow-y: auto/);
    expect(source("../src/kit/InspectorActions.vue")).toMatch(/justify-content: flex-end/);
});

test("a fold reads only its count while it is closed, and its list when it opens, again after each reload while it stays open", async () => {
    const {element, lines} = opened(WORKER);
    await settle();
    const skillFold = () => [...element.querySelectorAll("[data-agent-fold]")].find((fold) => fold.textContent.includes("Skills loaded"));
    expect(texts(element, "[data-agent-fold] .count")).toEqual(["0", "2", "7"]);
    expect(lines.filter((line) => line.startsWith("agent-skill list") || line.startsWith("agent list"))).toEqual([
        "agent list --parent 12 --limit 1 --columns id", "agent-skill list --agent 12 --state loaded --limit 1 --columns id",
    ]);
    skillFold().click();
    await settle();
    expect(lines).toContain("agent-skill list --agent 12 --state loaded");
    expect(lines).not.toContain("agent list --parent 12");
    expect(texts(element, "[data-agent-skill]")).toEqual(["journal", "plain-viewer-text"]);
    const reads = lines.filter((line) => line === "agent-skill list --agent 12 --state loaded").length;
    element.querySelector("[data-agent-inspector]").dispatchEvent(new CustomEvent("noop"));
    expect(reads).toBe(1);
});

const CODEX = {
    ...WORKER,
    "agent show 12": row({program: "codex"}),
    "usage agents": {rows: [facts({model: "gpt-6.1-sol", effort: "medium", context_percent: null, cost_dollars: null})]},
};

test("a Codex agent says its real model and that its cost is not known, never zero dollars", async () => {
    const {element} = opened(CODEX);
    await settle();
    expect(text(element, "[data-agent-identity]")).toBe("Builder · codex · gpt-6.1-sol · medium effort");
    expect(text(element, '[data-agent-cell="cost"]')).toBe("CostNot known");
    expect(element.textContent).not.toContain("$0");
});
