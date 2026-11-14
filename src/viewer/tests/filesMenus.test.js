import {createApp, h} from "vue";
import {afterEach, beforeEach, expect, test} from "vitest";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {placeUnder} from "../kit/vContext.js";
import {menuEntries} from "../src/composables/contextMenu.js";
import {settle} from "./support/windowContext.js";
import {projectFilesWindowContext} from "./support/projectFilesWindowContext.js";
import ProjectFiles from "../../suites/coding/web/src/ProjectFiles.vue";

const apps = [];
const copied = [];
const spoken = [];
const reads = [];
const say = (text) => spoken.push(text);

beforeEach(() => {
    history.replaceState(null, "", "/?");
    copied.length = 0;
    spoken.length = 0;
    reads.length = 0;
    Object.defineProperty(navigator, "clipboard", {value: {writeText: async (text) => copied.push(text)}, configurable: true});
});

afterEach(() => {
    apps.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
    history.replaceState(null, "", "/?");
});

async function drawn() {
    const window = projectFilesWindowContext({});
    window.read = async (words) => {
        const line = Array.isArray(words) ? words.join(" ") : words;
        reads.push(line);
        if (line.startsWith("file-comment")) return {ok: true, value: {rows: []}};
        if (line.startsWith("project-file show")) return {ok: true, value: {path: line.slice(18), text: "one\ntwo\n  three", cut: false}};
        if (line.startsWith("project-file find")) return {ok: true, value: {rows: []}};
        if (line.startsWith("file-edit")) return {ok: true, value: {rows: []}};
        const inShop = line.endsWith(" shop");
        return {ok: true, value: {rows: inShop ? [{id: "shop/cart.py", name: "cart.py", folder: false, size: 0, git: "M"}, {id: "shop/tax.py", name: "tax.py", folder: false, size: 0, git: ""}] : [{id: "shop", name: "shop", folder: true, size: 0, git: ""}]}};
    };
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(ProjectFiles)});
    app.provide(WINDOW_CONTEXT, window);
    app.mount(element);
    apps.push(app);
    await settle();
    element.querySelector('[data-folder="shop"]').click();
    await settle();
    return element;
}

async function openFile(element, path) {
    element.querySelector(`[data-file="${path}"]`).click();
    await settle();
}

// the menu of a right click on an element as the menu draws it, and the way to choose one of its items
function menuAt(element) {
    const place = placeUnder(element);
    const entries = menuEntries(place.items);
    const byLabel = (label) => entries.find((entry) => entry.label === label);
    return {head: place.head, labels: entries.filter((entry) => !entry.separator).map((entry) => entry.label), byLabel, choose: async (label) => (await byLabel(label).run({say}), settle())};
}

test("test_tab_items: a tab has Close, Close others, Close to the right and Close all, then Copy path, Copy name, Reveal in Files and Comment on file", async () => {
    const element = await drawn();
    await openFile(element, "shop/cart.py");
    const tab = element.querySelector('[data-files-tabs] [data-tab="shop/cart.py"]');
    const menu = menuAt(tab);
    expect(menu.labels).toEqual(["Close", "Close others", "Close to the right", "Close all", "Copy path", "Copy name", "Reveal in Files", "Comment on file"]);
    await menu.choose("Copy path");
    await menu.choose("Copy name");
    expect(copied).toEqual(["shop/cart.py", "cart.py"]);
    await menu.choose("Reveal in Files");
    expect(element.querySelector('[data-file="shop/cart.py"]').classList.contains("flash")).toBe(true);
    await menu.choose("Comment on file");
    await settle();
    expect(element.querySelector("[data-box-field]")).not.toBeNull();
});

test("test_tree_row_items: a file row has Open or Show, Close, Copy path, Copy name, Search in this folder, Comment on file and Show changes in Git, and a folder row fewer", async () => {
    const element = await drawn();
    const cart = menuAt(element.querySelector('[data-file="shop/cart.py"]'));
    expect(cart.labels).toEqual(["Open", "Copy path", "Copy name", "Search in this folder", "Comment on file", "Show changes in Git"]);
    expect(cart.byLabel("Show changes in Git").disabled).toBe(false);
    expect(menuAt(element.querySelector('[data-file="shop/tax.py"]')).byLabel("Show changes in Git").disabled).toBe(true);
    await openFile(element, "shop/cart.py");
    const shown = menuAt(element.querySelector('[data-file="shop/cart.py"]'));
    expect(shown.labels.slice(0, 2)).toEqual(["Show", "Close"]);
    await shown.choose("Close");
    expect(element.querySelector('[data-files-tabs]')).toBeNull();
    const folder = menuAt(element.querySelector('[data-folder="shop"]'));
    expect(folder.labels).toEqual(["Fold", "Copy path", "Copy name", "Search in this folder"]);
    await folder.choose("Fold");
    expect(element.querySelector('[data-file="shop/cart.py"]')).toBeNull();
});

test("test_code_line_items: a line of code has Comment on this line, Copy line and Copy path and line", async () => {
    const element = await drawn();
    await openFile(element, "shop/cart.py");
    const menu = menuAt(element.querySelector('[data-file-line="3"]'));
    expect(menu.head).toBe("Line 3");
    expect(menu.labels).toEqual(["Comment on this line", "Copy line", "Copy path and line"]);
    await menu.choose("Copy line");
    await menu.choose("Copy path and line");
    expect(copied).toEqual(["three", "shop/cart.py:3"]);
    await menu.choose("Comment on this line");
    await settle();
    expect(element.querySelector("[data-box-quote]").textContent).toContain("Line 3 · cart.py");
});

test("test_search_in_folder_opens_palette: Search in this folder opens the file palette with the folder typed in it, for a file's folder and for a folder", async () => {
    const element = await drawn();
    await menuAt(element.querySelector('[data-file="shop/tax.py"]')).choose("Search in this folder");
    expect(element.querySelector("[data-files-palette]")).not.toBeNull();
    expect(element.querySelector("[data-palette-field]").value).toBe("shop/");
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(reads).toContain("project-file find shop/");
    element.querySelector("[data-palette-field]").dispatchEvent(new KeyboardEvent("keydown", {key: "Escape", bubbles: true}));
    await settle();
    await menuAt(element.querySelector('[data-folder="shop"]')).choose("Search in this folder");
    expect(element.querySelector("[data-palette-field]").value).toBe("shop/");
});
