import {createApp, h, nextTick, shallowRef} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import PaneStage from "../src/windows/PaneStage.vue";
import {paneLayout} from "../src/windows/paneLayout.js";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";
import {leaves} from "../src/domain/panes.js";

const TITLES = {"a.chat": "Chat", "a.tasks": "Tasks", "a.notes": "Notes", "a.spare": "Spare"};
const fake = (name) => ({name, title: TITLES[name], icon: "window", options: [], line: "task list", loading: "document", reads: [], runs: [], events: [], unavailable_reason: "", allowed: true});
const SHAPE = {
    dir: "row",
    r: 0.5,
    a: {tabs: ["a.chat"], active: "a.chat"},
    b: {tabs: ["a.tasks", "a.notes"], active: "a.tasks"},
};
const AREA = {left: 0, top: 0, width: 1000, height: 600};
const TAB_WIDTH = 100;
const STRIP = 34;

let mounted = [];

// the pixel boxes jsdom cannot measure: the grid is 1000 by 600, a pane strip is 34 high at its pane's left edge and a tab is 100 wide
function measured() {
    const box = (left, top, width, height) => ({left, top, width, height, right: left + width, bottom: top + height, x: left, y: top});
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function () {
        if (this.classList.contains("pane-grid")) return box(AREA.left, AREA.top, AREA.width, AREA.height);
        const pane = this.closest("section.pane");
        const left = pane ? (parseFloat(pane.style.left) / 100) * AREA.width : 0;
        const top = pane ? (parseFloat(pane.style.top) / 100) * AREA.height : 0;
        const width = pane ? (parseFloat(pane.style.width) / 100) * AREA.width : 0;
        const height = pane ? (parseFloat(pane.style.height) / 100) * AREA.height : 0;
        if (this.dataset.tabsOf !== undefined) return box(left, top, width, STRIP);
        if (this.dataset.tab !== undefined) {
            const at = [...this.parentElement.children].indexOf(this);
            return box(left + at * TAB_WIDTH, top, TAB_WIDTH, STRIP);
        }
        return box(left, top, width, height);
    });
}

async function settled() {
    for (let round = 0; round < 5; round++) await nextTick();
}

async function stage(shape = SHAPE, {offers = ["a.chat", "a.tasks", "a.notes", "a.spare"], titles = null} = {}) {
    const store = paneLayout({
        saved: async () => null,
        defaults: async () => shape,
        save: async () => ({ok: true, version: 1}),
        tab: {read: () => null, write: () => {}},
        entry: (name) => (offers.includes(name) ? fake(name) : null),
    });
    await store.load({environment: "main", person: 1, suite: "coding", page: "home", driver: "coding.builder"});
    if (titles) store.replace({...store.layout.value, panes: Object.fromEntries(Object.entries(store.layout.value.panes).map(([id, pane]) => [id, {...pane, titles}]))});
    const windows = shallowRef(offers.map(fake));
    const catalogue = {window: (name) => windows.value.find((window) => window.name === name) || null, windows, person: 1};
    const element = document.createElement("div");
    document.body.append(element);
    createApp(() => h(PaneStage, {store, catalogue, subscriptions: new WindowSubscriptions(), environment: "main"})).mount(element);
    mounted.push(element);
    await settled();
    return {store, element};
}

const tab = (element, name) => element.querySelector(`[data-tab="${name}"]`);
const holder = (store, name) => leaves(store.layout.value.tree).find((id) => store.layout.value.panes[id].tabs.includes(name));
const tabsIn = (store, id) => store.layout.value.panes[id].tabs;
const pointer = (type, x, y) => new MouseEvent(type, {clientX: x, clientY: y, bubbles: true});

async function dragTo(element, name, x, y, {drop = true} = {}) {
    const grabbed = tab(element, name).getBoundingClientRect();
    tab(element, name).dispatchEvent(pointer("pointerdown", grabbed.left + 5, grabbed.top + 5));
    window.dispatchEvent(pointer("pointermove", x, y));
    await settled();
    if (drop) {
        window.dispatchEvent(pointer("pointerup", x, y));
        await settled();
    }
}

beforeEach(() => {
    vi.stubGlobal("fetch", async () => ({json: async () => ({code: 1, value: null, error: "refused"})}));
    vi.stubGlobal("requestAnimationFrame", (run) => setTimeout(run, 0));
    measured();
});

