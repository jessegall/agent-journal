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

test.each([["fresh", "codex, new conversation"], ["resumed", "codex, resumed"]])("a helper's row names the program of its job and whether the job began a new conversation", async (occupant_launch, text) => {
    const row = {id: 6, role: "helper", access: "read-only", ended_at: null, session: "s-6", program: "claude"};
    const facts = {tasks: [], helper_job: "Reviewing plan 1093", helper_job_program: "codex", occupant_launch};
    const element = await mounted({render: () => h(AgentCard, {row, facts})}, context({}));
    expect(element.querySelector("[data-agent-job-launch]").textContent).toBe(text);
});

test("a helper's row with a job from before programs were recorded shows no launch text", async () => {
    const row = {id: 6, role: "helper", access: "read-only", ended_at: null, session: "s-6", program: "claude"};
    const element = await mounted({render: () => h(AgentCard, {row, facts: {tasks: [], helper_job: "Reviewing plan 1093"}})}, context({}));
    expect(element.querySelector("[data-agent-job-launch]")).toBeNull();
});

test.each([[null, false, "Stop"], ["2026-11-01T00:00:00Z", true, "End job"]])("an open helper card offers to stop a running helper and to end the open job of a stopped one", async (ended_at, helper_job_open, label) => {
    const row = {id: 6, number: 3, role: "helper", access: "read-only", ended_at, session: "s-6", program: "claude"};
    const lines = [];
    const window = {...context({}), run: async (line) => lines.push(line)};
    const element = await mounted({render: () => h(AgentCard, {row, facts: {tasks: [], helper_job_open}, open: true})}, window);
    const button = element.querySelector("[data-helper-stop]");
    expect(button.textContent.trim()).toBe(label);
    button.click();
    expect(lines).toEqual([["helper", "stop", "3"]]);
});

test("the open card of a stopped helper whose job ended offers no stop", async () => {
    const row = {id: 6, number: 3, role: "helper", access: "read-only", ended_at: "2026-11-01T00:00:00Z", session: "s-6", program: "claude"};
    const element = await mounted({render: () => h(AgentCard, {row, facts: {tasks: [], helper_job_open: false}, open: true})}, context({}));
    expect(element.querySelector("[data-helper-stop]")).toBeNull();
});
