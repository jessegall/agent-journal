import {h} from "vue";
import {expect, test} from "vitest";
import AgentCard from "../../core/modules/agents/web/src/AgentCard.vue";
import {context, mounted} from "./support/agentWindowContext.js";

test.each([null, "2026-11-01T00:00:00Z"])("a helper shows its job and links the plan while running or ended", async (ended_at) => {
    const row = {id: 6, role: "helper", access: "read-only", ended_at, session: "s-6", program: "claude"};
    const facts = {tasks: [], helper_job: "Reviewing plan 1093"};
    const element = await mounted({render: () => h(AgentCard, {row, facts, open: true})}, context({}));
    const job = element.querySelector("[data-agent-job]");
    expect(job.textContent).toContain("Reviewing plan 1093");
    expect(job.querySelector("[data-peek]").dataset.peek).toBe("plans:1093");
});
