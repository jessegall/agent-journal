import {h} from "vue";
import {expect, test} from "vitest";
import AgentCard from "../../core/modules/agents/web/src/AgentCard.vue";
import AllowanceBar from "../src/shell/AllowanceBar.vue";
import {appended, settle} from "./support/windowContext.js";
import {context, mounted} from "./support/agentWindowContext.js";

const RESET = 1794085200;

test("the status bar says the plan is at its usage limit and when it starts again", async () => {
    const element = appended(AllowanceBar, {windows: [{title: "5 hours", used_percent: 100, reset_epoch_seconds: RESET}]});
    await settle();
    const fact = element.querySelector("[data-fact=usage]");
    expect(fact.textContent).toContain("At usage limit");
    expect(fact.title).toContain(`starts again ${new Date(RESET * 1000).toLocaleString()}`);
});

test("the status bar shows the percent and the reset time below the limit", async () => {
    const element = appended(AllowanceBar, {windows: [{title: "5 hours", used_percent: 98, reset_epoch_seconds: RESET}]});
    await settle();
    const fact = element.querySelector("[data-fact=usage]");
    expect(fact.textContent).toContain("98%");
    expect(fact.title).toContain(`starts again ${new Date(RESET * 1000).toLocaleString()}`);
});

test("an agent card at the usage limit says so with the time the allowance starts again", async () => {
    const limited = new Date(RESET * 1000).toISOString();
    const facts = {job_enabled: true, tasks: [], state: "at usage limit", usage_limit_ends_at: limited};
    const row = {id: 6, role: "worker", access: "writing", state: "running", session: "s-6", program: "claude", created_at: new Date().toISOString()};
    const element = await mounted({render: () => h(AgentCard, {row, facts})}, context({}));
    expect(element.textContent).toContain(`At usage limit: starts again ${new Date(limited).toLocaleString()}`);
});
