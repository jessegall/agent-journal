import {afterEach, expect, test} from "vitest";
import {mounted, settle, typeInto, unmountAll} from "./support/windowContext.js";
import {projectFilesWindowContext} from "./support/projectFilesWindowContext.js";
import ProjectFiles from "../../suites/coding/web/src/ProjectFiles.vue";

afterEach(() => {
    unmountAll();
    document.body.innerHTML = "";
    history.replaceState(null, "", "/?");
});

const row = (id, extra = {}) => ({id, name: id.split("/").at(-1), folder: false, size: 0, git: "", ...extra});
const later = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));
const press = (key, extra = {}) => document.dispatchEvent(new KeyboardEvent("keydown", {key, bubbles: true, cancelable: true, ...extra}));

async function drawn(rootRows = [row("shop", {folder: true}), row("readme.md", {git: "M", comments: 2})]) {
    const reads = [];
    const window = projectFilesWindowContext({});
    window.read = async (words) => {
        const line = Array.isArray(words) ? words.join(" ") : words;
        reads.push(line);
        if (line.startsWith("file-comment")) return {ok: false, failure: "refused", error: "no such command"};
        if (line.startsWith("project-file find")) return {ok: true, value: {rows: [row("shop/cart.py"), row("shop/tax.py")]}};
        if (line.startsWith("project-file grep")) return {ok: true, value: {rows: [{...row("shop/cart.py"), line: 3, text: "total = price * count"}, {...row("shop/tax.py"), line: 4, text: "return total + tax"}]}};
        if (line.startsWith("project-file show")) return {ok: true, value: {path: line.slice(18), text: "one\ntwo\nthree\nfour\nfive", cut: false}};
        return {ok: true, value: {rows: line.endsWith(" shop") ? [row("shop/cart.py", {git: "A"}), row("shop/tax.py")] : rootRows}};
    };
    const element = await mounted(ProjectFiles, window);
    document.body.append(element);
    return {element, reads};
}

const current = (element) => element.querySelector("[data-files-path] button:last-child").textContent;
const palette = () => document.body.querySelector("[data-files-palette]");

test("test_tree_folds: a folder opens into its own rows when its row is pressed and folds away when it is pressed again", async () => {
    const {element, reads} = await drawn();
    expect(element.querySelector('[data-file="shop/cart.py"]')).toBeNull();
    element.querySelector('[data-folder="shop"]').click();
    await settle();
    expect(reads).toContain("project-file list shop");
    expect(element.querySelector('[data-folder="shop"]').getAttribute("aria-expanded")).toBe("true");
    expect(element.querySelector('[data-file="shop/cart.py"]')).not.toBeNull();
    expect(element.querySelector('[data-folder="shop"] [data-icon="folder"]')).toBeNull();
    element.querySelector('[data-folder="shop"]').click();
    await settle();
    expect(element.querySelector('[data-file="shop/cart.py"]')).toBeNull();
    element.querySelector('[data-folder="shop"]').click();
    await settle();
    expect(reads.filter((line) => line === "project-file list shop").length).toBe(1);
});

test("test_git_letter_and_comment_count: a file row shows its git letter and the comments on it, and a file with neither shows nothing", async () => {
    const {element} = await drawn();
    const changed = element.querySelector('[data-file="readme.md"]');
    expect(changed.querySelector("[data-tree-git]").textContent).toBe("M");
    expect(changed.querySelector("[data-tree-git]").title).toBe("Changed");
    expect(changed.querySelector("[data-tree-comments]").textContent).toBe("2");
    expect(changed.querySelector("[data-tree-comments]").title).toBe("2 comments");
    element.querySelector('[data-folder="shop"]').click();
    await settle();
    expect(element.querySelector('[data-file="shop/cart.py"] [data-tree-git]').textContent).toBe("A");
    expect(element.querySelector('[data-file="shop/tax.py"] [data-tree-git]').textContent).toBe("");
    expect(element.querySelector('[data-file="shop/tax.py"] [data-tree-comments]')).toBeNull();
});

