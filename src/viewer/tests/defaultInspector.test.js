import {createApp, h} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import ResourcePanel from "../src/resource/ResourcePanel.vue";
import {startButtons} from "../src/domain/buttons.js";
import {AllowancePrompts} from "../src/windows/allowancePrompts.js";
import {perLine, settle} from "./support/windowContext.js";

const later = () => new Promise((resolve) => setTimeout(resolve, 60));
const LISTING = (noun, extra = {}) => ({noun, module: "acme", fingerprint: "a", reads: `${noun} show {row_id}`, label: "", title: "{title}", description: "", width: "small", components: [], comments: false, events: [], shareable: false,
    links: {kinds: [], open: false, outside_plan: false, page_size: 10}, ...extra});
const BUTTONS = [{name: "rules.approve", slots: ["row.rule"], label: "Approve the rule", runs: "rule approve {row_id}", fields: [], menu: [], icon: "check", primary: true, condition: null, tip: "", confirm: "", danger: false}];
const MEMORY = {id: 4, text: "Keep it **short**", state: "active", weight: 9, creator_id: 78, created_at: "2026-11-01T10:00:00Z"};
let app = null;

beforeEach(() => {
    vi.stubGlobal("ResizeObserver", class {
        observe() {}
        unobserve() {}
        disconnect() {}
    });
    vi.stubGlobal("fetch", perLine(async (url) => (String(url).startsWith("/api/buttons") ? {ok: true, status: 200, json: async () => ({buttons: BUTTONS, missing: {}})} : {ok: true, json: async () => ({code: 0, value: {}, error: ""})})));
});

afterEach(async () => {
    app?.unmount();
    app = null;
    location.hash = "";
    await later();
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

async function opened(hash, listings, answers) {
    await startButtons("main", new AllowancePrompts(async () => ({ok: true}))).load();
    const catalogue = {inspector: (noun) => listings[noun] ?? null, window: () => null, sectionsAt: () => []};
    const read = async (line) => answers[line.join(" ")] ?? {ok: true, value: {rows: [], total: 0, kinds: {}, counterparts: []}};
    location.hash = hash;
    await later();
    const element = document.createElement("div");
    document.body.append(element);
    app = createApp({render: () => h(ResourcePanel, {read, catalogue, environment: "main"})});
    app.directive("tip", {});
    app.mount(element);
    await later();
    await settle();
    return document.body.querySelector("[data-resource-panel]");
}

test("a memory opens with its text, fields and links in the shared layout", async () => {
    const panel = await opened("#?open=memories:4", {memory: LISTING("memory", {label: "Memory {id} · {state}"})}, {
        "memory show 4": {ok: true, value: MEMORY},
        "link list --row memory:4 --group-counterparts --page-size 1": {ok: true, value: {total: 2, kinds: {task: 2}, counterparts: []}},
    });
    expect(panel.textContent).toContain("Memory 4 · active");
    expect(panel.querySelector("[data-resource-text]").innerHTML).toContain("<strong>short</strong>");
    expect(panel.querySelector("[data-resource-fields]").textContent).toContain("Weight");
    expect(panel.querySelector("[data-inspector-links-count]").textContent).toBe("2");
    expect(panel.querySelector("[data-resource-close]")).not.toBeNull();
});

test("a rule opens in the shared layout with its own buttons", async () => {
    const panel = await opened("#?open=rules:3", {rule: LISTING("rule")}, {"rule show 3": {ok: true, value: {id: 3, text: "Never skip tests", state: "proposed"}}});
    expect(panel.querySelector("[data-resource-text]").textContent).toContain("Never skip tests");
    expect(panel.querySelector("[data-inspector-actions] [data-button='rules.approve']").textContent).toContain("Approve the rule");
});

test("a row whose noun has no inspector shows the failure line, never a blank panel", async () => {
    const panel = await opened("#?open=secret:1", {}, {});
    expect(panel.querySelector("[data-resource-failure]").textContent).toBe("This row has no inspector.");
    expect(panel.querySelector("[data-resource-close]")).not.toBeNull();
});

test("a skill opens in the shared layout with the shared head", async () => {
    const listing = LISTING("agent-skill", {label: "Skill", title: "{skill}", width: "medium", links: null, components: [{window: "skills.skill-body", tab: ""}]});
    const panel = await opened("#?open=agent-skill:3", {"agent-skill": listing}, {"agent-skill show 3": {ok: true, value: {id: 3, skill: "journal-tasks"}}});
    expect(panel.querySelector("[data-resource-title]").textContent).toBe("journal-tasks");
    expect(panel.textContent).toContain("Skill");
    expect(panel.querySelector("[data-resource-close]")).not.toBeNull();
    expect(panel.getAttribute("style")).toContain("min(640px, 100vw)");
    expect(panel.querySelector("[data-inspector-links]")).toBeNull();
});
