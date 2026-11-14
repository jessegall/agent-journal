import {readFileSync} from "node:fs";
import {h} from "vue";
import {expect, test} from "vitest";
import AgentCard from "../../core/modules/agents/web/src/AgentCard.vue";
import {context, mounted} from "./support/agentWindowContext.js";

const STARTED = new Date(Date.now() - 2 * 3600000).toISOString();
const worker = (overrides) => ({id: 6, role: "worker", access: "writing", session: "s-6", program: "claude", state: "running", created_at: STARTED, ended_at: null, ...overrides});
const task = (id, state, plan = 1131) => ({id, title: `Task ${id}`, state, plan_id: plan, plan_title: "Cart"});
const card = async (row, facts) => (await mounted({render: () => h(AgentCard, {row, facts: {job_enabled: true, ...facts}})}, context({}))).querySelector("[data-agent-open]");
// the plan has 18 tasks: 4 completed, 2 testing, 3 started and 9 open; every agent of the plan shows the same bar
const COUNTS = {1131: {completed: 4, testing: 2, started: 3, total: 18}};

test("test_bar_parts: the plan's bar is 72 by 4 pixels, with completed in full, testing at 60% and started at 28%, and its hover names each part", async () => {
    const element = await card(worker(), {tasks: [task(9682, "started")], plan_counts: COUNTS});
    const bar = element.querySelector("[data-plan-bar]");
    expect(bar.getAttribute("title")).toBe("Plan 1131: 4 completed, 2 testing, 3 started, 9 open");
    expect(bar.querySelector("[data-plan-track]").getAttribute("aria-label")).toBe("Plan 1131: 4 completed, 2 testing, 3 started, 9 open");
    expect([...bar.querySelectorAll(".part")].map((part) => part.style.width.replace(/(\.\d)\d+/, "$1"))).toEqual(["22.2%", "11.1%", "16.6%"]);
    const source = readFileSync(`${__dirname}/../../core/modules/agents/web/src/PlanBar.vue`, "utf8");
    expect(source).toMatch(/width: 72px;\s*height: 4px;/);
    expect(source).toContain("var(--accent) 60%");
    expect(source).toContain("var(--accent) 28%");
    expect(element.querySelector("[data-agent-bar]")).toBeNull();
});

test("test_count_text: the count reads the completed tasks of all the plan's tasks, with the first number in its own element, and an agent with no plan has no plan bar", async () => {
    const element = await card(worker(), {tasks: [task(9682, "started")], plan_counts: COUNTS});
    expect(element.querySelector("[data-plan-count]").textContent).toBe("4 of 18");
    expect(element.querySelector("[data-plan-count] b").textContent).toBe("4");
    const other = await card(worker({id: 7}), {tasks: [task(9700, "started")], plan_counts: COUNTS});
    expect(other.querySelector("[data-plan-count]").textContent).toBe("4 of 18");
    const noPlan = await card(worker({id: 8}), {tasks: [{id: 5, title: "Alone", state: "started"}], plan_counts: COUNTS});
    expect(noPlan.querySelector("[data-plan-bar]")).toBeNull();
});
