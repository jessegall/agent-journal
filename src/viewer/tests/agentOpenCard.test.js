import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {afterEach, expect, test, vi} from "vitest";
import {h} from "vue";
import {context, mounted, page, settleTransition as settle} from "./support/codingWindowContext.js";
import AgentRows from "../../core/modules/agents/web/src/AgentRows.vue";
import AgentCard from "../../core/modules/agents/web/src/AgentCard.vue";
import InformationBar from "../src/shell/InformationBar.vue";

vi.stubGlobal("matchMedia", () => ({matches: true}));

vi.stubGlobal("ResizeObserver", class {
    observe() {}

    disconnect() {}
});

afterEach(() => (document.body.innerHTML = ""));

const AGENTS = [
    {id: 2, session: "s-live", program: "claude", role: "main", ended_at: null},
    {id: 3, session: "s-sub", program: "claude", role: "helper", ended_at: null},
    {id: 4, session: "s-two", program: "claude", role: "worker", ended_at: null},
    {id: 5, session: "s-three", program: "claude", role: "worker", ended_at: null},
];
const TABS = [
    {key: "tasks", label: "Tasks", read: "usage agents", count_field: "tasks"},
    {key: "reports", label: "Reports", read: "message agent-reports", count_field: "reports"},
    {key: "transcript", label: "Transcript", read: "agent transcript", count_field: ""},
    {key: "file-feed", label: "File feed"},
    {key: "terminal", label: "Terminal"},
    {key: "memories", label: "Memories", read: "memory page", count_field: "memories"},
];
const OPTIONS = {working: true, waiting: true, idle: true, stopped: true, environment: true, worker: true, helper: true, order: "number", every: false};
const drawn = async () => {
    const element = await mounted({render: () => h(AgentRows, {line: "agent cards", empty: "No agents yet"})}, {
        ...context({"agent cards --show running --search worker": page(AGENTS.filter((row) => row.role === "worker")), "agent cards": page(AGENTS), "agent running": page(AGENTS), "usage agents --closed": page([]), "agent transcript 4": page([{id: 1, author: "user", text: "Read the cart"}])}),
        tabs: TABS,
        option: (key) => ({value: OPTIONS[key]}),
    });
    document.body.append(element);
    return element;
};
const cardOf = (element, id) => element.querySelector(`[data-agent-open="${id}"]`);
const cards = (element) => [...element.querySelectorAll("[data-agent-open]")].map((card) => Number(card.dataset.agentOpen));
const band = (element) => element.querySelector("[data-agents-held]");

