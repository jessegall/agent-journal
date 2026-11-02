import {afterEach, expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import {h} from "vue";
import AgentRows from "../../core/modules/agents/web/src/AgentRows.vue";
import {age, ago} from "../src/format/time.js";

afterEach(() => (document.body.innerHTML = ""));

const AGENTS = [
    {id: 2, session: "s-live", program: "claude", role: "main", ended_at: null},
    {id: 1, session: "s-old", program: "codex", role: "worker", ended_at: "2026-11-01T10:00:00Z"},
];

const FACTS = [{id: 2, model: "opus", context_percent: 62, cost_dollars: 1.2, task_id: 7, task_title: "Fix the cart"}];
const drawn = () => mounted({render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})}, context({"agent list": page(AGENTS), "usage agents": page(FACTS)}));

const pick = async (element, label) => {
    [...element.querySelectorAll("button")].find((button) => button.textContent.trim() === label).click();
    await settle();
};

test("the agents window filters on running or closed", async () => {
    const element = await drawn();
    expect(element.textContent).toContain("Main agent 2");
    expect(element.textContent).not.toContain("Worker 1");
    await pick(element, "Closed");
    expect(element.textContent).not.toContain("Main agent 2");
    expect(element.textContent).toContain("Worker 1");
    await pick(element, "All");
    expect(element.textContent).toContain("Main agent 2");
    expect(element.textContent).toContain("Worker 1");
});

test("an agent's card says what it works on, how long it has run and its context and cost", async () => {
    const element = await drawn();
    const card = element.querySelector('[data-agent-open="2"]');
    expect(card.textContent).toContain("claude · opus");
    expect(card.textContent).toContain("Running");
    expect(card.querySelector("[data-agent-card-task]").textContent).toBe("Task 7: Fix the cart");
    expect(card.querySelector("[data-agent-card-usage]").textContent).toBe("Context 62% · $1.20");
    expect(card.title).toBe("s-live");
});

test("the agents window searches the session, program and role", async () => {
    const element = await drawn();
    await pick(element, "All");
    const search = element.querySelector(".agents-search input") || element.querySelector("input");
    search.value = "codex";
    search.dispatchEvent(new Event("input"));
    await settle();
    expect(element.textContent).toContain("Worker 1");
    expect(element.textContent).not.toContain("Main agent 2");
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