test("test_back_and_forward_keys: [ goes back to the file before and ] forward again, and the buttons say when there is nowhere to go", async () => {
    const {element} = await drawn();
    element.querySelector('[data-folder="shop"]').click();
    await settle();
    expect(element.querySelector("[data-files-back]").disabled).toBe(true);
    element.querySelector('[data-file="shop/cart.py"]').click();
    await settle();
    element.querySelector('[data-file="shop/tax.py"]').click();
    await settle();
    expect(current(element)).toBe("tax.py");
    expect(element.querySelector("[data-files-back]").disabled).toBe(false);
    press("[");
    await settle();
    expect(current(element)).toBe("cart.py");
    expect(element.querySelector("[data-files-forward]").disabled).toBe(false);
    press("]");
    await settle();
    expect(current(element)).toBe("tax.py");
    expect(element.querySelector("[data-files-forward]").disabled).toBe(true);
    const typing = document.createElement("input");
    element.append(typing);
    typing.dispatchEvent(new KeyboardEvent("keydown", {key: "[", bubbles: true}));
    await settle();
    expect(current(element)).toBe("tax.py");
});

test("test_palette_files_and_text: T opens the palette on files and Ctrl+Shift+F on text, each reading what the words match, and text needs two letters", async () => {
    const {element, reads} = await drawn();
    press("t");
    await settle();
    expect(palette()).not.toBeNull();
    expect(document.body.querySelector('[role="radio"][aria-checked="true"]').textContent).toContain("Files");
    typeInto(document.body.querySelector("[data-palette-field]"), "cart");
    await later();
    await settle();
    expect(reads).toContain("project-file find cart");
    expect([...document.body.querySelectorAll("[data-hit-file-row]")].map((hit) => hit.dataset.hit)).toEqual(["shop/cart.py", "shop/tax.py"]);
    document.body.querySelector("[data-palette-field]").dispatchEvent(new KeyboardEvent("keydown", {key: "Escape", bubbles: true}));
    await settle();
    expect(palette()).toBeNull();
    press("f", {ctrlKey: true, shiftKey: true});
    await settle();
    expect(document.body.querySelector('[role="radio"][aria-checked="true"]').textContent).toContain("Text");
    typeInto(document.body.querySelector("[data-palette-field]"), "t");
    await later();
    expect(document.body.querySelector("[data-palette-note]").textContent).toBe("Two letters or more");
    typeInto(document.body.querySelector("[data-palette-field]"), "total");
    await later();
    await settle();
    expect(reads).toContain("project-file grep total");
    expect(element).not.toBeNull();
    expect([...document.body.querySelectorAll("[data-hit-line]")].map((hit) => hit.dataset.hit)).toEqual(["shop/cart.py:3", "shop/tax.py:4"]);
    expect(document.body.querySelector("[data-hit-line] em").textContent).toBe("total");
});

test("test_text_hit_opens_at_line: a text hit opens its file with its line marked, and Enter opens the chosen hit", async () => {
    const {element} = await drawn();
    press("f", {metaKey: true, shiftKey: true});
    await settle();
    typeInto(document.body.querySelector("[data-palette-field]"), "total");
    await later();
    await settle();
    document.body.querySelector('[data-hit="shop/tax.py:4"]').click();
    await settle();
    expect(palette()).toBeNull();
    expect(current(element)).toBe("tax.py");
    expect(element.querySelector(".files-line.target").dataset.fileLine).toBe("4");
    press("f", {metaKey: true, shiftKey: true});
    await settle();
    typeInto(document.body.querySelector("[data-palette-field]"), "total");
    await later();
    await settle();
    const field = document.body.querySelector("[data-palette-field]");
    field.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowDown", bubbles: true}));
    field.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowUp", bubbles: true}));
    field.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter", bubbles: true}));
    await settle();
    expect(current(element)).toBe("cart.py");
    expect(element.querySelector(".files-line.target").dataset.fileLine).toBe("3");
});
