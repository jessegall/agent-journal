import {h} from "vue";
import {expect, test} from "vitest";
import AgentTaskGroup from "../../core/modules/agents/web/src/AgentTaskGroup.vue";
import {context, mounted} from "./support/agentWindowContext.js";

test("a task of an agent names its plan", async () => {
    const section = {label: "Started", state: "started", tasks: [{id: 12, state: "started", title: "The cart", plan_id: 9, plan_title: "Current"}]};
    const element = await mounted({render: () => h(AgentTaskGroup, {section, open: true})}, context({}));
    expect(element.querySelector("[data-agent-task-plan]").textContent).toContain("Plan 9: Current");
});

test("a task outside a plan names none", async () => {
    const section = {label: "Open", state: "open", tasks: [{id: 11, state: "open", title: "The till"}]};
    const element = await mounted({render: () => h(AgentTaskGroup, {section, open: true})}, context({}));
    expect(element.querySelector("[data-agent-task-plan]")).toBeNull();
});
