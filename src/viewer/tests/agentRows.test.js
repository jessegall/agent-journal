import {afterEach, expect, test, vi} from "vitest";
import {context, mounted, page, pickButton, settle} from "./support/windowContext.js";
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
// the pane menu's option as the window declares it
const DEFAULT_OPTIONS = {order: "number"};
const TABS = [
    {key: "tasks", label: "Tasks", read: "usage agents", count_field: "tasks"},
    {key: "transcript", label: "Transcript", read: "agent transcript", count_field: ""},
    {key: "file-feed", label: "File feed", read: "file-edit list", count_field: ""},
];
const EDIT = {id: 5, path: "src/cart.py", edit_type: "edit", added: 1, removed: 0, created_at: "2026-11-01T10:00:00Z", rows: JSON.stringify([{line_type: "add", line: 4, text: "total = 0"}])};
const answers = {
    "agent list": page(AGENTS),
    "agent running": page(AGENTS.filter((row) => !row.ended_at)),
    "agent transcript 3": page([{id: 1, author: "user", text: "Read the cart"}]),
    "file-edit list --agent 3": page([EDIT]),
};
const window = (facts = FACTS, options = {}) => ({
    ...context({...answers, "usage agents --closed": page(facts)}),
    tabs: TABS,
    option: (key) => ({value: {...DEFAULT_OPTIONS, ...options}[key]}),
});
const drawn = (facts, options) => mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, window(facts, options));
const cardOf = (element, id) => element.querySelector(`[data-agent-open="${id}"]`);

test("the agents window filters on running or closed", async () => {
    const element = await drawn();
    expect(cardOf(element, 2)).not.toBeNull();
    expect(cardOf(element, 1)).toBeNull();
    await pickButton(element, "Closed");
    expect(cardOf(element, 2)).toBeNull();
    expect(cardOf(element, 1)).not.toBeNull();
    await pickButton(element, "All");
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

test("a click opens the card on its instruction with no usage line or Inspect button of its own, and a second closes it", async () => {
    const element = await drawn();
    document.body.append(element);
    const card = cardOf(element, 3);
    card.click();
    await settle();
    expect(card.querySelector("[data-agent-card-usage]")).toBeNull();
    expect(card.querySelector("[data-agent-inspect]")).toBeNull();
    expect(card.querySelector("[data-agent-instruction]").textContent).toBe("Read the cart\nand report");
    card.click();
    await settle();
    expect(card.querySelector("[data-agent-instruction]")).toBeNull();
});

test("an opened card has the tabs Tasks, Transcript and File feed, each read only when chosen", async () => {
    const reads = [];
    const held = window();
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, {...held, reads, read: (line) => (reads.push(line), held.read(line))});
    document.body.append(element);
    const card = cardOf(element, 3);
    card.click();
    await settle();
    expect([...card.querySelectorAll("[data-tab]")].map((tab) => tab.dataset.tab)).toEqual(["tasks", "transcript", "file-feed"]);
    expect(card.querySelector("[data-tab=tasks]").classList.contains("on")).toBe(true);
    expect(reads).not.toContain("agent transcript 3");
    card.querySelector("[data-tab=transcript]").click();
    await settle();
    expect(card.querySelector("[data-agent-tab-body]").textContent).toContain("Read the cart");
    expect(card.querySelector("[data-agent-instruction]")).toBeNull();
    card.querySelector("[data-tab=file-feed]").click();
    await settle();
    expect(reads.some((line) => line.startsWith("file-edit list --agent 3"))).toBe(true);
    expect(card.querySelector("[data-agent-tab-body]").textContent).toContain("cart.py");
    card.querySelector("[data-tab=tasks]").click();
    await settle();
    expect(card.querySelector("[data-agent-instruction]").textContent).toBe("Read the cart\nand report");
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
    const labels = [...card.querySelectorAll("[data-agent-section]")].map((section) => `${section.querySelector(".fold-label").textContent.trim()} ${section.querySelector(".fold-count").textContent.trim()}`);
    expect(labels).toEqual(["Started 1", "Open 1", "Completed 1"]);
    let rows = [...card.querySelectorAll("[data-agent-delegated]")];
    expect(rows.map((row) => row.dataset.agentDelegated)).toEqual(["12", "13"]);
    expect(rows[0].querySelector(".ring").classList.contains("started")).toBe(true);
    rows[0].click();
    await settle();
    expect(card.getAttribute("aria-expanded")).toBe("true");
});

test("the Completed section of the Tasks tab is folded until a click opens it", async () => {
    const element = await drawn([{...FACTS[0], tasks: TASKS}]);
    const card = cardOf(element, 2);
    card.click();
    await settle();
    const completed = card.querySelector("[data-agent-section=completed]");
    expect(completed.querySelector("[data-agent-delegated]")).toBeNull();
    completed.querySelector(".fold-head").click();
    await settle();
    expect([...card.querySelectorAll("[data-agent-delegated]")].map((row) => row.dataset.agentDelegated)).toEqual(["12", "13", "11"]);
    completed.querySelector(".fold-head").click();
    await settle();
    expect(completed.querySelector("[data-agent-delegated]")).toBeNull();
});

test("a worker with a task in testing and none started says it waits for its tests", async () => {
    const element = await drawn([{...FACTS[0], tasks: [{id: 11, title: "Fix the cart", state: "testing"}, {id: 13, title: "Print the receipt", state: "open"}]}]);
    expect(cardOf(element, 2).querySelector("[data-agent-identity]").textContent).not.toContain("waiting");
    expect(cardOf(element, 2).querySelector(".agent-dot").dataset.state).toBe("waiting");
});

test("a worker with a started task does not say it waits for its tests", async () => {
    const element = await drawn([{...FACTS[0], tasks: TASKS}]);
    expect(cardOf(element, 2).querySelector("[data-agent-identity]").textContent).not.toContain("Waiting: tests");
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

test("a running subagent's card names the command it runs", async () => {
    const subagent = {id: 6, session: "s-1", program: "claude", role: "subagent", ended_at: null};
    const lines = {"agent list": page([subagent]), "agent running": page([subagent]), "usage agents --closed": page([]), "usage tool --agent 6": {ok: true, value: {tool: "Read src/cart.py", note: ""}}};
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context(lines));
    await vi.waitFor(() => expect(element.querySelector("[data-agent-command]").textContent.trim()).toBe("Read src/cart.py"));
});

test("a running subagent that ran no command says so plainly", async () => {
    const subagent = {id: 6, session: "s-1", program: "claude", role: "subagent", ended_at: null};
    const lines = {"agent list": page([subagent]), "agent running": page([subagent]), "usage agents --closed": page([]), "usage tool --agent 6": {ok: true, value: {tool: "", note: "has run no command yet"}}};
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context(lines));
    await vi.waitFor(() => expect(element.querySelector("[data-agent-command]").textContent.trim()).toBe("has run no command yet"));
});

test("an ended subagent and the main agent show no command line", async () => {
    const ended = {id: 6, session: "s-1", program: "claude", role: "subagent", ended_at: "2026-11-01T10:00:00Z"};
    const main = {id: 1, session: "s-main", program: "claude", role: "main", ended_at: null};
    const lines = {"agent list": page([ended, main]), "agent running": page([main]), "usage agents --closed": page([])};
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context(lines));
    await settle();
    expect(element.querySelector("[data-agent-command]")).toBeNull();
});

