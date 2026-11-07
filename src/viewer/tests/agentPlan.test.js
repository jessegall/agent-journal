import {h} from "vue";
import {expect, test} from "vitest";
import AgentCard from "../../core/modules/agents/web/src/AgentCard.vue";
import {context, mounted} from "./support/agentWindowContext.js";

const row = {id: 6, role: "worker", access: "writing", session: "s-6", program: "claude"};

test("the current task's plan is shown as a link", async () => {
    const facts = {task_id: 12, tasks: [{id: 11, state: "open", plan_id: 4, plan_title: "Queued"}, {id: 12, state: "started", plan_id: 9, plan_title: "Current"}]};
    const element = await mounted({render: () => h(AgentCard, {row, facts, open: true})}, context({}));
    const plan = element.querySelector("[data-agent-plan]");
    expect(plan.textContent).toContain("Plan 9: Current");
    expect(plan.dataset.peek).toBe("plans:9");
});

test("a queued plan is shown when the agent has no current task", async () => {
    const facts = {tasks: [{id: 11, state: "open", plan_id: 4, plan_title: "Queued"}]};
    const element = await mounted({render: () => h(AgentCard, {row, facts, open: true})}, context({}));
    expect(element.querySelector("[data-agent-plan]").textContent).toContain("Plan 4: Queued");
});

test("a task with no plan adds no plan label", async () => {
    const facts = {task_id: 12, tasks: [{id: 12, state: "started", plan_id: null}]};
    const element = await mounted({render: () => h(AgentCard, {row, facts, open: true})}, context({}));
    expect(element.querySelector("[data-agent-plan]")).toBeNull();
});
