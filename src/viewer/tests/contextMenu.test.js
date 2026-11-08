import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import InformationBar from "../src/shell/InformationBar.vue";
import {compactionLine} from "../src/domain/compaction.js";
import {settle} from "./support/windowContext.js";

vi.stubGlobal("ResizeObserver", class {
    observe() {}

    disconnect() {}
});

afterEach(() => (document.body.innerHTML = ""));

const AT = "2026-11-06T21:03:11.000000+00:00";
const EXACT = new Date(AT).toLocaleString("en-GB", {dateStyle: "medium", timeStyle: "medium"});
const GROUPS = [{key: "context", label: "Context window", choices: [{value: "compact", label: "Compact context"}, {value: "clear", label: "Clear context"}]}];

async function menu(last_compaction, extra = {}) {
    const usage = {agents: [{id: 7, model: "sonnet", effort: "low", context_percent: 95, last_compaction, ...extra}], windows: []};
    const run = async (line) => (line[1] === "controls" ? {ok: true, value: {groups: GROUPS}} : {ok: true, value: {rows: []}});
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(InformationBar, {agent: {id: 7, ended_at: null, program: "claude", session: "s"}, run, usage, controlGroups: GROUPS})}).mount(element);
    await settle();
    element.querySelector('[data-fact="context"]').click();
    await settle();
    return document;
}

test("the context menu shows how full the context is as a bar and the exact time of the last compaction", async () => {
    const page = await menu({started_at: AT, start_percent: 92, end_percent: 18});
    expect(page.querySelector("[data-context-menu-meter] .context-used").textContent).toBe("95%");
    expect(page.querySelector("[data-context-menu-meter] .gauge span").style.width).toBe("95%");
    expect(page.querySelector("[data-context-menu-compaction]").textContent).toBe(`Last compacted ${EXACT}`);
    expect(page.querySelector("[data-context-menu-compaction]").nextElementSibling).toBe(page.querySelector("[data-context-menu-meter]"));
    expect(page.body.textContent).toContain("Compact context");
});

test("the context menu shows the tokens out of the limit and a Capped badge while a limit caps the agent", async () => {
    const page = await menu(null, {context_tokens: 248000, context_limit_tokens: 400000});
    expect(page.querySelector("[data-context-menu-cap]").textContent.replace(/\s+/g, " ").trim()).toBe("248k of 400k Capped");
});

test("the context menu shows no limit when none caps the agent", async () => {
    const page = await menu(null, {context_tokens: 248000, context_limit_tokens: null});
    expect(page.querySelector("[data-context-menu-cap]")).toBeNull();
    expect(page.querySelector("[data-context-menu-meter] .context-used").textContent).toBe("95%");
});

test("the context menu says none yet for a session never compacted", async () => {
    const page = await menu(null);
    expect(page.querySelector("[data-context-menu-compaction]").textContent).toBe("Not compacted yet");
});

test("a compaction shows the time alone, whatever percents it has", () => {
    expect(compactionLine({started_at: AT, start_percent: 92, end_percent: null})).toBe(`Last compacted ${EXACT}`);
    expect(compactionLine({started_at: AT, start_percent: null, end_percent: null})).toBe(`Last compacted ${EXACT}`);
});
