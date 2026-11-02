import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {h} from "vue";
import {expect, test} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import AgentRows from "../../core/modules/agents/web/src/AgentRows.vue";

const source = (path) => readFileSync(resolve(__dirname, path), "utf8");

test("a pane gives a flush window no padding, so a window's own padding is not doubled", () => {
    expect(source("../src/windows/PaneStage.vue")).toMatch(/\.pane-body > :deep\(\.window:has\(\[data-window-flush\]\)\) \{\n {4}padding: 0;/);
});

test.each(["../kit/RowCards.vue", "../../core/modules/search/web/src/SearchWindow.vue", "../../suites/coding/web/src/GitOverview.vue", "../../core/modules/documents/web/src/DocumentLibrary.vue"])("%s pads its own parts", (path) => {
    expect(source(path)).toContain("data-window-flush");
});

test("the helpers say none exist when only the main agent runs", async () => {
    const window = context({});
    window.read = async () => ({ok: true, value: {rows: [{id: 1, role: "main", session: "s", program: "claude"}]}});
    const helpers = {render: () => h(AgentRows, {line: "agent list", empty: "No helpers yet", only: (row) => row.role !== "main"})};
    const element = await mounted(helpers, window);
    await settle();
    expect(element.textContent).toContain("No helpers yet");
});
