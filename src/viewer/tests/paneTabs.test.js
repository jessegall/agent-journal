import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {createApp, h} from "vue";
import {afterEach, expect, test} from "vitest";
import EditorTabs from "../kit/EditorTabs.vue";
import PaneTabs from "../src/panes/PaneTabs.vue";
import ContextMenuHost from "../src/shell/ContextMenuHost.vue";
import {settle} from "./support/windowContext.js";

const TABS = [
    {key: "a.tasks", title: "Tasks", icon: "window", on: true, count: 3},
    {key: "a.plans", title: "Plans", icon: "window"},
    {key: "a.chat", title: "Chat", icon: "window"},
];
const apps = [];
let events = [];

function mount(component, props = {}) {
    events = [];
    const element = document.createElement("div");
    document.body.append(element);
    const listeners = Object.fromEntries(["pick", "close", "grab", "split", "detach"].map((name) => [`on${name[0].toUpperCase()}${name.slice(1)}`, (...args) => events.push([name, ...args.filter((arg) => typeof arg === "string")])]));
    const app = createApp({render: () => h(component, {tabs: TABS, ...props, ...listeners})});
    app.mount(element);
    apps.push(app);
    const host = document.createElement("div");
    document.body.append(host);
    const hostApp = createApp(ContextMenuHost);
    hostApp.mount(host);
    apps.push(hostApp);
    return element;
}

afterEach(() => {
    apps.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
});

const tab = (element, key) => element.querySelector(`[data-tab="${key}"]`);
const menu = () => document.body.querySelector("[data-context-menu]");
const item = (label) => [...menu().querySelectorAll("[data-menu-item]")].find((button) => button.querySelector(".context-label").textContent === label);
const labels = () => [...menu().querySelectorAll(".context-label")].map((label) => label.textContent);

async function openMenu(element, key) {
    tab(element, key).dispatchEvent(new MouseEvent("contextmenu", {bubbles: true, cancelable: true, clientX: 20, clientY: 20}));
    await settle();
}

test("test_cross_slot_reserved: every tab has its cross slot, the slot never changes width and nothing grows in after half a second", () => {
    const element = mount(EditorTabs);
    expect(element.querySelectorAll(".pane-tab-x").length).toBe(3);
    const source = readFileSync(resolve(__dirname, "../kit/EditorTabs.vue"), "utf8");
    const rule = source.match(/\.pane-tab-x \{[^}]*\}/)[0];
    expect(rule).toMatch(/width: 16px/);
    expect(rule).not.toMatch(/transition/);
    expect(source).not.toMatch(/transition-delay/);
    for (const shown of [".pane-tab.on .pane-tab-x", ".pane-tab:hover .pane-tab-x", ".pane-tab:focus-visible .pane-tab-x", ".pane-tab.menu-target .pane-tab-x"]) expect(source).toContain(shown);
});

test("test_middle_click_closes: a middle click closes the tab, a plain or right click does not", () => {
    const element = mount(EditorTabs);
    tab(element, "a.plans").dispatchEvent(new MouseEvent("auxclick", {bubbles: true, cancelable: true, button: 2}));
    tab(element, "a.plans").dispatchEvent(new MouseEvent("click", {bubbles: true, button: 0}));
    expect(events).toEqual([]);
    const middle = new MouseEvent("auxclick", {bubbles: true, cancelable: true, button: 1});
    tab(element, "a.plans").dispatchEvent(middle);
    expect(events).toEqual([["close", "a.plans"]]);
    expect(middle.defaultPrevented).toBe(true);
});

test("test_delete_key_closes: Delete on a focused tab closes it", () => {
    const element = mount(EditorTabs);
    tab(element, "a.chat").dispatchEvent(new KeyboardEvent("keydown", {key: "Delete", bubbles: true, cancelable: true}));
    expect(events).toEqual([["close", "a.chat"]]);
});

test("test_close_others_and_to_the_right: the tab menu closes the others, the ones to the right, or all, and a right click picks nothing", async () => {
    const element = mount(EditorTabs);
    await openMenu(element, "a.plans");
    expect(events).toEqual([]);
    expect(labels()).toEqual(["Close", "Close others", "Close to the right", "Close all"]);
    expect(tab(element, "a.plans").classList.contains("menu-target")).toBe(true);
    item("Close others").click();
    await new Promise((resolve) => setTimeout(resolve));
    expect(events).toEqual([["close", "a.tasks"], ["close", "a.chat"]]);
    events.length = 0;
    await openMenu(element, "a.plans");
    item("Close to the right").click();
    await new Promise((resolve) => setTimeout(resolve));
    expect(events).toEqual([["close", "a.chat"]]);
    events.length = 0;
    await openMenu(element, "a.chat");
    expect(item("Close to the right").disabled).toBe(true);
    item("Close all").click();
    await new Promise((resolve) => setTimeout(resolve));
    expect(events.map(([, key]) => key)).toEqual(["a.tasks", "a.plans", "a.chat"]);
});

test("a window tab adds Split right, Split below and Detach to its menu, for that tab and not the open one", async () => {
    const element = mount(PaneTabs);
    await openMenu(element, "a.plans");
    expect(labels()).toEqual(["Close", "Close others", "Close to the right", "Close all", "Split right", "Split below", "Detach"]);
    item("Split below").click();
    await new Promise((resolve) => setTimeout(resolve));
    expect(events).toEqual([["split", "a.plans", "bottom"]]);
    events.length = 0;
    await openMenu(element, "a.plans");
    item("Detach").click();
    await new Promise((resolve) => setTimeout(resolve));
    expect(events).toEqual([["detach", "a.plans"]]);
});

test("a pane with one window cannot split, and its only tab has no others to close", async () => {
    const element = mount(PaneTabs, {tabs: [TABS[0]]});
    await openMenu(element, "a.tasks");
    expect(item("Split right").disabled).toBe(true);
    expect(item("Close others").disabled).toBe(true);
    expect(item("Detach").disabled).toBe(false);
});
