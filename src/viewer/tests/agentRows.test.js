import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {afterEach, expect, test, vi} from "vitest";
import {context, mounted, page, pickButton, settleTransition as settle} from "./support/codingWindowContext.js";
import {h} from "vue";
import {TimeAgo} from "@journal/window-kit";
import AgentCard from "../../core/modules/agents/web/src/AgentCard.vue";
import AgentRows from "../../core/modules/agents/web/src/AgentRows.vue";
import Agents from "../../core/modules/agents/web/src/agents.js";
import Helpers from "../../core/modules/agents/web/src/helpers.js";
import TranscriptRows from "../../core/modules/agents/web/src/TranscriptRows.vue";
import {age, ago} from "../src/format/time.js";
import {agentFilterOptions} from "./support/agentFilterOptions.js";

vi.stubGlobal("matchMedia", () => ({matches: true}));

vi.mock("../kit/loadWindowComponent.js", () => ({loadWindowComponent: (path) => path.endsWith("terminal.js") ? import("../../suites/coding/web/src/terminal.js") : import("../../suites/coding/web/src/agent-file-edits.js")}));

vi.stubGlobal("ResizeObserver", class {
    observe() {}

    disconnect() {}
});

afterEach(() => (document.body.innerHTML = ""));

const AGENTS = [
    {id: 2, session: "s-live", program: "claude", role: "main", state: "running", ended_at: null},
    {id: 3, session: "s-sub", program: "claude", role: "helper", state: "running", ended_at: null},
    {id: 1, session: "s-old", program: "codex", role: "worker", state: "retired", ended_at: "2026-11-01T10:00:00Z"},
];

const FACTS = [
    {id: 2, model: "opus", context_percent: 62, cost_dollars: 1.2, task_id: 7, task_title: "Fix the cart", tasks: [], state: "", profile: "", given_name: "", instruction: ""},
    {id: 3, model: "sonnet", effort: "high", context_percent: null, cost_dollars: 0, task_id: null, task_title: "", tasks: [], state: "blocked", profile: "journal-researcher", profile_title: "Researcher", given_name: "Madame Curie", instruction: "Read the cart\nand report"},
];
// the pane menu's option as the window declares it
const DEFAULT_OPTIONS = {order: "number"};
const TABS = [
    {key: "tasks", label: "Tasks", read: "usage agents", count_field: "tasks"},
    {key: "reports", label: "Reports", read: "message agent-reports", count_field: "reports"},
    {key: "transcript", label: "Transcript", read: "agent transcript", count_field: ""},
    {key: "file-feed", label: "File feed", read: "file-edit list", count_field: "", component: "/modules/journal.suites.coding/agent-file-edits.js"},
    {key: "terminal", label: "Terminal", read: "hook-call feed", count_field: "", component: "/modules/journal.suites.coding/terminal.js"},
];
const EDIT = {id: 5, path: "src/cart.py", edit_type: "edit", added: 1, removed: 0, created_at: "2026-11-01T10:00:00Z", rows: JSON.stringify([{line_type: "add", line: 4, text: "total = 0"}])};
const answers = {
    "agent list": page(AGENTS),
    "agent running": page(AGENTS.filter((row) => !row.ended_at)),
    "agent transcript 3": page([{id: 1, author: "user", text: "Read the cart"}]),
    "file-edit list --agent 3": page([EDIT]),
};
const WORKERS = AGENTS.map((row) => (row.id === 3 ? {...row, role: "worker"} : row));
const window = (facts = FACTS, options = {}, agents = AGENTS) => ({
    ...context({
        "agent cards --options": agentFilterOptions,
        "agent list --show running": page(agents.filter((row) => !row.ended_at)),
        "agent list --show idle": page(agents.filter((row) => row.ended_at && row.role === "helper")),
        "agent list --show retired": page(agents.filter((row) => row.ended_at && row.role !== "helper")),
        "agent list --show all": page(agents),
        ...answers, "usage agents --closed": page(facts),
    }),
    tabs: TABS,
    option: (key) => ({value: {...DEFAULT_OPTIONS, ...options}[key]}),
});
const drawn = (facts, options, agents) => mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, window(facts, options, agents));
const cardOf = (element, id) => element.querySelector(`[data-agent-open="${id}"]`);

