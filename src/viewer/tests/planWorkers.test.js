import {planWindowContext} from "./support/planWindowContext.js";
import {afterEach, expect, test, vi} from "vitest";
import {h, provide, ref} from "vue";
import {provideDockCard} from "@journal/window-kit";
import {context, mounted, mountedDock, settle} from "./support/windowContext.js";
import PlanCards from "../../core/modules/plans/web/src/PlanCards.vue";
import PlanDock from "../../core/modules/plans/web/src/PlanDock.vue";

globalThis.ResizeObserver ??= class {
    observe() {}
    disconnect() {}
};

afterEach(() => (document.body.innerHTML = ""));

const TABS = [{key: "open", label: "Open", read: "plan board", count_field: "open_total"}, {key: "closed", label: "Closed", read: "plan board --closed", count_field: "closed_total"}];
const AGENTS = [{id: 12, name: "Lady Lovelace", task_id: 1, task_title: "Cart"}, {id: 12, name: "Lady Lovelace", task_id: 2, task_title: "Tax"}];
const card = (id, agents, working = [], assignee = null) => ({id, title: `Plan ${id}`, state: "started", task_count: 4, completed_count: 0, current_phase: 1, delegated: agents.length > 0, agents, working, assignee});

const TWO = [...AGENTS, {id: 13, name: "Grace Hopper", task_id: 3, task_title: "Print"}];

test("a plan card shows the plan, its bar and who has it, in one row for none, one and several agents, and no tasks", async () => {
    const window = planWindowContext({"plan board": {ok: true, value: {open_total: 3, closed_total: 0, plans: [card(1, []), card(2, AGENTS), card(3, TWO)]}}});
    const element = await mounted(PlanCards, {...window, tabs: TABS});
    const [none, one, several] = [1, 2, 3].map((id) => element.querySelector(`[data-row="${id}"]`));
    for (const row of [none, one, several]) {
        expect(row.querySelector(".plan-bar")).not.toBeNull();
        expect(row.querySelector("[data-plan-agents]")).not.toBeNull();
        expect(row.textContent).not.toContain("Cart");
    }
    expect(none.querySelector("[data-plan-agents]").textContent.trim()).toBe("No agent assigned");
    expect(one.querySelector("[data-plan-agents]").textContent.trim()).toBe("Lady Lovelace");
    expect(several.querySelector("[data-plan-agents-list]").textContent.trim()).toBe("Agents: 2");
    document.body.append(element);
    several.querySelector("[data-plan-agents-list]").click();
    await settle();
    expect([...document.body.querySelectorAll("[data-plan-agents-menu] [data-plan-agent]")].map((agent) => agent.textContent.trim())).toEqual(["Lady Lovelace", "Grace Hopper"]);
});

test("a plan card names its assigned agent alone, without a label", async () => {
    const window = planWindowContext({"plan board": {ok: true, value: {open_total: 1, closed_total: 0, plans: [card(1, [], [], {id: 897, name: "Agent 897", main: false})]}}});
    const element = await mounted(PlanCards, {...window, tabs: TABS});
    expect(element.querySelector("[data-plan-assignee]").textContent.trim()).toBe("Agent 897");
    expect(element.querySelector("[data-plan-agents]").textContent).not.toContain("Works this plan");
});

test("a plan's dock card lists each agent working on the plan once, above its phases", async () => {
    const outline = {delegated: true, agents: AGENTS, phases: [{id: 1, title: "Build", tasks: [{id: 1}, {id: 2}]}]};
    const window = context({"plan outline": {ok: true, value: outline}});
    const card = {setup() {
        provideDockCard(provide, {data: ref(outline), reload: async () => {}});
        return () => h(PlanDock);
    }};
    const element = await mountedDock(card, window, {target_id: 5});
    await vi.waitFor(() => expect(element.textContent).toContain("Build"));
    expect([...element.querySelectorAll("[data-plan-dock-agent]")].map((agent) => agent.textContent)).toEqual(["Lady Lovelace"]);
    expect(element.textContent).toContain("Build");
});

