import {afterEach, expect, test} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import ProjectFiles from "../../suites/coding/web/src/ProjectFiles.vue";

afterEach(() => (document.body.innerHTML = ""));

const row = (id, folder = false) => ({id, name: id.split("/").at(-1), folder, size: 0});

function drawn() {
    const reads = [];
    const window = context({});
    window.read = async (line) => {
        reads.push(line);
        if (line.startsWith("project-file find")) return {ok: true, value: {rows: [row("shop/cart.py")]}};
        if (line.startsWith("project-file show")) return {ok: true, value: {path: "shop/cart.py", text: "one\ntwo", cut: false}};
        return {ok: true, value: {rows: line.includes("shop") ? [row("shop/cart.py")] : [row("shop", true), row("readme.md")]}};
    };
    return {reads, window};
}

test("a folder opens into its entries and the crumbs lead back", async () => {
    const {reads, window} = drawn();
    const element = await mounted(ProjectFiles, window);
    element.querySelector('[data-file="shop"]').click();
    await settle();
    expect(reads).toContain('project-file list "shop"');
    expect(element.querySelector('[data-file="shop/cart.py"]')).not.toBeNull();
    element.querySelector("[data-files-root]").click();
    await settle();
    expect(element.querySelector('[data-file="readme.md"]')).not.toBeNull();
});

test("a file opens beside the list with its line numbers", async () => {
    const {window} = drawn();
    const element = await mounted(ProjectFiles, window);
    element.querySelector('[data-file="shop"]').click();
    await settle();
    element.querySelector('[data-file="shop/cart.py"]').click();
    await settle();
    const lines = element.querySelectorAll(".files-line");
    expect(lines.length).toBe(2);
    expect(lines[1].textContent).toContain("two");
});

test("typing finds files across the project", async () => {
    const {reads, window} = drawn();
    const element = await mounted(ProjectFiles, window);
    const search = element.querySelector("[data-files-search] input") || element.querySelector("input");
    search.value = "cart";
    search.dispatchEvent(new Event("input"));
    await settle();
    expect(reads).toContain('project-file find "cart"');
    expect(element.textContent).toContain("shop/cart.py");
});

test("command or control O asks for the file browser", async () => {
    const {shellKeyAction} = await import("../src/windows/shellKeys.js");
    expect(shellKeyAction(new KeyboardEvent("keydown", {key: "o", metaKey: true}))).toBe("open-file");
    expect(shellKeyAction(new KeyboardEvent("keydown", {key: "O", ctrlKey: true}))).toBe("open-file");
    expect(shellKeyAction(new KeyboardEvent("keydown", {key: "o"}))).toBeNull();
});
