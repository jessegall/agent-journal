import {afterEach, expect, test, vi} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import {h} from "vue";
import AgentRows from "../../core/modules/agents/web/src/AgentRows.vue";
import {age, ago} from "../src/format/time.js";

vi.stubGlobal("ResizeObserver", class {
    observe() {}

    disconnect() {}
});

afterEach(() => (document.body.innerHTML = ""));

const AGENTS = [
    {id: 2, session: "s-live", program: "claude", role: "main", ended_at: null},
    {id: 3, session: "s-sub", program: "claude", role: "subagent", ended_at: null},
    {id: 1, session: "s-old", program: "codex", role: "worker", ended_at: "2026-11-01T10:00:00Z"},
];

const FACTS = [
    {id: 2, model: "opus", context_percent: 62, cost_dollars: 1.2, task_id: 7, task_title: "Fix the cart", tasks: [], state: "", profile: "", given_name: "", instruction: ""},
    {id: 3, model: "sonnet", context_percent: null, cost_dollars: 0, task_id: null, task_title: "", tasks: [], state: "blocked", profile: "journal-researcher", given_name: "Madame Curie", instruction: "Read the cart\nand report"},
];
// the pane menu's options as the window declares them: every state and kind shown, by number, `every` off
const DEFAULT_OPTIONS = {working: true, waiting: true, idle: true, stopped: true, environment: true, worker: true, subagent: true, order: "number", every: false};
const window = (facts = FACTS, options = {}) => ({
    ...context({"agent list": page(AGENTS), "agent running": page(AGENTS.filter((row) => !row.ended_at)), "usage agents --closed": page(facts)}),
    option: (key) => ({value: {...DEFAULT_OPTIONS, ...options}[key]}),
});
const drawn = (facts, options) => mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, window(facts, options));
const cardOf = (element, id) => element.querySelector(`[data-agent-open="${id}"]`);

const pick = async (element, label) => {
    [...element.querySelectorAll("button")].find((button) => button.textContent.trim() === label).click();
    await settle();
};

test("the agents window filters on running or closed", async () => {
    const element = await drawn();
    expect(cardOf(element, 2)).not.toBeNull();
    expect(cardOf(element, 1)).toBeNull();
    await pick(element, "Closed");
    expect(cardOf(element, 2)).toBeNull();
    expect(cardOf(element, 1)).not.toBeNull();
    await pick(element, "All");
    expect(cardOf(element, 2)).not.toBeNull();
    expect(cardOf(element, 1)).not.toBeNull();
});

test("a card is two lines: the profile, name and time, then the provider, model and kind, with no task or instruction", async () => {
    const element = await drawn();
    const card = cardOf(element, 3);
    expect(card.querySelector("[data-agent-title]").textContent).toBe("Journal-researcher");
    expect(card.querySelector("[data-agent-name]").textContent).toBe("Madame Curie");
    expect(card.querySelector("[data-agent-identity]").textContent).toBe("claude · sonnet · subagent");
    expect(card.querySelector(".agent-dot").dataset.state).toBe("blocked");
    expect(card.textContent).not.toContain("Running");
    expect(card.querySelector("[data-agent-instruction]")).toBeNull();
    expect(card.title).toBe("s-sub");
});

test("the main agent is titled Main agent and its model follows the provider", async () => {
    const element = await drawn();
    const card = cardOf(element, 2);
    expect(card.querySelector("[data-agent-title]").textContent).toBe("Main agent");
    expect(card.querySelector("[data-agent-identity]").textContent).toBe("claude · opus");
    expect(card.textContent).not.toContain("Fix the cart");
});

test("a click opens the card on its number, usage, Inspect and instruction, and a second closes it", async () => {
    const element = await drawn();
    document.body.append(element);
    const card = cardOf(element, 3);
    card.click();
    await settle();
    expect(card.querySelector("[data-agent-card-usage]").textContent).toBe("agent 3");
    expect(card.querySelector("[data-agent-inspect]").textContent.trim()).toBe("Inspect");
    expect(card.querySelector("[data-agent-instruction]").textContent).toBe("Read the cart\nand report");
    card.click();
    await settle();
    expect(card.querySelector("[data-agent-instruction]")).toBeNull();
});

const TASKS = [
    {id: 11, title: "Fix the cart", state: "completed"},
    {id: 12, title: "Add the totals", state: "started"},
    {id: 13, title: "Print the receipt", state: "open"},
];

test("the card counts what is completed and lists its tasks when opened, under the state names of the tasks window", async () => {
    const element = await drawn([{...FACTS[0], tasks: TASKS}]);
    const card = cardOf(element, 2);
    expect(card.querySelector("[data-agent-tasks]").textContent.trim()).toBe("1 of 3 tasks");
    expect(card.querySelector("[data-agent-delegated]")).toBeNull();
    card.click();
    await settle();
    const labels = [...card.querySelectorAll("[data-agent-section]")].map((label) => label.textContent.trim());
    expect(labels).toEqual(["Started 1", "Open 1", "Completed 1"]);
    const rows = [...card.querySelectorAll("[data-agent-delegated]")];
    expect(rows.map((row) => row.dataset.agentDelegated)).toEqual(["12", "13", "11"]);
    expect(rows[0].querySelector(".ring").classList.contains("started")).toBe(true);
    rows[0].click();
    await settle();
    expect(card.getAttribute("aria-expanded")).toBe("true");
});