test("the agents window filters on working, idle, retired or all from the server", async () => {
    const element = await drawn();
    expect([...element.querySelectorAll('.segmented button')].map((button) => button.textContent.trim())).toEqual(["Working", "Idle", "Retired", "All"]);
    expect(cardOf(element, 2)).not.toBeNull();
    expect(cardOf(element, 1)).toBeNull();
    await pickButton(element, "Idle");
    expect(cardOf(element, 1)).toBeNull();
    await pickButton(element, "Retired");
    expect(cardOf(element, 2)).toBeNull();
    expect(cardOf(element, 1)).not.toBeNull();
    await pickButton(element, "All");
    expect(cardOf(element, 2)).not.toBeNull();
    expect(cardOf(element, 1)).not.toBeNull();
});

test("an idle helper's card opens its report", async () => {
    const helper = {...AGENTS[1], access: "read-only", state: "idle", ended_at: "2026-11-02T10:00:00Z"};
    const held = window(FACTS, {}, [helper]);
    const read = held.read;
    held.read = (line) => line.startsWith("agent transcript 3") ? Promise.resolve(page([{id: 1, author: "assistant", text: "The review is complete"}])) : read(line);
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, held);
    document.body.append(element);
    await pickButton(element, "Idle");
    cardOf(element, helper.id).click();
    await settle();
    expect(element.textContent).toContain("The review is complete");
});

test("a closed card shows the profile, name and status without open-card details", async () => {
    const element = await drawn();
    const card = cardOf(element, 3);
    expect(card.querySelector("[data-agent-title]").textContent).toBe("Researcher");
    expect(card.querySelector("[data-agent-name]").textContent).toBe("Madame Curie");
    expect(card.querySelector("[data-agent-identity]").textContent).toBe("claude · sonnet · high");
    expect(card.querySelector("[data-agent-identity]").parentElement.previousElementSibling.classList.contains("agent-head")).toBe(true);
    expect(card.querySelector(".agent-dot").dataset.state).toBe("blocked");
    expect(card.textContent).not.toContain("Running");
    expect(card.querySelector("[data-agent-instruction]")).toBeNull();
    expect(card.title).toBe("");
    card.click();
    await settle();
    expect(cardOf(element, 3).querySelector("[data-agent-identity]").textContent).toBe("");
});

test("closed cards use the shared agent facts read for their identity", async () => {
    const held = window(FACTS);
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, held);
    expect(cardOf(element, 2).querySelector("[data-agent-identity]").textContent).toBe("claude · opus");
    expect(cardOf(element, 3).querySelector("[data-agent-identity]").textContent).toBe("claude · sonnet · high");
    expect(held.reads.filter((line) => line.startsWith("usage agents --closed"))).toHaveLength(1);
    expect(held.reads.filter((line) => line.startsWith("usage tool --agent"))).toHaveLength(0);
});

test("worker identity changes from list details to its number when opened", async () => {
    const row = {id: 4, session: "s-worker", program: "codex", role: "worker", ended_at: null};
    const facts = {model: "gpt-6.1-sol", effort: "high", given_name: "Mary Shelley", last_activity: "2026-11-01T10:00:00Z", job_enabled: true, task_title: "Window converter", tasks: []};
    const element = await mounted({render: () => h(AgentCard, {row, facts})}, context({}));
    const card = element.querySelector("[data-agent-open]");
    const identity = card.querySelector("[data-agent-identity]");
    expect(identity.textContent).toBe("codex · gpt-6.1-sol · high · worker 4");
    expect(identity.parentElement.previousElementSibling.classList.contains("agent-head")).toBe(true);
    expect(identity.parentElement.nextElementSibling.querySelector("[data-agent-job]").textContent).toBe("Window converter");
    const opened = await mounted({render: () => h(AgentCard, {row, facts, open: true})}, context({}));
    expect(opened.querySelector("[data-agent-identity]").textContent).toBe("worker 4");
    expect(opened.querySelector("[data-agent-open]").title).toBe("");
    expect(opened.querySelector("[data-agent-last-heard]").parentElement).toBe(opened.querySelector("[data-agent-identity]").parentElement);
    expect(opened.querySelector("[data-information-bar]").previousElementSibling).toBe(opened.querySelector("[data-agent-identity]").parentElement);
});

