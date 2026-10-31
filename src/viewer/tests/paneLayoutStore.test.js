import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {paneLayout, SAVE_DELAY_MS, tabKey} from "../src/windows/paneLayout.js";
import {arranged, fresh} from "../src/domain/panes.js";

const KEY = {environment: "main", person: 7, suite: "coding", page: "home", driver: "coding.builder"};
const CHAT = {name: "messages.chat", title: "Chat", options: [{key: "hide"}]};
const TASKS = {name: "tasks.tasks", title: "Tasks", options: []};
const shapeOf = (...windows) => ({tabs: windows, active: windows[0]});
const layoutOf = (...windows) => arranged(fresh(), shapeOf(...windows)).layout;
const firstPane = (layout) => Object.values(layout.panes)[0];

// a person's saved layout on a fake server, with its version, that refuses a save over a newer version
function server(layout = null) {
    return {layout, version: layout ? 1 : null, saves: []};
}

function store({copies = {}, stored = server(), shape = null, windows = [CHAT, TASKS], refusal = ""} = {}) {
    const tab = {read: (at) => copies[at] ?? null, write: (at, layout) => (copies[at] = layout)};
    const layouts = paneLayout({
        saved: async () => (stored.layout ? {layout: stored.layout, version: stored.version} : null),
        defaults: async () => shape,
        save: async (key, layout, base) => {
            if (refusal) return {ok: false, error: refusal};
            if (stored.version !== null && base !== stored.version) return {ok: false, error: "the layout was saved again"};
            stored.saves.push([key, layout]);
            stored.layout = layout;
            stored.version = (stored.version ?? 0) + 1;
            return {ok: true, version: stored.version};
        },
        tab,
        entry: (name) => windows.find((window) => window.name === name) || null,
    });
    return {layouts, copies, stored};
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test("the tab key names the environment, the person, the suite, page and driver", () => {
    expect(tabKey(KEY)).toBe("journal.layout.main.7.coding.home.coding.builder");
});

test("two people on one browser each load their own tab copy", async () => {
    const copies = {[tabKey(KEY)]: layoutOf("tasks.tasks"), [tabKey({...KEY, person: 8})]: layoutOf("messages.chat")};
    const first = store({copies});
    await first.layouts.load(KEY);
    const second = store({copies});
    await second.layouts.load({...KEY, person: 8});
    expect([firstPane(first.layouts.layout.value).tabs, firstPane(second.layouts.layout.value).tabs]).toEqual([["tasks.tasks"], ["messages.chat"]]);
});

test("the browser tab's copy comes first, then the person's saved layout, then the suite's", async () => {
    const copy = layoutOf("tasks.tasks");
    const saved = layoutOf("messages.chat", "tasks.tasks");
    const first = store({copies: {[tabKey(KEY)]: copy}, stored: server(saved), shape: shapeOf("messages.chat")});
    await first.layouts.load(KEY);
    expect(firstPane(first.layouts.layout.value).tabs).toEqual(["tasks.tasks"]);
    const second = store({stored: server(saved), shape: shapeOf("messages.chat")});
    await second.layouts.load(KEY);
    expect(firstPane(second.layouts.layout.value).tabs).toEqual(["messages.chat", "tasks.tasks"]);
    const third = store({shape: shapeOf("messages.chat")});
    await third.layouts.load(KEY);
    expect(firstPane(third.layouts.layout.value).tabs).toEqual(["messages.chat"]);
});

test("a suite with no layout for the page starts from one empty pane", async () => {
    const {layouts} = store();
    await layouts.load(KEY);
    expect(firstPane(layouts.layout.value).tabs).toEqual([]);
});

test("a corrupt tab copy and a badly shaped saved layout are passed over for the next source", async () => {
    const {layouts} = store({copies: {[tabKey(KEY)]: {tree: {}}}, stored: server({panes: 3}), shape: shapeOf("messages.chat")});
    await layouts.load(KEY);
    expect(firstPane(layouts.layout.value).tabs).toEqual(["messages.chat"]);
});

test("a change is copied to the tab at once and saved half a second later, once for a burst", async () => {
    const {layouts, copies, stored} = store({shape: shapeOf("messages.chat", "tasks.tasks")});
    await layouts.load(KEY);
    const changed = layoutOf("tasks.tasks", "messages.chat");
    layouts.replace(changed);
    layouts.replace(changed);
    expect(firstPane(copies[tabKey(KEY)]).tabs).toEqual(["tasks.tasks", "messages.chat"]);
    expect(stored.saves).toEqual([]);
    await vi.advanceTimersByTimeAsync(SAVE_DELAY_MS);
    expect(stored.saves.map(([key, layout]) => [key, firstPane(layout).tabs])).toEqual([[KEY, ["tasks.tasks", "messages.chat"]]]);
});

test("a save still waiting when the page loads another key is sent under its own key, never the next one", async () => {
    const {layouts, stored} = store({shape: shapeOf("messages.chat")});
    await layouts.load(KEY);
    layouts.replace(layoutOf("tasks.tasks"));
    await layouts.load({...KEY, driver: "coding.orchestrator"});
    await vi.advanceTimersByTimeAsync(SAVE_DELAY_MS * 2);
    expect(stored.saves.map(([key]) => key.driver)).toEqual(["coding.builder"]);
});

test("a layout saved before titles and options loads unchanged and writes nothing back", async () => {
    const saved = layoutOf("messages.chat", "chat");
    const {layouts, stored} = store({stored: server(saved)});
    await layouts.load(KEY);
    await vi.advanceTimersByTimeAsync(SAVE_DELAY_MS * 2);
    expect(layouts.layout.value.tree).toEqual(saved.tree);
    expect(firstPane(layouts.layout.value).tabs).toEqual(["messages.chat", "chat"]);
    expect(layouts.gone.value).toEqual(["chat"]);
    expect(stored.saves).toEqual([]);
});

test("a placed tab keeps its window's title, and an option key no window of the pane declares is dropped", async () => {
    const {layouts} = store({shape: shapeOf("messages.chat")});
    await layouts.load(KEY);
    const layout = layouts.layout.value;
    const id = Object.keys(layout.panes)[0];
    layouts.replace({...layout, panes: {[id]: {...layout.panes[id], options: {hide: ["fault"], flush: true}}}});
    expect(firstPane(layouts.layout.value).titles).toEqual({"messages.chat": "Chat"});
    expect(firstPane(layouts.layout.value).options).toEqual({hide: ["fault"]});
});

test("of two tabs saving one layout, the second's save over a newer version loads that version instead", async () => {
    const stored = server(layoutOf("messages.chat"));
    const first = store({stored});
    const second = store({stored});
    await first.layouts.load(KEY);
    await second.layouts.load(KEY);
    first.layouts.replace(layoutOf("tasks.tasks"));
    await vi.advanceTimersByTimeAsync(SAVE_DELAY_MS);
    second.layouts.replace(layoutOf("messages.chat", "tasks.tasks"));
    await vi.advanceTimersByTimeAsync(SAVE_DELAY_MS);
    expect(stored.saves.length).toBe(1);
    expect(firstPane(second.layouts.layout.value).tabs).toEqual(["tasks.tasks"]);
    expect(second.layouts.refusal.value).toBe("the layout was saved again");
});

test("a save the server refuses keeps the tab copy and shows the refusal", async () => {
    const {layouts, copies} = store({shape: shapeOf("messages.chat"), refusal: "only a person keeps a layout"});
    await layouts.load(KEY);
    layouts.replace(layoutOf("tasks.tasks"));
    await vi.advanceTimersByTimeAsync(SAVE_DELAY_MS);
    expect(layouts.refusal.value).toBe("only a person keeps a layout");
    expect(firstPane(copies[tabKey(KEY)]).tabs).toEqual(["tasks.tasks"]);
});
