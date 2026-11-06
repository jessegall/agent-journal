import {afterEach, expect, test} from "vitest";
import {h} from "vue";
import {context, mounted, page, pickButton, settle} from "./support/windowContext.js";
import AgentRows from "../../core/modules/agents/web/src/AgentRows.vue";
import {agentFilterOptions} from "./support/agentFilterOptions.js";

afterEach(() => (document.body.innerHTML = ""));

test("the agents window reads the selected state from the query", async () => {
    const worker = {id: 4, session: "s-worker", program: "claude", role: "worker", state: "idle", ended_at: "2026-11-03T02:00:00Z"};
    const answers = {"agent cards --options": agentFilterOptions, "agent cards --show running": page([]), "agent cards --show idle": page([worker]), "agent cards --show retired": page([]), "agent cards --show all": page([worker])};
    const held = context(answers);
    const element = await mounted({render: () => h(AgentRows, {line: "agent cards", empty: "No agents yet"})}, held);
    document.body.append(element);
    expect(element.querySelector('[data-agent-row="4"]')).toBeNull();
    await pickButton(element, "Idle");
    expect(element.querySelector('[data-agent-row="4"]')).not.toBeNull();
    await pickButton(element, "Retired");
    expect(element.querySelector('[data-agent-row="4"]')).toBeNull();
    await pickButton(element, "All");
    await settle();
    expect(element.querySelector('[data-agent-row="4"]')).not.toBeNull();
});
