import {h} from "vue";
import {expect, test, vi} from "vitest";
import AgentCard from "../../core/modules/agents/web/src/AgentCard.vue";
import {context, mounted, page, settle} from "./support/agentWindowContext.js";

vi.mock("../kit/loadWindowComponent.js", () => ({loadWindowComponent: () => import("../../suites/coding/web/src/terminal.js")}));
vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });

const tabs = [
    {key: "tasks", label: "Tasks", read: "usage agents", count_field: "tasks"},
    {key: "transcript", label: "Transcript", read: "agent transcript", count_field: ""},
    {key: "terminal", label: "Terminal", read: "hook-call feed", component: "/modules/journal.suites.coding/terminal.js", count_field: ""},
];

test.each([
    ["helper", "read-only", null],
    ["helper", "read-only", "2026-11-01T00:00:00Z"],
    ["worker", "writing", null],
    ["worker", "writing", "2026-11-01T00:00:00Z"],
])("the %s terminal reads its own commands, including after it ends", async (role, access, ended_at) => {
    const row = {id: 6, role, access, ended_at, session: "s-6", program: "claude"};
    const answers = {"usage tool --agent 6": {ok: true, value: {tool: "", note: ""}}, "agent transcript 6": page([]),
        "hook-call feed --session-agent-id 6": page([{id: 1, hook: "pre_tool_use", tool: "Bash", summary: "echo agent-six", refusal: ""}])};
    const ctx = {...context(answers, 999), tabs};
    const element = await mounted({render: () => h(AgentCard, {row, facts: {tasks: []}, open: true})}, ctx);
    element.querySelector('[data-tab="terminal"]').click();
    await settle();
    await vi.waitFor(() => expect(element.textContent).toContain("echo agent-six"));
    expect(ctx.reads.some((line) => line.startsWith("hook-call feed --session-agent-id 6"))).toBe(true);
    expect(ctx.reads.some((line) => line.startsWith("hook-call feed --session-agent-id 999"))).toBe(false);
});