afterEach(() => {
    mounted.forEach((element) => element.remove());
    mounted = [];
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

// where a drop lands a tab grabbed from the right pane, and the side of the left pane that gives
const EDGES = {left: [20, 300], right: [480, 300], top: [250, 60], bottom: [250, 590]};

for (const [zone, [x, y]] of Object.entries(EDGES)) {
    test(`a drop on a pane's ${zone} edge splits that pane that way, and the drop compass shows the ${zone} zone while the tab is held`, async () => {
        const {store, element} = await stage();
        const target = holder(store, "a.chat");
        await dragTo(element, "a.notes", x, y, {drop: false});
        expect(element.querySelector(`.drop-shade.${zone}`)).not.toBeNull();
        expect(element.querySelector(".drop-cell.on").classList.contains(zone)).toBe(true);
        window.dispatchEvent(pointer("pointerup", x, y));
        await settled();
        const made = holder(store, "a.notes");
        expect(made).not.toBe(target);
        expect(tabsIn(store, made)).toEqual(["a.notes"]);
        expect(tabsIn(store, target)).toEqual(["a.chat"]);
        expect(tabsIn(store, holder(store, "a.tasks"))).toEqual(["a.tasks"]);
        const wrapping = store.layout.value.tree.a;
        expect(wrapping.dir).toBe(zone === "left" || zone === "right" ? "row" : "col");
        expect(wrapping.a.id).toBe(zone === "left" || zone === "top" ? made : target);
    });
}

test("a drop on a tab strip adds the tab at the dropped place", async () => {
    const {store, element} = await stage();
    const target = holder(store, "a.tasks");
    const strip = element.querySelector(`[data-tabs-of="${target}"]`).getBoundingClientRect();
    await dragTo(element, "a.chat", strip.left + TAB_WIDTH + 20, strip.top + 10);
    expect(tabsIn(store, holder(store, "a.chat"))).toEqual(["a.tasks", "a.chat", "a.notes"]);
    expect(leaves(store.layout.value.tree)).toHaveLength(1);
});

test("a drop inside one tab strip reorders its tabs", async () => {
    const {store, element} = await stage();
    const own = holder(store, "a.tasks");
    const strip = element.querySelector(`[data-tabs-of="${own}"]`).getBoundingClientRect();
    await dragTo(element, "a.notes", strip.left + 10, strip.top + 10);
    expect(tabsIn(store, own)).toEqual(["a.notes", "a.tasks"]);
    expect(leaves(store.layout.value.tree)).toHaveLength(2);
});

test("Escape cancels a drag: no compass stays and the layout is unchanged", async () => {
    const {store, element} = await stage();
    const before = JSON.stringify(store.layout.value);
    await dragTo(element, "a.notes", ...EDGES.left, {drop: false});
    expect(element.querySelector(".drop-compass")).not.toBeNull();
    window.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape"}));
    window.dispatchEvent(pointer("pointerup", ...EDGES.left));
    await settled();
    expect(element.querySelector(".drop-compass")).toBeNull();
    expect(JSON.stringify(store.layout.value)).toBe(before);
});

test("dragging a resize handle writes the ratio r, and a double click resets it to 0.5", async () => {
    const {store, element} = await stage();
    const handle = element.querySelector(".pane-split");
    handle.dispatchEvent(pointer("pointerdown", 500, 300));
    window.dispatchEvent(pointer("pointermove", 700, 300));
    window.dispatchEvent(pointer("pointerup", 700, 300));
    await settled();
    expect(store.layout.value.tree.r).toBeCloseTo(0.7, 2);
    handle.dispatchEvent(new MouseEvent("dblclick", {bubbles: true}));
    await settled();
    expect(store.layout.value.tree.r).toBe(0.5);
});

test("closing the last tab of a pane removes the pane and gives its space to the one beside it", async () => {
    const {store, element} = await stage();
    element.querySelector(`[data-tab="a.chat"] .pane-tab-x`).dispatchEvent(new MouseEvent("click", {bubbles: true}));
    await settled();
    const ids = leaves(store.layout.value.tree);
    expect(ids).toHaveLength(1);
    expect(store.measured.value.rects[ids[0]]).toEqual({x: 0, y: 0, w: 1, h: 1});
    expect(tabsIn(store, ids[0])).toEqual(["a.tasks", "a.notes"]);
});

test("a closed window comes back from the reopen bar", async () => {
    const {store, element} = await stage();
    expect(element.querySelector(`[data-reopen="a.chat"]`)).toBeNull();
    expect(element.querySelector(`[data-reopen="a.spare"]`)).not.toBeNull();
    element.querySelector(`[data-tab="a.chat"] .pane-tab-x`).dispatchEvent(new MouseEvent("click", {bubbles: true}));
    await settled();
    element.querySelector(`[data-reopen="a.chat"]`).dispatchEvent(new MouseEvent("click", {bubbles: true}));
    await settled();
    expect(holder(store, "a.chat")).toBeDefined();
    expect(element.querySelector(`[data-reopen="a.chat"]`)).toBeNull();
    expect(tab(element, "a.chat")).not.toBeNull();
});

test("a window that is gone keeps a muted tab with its last title and a placeholder body, and is not offered to reopen", async () => {
    const shape = {tabs: ["a.old", "a.chat"], active: "a.old"};
    const {store, element} = await stage(shape, {offers: ["a.chat"], titles: {"a.old": "Old board"}});
    expect(holder(store, "a.old")).toBeDefined();
    const gone = tab(element, "a.old");
    expect(gone.classList.contains("gone")).toBe(true);
    expect(gone.textContent).toContain("Old board");
    expect(element.textContent).toContain("No installed module has this window.");
    expect(element.querySelector(`[data-reopen="a.old"]`)).toBeNull();
});

test("a gone window's placeholder has Remove tab, which closes that tab", async () => {
    const {store, element} = await stage({tabs: ["a.old", "a.chat"], active: "a.old"}, {offers: ["a.chat"], titles: {"a.old": "Old board"}});
    [...element.querySelectorAll(".window-placeholder button")].find((button) => button.textContent.includes("Remove tab")).click();
    await settled();
    expect(tabsIn(store, leaves(store.layout.value.tree)[0])).toEqual(["a.chat"]);
});

const key = (target, name) => target.dispatchEvent(new KeyboardEvent("keydown", {key: name, bubbles: true}));

test("Enter and Space on a focused tab pick it", async () => {
    const {store, element} = await stage();
    const own = holder(store, "a.tasks");
    key(tab(element, "a.notes"), "Enter");
    await settled();
    expect(store.layout.value.panes[own].active).toBe("a.notes");
    key(tab(element, "a.tasks"), " ");
    await settled();
    expect(store.layout.value.panes[own].active).toBe("a.tasks");
});

test("the arrow keys on a resize separator move the split, and the keys that do not fit its direction do nothing", async () => {
    const {store, element} = await stage();
    const handle = element.querySelector(".pane-split");
    key(handle, "ArrowRight");
    await settled();
    expect(store.layout.value.tree.r).toBeCloseTo(0.55, 2);
    key(handle, "ArrowLeft");
    key(handle, "ArrowLeft");
    await settled();
    expect(store.layout.value.tree.r).toBeCloseTo(0.45, 2);
    key(handle, "ArrowDown");
    await settled();
    expect(store.layout.value.tree.r).toBeCloseTo(0.45, 2);
});

test("the pane menu splits a pane with several tabs and moves its tab to another pane", async () => {
    const {store, element} = await stage();
    const own = holder(store, "a.tasks");
    element.querySelector(`[data-tabs-of="${own}"] .pane-menu-button`).click();
    await settled();
    element.querySelector(`[data-menu="split-right"]`).click();
    await settled();
    expect(leaves(store.layout.value.tree)).toHaveLength(3);
    expect(holder(store, "a.tasks")).not.toBe(holder(store, "a.notes"));
    const from = holder(store, "a.notes");
    element.querySelector(`[data-tabs-of="${from}"] .pane-menu-button`).click();
    await settled();
    element.querySelector(`[data-menu="move-${holder(store, "a.chat")}"]`).click();
    await settled();
    expect(tabsIn(store, holder(store, "a.chat"))).toEqual(["a.chat", "a.notes"]);
});

test("f makes the focused pane full screen and Escape returns it", async () => {
    const {store, element} = await stage();
    const own = holder(store, "a.tasks");
    key(tab(element, "a.tasks"), "f");
    await settled();
    expect(element.querySelector("section.pane.full")).not.toBeNull();
    expect(element.querySelector("section.pane.full [data-tabs-of]").dataset.tabsOf).toBe(String(own));
    key(tab(element, "a.tasks"), "Escape");
    await settled();
    expect(element.querySelector("section.pane.full")).toBeNull();
});

test("at phone width the panes stack one to a screen, the chat first, and no resize separator is drawn", async () => {
    vi.stubGlobal("innerWidth", 400);
    const {element} = await stage({dir: "row", r: 0.5, a: {tabs: ["a.tasks"], active: "a.tasks"}, b: {tabs: ["messages.chat"], active: "messages.chat"}}, {offers: ["a.tasks", "messages.chat"]});
    expect(element.querySelector(".pane-grid.stacked")).not.toBeNull();
    expect(element.querySelector(".pane-split")).toBeNull();
    const order = [...element.querySelectorAll("section.pane")].map((section) => [section.querySelector("[data-tab]").dataset.tab, Number(section.style.order)]);
    expect(order.find(([name]) => name === "messages.chat")[1]).toBeLessThan(order.find(([name]) => name === "a.tasks")[1]);
});