test("a worker with a task in testing and none started says it waits for its tests", async () => {
    const element = await drawn([{...FACTS[0], tasks: [{id: 11, title: "Fix the cart", state: "testing"}, {id: 13, title: "Print the receipt", state: "open"}]}]);
    expect(cardOf(element, 2).querySelector("[data-agent-identity]").textContent).toContain("waiting for its tests");
    expect(cardOf(element, 2).querySelector(".agent-dot").dataset.state).toBe("waiting");
});

test("a worker with a started task does not say it waits for its tests", async () => {
    const element = await drawn([{...FACTS[0], tasks: TASKS}]);
    expect(cardOf(element, 2).querySelector("[data-agent-identity]").textContent).not.toContain("waiting for its tests");
});

test("a profile's name shows with a capital letter", async () => {
    const element = await drawn([{...FACTS[0], profile: "auditor"}]);
    expect(cardOf(element, 2).querySelector("[data-agent-title]").textContent).toBe("Auditor");
});

test("a running worker's card names the command it runs", async () => {
    const worker = {id: 4, session: "s-worker", program: "claude", role: "worker", ended_at: null};
    const lines = {"agent list": page([worker]), "agent running": page([worker]), "usage agents --closed": page([]), "usage tool --agent 4": {ok: true, value: {tool: "Bash make test"}}};
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context(lines));
    await vi.waitFor(() => expect(element.querySelector("[data-agent-command]").textContent.trim()).toBe("Bash make test"));
});

test("the running list has no show more button", async () => {
    const element = await drawn();
    expect(element.querySelector("[data-row-list-more]")).toBeNull();
});

test("an agent with no tasks has no tasks control", async () => {
    const element = await drawn();
    expect(element.querySelector("[data-agent-tasks]")).toBeNull();
});

test("the agents window searches the session, program, role, profile and name", async () => {
    const element = await drawn();
    await pick(element, "All");
    const search = element.querySelector("[data-search-input]");
    search.value = "codex";
    search.dispatchEvent(new Event("input"));
    await settle();
    expect(cardOf(element, 1)).not.toBeNull();
    expect(cardOf(element, 2)).toBeNull();
    search.value = "curie";
    search.dispatchEvent(new Event("input"));
    await settle();
    expect(cardOf(element, 3)).not.toBeNull();
    search.value = "nobody";
    search.dispatchEvent(new Event("input"));
    await settle();
    expect(element.textContent).toContain("Nothing matches");
});

test("an age reads a row's ISO time as well as epoch seconds", () => {
    const hourAgo = new Date(Date.now() - 3_600_000);
    expect(ago(hourAgo.toISOString())).toBe("1h ago");
    expect(age(hourAgo.getTime() / 1000)).toBe("1h");
});

const listed = (element) => [...element.querySelectorAll("[data-agent-open]")].map((card) => Number(card.dataset.agentOpen));

test("switching off a state hides the agents in it and the window says how many it hides", async () => {
    const element = await drawn(FACTS, {waiting: false});
    expect(listed(element)).toEqual([2]);
    expect(element.querySelector("[data-agents-hidden]").textContent).toBe("Hidden: 1 blocked");
});

test("switching off the working state hides the working agent", async () => {
    const element = await drawn(FACTS, {working: false});
    expect(listed(element)).toEqual([3]);
    expect(element.querySelector("[data-agents-hidden]").textContent).toBe("Hidden: 1 working");
});

test("switching off the not running state hides an ended agent under All", async () => {
    const element = await drawn(FACTS, {stopped: false});
    await pick(element, "All");
    expect(listed(element)).toEqual([2, 3]);
    expect(element.querySelector("[data-agents-hidden]").textContent).toBe("Hidden: 1 not running");
});

test("switching off a kind hides the agents of it", async () => {
    const element = await drawn(FACTS, {subagent: false});
    expect(listed(element)).toEqual([2]);
    expect(element.querySelector("[data-agents-hidden]").textContent).toBe("Hidden: 1 helper");
    const environments = await drawn(FACTS, {environment: false});
    expect(listed(environments)).toEqual([3]);
    expect(environments.querySelector("[data-agents-hidden]").textContent).toBe("Hidden: 1 environment agent");
});

test("show every agent overrides the switches that are off", async () => {
    const element = await drawn(FACTS, {working: false, subagent: false, every: true});
    expect(listed(element)).toEqual([2, 3]);
    expect(element.querySelector("[data-agents-hidden]")).toBeNull();
});

test("agents are ordered by number, by state and by last active", async () => {
    const rows = [
        {id: 5, session: "s-5", program: "claude", role: "worker", ended_at: null, updated_at: "2026-11-01T10:00:00Z"},
        {id: 6, session: "s-6", program: "claude", role: "worker", ended_at: null, updated_at: "2026-11-01T09:00:00Z"},
        {id: 7, session: "s-7", program: "claude", role: "worker", ended_at: null, updated_at: "2026-11-01T11:00:00Z"},
    ];
    const facts = [{...FACTS[0], id: 5, state: "blocked"}, {...FACTS[0], id: 6}, {...FACTS[0], id: 7}];
    const drawnIn = (order) => mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, {
        ...context({"agent list": page(rows), "agent running": page(rows), "usage agents --closed": page(facts)}),
        option: (key) => ({value: {...DEFAULT_OPTIONS, order}[key]}),
    });
    expect(listed(await drawnIn("number"))).toEqual([6, 7, 5]);
    expect(listed(await drawnIn("state"))).toEqual([7, 6, 5]);
    expect(listed(await drawnIn("active"))).toEqual([7, 6, 5]);
});
