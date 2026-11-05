import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import PaneGrid from "../src/panes/PaneGrid.vue";
import WindowPane from "../src/windows/WindowPane.vue";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";
import {paneLayout} from "../src/windows/paneLayout.js";
import {settle} from "./support/windowContext.js";

afterEach(() => (document.body.innerHTML = ""));

test("a pane grid eases nothing in its first moments, so a layout that arrives does not narrow a wide pane", async () => {
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(PaneGrid, {panes: [], splits: []})}).mount(element);
    await nextTick();
    expect(element.querySelector(".pane-grid").classList.contains("still")).toBe(true);
});

test("a window the catalogue has not answered for is a skeleton, not a module that is not installed", async () => {
    const catalogue = new WindowCatalogue(async () => ({windows: []}));
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(WindowPane, {name: "tasks.tasks", catalogue, subscriptions: {}, environment: "main"})}).mount(element);
    await nextTick();
    expect(element.textContent).not.toContain("No installed module");
    await catalogue.load();
    await settle();
    expect(element.textContent).toContain("No installed module");
});

test("a layout kept in the tab is drawn before the server answers", async () => {
    const mine = {tree: {id: 1}, panes: {1: {tabs: ["messages.chat"], active: "messages.chat"}}, next: 2};
    let release;
    const gate = new Promise((resolve) => (release = resolve));
    const layout = paneLayout({saved: async () => (await gate, null), defaults: async () => null, save: async () => ({ok: true}), tab: {read: () => mine, write: () => {}}, entry: (name) => ({name, place: "pane", shows: "environment"})});
    const loading = layout.load("home");
    await nextTick();
    expect(JSON.stringify(layout.layout.value)).toContain("messages.chat");
    release();
    await loading;
    vi.unstubAllGlobals();
});

test("a layout is not ready until it is loaded, and a page that loads none is settled all the same", async () => {
    const layout = paneLayout({saved: async () => null, defaults: async () => null, save: async () => ({ok: true}), tab: {read: () => null, write: () => {}}, entry: (name) => ({name, place: "pane", shows: "environment"})});
    expect(layout.ready.value).toBe(false);
    layout.settle();
    expect(layout.ready.value).toBe(true);
});
