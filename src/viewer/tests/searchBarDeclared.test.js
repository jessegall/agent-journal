import {afterEach, expect, test} from "vitest";
import {createApp, h} from "vue";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {context, settle} from "./support/windowContext.js";
import SearchBar from "../kit/SearchBar.vue";
import {matchesSearch} from "../kit/searchFields.js";

const SEARCH = {
    placeholder: "Search the tasks",
    context: [
        {title: "Order", subtext: "How the rows are sorted", next: [{title: "Newest", subtext: "", next: [], click: "order-newest"}], click: ""},
        {title: "Show closed", subtext: "Include finished rows", next: [], click: "show-closed"},
    ],
    button: {title: "Manage tasks", click: "manage"},
};
let app;
let host;

// the menu panel measures itself, which the test document cannot do
globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

afterEach(() => {
    app?.unmount();
    host?.remove();
});

// the bar drawn into the document inside a window that declares this search, with the keys it sends the window
async function bar(search, props = {}) {
    const picked = [];
    host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(SearchBar, {modelValue: "", ...props, onPick: (key) => picked.push(key)})});
    app.provide(WINDOW_CONTEXT, {...context({}), search});
    app.mount(host);
    await settle();
    return picked;
}

const entry = (title) => document.querySelector(`[data-search-entry="${title}"]`);

test("the shared search bar owns its sticky position and bottom border", () => {
    const source = readFileSync(resolve(__dirname, "../kit/SearchBar.vue"), "utf8");
    const style = source.slice(source.indexOf(".search-bar {"), source.indexOf(".search-bar-control {"));
    expect(style).toContain("position: sticky;");
    expect(style).toContain("top: 0;");
    expect(style).toContain("border-bottom: 1px solid var(--border);");
});

test("a search matches only the fields its backend declaration names", () => {
    const row = {title: "Cart totals", body: "Private implementation notes"};
    expect(matchesSearch(row, "cart", ["title"])).toBe(true);
    expect(matchesSearch(row, "private", ["title"])).toBe(false);
    expect(matchesSearch(row, "private", ["body"])).toBe(true);
});

test("the bar draws the placeholder the window declares over the one it was given", async () => {
    await bar(SEARCH, {placeholder: "Search"});
    expect(host.querySelector("[data-search-input]").placeholder).toBe("Search the tasks");
});

test("a window that declares no search keeps the placeholder it gives", async () => {
    await bar({}, {placeholder: "Filter files"});
    expect(host.querySelector("[data-search-input]").placeholder).toBe("Filter files");
    expect(host.querySelector("[data-search-menu]")).toBeNull();
    expect(host.querySelector("[data-search-button]")).toBeNull();
});

test("the empty button a window with no button declares draws no button", async () => {
    await bar({}, {placeholder: "Filter files", context: [], button: {}});
    expect(host.querySelector("[data-search-button]")).toBeNull();
});

test("the declared standalone button stands beside the field and sends its click key", async () => {
    const picked = await bar(SEARCH);
    const button = host.querySelector("[data-search-button]");
    expect(button.textContent).toBe("Manage tasks");
    button.click();
    expect(picked).toEqual(["manage"]);
});

test("the declared context menu lists its entries with their sub lines and sends the key of the one clicked", async () => {
    const picked = await bar(SEARCH);
    host.querySelector("[data-search-menu]").click();
    await settle();
    expect(entry("Show closed").textContent).toContain("Include finished rows");
    entry("Show closed").click();
    expect(picked).toEqual(["show-closed"]);
});

test("a declared entry that opens a menu shows that menu, and Back returns to the first", async () => {
    const picked = await bar(SEARCH);
    host.querySelector("[data-search-menu]").click();
    await settle();
    entry("Order").click();
    await settle();
    expect(entry("Newest")).not.toBeNull();
    expect(entry("Show closed")).toBeNull();
    document.querySelector("[data-search-back]").click();
    await settle();
    expect(entry("Show closed")).not.toBeNull();
    expect(picked).toEqual([]);
});
