import {h} from "vue";
import {expect, test} from "vitest";
import AgentCard from "../../core/modules/agents/web/src/AgentCard.vue";
import {context, mounted} from "./support/agentWindowContext.js";

test("an opened helper has its own information band and no stop button", async () => {
    const row = {id: 6, role: "helper", access: "read-only", session: "s-6", program: "claude", created_at: new Date().toISOString()};
    const progress = {branch: "worker-6"};
    const facts = {id: 6, tasks: [], model: "model-six", effort: "high", context_percent: 25, cost_dollars: 5.94};
    const ctx = context({"usage tool --agent 6": {ok: true, value: {tool: "", note: ""}}, "agent programs": {ok: true, value: {rows: [{name: "claude", title: "Claude"}]}}});
    const element = await mounted({render: () => h(AgentCard, {row, facts, progress, open: true})}, ctx);
    const band = element.querySelector("[data-information-bar]");
    expect(band.textContent).toContain("Claude");
    expect(band.textContent).toContain("25%");
    expect(band.textContent).toContain("model-six");
    expect(band.textContent).toContain("high");
    expect(band.textContent).toContain("$5.94");
    expect(band.textContent).toContain("worker-6");
    expect(element.querySelector("[data-helper-stop]")).toBeNull();
    expect(band.querySelector('[data-fact="jobs"]')).toBeNull();
});

test("an opened worker shows its branch without a helper stop button", async () => {
    const row = {id: 7, role: "worker", access: "writing", session: "s-7", program: "codex", created_at: new Date().toISOString()};
    const facts = {id: 7, tasks: [], model: "model-seven", context_percent: 40};
    const ctx = context({"usage tool --agent 7": {ok: true, value: {tool: "", note: ""}}});
    const element = await mounted({render: () => h(AgentCard, {row, facts, progress: {branch: "worker-7"}, open: true})}, ctx);
    const band = element.querySelector("[data-information-bar]");
    expect(band.textContent).toContain("worker-7");
    expect(band.textContent).toContain("40%");
    expect(element.querySelector("[data-helper-stop]")).toBeNull();
});

test.each([
    ["tests running", false], ["judging", false], ["waiting for the merge", false], ["with the main agent", false],
    ["tests running", true], ["judging", true], ["waiting for the merge", true], ["with the main agent", true],
])("a card keeps the pending work status %s when open is %s", async (status, open) => {
    const row = {id: 8, role: "worker", access: "writing", session: "s-8", program: "codex", state: "running", created_at: "2026-11-01T10:00:00Z", ended_at: "2026-11-01T11:00:00Z"};
    const facts = {id: 8, tasks: [{id: 1, state: "completed"}], work_status: status};
    const element = await mounted({render: () => h(AgentCard, {row, facts, open})}, context({"usage tool --agent 8": {ok: true, value: {tool: "", note: ""}}}));
    expect(element.querySelector(".agent-dot").dataset.state).toBe("waiting");
    expect(element.querySelector("[data-agent-status] [role='tooltip'] b").textContent).toBe(`Status: ${status}`);
    expect(element.querySelector("[data-agent-status] [role='tooltip'] span").textContent).toMatch(/^Since: \d/);
    expect(element.querySelector("[data-agent-stopped]")).toBeNull();
});