test("reports tab lists messages in order and offers their message links", async () => {
    const row = {...AGENTS[1], role: "worker"};
    const held = {...context({"message agent-reports --agent 3": page([{id: 9, text: "Latest report"}, {id: 4, text: "Earlier report"}])}), tabs: TABS};
    const element = await mounted({render: () => h(AgentCard, {row, facts: {tasks: [], job_returned: "Latest report"}, open: true})}, held);
    expect(element.querySelector("[data-agent-report]")).toBeNull();
    expect(element.querySelector("[data-agent-send-message]")).toBeNull();
    const tab = element.querySelector("[data-tab=reports]");
    expect(tab.textContent).toContain("2");
    tab.click();
    await settle();
    expect([...element.querySelectorAll("[data-agent-tab-body] [data-peek]")].map((item) => [item.dataset.peek, item.textContent])).toEqual([["messages:9", "Latest report"], ["messages:4", "Earlier report"]]);
});

test("a click opens the card on its instruction with no usage line or Inspect button of its own, and a second closes it", async () => {
    const element = await drawn(FACTS, {}, WORKERS);
    document.body.append(element);
    let card = cardOf(element, 3);
    card.click();
    await settle();
    card = cardOf(element, 3);
    expect(card.querySelector("[data-agent-card-usage]")).toBeNull();
    expect(card.querySelector("[data-agent-inspect]")).toBeNull();
    expect(card.querySelector("[data-agent-instruction]").textContent).toBe("Read the cart\nand report");
    card.querySelector(".agent-back").click();
    await settle();
    expect(cardOf(element, 3).querySelector("[data-agent-instruction]")).toBeNull();
});

test("an opened card has task, report, transcript, file and terminal tabs", async () => {
    const reads = [];
    const held = window(FACTS, {}, WORKERS);
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, {...held, reads, read: (line) => (reads.push(line), held.read(line))});
    document.body.append(element);
    let card = cardOf(element, 3);
    card.click();
    await settle();
    card = cardOf(element, 3);
    expect([...card.querySelectorAll("[data-tab]")].map((tab) => tab.dataset.tab)).toEqual(["tasks", "transcript", "terminal", "file-feed", "reports"]);
    expect(card.querySelector("[data-tab=tasks]").classList.contains("on")).toBe(true);
    expect(reads).not.toContain("agent transcript 3");
    card.querySelector("[data-tab=transcript]").click();
    await settle();
    expect(card.querySelector("[data-agent-tab-body]").textContent).toContain("Read the cart");
    expect(card.querySelector("[data-agent-instruction]")).toBeNull();
    card.querySelector("[data-tab=file-feed]").click();
    await settle();
    await vi.waitFor(() => expect(reads.some((line) => line.startsWith("file-edit list --agent 3"))).toBe(true));
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
    let card = cardOf(element, 2);
    expect(card.querySelector("[data-agent-tasks]")).toBeNull();
    expect(card.querySelector("[data-agent-delegated]")).toBeNull();
    card.click();
    await settle();
    card = cardOf(element, 2);
    expect(card.querySelector("[data-agent-tasks]").textContent.trim()).toBe("1 of 3 tasks");
    const labels = [...card.querySelectorAll("[data-agent-section]")].map((section) => `${section.querySelector(".fold-label").textContent.trim()} ${section.querySelector(".fold-count").textContent.trim()}`);
    expect(labels).toEqual(["Started 1", "Blocked 0", "Open 1", "Completed 1"]);
    let rows = [...card.querySelectorAll("[data-agent-delegated]")];
    expect(rows.map((row) => row.dataset.agentDelegated)).toEqual(["12", "13"]);
    expect(rows[0].querySelector(".ring").classList.contains("started")).toBe(true);
    rows[0].click();
    await settle();
    expect(card.getAttribute("aria-expanded")).toBe("true");
});

