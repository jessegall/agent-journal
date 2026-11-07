import {createApp, defineComponent, h} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {trackMutationObservers} from "./support/mutationObservers.js";
import {settled} from "./settled.js";
import {perLine} from "./support/windowContext.js";
import PaneStage from "../src/windows/PaneStage.vue";
import WindowHost from "../src/windows/WindowHost.vue";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";
import {paneLayout} from "../src/windows/paneLayout.js";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";
import {leaves} from "../src/domain/panes.js";
import FileFeed from "../../suites/coding/web/src/FileFeed.vue";

vi.stubGlobal("ResizeObserver", class {
    observe() {}

    disconnect() {}
});

// a page window here is the file feed itself, hosted as the viewer hosts it
vi.mock("../src/windows/PageWindow.vue", () => ({
    default: defineComponent({
        props: ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"],
        emits: ["option"],
        setup: (props, {emit}) => () =>
            h(WindowHost, {name: props.entry.name, component: FileFeed, subscriptions: props.subscriptions, environment: props.environment, agent: props.agent, visible: props.visible, permissions: props.permissions, options: props.options, onOption: (key, value) => emit("option", key, value)}),
    }),
}));

const FEEDS = ["a.feed", "a.other-feed"];
const entry = (name) => ({name, title: name, icon: "window", options: [], loading: "component", entry_url: `/${name}.js`, reads: [], runs: [], events: [], unavailable_reason: "", allowed: true});
const SHAPE = {dir: "row", r: 0.5, a: {tabs: [FEEDS[0]], active: FEEDS[0]}, b: {tabs: [FEEDS[1]], active: FEEDS[1]}};
// the journal's answer to each line: the old per-window setting is the one given, every other read is refused
const answers = (setting) => perLine(async (url, init) => {
    if (String(url).endsWith("/api/session")) return {ok: true, json: async () => ({tour_completed: true})};
    if (String(url).startsWith("/api/window?")) return {ok: true, json: async () => ({
        declared: {edits: {loading: "first", events: [], page_size: 50}, view: {loading: "first", events: [], page_size: 0}},
        keys: {edits: {code: 0, value: {rows: [], total: 0}}, view: setting ? {code: 0, value: {value: setting}} : {code: 1, error: "refused"}},
    })};
    const line = JSON.parse(init.body).line;
    const value = line[1] === "setting" && setting ? {code: 0, value: {value: setting}} : {code: 1, value: null, error: "refused"};
    return {ok: true, json: async () => value};
});

let drawn = [];
let checkObservers;
beforeEach(() => { checkObservers = trackMutationObservers(); });

// a stage over a layout that was saved as it is given, and the layout it saves
async function stage({page = "home", saved = null, setting = null} = {}) {
    vi.stubGlobal("fetch", answers(setting));
    const kept = [];
    const store = paneLayout({
        saved: async () => saved,
        defaults: async () => SHAPE,
        save: async (key, layout) => (kept.push(layout), {ok: true, version: 1}),
        tab: {read: () => null, write: () => {}},
        copy: {read: () => null, write: () => {}},
        entry: (name) => (FEEDS.includes(name) ? entry(name) : null),
    });
    await store.load({environment: "main", person: 1, suite: "coding", page, driver: "coding.builder"});
    const catalogue = new WindowCatalogue(async () => ({windows: []}));
    catalogue.loaded.value = true;
    catalogue.windows.value = FEEDS.map(entry);
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp(() => h(PaneStage, {store, catalogue, subscriptions: new WindowSubscriptions(), environment: "main", page}));
    app.mount(element);
    drawn.push({app, element});
    await settled();
    return {store, element, kept};
}

afterEach(() => {
    drawn.forEach(({app, element}) => (app.unmount(), element.remove()));
    checkObservers();
    drawn = [];
    vi.unstubAllGlobals();
    vi.stubGlobal("ResizeObserver", class {
        observe() {}

        disconnect() {}
    });
});

const feedIn = (element, name) => element.querySelector(`[data-window="${name}"] [data-file-feed]`);
const flushed = (element, name) => feedIn(element, name).classList.contains("flush");

test("two file feed panes keep different views on their panes, and each is drawn again as it was after a reload", async () => {
    const first = await stage();
    expect(flushed(first.element, FEEDS[0])).toBe(false);
    expect(flushed(first.element, FEEDS[1])).toBe(false);
    first.element.querySelector(`[data-window="${FEEDS[0]}"] [data-search-menu]`).click();
    await settled();
    document.querySelector('[data-feed-toggle="flush"]').click();
    await settled();
    expect(flushed(first.element, FEEDS[0])).toBe(true);
    expect(flushed(first.element, FEEDS[1])).toBe(false);
    await first.store.flush();
    const [feed, other] = leaves(first.store.layout.value.tree);
    expect(first.kept.at(-1).panes[feed].options.view.flush).toBe(true);
    expect(first.kept.at(-1).panes[other].options.view).toBeUndefined();

    const reloaded = await stage({saved: {layout: first.kept.at(-1), version: 1}});
    expect(flushed(reloaded.element, FEEDS[0])).toBe(true);
    expect(flushed(reloaded.element, FEEDS[1])).toBe(false);
});

test("a feed whose pane keeps no view starts from the view version 5 kept for every feed", async () => {
    const {element} = await stage({setting: {flush: true}});
    expect(flushed(element, FEEDS[0])).toBe(true);
    expect(flushed(element, FEEDS[1])).toBe(true);
});

test("on an agent's page a feed starts at 5 lines and flush", async () => {
    const {element} = await stage({page: "agent"});
    expect(flushed(element, FEEDS[0])).toBe(true);
    element.querySelector(`[data-window="${FEEDS[0]}"] [data-search-menu]`).click();
    await settled();
    expect(document.querySelector(".feed-bar-lines [aria-checked='true']").textContent.trim()).toBe("5");
});
