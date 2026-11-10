import {h} from "vue";
import {expect, test} from "vitest";
import AgentCard from "../../core/modules/agents/web/src/AgentCard.vue";
import {context, mounted} from "./support/agentWindowContext.js";

test.each([null, "2026-11-01T00:00:00Z"])("a helper's row shows its job while running or ended", async (ended_at) => {
    const row = {id: 6, role: "helper", access: "read-only", ended_at, session: "s-6", program: "claude"};
    const facts = {tasks: [], helper_job: "Reviewing plan 1093"};
    const element = await mounted({render: () => h(AgentCard, {row, facts})}, context({}));
    const job = element.querySelector("[data-agent-job]");
    expect(job.textContent).toContain("Reviewing plan 1093");
});

test("a helper's row shows the title its sender gave the job, with the job in the tooltip", async () => {
    const row = {id: 6, role: "helper", access: "read-only", ended_at: null, session: "s-6", program: "claude"};
    const facts = {tasks: [], helper_job: "Reviewing plan 1093 against its card", helper_job_title: "Plan 1093 review"};
    const element = await mounted({render: () => h(AgentCard, {row, facts})}, context({}));
    const job = element.querySelector("[data-agent-job]");
    expect(job.textContent).toContain("Plan 1093 review");
    expect(job.textContent).toContain("Reviewing plan 1093 against its card");
    expect(job.textContent.startsWith("Job")).toBe(false);
});
