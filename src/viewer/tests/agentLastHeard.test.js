import {h, reactive, ref} from "vue";
import {expect, test, vi} from "vitest";
import AgentCard from "../../core/modules/agents/web/src/AgentCard.vue";
import {context, mounted, settle} from "./support/agentWindowContext.js";

test("the card shows and updates the last hook time", async () => {
    const facts = reactive({tasks: [], last_activity: new Date(Date.now() - 120000).toISOString()});
    const row = {id: 6, role: "worker", access: "writing", session: "s-6", program: "claude", created_at: new Date().toISOString()};
    const element = await mounted({render: () => h(AgentCard, {row, facts, open: true})}, context({"usage tool --agent 6": {ok: true, value: {tool: "", note: ""}}}));
    expect(element.querySelector("[data-agent-identity]").textContent).toBe("worker 6");
    expect(element.querySelector("[data-agent-last-heard]").textContent).toContain("Last heard: 2m ago");
    facts.last_activity = new Date().toISOString();
    await settle();
    expect(element.querySelector("[data-agent-last-heard]").textContent).toContain("Last heard: just now");
});

test("a closed card reads no command until it opens", async () => {
    const open = ref(false);
    const row = {id: 6, role: "worker", access: "writing", session: "s-6", program: "claude", created_at: new Date().toISOString()};
    const held = context({"usage tool --agent 6": {ok: true, value: {tool: "Bash make test", note: ""}}});
    const element = await mounted({render: () => h(AgentCard, {row, open: open.value})}, held);
    expect(held.reads).not.toContain("usage tool --agent 6");
    expect(element.querySelector("[data-agent-actions]")).toBeNull();
    open.value = true;
    await settle();
    expect(held.reads).toContain("usage tool --agent 6");
    await vi.waitFor(() => expect(element.querySelector("[data-agent-command]").textContent).toContain("Bash make test"));
});
