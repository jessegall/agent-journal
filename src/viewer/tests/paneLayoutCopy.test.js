import {afterEach, expect, test, vi} from "vitest";
import {paneLayout} from "../src/windows/paneLayout.js";

const AT = {environment: "main", person: 1, suite: "coding", page: "home", driver: "builder"};
const KEPT = {tree: {id: 1}, next: 2, panes: {1: {tabs: ["messages.chat"], active: "messages.chat"}}};
const SERVED = {tree: {id: 1}, next: 2, panes: {1: {tabs: ["tasks.tasks"], active: "tasks.tasks"}}};
const entry = (name) => ({name, title: name});
const emptyTab = {read: () => null, write: () => {}};

function browserCopy(kept = null) {
    const rows = new Map(kept ? [["key", kept]] : []);
    return {rows, read: () => rows.get("key") ?? null, write: (key, layout) => key.startsWith("journal.layout.") && rows.set("key", layout)};
}

afterEach(() => vi.restoreAllMocks());

test("a new tab draws the layout this browser kept before the server has answered", async () => {
    let answer;
    const served = new Promise((resolve) => (answer = resolve));
    const store = paneLayout({saved: () => served, defaults: async () => null, save: async () => ({ok: true}), tab: emptyTab, copy: browserCopy(KEPT), entry});
    const loading = store.load(AT);
    await Promise.resolve();
    await Promise.resolve();
    expect(store.ready.value).toBe(true);
    expect(store.layout.value.panes[1].tabs).toEqual(["messages.chat"]);
    answer({layout: SERVED, version: 1});
    await loading;
});

test("the server's layout then takes over and is kept for the next load", async () => {
    const copy = browserCopy(KEPT);
    const store = paneLayout({saved: async () => ({layout: SERVED, version: 1}), defaults: async () => null, save: async () => ({ok: true}), tab: emptyTab, copy, entry});
    await store.load(AT);
    expect(store.layout.value.panes[1].tabs).toEqual(["tasks.tasks"]);
    expect(copy.rows.get("key").panes[1].tabs).toEqual(["tasks.tasks"]);
});

test("with nothing kept the stage waits for the server, so no wrong layout is drawn", async () => {
    let answer;
    const served = new Promise((resolve) => (answer = resolve));
    const store = paneLayout({saved: () => served, defaults: async () => null, save: async () => ({ok: true}), tab: emptyTab, copy: browserCopy(), entry});
    const loading = store.load(AT);
    await Promise.resolve();
    expect(store.ready.value).toBe(false);
    answer({layout: SERVED, version: 1});
    await loading;
    expect(store.ready.value).toBe(true);
});

test("a kept copy that is not a layout is ignored", async () => {
    const store = paneLayout({saved: async () => ({layout: SERVED, version: 1}), defaults: async () => null, save: async () => ({ok: true}), tab: emptyTab, copy: browserCopy({nonsense: true}), entry});
    await store.load(AT);
    expect(store.layout.value.panes[1].tabs).toEqual(["tasks.tasks"]);
});
