import {afterEach, expect, test} from "vitest";
import {mounted, settle} from "./support/windowContext.js";
import {projectFilesWindowContext} from "./support/projectFilesWindowContext.js";
import ProjectFiles from "../../suites/coding/web/src/ProjectFiles.vue";

afterEach(() => (document.body.innerHTML = ""));

const row = (id, folder = false) => ({id, name: id.split("/").at(-1), folder, size: 0, git: ""});

function drawn() {
    const reads = [];
    const window = projectFilesWindowContext({});
    window.read = async (words) => {
        const line = Array.isArray(words) ? words.join(" ") : words;
        reads.push(line);
        if (line.startsWith("project-file show")) return {ok: true, value: {path: "shop/cart.py", text: "one\ntwo", cut: false}};
        return {ok: true, value: {rows: line.includes("shop") ? [row("shop/cart.py")] : [row("shop", true), row("readme.md")]}};
    };
    return {reads, window};
}

test("the first read asks for the project's folder without searching or opening a file", async () => {
    const {reads, window} = drawn();
    await mounted(ProjectFiles, window);
    expect(reads).toEqual(["project-file list "]);
});

test("a file opens beside the tree with its line numbers, and the path above it leads back to the project", async () => {
    const {window} = drawn();
    const element = await mounted(ProjectFiles, window);
    element.querySelector('[data-folder="shop"]').click();
    await settle();
    element.querySelector('[data-file="shop/cart.py"]').click();
    await settle();
    const lines = element.querySelectorAll(".files-line");
    expect(lines.length).toBe(2);
    expect(lines[1].textContent).toContain("two");
    expect(element.querySelector('[data-files-crumb="shop/cart.py"]')).not.toBeNull();
    element.querySelector("[data-files-root]").click();
    await settle();
    expect(element.querySelector(".files-line")).toBeNull();
});

test("command or control O asks for the file browser", async () => {
    const {shellKeyAction} = await import("../src/windows/shellKeys.js");
    expect(shellKeyAction(new KeyboardEvent("keydown", {key: "o", metaKey: true}))).toBe("open-file");
    expect(shellKeyAction(new KeyboardEvent("keydown", {key: "O", ctrlKey: true}))).toBe("open-file");
    expect(shellKeyAction(new KeyboardEvent("keydown", {key: "o"}))).toBeNull();
});