test("a task of a plan shows the plan after its title and a task of no plan shows nothing there", async () => {
    const element = await drawn([{...FACTS[0], tasks: [{id: 12, title: "Add the totals", state: "started", plan_id: 7, plan_title: "Cart plan"}, {id: 13, title: "Print the receipt", state: "open", plan_id: null, plan_title: null}]}]);
    cardOf(element, 2).click();
    await settle();
    const [planned, alone] = cardOf(element, 2).querySelectorAll("[data-agent-delegated]");
    expect(planned.querySelector("[data-agent-task-plan]").textContent).toBe("Plan 7: Cart plan");
    expect(alone.querySelector("[data-agent-task-plan]")).toBeNull();
});

test("the Completed section of the Tasks tab is folded until a click opens it", async () => {
    const element = await drawn([{...FACTS[0], tasks: TASKS}]);
    let card = cardOf(element, 2);
    card.click();
    await settle();
    card = cardOf(element, 2);
    const completed = card.querySelector("[data-agent-section=completed]");
    expect(completed.querySelector("[data-agent-delegated]")).toBeNull();
    completed.querySelector(".fold-head").click();
    await settle();
    expect([...card.querySelectorAll("[data-agent-delegated]")].map((row) => row.dataset.agentDelegated)).toEqual(["12", "13", "11"]);
    completed.querySelector(".fold-head").click();
    await settle();
    expect(completed.querySelector("[data-agent-delegated]")).toBeNull();
});

test("a task in testing does not invent a waiting reason without the server's reason", async () => {
    const element = await drawn([{...FACTS[0], tasks: [{id: 11, title: "Fix the cart", state: "testing"}, {id: 13, title: "Print the receipt", state: "open"}]}]);
    expect(cardOf(element, 2).textContent).not.toContain("Waiting:");
    expect(cardOf(element, 2).querySelector(".agent-dot").dataset.state).toBe("running");
    expect(cardOf(element, 2).querySelector("[data-agent-waiting]")).toBeNull();
});

test("a worker with a started task does not say it waits for its tests", async () => {
    const element = await drawn([{...FACTS[0], tasks: TASKS}]);
    expect(cardOf(element, 2).textContent).not.toContain("Waiting: tests");
});

test("a profile title is shown on its agent card", async () => {
    const element = await drawn([{...FACTS[0], profile: "journal-worker", profile_title: "Worker"}]);
    expect(cardOf(element, 2).querySelector("[data-agent-title]").textContent).toBe("Worker");
});

test("a profile without a title shows its name", async () => {
    const element = await drawn([{...FACTS[0], profile: "auditor"}]);
    expect(cardOf(element, 2).querySelector("[data-agent-title]").textContent).toBe("auditor");
});

test("a running worker's card names the command it runs", async () => {
    const worker = {id: 4, session: "s-worker", program: "claude", role: "worker", ended_at: null};
    const lines = {"agent list": page([worker]), "agent running": page([worker]), "usage agents --closed": page([]), "usage tool --agent 4": {ok: true, value: {tool: "Bash make test"}}};
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context(lines));
    expect(element.querySelector("[data-agent-command]")).toBeNull();
    cardOf(element, 4).click();
    await settle();
    await vi.waitFor(() => expect(element.querySelector("[data-agent-command]").textContent.trim()).toBe("Bash make test"));
});

test("a running helper's card names the command it runs", async () => {
    const helper = {id: 6, session: "s-1", program: "claude", role: "helper", access: "read-only", ended_at: null};
    const lines = {"agent list": page([helper]), "agent running": page([helper]), "usage agents --closed": page([]), "usage tool --agent 6": {ok: true, value: {tool: "Read src/cart.py", note: ""}}};
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context(lines));
    expect(element.querySelector("[data-agent-command]")).toBeNull();
    cardOf(element, 6).click();
    await settle();
    await vi.waitFor(() => expect(element.querySelector("[data-agent-command]").textContent.trim()).toBe("Read src/cart.py"));
});

test("an agent that has just ended reads just now, never now ago", async () => {
    const ended = {id: 6, session: "s-1", program: "claude", role: "helper", ended_at: new Date().toISOString()};
    const element = await mounted({render: () => h(AgentCard, {row: ended})}, context({}));
    expect(element.querySelector(".agent-time").textContent).toBe("Idle, just now");
});

