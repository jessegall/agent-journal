import {afterEach, expect, test, vi} from "vitest";
import {h} from "vue";
import {context, mounted, page, pickButton, settle} from "./support/agentWindowContext.js";
import AgentRows from "../../core/modules/agents/web/src/AgentRows.vue";
import {agentFilterOptions} from "./support/agentFilterOptions.js";

afterEach(() => (document.body.innerHTML = ""));

test("the agents window reads the selected state from the query", async () => {
    const worker = {id: 4, session: "s-worker", program: "claude", role: "worker", state: "idle", ended_at: "2026-11-03T02:00:00Z"};
    const answers = {"agent cards --options": agentFilterOptions, "agent cards --show running": page([]), "agent cards --show idle": page([worker]), "agent cards --show retired": page([]), "agent cards --show all": page([worker])};
    const held = context(answers);
    const element = await mounted({render: () => h(AgentRows, {line: "agent cards", empty: "No agents yet"})}, held);
    document.body.append(element);
    expect(element.querySelector('[data-agent-row="4"]')).toBeNull();
    await pickButton(element, "Idle");
    expect(element.querySelector('[data-agent-row="4"]')).not.toBeNull();
    await pickButton(element, "Retired");
    expect(element.querySelector('[data-agent-row="4"]')).toBeNull();
    await pickButton(element, "All");
    await settle();
    expect(element.querySelector('[data-agent-row="4"]')).not.toBeNull();
});

test("an agent that ends moves to the bottom of the Working list, faded, and leaves after five minutes", async () => {
    vi.useFakeTimers({toFake: ["Date", "setInterval", "clearInterval"]});
    const first = {id: 4, session: "s-first", program: "claude", role: "worker", state: "running", ended_at: null};
    const second = {id: 5, session: "s-second", program: "claude", role: "worker", state: "running", ended_at: null};
    const listed = page([first, second]);
    const answers = {"agent cards --show all --include-main --id 4": page([{...first, state: "idle", ended_at: new Date().toISOString()}]), "agent cards --options": agentFilterOptions, "agent cards": listed};
    const held = context(answers);
    try {
        const element = await mounted({render: () => h(AgentRows, {line: "agent cards", empty: "No agents yet"})}, held);
        document.body.append(element);
        const order = () => [...element.querySelectorAll("[data-agent-row]")].map((row) => Number(row.dataset.agentRow));
        expect(order()).toEqual([4, 5]);
        expect(element.querySelector("[data-agent-lingering]")).toBeNull();
        listed.value.rows = [second];
        await held.reload("agents");
        await settle();
        expect(order()).toEqual([5, 4]);
        const ended = element.querySelector('[data-agent-row="4"]');
        expect(ended.hasAttribute("data-agent-lingering")).toBe(true);
        expect(ended.classList.contains("lingering")).toBe(true);
        expect(element.querySelector('[data-agent-row="5"]').hasAttribute("data-agent-lingering")).toBe(false);
        vi.advanceTimersByTime(4 * 60 * 1000);
        await settle();
        expect(order()).toEqual([5, 4]);
        vi.advanceTimersByTime(120 * 1000);
        await settle();
        expect(order()).toEqual([5]);
    } finally {
        vi.useRealTimers();
    }
});

test("a row that leaves because the search changed does not linger", async () => {
    const first = {id: 4, session: "s-first", program: "claude", role: "worker", state: "running", ended_at: null};
    const listed = page([first]);
    const held = context({"agent cards --options": agentFilterOptions, "agent cards": listed});
    const element = await mounted({render: () => h(AgentRows, {line: "agent cards", empty: "No agents yet"})}, held);
    document.body.append(element);
    await pickButton(element, "Idle");
    listed.value.rows = [];
    await held.reload("agents");
    await settle();
    expect(element.querySelector("[data-agent-lingering]")).toBeNull();
    expect(element.querySelector('[data-agent-row="4"]')).toBeNull();
});
