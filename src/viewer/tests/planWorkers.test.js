import {afterEach, expect, test} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import PlanCards from "../../core/modules/plans/web/src/PlanCards.vue";
import PlanDock from "../../core/modules/plans/web/src/PlanDock.vue";

afterEach(() => (document.body.innerHTML = ""));

const TABS = [{key: "open", label: "Open", read: "plan board", count_field: "open_total"}, {key: "closed", label: "Closed", read: "plan board --closed", count_field: "closed_total"}];
const AGENTS = [{id: 12, name: "Lady Lovelace", task_id: 1, task_title: "Cart"}, {id: 12, name: "Lady Lovelace", task_id: 2, task_title: "Tax"}];
const card = (id, agents, working = []) => ({id, title: `Plan ${id}`, state: "started", task_count: 4, completed_count: 0, current_phase: 1, delegated: agents.length > 0, agents, working});

test("a plan card shows the plan and its progress bar, and no tasks or agents", async () => {
    const window = context({"plan board": {ok: true, value: {open_total: 1, closed_total: 0, plans: [card(1, AGENTS, [{id: 7, title: "Cart"}])]}}});
    const element = await mounted(PlanCards, {...window, tabs: TABS});
    const row = element.querySelector('[data-row="1"]');
    expect(row.textContent).toContain("Plan 1");
    expect(row.querySelector(".plan-bar")).not.toBeNull();
    expect(row.textContent).not.toContain("Lady Lovelace");
    expect(row.textContent).not.toContain("Cart");
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

