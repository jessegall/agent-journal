import {afterEach, expect, test} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import PlanCards from "../../core/modules/plans/web/src/PlanCards.vue";
import PlanDock from "../../core/modules/plans/web/src/PlanDock.vue";
import PlanDelegation from "../../suites/coding/modules/workers/web/src/PlanDelegation.vue";

afterEach(() => (document.body.innerHTML = ""));

const TABS = [{key: "open", label: "Open", read: "plan board", count_field: "open_total"}, {key: "closed", label: "Closed", read: "plan board --closed", count_field: "closed_total"}];
const AGENTS = [{id: 12, name: "Lady Lovelace", task_id: 1, task_title: "Cart"}, {id: 12, name: "Lady Lovelace", task_id: 2, task_title: "Tax"}];
const card = (id, agents) => ({id, title: `Plan ${id}`, state: "started", task_count: 4, completed_count: 0, current_phase: 1, delegated: agents.length > 0, agents});

test("a plan card names the agents working on its tasks, each with its task, and a plan nobody works for names none", async () => {
    const window = context({"plan board": {ok: true, value: {open_total: 2, closed_total: 0, plans: [card(1, AGENTS), card(2, [])]}}});
    const element = await mounted(PlanCards, {...window, tabs: TABS});
    const agents = [...element.querySelectorAll('[data-row="1"] [data-plan-agent]')].map((worker) => worker.textContent);
    expect(agents).toEqual(["Lady Lovelace task 1: Cart", "Lady Lovelace task 2: Tax"]);
    expect(element.querySelector('[data-row="2"] [data-plan-agents]')).toBeNull();
});

test("a plan's dock card lists each agent working on the plan once, above its phases", async () => {
    const outline = {delegated: true, agents: AGENTS, phases: [{id: 1, title: "Build", tasks: [{id: 1}, {id: 2}]}]};
    const window = context({"plan outline": {ok: true, value: outline}});
    window.option = () => ({value: {target_id: 5}});
    const element = await mounted(PlanDock, window);
    await settle();
    expect([...element.querySelectorAll("[data-plan-dock-agent]")].map((agent) => agent.textContent)).toEqual(["Lady Lovelace"]);
    expect(element.textContent).toContain("Build");
});

test("the plan bar names the one agent on the started plan, opens the agents with their tasks, and says Delegated for several", async () => {
    const window = context({"plan board": {ok: true, value: {open_total: 1, closed_total: 0, plans: [card(3, AGENTS)]}}});
    const element = await mounted(PlanDelegation, window);
    expect(element.querySelector("[data-plan-bar-delegation]").textContent).toBe("Worker: Lady Lovelace");
    element.querySelector("[data-plan-bar-delegation]").click();
    await settle();
    expect([...element.querySelectorAll("[data-plan-bar-agent]")].map((row) => [row.querySelector("strong").textContent, row.querySelector("span").textContent])).toEqual([["Lady Lovelace", "task 1: Cart"], ["Lady Lovelace", "task 2: Tax"]]);
    const two = context({"plan board": {ok: true, value: {open_total: 1, closed_total: 0, plans: [card(3, [...AGENTS, {id: 13, name: "Grace Hopper", task_id: 3, task_title: "Totals"}])]}}});
    expect((await mounted(PlanDelegation, two)).querySelector("[data-plan-bar-delegation]").textContent).toBe("Delegated");
});

test("the plan bar shows no delegation when nobody works on the plan, and nothing when no plan is started", async () => {
    const free = await mounted(PlanDelegation, context({"plan board": {ok: true, value: {open_total: 1, closed_total: 0, plans: [card(3, [])]}}}));
    expect(free.querySelector("[data-plan-bar]")).not.toBeNull();
    expect(free.querySelector("[data-plan-bar-delegation]")).toBeNull();
    const idle = await mounted(PlanDelegation, context({"plan board": {ok: true, value: {open_total: 0, closed_total: 0, plans: []}}}));
    expect(idle.querySelector("[data-plan-bar]")).toBeNull();
});