test("an open helper has transcript and terminal tabs with its instruction folded", async () => {
    const helper = {id: 6, session: "s-1", program: "claude", role: "helper", access: "read-only", ended_at: null};
    const lines = {"usage tool --agent 6": {ok: true, value: {tool: "", note: ""}}, "agent transcript 6": page([])};
    const element = await mounted({render: () => h(AgentCard, {row: helper, facts: {instruction: "Read the cart"}, open: true})}, {...context(lines), tabs: TABS});
    expect([...element.querySelectorAll("[data-tab]")].map((tab) => tab.dataset.tab)).toEqual(["transcript", "terminal", "reports"]);
    expect(element.querySelector('[data-agent-tab-body="transcript"]')).not.toBeNull();
    expect(element.querySelector("[data-agent-section='instruction']").textContent).toContain("Instruction");
    expect(element.querySelector("[data-agent-instruction]")).toBeNull();
});

test("an ended helper without a job says none is recorded", async () => {
    const helper = {id: 6, session: "s-1", program: "claude", role: "helper", access: "read-only", ended_at: "2026-11-02T10:00:00Z"};
    const lines = {"agent transcript 6": page([])};
    const element = await mounted({render: () => h(AgentCard, {row: helper, facts: {instruction: ""}, open: true})}, {...context(lines), tabs: TABS});
    expect(element.querySelector("[data-agent-no-job]").textContent).toBe("No job recorded");
    expect(element.querySelector('[data-agent-tab-body="transcript"]')).not.toBeNull();
});

test("an open worker's card keeps its tabs", async () => {
    const worker = {id: 4, session: "s-worker", program: "claude", role: "worker", ended_at: null};
    const lines = {"usage tool --agent 4": {ok: true, value: {tool: "", note: ""}}};
    const element = await mounted({render: () => h(AgentCard, {row: worker, facts: {}, open: true})}, context(lines));
    expect(element.querySelector("[data-inner-tabs]")).not.toBeNull();
});

test("an agent's card shows its effort beside its model", async () => {
    const worker = {id: 4, session: "s-worker", program: "codex", role: "worker", ended_at: null};
    const lines = {"usage tool --agent 4": {ok: true, value: {tool: "", note: ""}}};
    const element = await mounted({render: () => h(AgentCard, {row: worker, facts: {model: "gpt-6.1-sol", effort: "medium"}})}, context(lines));
    expect(element.querySelector("[data-agent-open]").title).toContain("gpt-6.1-sol · medium");
});

test("a worker that stopped with tasks left shows under Running as waiting, not closed", async () => {
    const stopped = {id: 4, session: "s-4", program: "codex", role: "worker", ended_at: "2026-11-03T13:35:28Z"};
    const facts = [{id: 4, tasks: [{id: 11, title: "Fix the cart", state: "open"}]}];
    const lines = {"agent list": page([stopped]), "agent running": page([]), "usage agents --closed": page(facts), "usage tool --agent 4": {ok: true, value: {tool: "", note: ""}}};
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context(lines));
    await vi.waitFor(() => expect(element.querySelector("[data-agent-stopped]")).not.toBeNull());
    expect(element.querySelector("[data-agent-open='4'] .agent-dot").dataset.state).toBe("waiting");
    expect(element.querySelector("[data-agent-leave]")).toBeNull();
});

test("a transcript row reads author, words, then its time at the end", async () => {
    const lines = {"agent transcript 6": page([{id: 1, author: "worker", text: "I read the guidance", time: "2026-11-03T13:19:21Z"}])};
    const element = await mounted({render: () => h(TranscriptRows, {line: "agent transcript 6"})}, context(lines));
    await vi.waitFor(() => expect(element.querySelector("[data-row-time]")).not.toBeNull());
    expect(element.querySelector(".text").nextElementSibling).toBe(element.querySelector("[data-row-time]"));
    expect(element.querySelector("[data-row-time]").nextElementSibling).toBeNull();
    expect(element.querySelector(".author").nextElementSibling).toBe(element.querySelector(".text"));
});

test("how long ago something happened reads the same from a row's time and from epoch seconds", async () => {
    const fourMinutes = Date.now() / 1000 - 240;
    const element = await mounted({render: () => [h(TimeAgo, {at: fourMinutes}), h(TimeAgo, {at: new Date(fourMinutes * 1000).toISOString()})]}, context({}));
    expect([...element.querySelectorAll("[data-time-ago]")].map((time) => time.textContent)).toEqual(["4m ago", "4m ago"]);
});

