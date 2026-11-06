import {h, reactive} from "vue";
import {expect, test} from "vitest";
import AgentCard from "../../core/modules/agents/web/src/AgentCard.vue";
import {context, mounted, settle} from "./support/windowContext.js";

test("the card shows and updates the last hook time", async () => {
    const facts = reactive({tasks: [], last_activity: new Date(Date.now() - 120000).toISOString()});
    const row = {id: 6, role: "worker", access: "writing", session: "s-6", program: "claude", created_at: new Date().toISOString()};
    const element = await mounted({render: () => h(AgentCard, {row, facts})}, context({"usage tool --agent 6": {ok: true, value: {tool: "", note: ""}}}));
    expect(element.querySelector("[data-agent-last-heard]").textContent).toContain("Last heard: 2m ago");
    facts.last_activity = new Date().toISOString();
    await settle();
    expect(element.querySelector("[data-agent-last-heard]").textContent).toContain("Last heard: just now");
});
