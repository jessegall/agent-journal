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
const window = (facts = FACTS) => context({"agent list": page(AGENTS), "usage agents --closed": page(facts)});
const drawn = (facts) => mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, window(facts));
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
    expect(card.querySelector("[data-agent-title]").textContent).toBe("journal-researcher");
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