test("a running helper that ran no command says so plainly", async () => {
    const helper = {id: 6, session: "s-1", program: "claude", role: "helper", ended_at: null};
    const lines = {"agent list": page([helper]), "agent running": page([helper]), "usage agents --closed": page([]), "usage tool --agent 6": {ok: true, value: {tool: "", note: "has run no command yet"}}};
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context(lines));
    cardOf(element, 6).click();
    await settle();
    await vi.waitFor(() => expect(element.querySelector("[data-agent-command]").textContent.trim()).toBe("has run no command yet"));
});

test("an ended helper and the main agent show no command line", async () => {
    const ended = {id: 6, session: "s-1", program: "claude", role: "helper", ended_at: "2026-11-01T10:00:00Z"};
    const main = {id: 1, session: "s-main", program: "claude", role: "main", ended_at: null};
    const lines = {"agent list": page([ended, main]), "agent running": page([main]), "usage agents --closed": page([])};
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context(lines));
    await settle();
    expect(element.querySelector("[data-agent-command]")).toBeNull();
});

test("a waiting worker's command line says it waits for its tests", async () => {
    const worker = {id: 4, session: "s-worker", program: "claude", role: "worker", ended_at: null};
    const tasks = [{id: 11, title: "Fix the cart", state: "testing"}, {id: 13, title: "Print the receipt", state: "open"}];
    const lines = {"agent list": page([worker]), "agent running": page([worker]), "usage agents --closed": page([{id: 4, tasks}]), "worker waits": page([{agent_id: 4, reason: "tests"}]), "usage tool --agent 4": {ok: true, value: {tool: "Bash make test"}}};
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context(lines));
    await vi.waitFor(() => expect(element.querySelector("[data-agent-waiting]").textContent.trim()).toBe("Waiting: tests"));
});

test.each(["merge", "proof check", "tests", "a job"])("a worker card shows the server's waiting reason: %s", async (reason) => {
    const worker = {id: 4, session: "s-worker", program: "claude", role: "worker", ended_at: "2026-11-03T13:35:28Z"};
    const lines = {"agent list": page([worker]), "agent running": page([]), "usage agents --closed": page([{id: 4, tasks: []}]), "worker waits": page([{agent_id: 4, reason}])};
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context(lines));
    await vi.waitFor(() => expect(element.querySelector("[data-agent-waiting]")?.textContent.trim()).toBe(`Waiting: ${reason}`));
    expect(element.querySelector(".agent-dot").dataset.state).toBe("waiting");
});

test("one read supplies every worker's short reason without commands or paths", async () => {
    const reasons = ["tests", "proof check", "merge", "a job"];
    const workers = reasons.map((reason, index) => ({id: index + 1, session: `worker-${index}`, program: "claude", role: "worker", ended_at: null}));
    const lines = {"agent list": page(workers), "agent running": page(workers), "usage agents --closed": page([]),
        "worker waits": page(reasons.map((reason, index) => ({agent_id: index + 1, reason}))),
        "usage tool": {ok: true, value: {tool: "pytest /tmp/private_tests.py", wait_target: "/tmp/private_tests.py and another command"}}};
    const window = context(lines);
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, window);
    await vi.waitFor(() => expect(element.querySelectorAll("[data-agent-waiting]")).toHaveLength(4));
    expect([...element.querySelectorAll("[data-agent-waiting]")].map((line) => line.textContent.trim())).toEqual(reasons.map((reason) => `Waiting: ${reason}`));
    expect(window.reads.filter((line) => line === "worker waits")).toHaveLength(1);
    for (const line of element.querySelectorAll("[data-agent-command]")) {
        expect(line.textContent).not.toContain("pytest");
        expect(line.textContent).not.toContain("/tmp/");
    }
});