test("the opened agent card has no row of buttons and pads transcript rows", async () => {
    const row = {...AGENTS[2], ended_at: "2026-11-01T10:00:00Z", job_command: ["worker", "send"], job_task_flag: "--task"};
    const element = await mounted({render: () => h(AgentCard, {row, facts: {tasks: []}, open: true})}, {...context({}), tabs: TABS});
    for (const name of ["head-actions", "send-job", "retire", "inspector", "history", "driver"]) expect(element.querySelector(`[data-agent-${name}]`)).toBeNull();
    expect(element.querySelector("[data-helper-stop]")).toBeNull();
    expect(element.querySelector("[data-agent-head] .agent-back")).not.toBeNull();
    const transcript = readFileSync(resolve(__dirname, "../../core/modules/agents/web/src/TranscriptRows.vue"), "utf8");
    expect(transcript).toMatch(/\.transcript :deep\(\.row-list-row\)\s*\{\s*padding:\s*8px 14px/);
});

test("one menu button in the head opens the actions of every kind of agent, and the actions are in the menu only", async () => {
    for (const role of ["worker", "helper", "merger"]) {
        const row = {...AGENTS[2], role, number: 5, ended_at: "2026-11-01T10:00:00Z", job_command: ["worker", "send"], job_task_flag: "--task"};
        const element = await mounted({render: () => h(AgentCard, {row, facts: {tasks: []}, open: true})}, {...context({}), tabs: TABS});
        expect(element.querySelectorAll("[data-agent-menu]")).toHaveLength(1);
        expect(element.querySelector("[data-agent-send-job]")).toBeNull();
        element.querySelector("[data-agent-menu]").click();
        await settle();
        const menu = element.querySelector("[data-agent-menu-panel]");
        for (const name of ["history", "send-job", "driver", "retire"]) expect(menu.querySelector(`[data-agent-${name}]`)).not.toBeNull();
        document.body.innerHTML = "";
    }
});

test("the opened agent card shows the plan allowance its facts carry in the information bar", async () => {
    const windows = [{title: "5 hours", used_percent: 30, reset_epoch_seconds: 1793545200}];
    const element = await mounted({render: () => h(AgentCard, {row: AGENTS[2], facts: {tasks: [], windows}, open: true})}, {...context({}), tabs: TABS});
    expect(element.querySelector("[data-information-bar] [data-fact='usage']").textContent).toContain("30%");
});

test("the Reports tab counts the agent's reports before the tab is opened", async () => {
    const row = {...AGENTS[2], number: 770, report_count: 4};
    const element = await mounted({render: () => h(AgentCard, {row, facts: {tasks: []}, open: true})}, {...context({}), tabs: TABS});
    expect(element.querySelector("[data-tab='reports'] [data-tab-count]").textContent).toBe("4");
});

test("the opened agent card names its role and number once, and its program, model and effort once, in its bar", async () => {
    const row = {...AGENTS[2], number: 770, program_model: "opus", session_count: 2, memory_count: 3, created_at: "2026-11-01T10:00:00Z"};
    const facts = {id: row.id, tasks: [], model: "opus", effort: "high", last_activity: "2026-11-11T10:00:00Z", context_percent: 15, cost_dollars: 1.5};
    const element = await mounted({render: () => h(AgentCard, {row, facts, open: true})}, {...context({}), tabs: TABS});
    expect(element.querySelector("[data-agent-title]").textContent).toBe("Worker");
    expect(element.querySelector("[data-agent-name]").textContent).toBe("worker 770");
    expect(element.querySelector("[data-agent-identity]")).toBeNull();
    const bar = element.querySelector("[data-information-bar]");
    expect(bar.querySelector("[data-fact='agent']")).not.toBeNull();
    expect(bar.querySelector("[data-fact='model']").textContent).toContain("opus");
    expect(bar.querySelector("[data-fact='effort']").textContent).toContain("high");
    expect(bar.querySelector("[data-fact='context']")).not.toBeNull();
    expect(bar.querySelector("[data-fact='cost']")).not.toBeNull();
    expect(element.querySelector("[data-agent-run-time]")).toBeNull();
    expect(element.querySelector("[data-agent-last-heard]")).toBeNull();
    expect(element.querySelector("[data-agent-driver-name]")).toBeNull();
    expect(element.querySelector("[data-agent-memory-count]")).toBeNull();
    expect(element.textContent.match(/opus/g)).toHaveLength(1);
});

test("a worker's and a helper's card draws the same bar as the home window draws for its agent, each fact once", async () => {
    const windows = [{title: "5 hours", used_percent: 30, reset_epoch_seconds: 1793545200}];
    const factsOf = (element) => [...element.querySelectorAll("[data-information-bar] [data-fact]")].map((fact) => fact.dataset.fact);
    for (const role of ["worker", "helper"]) {
        const row = {...AGENTS[2], role, number: 770, program_model: "opus"};
        const facts = {id: row.id, tasks: [], model: "opus", effort: "high", context_percent: 15, cost_dollars: 1.5, windows};
        const card = await mounted({render: () => h(AgentCard, {row, facts, open: true})}, {...context({}), tabs: TABS});
        const bar = await mounted({render: () => h(InformationBar, {agent: row, card: true, usage: {agents: [facts], windows}})}, context({}));
        expect(factsOf(card)).toEqual(factsOf(bar));
        expect(factsOf(card)).toEqual(["agent", "usage", "context", "model", "effort", "cost"]);
        expect(card.querySelector("[data-information-bar]").textContent.match(/opus/g)).toHaveLength(1);
        document.body.innerHTML = "";
    }
});

test("a retired agent card has no live bar", async () => {
    const row = {...AGENTS[2], number: 770, ended_at: "2026-11-01T10:00:00Z", retired_at: "2026-11-02T10:00:00Z"};
    const element = await mounted({render: () => h(AgentCard, {row, facts: {tasks: []}, open: true})}, {...context({}), tabs: TABS});
    expect(element.querySelector("[data-information-bar]")).toBeNull();
    expect(element.querySelector("[data-agent-head-actions]")).toBeNull();
});

test("a worker, a helper, a reader and a retired agent open the same tabs", async () => {
    const tabsOf = async (row) => {
        const element = await mounted({render: () => h(AgentCard, {row, facts: {tasks: []}, open: true})}, {...context({}), tabs: TABS});
        const keys = [...element.querySelectorAll("[data-tab]")].map((tab) => tab.dataset.tab);
        document.body.innerHTML = "";
        return keys;
    };
    const worker = await tabsOf({...AGENTS[2], role: "worker", access: "writing"});
    expect(worker.length).toBeGreaterThan(3);
    expect(await tabsOf({...AGENTS[2], role: "helper", access: "read-only"})).toEqual(worker);
    expect(await tabsOf({...AGENTS[2], role: "merger", access: "read-only"})).toEqual(worker);
    expect(await tabsOf({...AGENTS[2], retired_at: "2026-11-02T10:00:00Z", ended_at: "2026-11-01T10:00:00Z"})).toEqual(worker);
});

test("the agent hover card is on the name of a closed card only, and an open card has none", async () => {
    const closed = await mounted({render: () => h(AgentCard, {row: AGENTS[2], facts: {tasks: []}})}, {...context({}), tabs: TABS});
    expect(closed.querySelectorAll("[data-agent-tip]")).toHaveLength(1);
    expect(closed.querySelector("[data-agent-tip] [data-agent-title]")).not.toBeNull();
    expect(closed.querySelector("[data-agent-head]").hasAttribute("data-agent-tip")).toBe(false);
    document.body.innerHTML = "";
    const open = await mounted({render: () => h(AgentCard, {row: AGENTS[2], facts: {tasks: []}, open: true})}, {...context({}), tabs: TABS});
    expect(open.querySelector("[data-agent-tip]")).toBeNull();
});

test("every card is listed and there is no band while none is open", async () => {
    const element = await drawn();
    await vi.waitFor(() => expect(cards(element)).toEqual([2, 3, 4, 5]));
    expect(band(element)).toBeNull();
    expect(element.querySelector(".agents").classList.contains("focused")).toBe(false);
});

test("the open card is alone, with its tabs in order and no more button", async () => {
    const element = await drawn();
    cardOf(element, 3).click();
    await settle();
    await vi.waitFor(() => expect(cards(element)).toEqual([3]));
    expect(cardOf(element, 3).getAttribute("aria-expanded")).toBe("true");
    expect(element.querySelector(".agents").classList.contains("focused")).toBe(true);
    expect(band(element)).toBeNull();
    expect([...element.querySelectorAll("[data-tab]")].map((tab) => tab.dataset.tab)).toEqual(["tasks", "transcript", "terminal", "file-feed", "reports", "memories"]);
});

test("closing the card itself brings the others back", async () => {
    const element = await drawn();
    cardOf(element, 5).click();
    await settle();
    await vi.waitFor(() => expect(cards(element)).toEqual([5]));
    cardOf(element, 5).querySelector(".agent-back").click();
    await settle();
    await vi.waitFor(() => expect(cards(element)).toEqual([2, 3, 4, 5]));
    expect(band(element)).toBeNull();
});

test("opening another card closes the one that was open", async () => {
    const element = await drawn();
    cardOf(element, 3).click();
    await settle();
    cardOf(element, 3).querySelector(".agent-back").click();
    await settle();
    cardOf(element, 4).click();
    await settle();
    await vi.waitFor(() => expect(cards(element)).toEqual([4]));
    expect(cardOf(element, 4).getAttribute("aria-expanded")).toBe("true");
    expect(element.querySelectorAll("[data-agent-more]").length).toBe(1);
});

test("a search lists every match", async () => {
    const element = await drawn();
    const box = element.querySelector("[data-search-input]");
    box.value = "worker";
    box.dispatchEvent(new Event("input", {bubbles: true}));
    await settle();
    await vi.waitFor(() => expect(cards(element)).toEqual([4, 5]));
    expect(band(element)).toBeNull();
});

test("the search bar is gone while an agent card is open and back after closing it", async () => {
    const element = await drawn();
    expect(element.querySelector("[data-agents-search]")).not.toBeNull();
    cardOf(element, 3).click();
    await settle();
    await vi.waitFor(() => expect(cards(element)).toEqual([3]));
    expect(element.querySelector("[data-agents-search]")).toBeNull();
    cardOf(element, 3).querySelector(".agent-back").click();
    await settle();
    await vi.waitFor(() => expect(cards(element)).toEqual([2, 3, 4, 5]));
    expect(element.querySelector("[data-agents-search]")).not.toBeNull();
});

test("a clicked card inside the open one, such as a tab, does not close it", async () => {
    const element = await drawn();
    cardOf(element, 4).click();
    await settle();
    element.querySelector("[data-tab=transcript]").click();
    await settle();
    await vi.waitFor(() => expect(cards(element)).toEqual([4]));
    expect(element.querySelector("[data-agent-tab-body]").textContent).toContain("Read the cart");
});

test("the window holds the open card, and the card's tab body scrolls within the height it is given", () => {
    const rows = readFileSync(resolve(__dirname, "../../core/modules/agents/web/src/AgentRows.vue"), "utf8");
    const card = readFileSync(resolve(__dirname, "../../core/modules/agents/web/src/AgentCard.vue"), "utf8");
    const details = readFileSync(resolve(__dirname, "../../core/modules/agents/web/src/AgentCardDetails.vue"), "utf8");
    expect(rows).toContain("const openId = ref(null)");
    expect(card).not.toMatch(/const opened = ref/);
    expect(rows).toMatch(/\.agents\.focused :deep\(\.row-list\) \{[^}]*flex: 1;[^}]*min-height: 0;/);
    expect(details).toMatch(/\.agent-tab-body \{[^}]*flex: 1;[^}]*min-height: 0;[^}]*overflow-y: auto;/);
});
