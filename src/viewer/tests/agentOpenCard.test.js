import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {afterEach, expect, test, vi} from "vitest";
import {h} from "vue";
import {context, mounted, page, settleTransition as settle} from "./support/codingWindowContext.js";
import AgentRows from "../../core/modules/agents/web/src/AgentRows.vue";
import AgentCard from "../../core/modules/agents/web/src/AgentCard.vue";

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

test("the opened agent card places its actions in the information bar and pads transcript rows", async () => {
    const row = {...AGENTS[2], ended_at: "2026-11-01T10:00:00Z", job_command: ["worker", "send"], job_task_flag: "--task"};
    const element = await mounted({render: () => h(AgentCard, {row, facts: {tasks: []}, open: true})}, {...context({}), tabs: TABS});
    const bar = element.querySelector("[data-information-bar]");
    expect(bar.querySelector("[data-agent-send-job]")).not.toBeNull();
    expect(bar.querySelector("[data-agent-retire]")).not.toBeNull();
    const transcript = readFileSync(resolve(__dirname, "../../core/modules/agents/web/src/TranscriptRows.vue"), "utf8");
    expect(transcript).toMatch(/\.transcript :deep\(\.row-list-row\)\s*\{\s*padding:\s*8px 14px/);
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
    expect([...element.querySelectorAll("[data-tab]")].map((tab) => tab.dataset.tab)).toEqual(["tasks", "transcript", "terminal", "file-feed", "reports"]);
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

test("starting a search closes the open card and lists every match", async () => {
    const element = await drawn();
    cardOf(element, 3).click();
    await settle();
    const box = element.querySelector("[data-search-input]");
    box.value = "worker";
    box.dispatchEvent(new Event("input", {bubbles: true}));
    await settle();
    await vi.waitFor(() => expect(cards(element)).toEqual([4, 5]));
    expect(element.querySelector("[data-agent-more]")).toBeNull();
    expect(band(element)).toBeNull();
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