test("a worker's card shows its completed tasks per hour", async () => {
    const started = new Date(Date.now() - 2 * 3600000).toISOString();
    const worker = {id: 4, session: "s-worker", program: "claude", role: "worker", ended_at: null, created_at: started};
    const tasks = [{id: 11, title: "Fix the cart", state: "completed"}, {id: 12, title: "Add the totals", state: "completed"}, {id: 13, title: "Print", state: "started"}];
    const lines = {"agent list": page([worker]), "agent running": page([worker]), "usage agents --closed": page([{id: 4, tasks}]), "usage tool --agent 4": {ok: true, value: {tool: ""}}};
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context(lines));
    cardOf(element, 4).click();
    await settle();
    expect(element.querySelector("[data-agent-pace]").textContent.trim()).toBe("1 per hour");
    expect(element.querySelector("[data-agent-tasks]").parentElement.querySelector("[data-agent-pace]")).toBeNull();
});

test("worker totals and pace use its current worktree instead of session history", async () => {
    const started = new Date(Date.now() - 1.5 * 3600000).toISOString();
    const worker = {id: 4, session: "s-worker", program: "claude", role: "worker", ended_at: null,
        created_at: new Date(Date.now() - 24 * 3600000).toISOString(), process_started_at: new Date(Date.now() - 3600000).toISOString()};
    const tasks = [{id: 11, title: "Old task", state: "completed"}, {id: 12, title: "Old total", state: "completed"}, {id: 13, title: "Current job", state: "started"}];
    const progress = {agent_id: 4, started_at: started, finished_at: null, completed_count: 1, task_count: 2};
    const lines = {"agent list": page([worker]), "agent running": page([worker]), "usage agents --closed": page([{id: 4, tasks}]), "worker progress": page([progress])};
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context(lines));
    cardOf(element, 4).click();
    await settle();
    expect(cardOf(element, 4).querySelector("[data-agent-tasks]").textContent.trim()).toBe("1 of 2 tasks");
    expect(cardOf(element, 4).querySelector("[data-agent-pace]").textContent.trim()).toBe("1 per hour");
});

test("a worker's opened card shows its context and cost", async () => {
    const worker = {id: 4, session: "s-worker", program: "claude", role: "worker", ended_at: null};
    const lines = {"agent list": page([worker]), "agent running": page([worker]), "usage agents --closed": page([{id: 4, tasks: [], context_percent: 20, cost_dollars: 1.5}]), "usage tool --agent 4": {ok: true, value: {tool: ""}}};
    const element = await mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context(lines));
    document.body.append(element);
    cardOf(element, 4).click();
    await settle();
    const band = cardOf(element, 4).querySelector("[data-information-bar]");
    expect(band.querySelector('[data-fact="context"]').textContent).toContain("20%");
    expect(band.querySelector('[data-fact="cost"]').textContent).toContain("$1.50");
});

test("the running list has no show more button", async () => {
    const element = await drawn();
    expect(element.querySelector("[data-row-list-more]")).toBeNull();
});

test("an agent with no tasks has no tasks control", async () => {
    const element = await drawn();
    expect(element.querySelector("[data-agent-tasks]")).toBeNull();
});

