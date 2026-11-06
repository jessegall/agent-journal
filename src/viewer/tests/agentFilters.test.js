import {h} from "vue";
import {expect, test, vi} from "vitest";
import AgentRows from "../../core/modules/agents/web/src/AgentRows.vue";
import {context, mounted, page, settle} from "./support/agentWindowContext.js";

vi.stubGlobal("matchMedia", () => ({matches: true}));

test("agent filters combine and are remembered", async () => {
    localStorage.removeItem("journal.agents.filters");
    const ctx = context({"agent cards --options": {ok: true, value: {roles: ["worker", "helper"], profiles: ["reviewer"]}},
        "agent programs": {ok: true, value: {rows: [{name: "codex", title: "Codex"}]}}, "agent cards": page([]), "usage agents": page([])});
    const element = await mounted({render: () => h(AgentRows, {line: "agent cards", empty: "No agents"})}, ctx);
    document.body.append(element);
    element.querySelector("[data-search-menu]").click();
    await settle();
    document.querySelector('[data-filter-role="worker"]').click();
    document.querySelector('[data-filter-program="codex"]').click();
    await settle();
    expect(ctx.reads.some((line) => line.includes('--roles worker') && line.includes('--programs codex'))).toBe(true);
    expect(element.querySelector("[data-menu-count]").textContent).toBe("2");
    expect(JSON.parse(localStorage.getItem("journal.agents.filters")).roles).toEqual(["worker"]);
    expect(element.querySelector("[data-empty-clear]")).not.toBeNull();
    const next = context({"agent cards --options": {ok: true, value: {roles: ["worker"], profiles: []}}, "agent programs": {ok: true, value: {rows: []}}, "agent cards": page([]), "usage agents": page([])});
    await mounted({render: () => h(AgentRows, {line: "agent cards", empty: "No agents"})}, next);
    expect(next.reads.some((line) => line.includes('--roles worker') && line.includes('--programs codex'))).toBe(true);
    localStorage.removeItem("journal.agents.filters");
});
