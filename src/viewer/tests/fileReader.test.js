import {createApp, h} from "vue";
import {afterEach, beforeEach, expect, test} from "vitest";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {settle} from "./support/windowContext.js";
import {projectFilesWindowContext} from "./support/projectFilesWindowContext.js";
import ProjectFiles from "../../suites/coding/web/src/ProjectFiles.vue";
import {tint} from "../../suites/coding/web/src/codeTint.js";

const apps = [];
const copied = [];
const TEXT = ["# a comment", "import cart", 'name = "total"', "return Total(x)", "<b>&</b>", "last"].join("\n");

beforeEach(() => {
    history.replaceState(null, "", "/?");
    copied.length = 0;
    Object.defineProperty(navigator, "clipboard", {value: {writeText: async (text) => copied.push(text)}, configurable: true});
});

afterEach(() => {
    apps.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
    history.replaceState(null, "", "/?");
});

// a Files window with one file, whose read answers with the given facts about it
async function drawn(file = {}) {
    const window = projectFilesWindowContext({});
    window.read = async (words) => {
        const line = Array.isArray(words) ? words.join(" ") : words;
        if (line.startsWith("project-file show")) return {ok: true, value: {path: "shop/cart.py", text: TEXT, cut: false, git: "", moved_from: "", ...file}};
        if (line.startsWith("file-edit list")) return {ok: true, value: {rows: [{path: "shop/cart.py", session_agent_id: 12}]}};
        return {ok: true, value: {rows: [{id: "shop/cart.py", name: "cart.py", folder: false, size: 0, git: "M"}]}};
    };
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(ProjectFiles)});
    app.provide(WINDOW_CONTEXT, window);
    app.mount(element);
    apps.push(app);
    await settle();
    element.querySelector('[data-file="shop/cart.py"]').click();
    await settle();
    return {element, unmount: () => (app.unmount(), apps.splice(apps.indexOf(app), 1))};
}

const picked = (element) => [...element.querySelectorAll(".files-line.picked")].map((line) => Number(line.dataset.fileLine));
const number = (element, at) => element.querySelector(`[data-file-line="${at}"] [data-line-number]`);

test("code gets its colour and no text of the file is read as markup", () => {
    expect(tint("# a comment")).toBe('<span class="tk-c"># a comment</span>');
    expect(tint('name = "total"')).toBe('name = <span class="tk-s">&quot;total&quot;</span>');
    expect(tint("import cart")).toContain('<span class="tk-k">import</span>');
    expect(tint("return Total(x)")).toContain('<span class="tk-f">Total</span>');
    expect(tint("<b>&</b>")).toBe("&lt;b&gt;&amp;&lt;/b&gt;");
});

test("test_line_click_picks_line: a click on a line number picks that line, and the next click picks another", async () => {
    const {element} = await drawn();
    expect(element.querySelectorAll(".files-line").length).toBe(6);
    expect(element.querySelector('[data-file-line="2"] .tk-k').textContent).toBe("import");
    number(element, 3).click();
    await settle();
    expect(picked(element)).toEqual([3]);
    number(element, 5).click();
    await settle();
    expect(picked(element)).toEqual([5]);
});

test("test_shift_click_picks_range: Shift and a click on a number stretches the pick to a range, in either direction", async () => {
    const {element} = await drawn();
    number(element, 2).click();
    number(element, 5).dispatchEvent(new MouseEvent("click", {bubbles: true, shiftKey: true}));
    await settle();
    expect(picked(element)).toEqual([2, 3, 4, 5]);
    number(element, 1).dispatchEvent(new MouseEvent("click", {bubbles: true, shiftKey: true}));
    await settle();
    expect(picked(element)).toEqual([1, 2, 3, 4, 5]);
});

test("test_range_in_address: the picked lines are written in the address and a window opened again picks them", async () => {
    const first = await drawn();
    number(first.element, 2).click();
    number(first.element, 4).dispatchEvent(new MouseEvent("click", {bubbles: true, shiftKey: true}));
    await settle();
    expect(new URLSearchParams(location.search).get("files-lines")).toBe("2-4");
    number(first.element, 6).click();
    await settle();
    expect(new URLSearchParams(location.search).get("files-lines")).toBe("6");
    number(first.element, 3).click();
    number(first.element, 4).dispatchEvent(new MouseEvent("click", {bubbles: true, shiftKey: true}));
    await settle();
    first.unmount();
    document.body.innerHTML = "";
    const again = await drawn();
    expect(picked(again.element)).toEqual([3, 4]);
});

test("test_big_file_notice: a file shown cut says so and how to read all of it, and a moved file says where it came from", async () => {
    const {element} = await drawn({cut: true, moved_from: "shop/old_cart.py"});
    expect(element.querySelector("[data-big-file]").textContent).toContain("Open it in an editor");
    expect(element.querySelector("[data-moved-file]").textContent).toContain("shop/old_cart.py");
    const plain = await drawn();
    expect(plain.element.querySelectorAll("[data-big-file]").length).toBe(0);
});

test("test_status_bar_copy_path: the bar under the file has its git state, who edited it, its lines and language and a button that copies the path, which the bar does not print", async () => {
    const {element} = await drawn({git: "M"});
    const bar = element.querySelector("[data-file-status]");
    expect(bar.querySelector("[data-status-git]").textContent).toBe("Changed");
    expect(bar.querySelector("[data-status-agent]").textContent).toBe("Edited by agent 12");
    expect(bar.querySelector("[data-status-lines]").textContent).toBe("6 lines");
    expect(bar.querySelector("[data-status-language]").textContent).toBe("Python");
    expect(bar.textContent).not.toContain("shop/cart.py");
    bar.querySelector("[data-status-copy]").click();
    await settle();
    expect(copied).toEqual(["shop/cart.py"]);
    expect(bar.querySelector("[data-status-said]").textContent).toBe("Copied the path");
});