test("a waiting worker's command line says it waits for its tests", async () => {
    const worker = {id: 4, session: "s-worker", program: "claude", role: "worker", ended_at: null};
    const tasks = [{id: 11, title: "Fix the cart", state: "testing"}, {id: 13, title: "Print the receipt", state: "open"}];
    const lines = {"agent list": page([worker]), "agent running": page([worker]), "usage agents --closed": page([{id: 4, tasks}]), "usage tool --agent 4": {ok: true, value: {tool: "Bash make test"}}};
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context(lines));
    await vi.waitFor(() => expect(element.querySelector("[data-agent-command]").textContent.trim()).toBe("Waiting: tests"));
});

test("a worker's card shows its completed tasks per hour", async () => {
    const started = new Date(Date.now() - 2 * 3600000).toISOString();
    const worker = {id: 4, session: "s-worker", program: "claude", role: "worker", ended_at: null, created_at: started};
    const tasks = [{id: 11, title: "Fix the cart", state: "completed"}, {id: 12, title: "Add the totals", state: "completed"}, {id: 13, title: "Print", state: "started"}];
    const lines = {"agent list": page([worker]), "agent running": page([worker]), "usage agents --closed": page([{id: 4, tasks}]), "usage tool --agent 4": {ok: true, value: {tool: ""}}};
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context(lines));
    expect(element.querySelector("[data-agent-pace]").textContent.trim()).toBe("1/h");
});

test("a worker's opened card shows its context and cost", async () => {
    const worker = {id: 4, session: "s-worker", program: "claude", role: "worker", ended_at: null};
    const lines = {"agent list": page([worker]), "agent running": page([worker]), "usage agents --closed": page([{id: 4, tasks: [], context_percent: 20, cost_dollars: 1.5}]), "usage tool --agent 4": {ok: true, value: {tool: ""}}};
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context(lines));
    document.body.append(element);
    cardOf(element, 4).click();
    await settle();
    expect(cardOf(element, 4).querySelector("[data-agent-card-usage]").textContent.trim()).toBe("Context 20% · $1.50");
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
    await pickButton(element, "All");
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

// message 101362: nothing is ever hidden, even for a pane that saved a switch off in an older version
test("a switch saved off hides no agent, and no line speaks of hidden agents", async () => {
    const element = await drawn(FACTS, {subagent: false, waiting: false, working: false});
    expect(listed(element)).toEqual([2, 3]);
    expect(element.textContent).not.toContain("Hidden");
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
