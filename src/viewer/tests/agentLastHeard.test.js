import {h, reactive, ref} from "vue";
import {expect, test, vi} from "vitest";
import AgentCard from "../../core/modules/agents/web/src/AgentCard.vue";
import {context, mounted, settle} from "./support/agentWindowContext.js";

test("an open card has no Seen line between its badges and its tabs; its dot says and updates when it was last seen", async () => {
    const facts = reactive({job_enabled: true, tasks: [], last_activity: new Date(Date.now() - 120000).toISOString()});
    const row = {id: 6, number: 2, role: "worker", access: "writing", session: "s-6", program: "claude", created_at: new Date().toISOString()};
    const element = await mounted({render: () => h(AgentCard, {row, facts, open: true})}, context({"usage tool --agent 2": {ok: true, value: {tool: "", note: ""}}}));
    expect(element.querySelector("[data-agent-identity]")).toBeNull();
    expect(element.querySelector("[data-agent-last-heard]")).toBeNull();
    expect(element.querySelector("[data-information-bar]").nextElementSibling.matches("[data-agent-status]")).toBe(true);
    expect(element.querySelector("[data-agent-status]").getAttribute("aria-label")).toContain("Seen: 2m ago");
    facts.last_activity = new Date().toISOString();
    await settle();
    expect(element.querySelector("[data-agent-status]").getAttribute("aria-label")).toContain("Seen: just now");
});

test("a closed card reads no command until it opens", async () => {
    const open = ref(false);
    const row = {id: 6, number: 2, role: "worker", access: "writing", session: "s-6", program: "claude", created_at: new Date().toISOString()};
    const view = context({"usage tool --agent 2": {ok: true, value: {tool: "Bash make test", note: ""}}});
    const element = await mounted({render: () => h(AgentCard, {row, open: open.value})}, view);
    expect(view.reads).not.toContain("usage tool --agent 2");
    expect(element.querySelector("[data-agent-actions]")).toBeNull();
    open.value = true;
    await settle();
    expect(view.reads).toContain("usage tool --agent 2");
    await vi.waitFor(() => expect(element.querySelector("[data-agent-command]").textContent).toContain("Bash make test"));
});
