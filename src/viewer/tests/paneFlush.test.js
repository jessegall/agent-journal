import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {h} from "vue";
import {expect, test} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import {context as agentContext} from "./support/agentWindowContext.js";
import AgentRows from "../../core/modules/agents/web/src/AgentRows.vue";
import WindowRoom from "../kit/WindowRoom.vue";

const source = (path) => readFileSync(resolve(__dirname, path), "utf8");

test.each(["../src/windows/PaneStage.vue", "../src/layout/ViewWindow.vue", "../src/windows/WindowDropdown.vue"])("%s gives a window no padding of its own", (path) => {
    const text = source(path);
    expect(text).not.toContain("data-window-flush");
    expect(text).not.toMatch(/\.window\) \{[^}]*padding/);
    expect(text).not.toMatch(/\.dropdown-body \{[^}]*padding/);
});

test("a window's room pads what it holds as the window says", async () => {
    const drawn = await mounted({render: () => h(WindowRoom, {padding: "14px 16px"}, () => "words")}, context({}));
    expect(drawn.querySelector("[data-window-room]").style.padding).toBe("14px 16px");
});

test("the helpers say none exist when only the main agent runs", async () => {
    const window = agentContext({});
    window.read = async () => ({ok: true, value: {rows: [], page: 1, size: 25, total: 0}});
    const helpers = {render: () => h(AgentRows, {line: "agent cards --helpers", empty: "No helpers yet"})};
    const element = await mounted(helpers, window);
    await settle();
    expect(element.textContent).toContain("No helpers yet");
});
