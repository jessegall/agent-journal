import {expect, test} from "vitest";
import ContextPanel from "../../core/modules/usage/web/src/ContextPanel.vue";
import {mounted} from "./support/windowContext.js";
import {usageWindowContext} from "./support/usageWindowContext.js";

test("context uses the main agent's usage and last compaction from its window key", async () => {
    const at = "2026-11-06T10:00:00Z";
    const window = usageWindowContext({"usage show": {ok: true, value: {agents: [
        {id: 1, role: "main", context_percent: 43.7, last_compacted_at: at},
        {id: 2, role: "worker", context_percent: 90},
    ]}}});
    const element = await mounted(ContextPanel, window);
    expect(window.reads).toEqual(["usage show"]);
    expect(element.querySelector("[data-context-meter] strong").textContent).toBe("44%");
    expect(element.querySelector("[data-last-compacted]").textContent).toContain(new Date(at).toLocaleString());
});

test("context shows zero and no compaction when there is no main agent", async () => {
    const element = await mounted(ContextPanel, usageWindowContext({"usage show": {ok: true, value: {agents: []}}}));
    expect(element.querySelector("[data-context-meter] strong").textContent).toBe("0%");
    expect(element.querySelector("[data-last-compacted]").textContent).toContain("Not yet");
});
