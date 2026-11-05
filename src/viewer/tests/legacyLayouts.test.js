import {afterEach, expect, test, vi} from "vitest";
import {moveLegacyLayouts} from "../src/windows/legacyLayouts.js";

afterEach(() => vi.unstubAllGlobals());

const OLD = {
    tree: {dir: "row", r: 0.6, a: {id: 1}, b: {id: 2}},
    panes: {1: {tabs: ["chat"], active: "chat", width: "full"}, 2: {tabs: ["tasks", "plans", "gone-view"], active: "plans"}},
    next: 3,
    floats: [{id: 3, view: "terminal", x: 10, y: 10, w: 300, h: 200}],
};

async function movedLayout(layout) {
    const {lines, shellLine} = journal({layout: JSON.stringify(layout)});
    await moveLegacyLayouts(shellLine, "main");
    const [save] = saves(lines);
    return save ? JSON.parse(save[save.indexOf("--layout") + 1]) : null;
}

test("a version 4 layout has every tab, float and active view named by its window", async () => {
    const layout = await movedLayout(OLD);
    expect(layout.panes[1]).toEqual({tabs: ["messages.chat"], active: "messages.chat", width: "full"});
    expect(layout.panes[2].tabs).toEqual(["tasks.tasks", "plans.plans"]);
    expect(layout.panes[2].active).toBe("plans.plans");
    expect(layout.floats[0].view).toBe("coding.terminal");
    expect(layout.tree).toEqual(OLD.tree);
});

test("a layout that is not valid is skipped", async () => {
    expect(await movedLayout({tree: null, panes: {}})).toBeNull();
    expect(await movedLayout({...OLD, next: "x"})).toBeNull();
});

test("a chat pane's hidden version 4 types become the chat window's family switches", async () => {
    const types = [
        {type: "memory", family: "memories.memories", family_title: "Memories", group: "reminders", shown: true, main: true},
        {type: "reminder", family: "memories.reminders", family_title: "Reminders", group: "reminders", shown: false, main: false},
        {type: "compaction", family: "memories.context", family_title: "Context", group: "agent", shown: true, main: true},
    ];
    vi.stubGlobal("fetch", async () => ({ok: true, json: async () => ({marks: types})}));
    const layout = {tree: {id: "a"}, panes: {a: {tabs: ["chat"], active: "chat", hide: ["reminder"]}}, next: 2};
    expect((await movedLayout(layout)).panes.a.options).toEqual({"show-memories.memories": true, "show-memories.reminders": false, "show-memories.context": true});
});

function journal(settings, saved = {}) {
    const lines = [];
    const shellLine = async (line) => {
        lines.push(line);
        const words = line.join(" ");
        if (words.startsWith("suite current")) return {ok: true, value: {suite: "coding", drivers: "main: coding.builder, worker: coding.worker"}};
        if (line[0] === "window" && line[1] === "setting") return line[3] in settings ? {ok: true, value: {value: settings[line[3]]}} : {ok: false, error: "none"};
        if (line[0] === "viewer-layout" && line[1] === "current") return line[line.indexOf("--page") + 1] in saved ? {ok: true, value: {layout: "{}", version: 1}} : {ok: true, value: null};
        return {ok: true, value: {}};
    };
    return {lines, shellLine};
}

const saves = (lines) => lines.filter((line) => line[0] === "viewer-layout" && line[1] === "save");

test("each version 4 layout setting is read once and saved under the suite, page and driver it now belongs to", async () => {
    const {lines, shellLine} = journal({layout: JSON.stringify(OLD), worker_layout: JSON.stringify(OLD), inspector_layout: "not json"});
    await moveLegacyLayouts(shellLine, "main");
    const keys = saves(lines).map((line) => [line[line.indexOf("--page") + 1], line[line.indexOf("--driver") + 1]]);
    expect(keys).toEqual([["home", "coding.builder"], ["agent", "coding.worker"]]);
    expect(JSON.parse(saves(lines)[0][saves(lines)[0].indexOf("--layout") + 1]).panes[1].tabs).toEqual(["messages.chat"]);
    expect(lines.at(-1)).toEqual(["window", "save-setting", "viewer.shell", "layouts_moved", "true"]);
});

test("once moved, nothing is read again, and a page that already has a saved layout keeps it", async () => {
    const moved = journal({layouts_moved: true, layout: JSON.stringify(OLD)});
    await moveLegacyLayouts(moved.shellLine, "main");
    expect(saves(moved.lines)).toEqual([]);
    const kept = journal({layout: JSON.stringify(OLD)}, {home: true});
    await moveLegacyLayouts(kept.shellLine, "main");
    expect(saves(kept.lines)).toEqual([]);
});