test("the agents window sends searches to its list read", async () => {
    const held = window();
    const read = held.read;
    held.read = async (line) => {
        if (line.includes('--search "codex"')) return page([AGENTS[2]]);
        if (line.includes('--search "curie"')) return page([AGENTS[1]]);
        if (line.includes('--search "nobody"')) return page([]);
        return read(line);
    };
    const element = await mounted(AgentRows, held, {line: "agent list", empty: "No agents yet"});
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

// message 101517: an open card's instruction stopped at 240px with empty room under it
test("an open card's instruction has no fixed height and takes the room of its body", () => {
    const details = readFileSync(resolve(__dirname, "../../core/modules/agents/web/src/AgentCardDetails.vue"), "utf8");
    expect(details).toMatch(/\.agent-instruction \{[^}]*flex: 1;[^}]*overflow-y: auto;/);
});

// message 101362: nothing is ever hidden, even for a pane that saved a switch off in an older version
test("a switch saved off hides no agent, and no line speaks of hidden agents", async () => {
    const element = await drawn(FACTS, {helper: false, waiting: false, working: false});
    expect(listed(element)).toEqual([2, 3]);
    expect(element.textContent).not.toContain("Hidden");
});

test.each([["agents", Agents], ["helpers", Helpers]])("the %s window keeps the server's age order regardless of state or saved order", async (name, component) => {
    const rows = [
        {id: 5, session: "oldest", program: "claude", role: "worker", ended_at: null, created_at: "2026-11-01T09:00:00Z", updated_at: "2026-11-01T12:00:00Z"},
        {id: 6, session: "middle", program: "claude", role: "worker", ended_at: null, created_at: "2026-11-01T10:00:00Z", updated_at: "2026-11-01T10:00:00Z"},
        {id: 7, session: "newest", program: "claude", role: "worker", ended_at: null, created_at: "2026-11-01T11:00:00Z", updated_at: "2026-11-01T11:00:00Z"},
    ];
    const facts = [{...FACTS[0], id: 5, state: "blocked"}, {...FACTS[0], id: 6}, {...FACTS[0], id: 7}];
    const window = context({"agent cards": page(rows), "agent list": page(rows), "agent running": page(rows), "usage agents --closed": page(facts)});
    window.option = () => ({value: "state"});
    const element = await mounted(component, window);
    expect(listed(element)).toEqual([5, 6, 7]);
    expect(window.reads.filter((line) => line.startsWith("agent cards") && line !== "agent cards --options")).toHaveLength(1);
    expect(window.reads).not.toContain("agent running");
});

test("a worker's card shows the task it works on as its job and no queued count, and the main agent's card shows no job", async () => {
    const worker = {id: 4, session: "s-worker", program: "claude", role: "worker", ended_at: null};
    const lines = {"usage tool --agent 4": {ok: true, value: {tool: "", note: ""}}};
    const tasks = [{id: 1, title: "Add the tax", state: "started"}, {id: 2, title: "Print the receipt", state: "open"}, {id: 3, title: "Ship it", state: "open"}];
    const element = await mounted({render: () => h(AgentCard, {row: worker, facts: {job_enabled: true, task_id: 1, task_title: "Add the tax", tasks}})}, context(lines));
    expect(element.querySelector("[data-agent-job]").textContent).toBe("Add the tax");
    expect(element.querySelector("[data-agent-identity]").textContent).toBe("claude · worker 4");
    expect(element.querySelector("[data-agent-job]").parentElement.querySelector("[data-agent-tasks]")).toBeNull();
    expect(element.textContent).not.toContain("Queued");
    const main = {id: 1, session: "s-main", program: "claude", role: "main", ended_at: null};
    const idle = await mounted({render: () => h(AgentCard, {row: main, facts: {task_id: 1, task_title: "Add the tax", tasks}})}, context(lines));
    expect(idle.querySelector("[data-agent-job]")).toBeNull();
});

test("a worker with nothing started takes the first task queued for it as its job", async () => {
    const worker = {id: 4, session: "s-worker", program: "claude", role: "worker", ended_at: null};
    const lines = {"usage tool --agent 4": {ok: true, value: {tool: "", note: ""}}};
    const element = await mounted({render: () => h(AgentCard, {row: worker, facts: {job_enabled: true, task_id: null, task_title: "", tasks: [{id: 2, title: "Print the receipt", state: "open"}]}})}, context(lines));
    expect(element.querySelector("[data-agent-job]").textContent).toBe("Print the receipt");
});


test("a card says Blocked with its reason when the facts name one, and nothing when the agent is only held for a moment", async () => {
    const worker = {id: 4, session: "s-worker", program: "claude", role: "worker", ended_at: null, state: "running"};
    const lines = {"usage tool --agent 4": {ok: true, value: {tool: "", note: ""}}};
    const shown = async (facts) => mounted({render: () => h(AgentCard, {row: worker, facts: {job_enabled: true, tasks: [], ...facts}})}, context(lines));
    const stuck = await shown({state: "blocked", blocked_reason: "its task is blocked"});
    expect(stuck.querySelector(".agent-dot").dataset.state).toBe("blocked");
    expect(stuck.querySelector(".agent-work-status").textContent).toBe("Blocked: its task is blocked");
    const held = await shown({state: ""});
    expect(held.querySelector(".agent-dot").dataset.state).toBe("running");
    expect(held.querySelector(".agent-work-status")).toBeNull();
});
