import {createApp, h} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {settle} from "./support/windowContext.js";
import {projectFilesWindowContext} from "./support/projectFilesWindowContext.js";
import ProjectFiles from "../../suites/coding/web/src/ProjectFiles.vue";

const apps = [];
const TEXT = ["one", "two", "three", "four", "five"].join("\n");
const COMMENTS = [
    {id: 501, from: 2, to: 4, by: "Jesse", at: "10 min ago", text: "These three become the menu", reply: {by: "main", text: "Task 9692 builds it"}},
    {id: 502, from: 1, to: 1, by: "Jesse", at: "yesterday", outdated: true, text: "Name the states here"},
];

beforeEach(() => history.replaceState(null, "", "/?"));

afterEach(() => {
    apps.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
    history.replaceState(null, "", "/?");
    vi.unstubAllGlobals();
});

// a Files window with one file and the comments the journal has on it; null means the journal has no file comments at all
async function drawn(comments = COMMENTS) {
    const runs = [];
    const window = projectFilesWindowContext({});
    window.read = async (words) => {
        const line = Array.isArray(words) ? words.join(" ") : words;
        if (line.startsWith("file-comment")) return comments ? {ok: true, value: {rows: [...comments]}} : {ok: false, failure: "refused", error: "no such command"};
        if (line.startsWith("project-file show")) return {ok: true, value: {path: "shop/cart.py", text: TEXT, cut: false}};
        if (line.startsWith("file-edit")) return {ok: true, value: {rows: []}};
        return {ok: true, value: {rows: [{id: "shop/cart.py", name: "cart.py", folder: false, size: 0, git: ""}]}};
    };
    window.run = async (line) => {
        runs.push(line.join(" "));
        comments?.push({id: 600, from: 2, to: 3, by: "Jesse", at: "now", text: "A new comment"});
        return {ok: true, value: null};
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
    return {element, runs};
}

const line = (element, number) => element.querySelector(`[data-file-line="${number}"]`);

test("test_thread_under_range: a comment's thread stands under the last line of its range, with the answer to it", async () => {
    const {element} = await drawn([...COMMENTS]);
    expect(line(element, 4).nextElementSibling.matches("[data-comment-thread]")).toBe(true);
    expect(line(element, 4).nextElementSibling.textContent).toContain("These three become the menu");
    expect(line(element, 4).nextElementSibling.textContent).toContain("Task 9692 builds it");
    expect(line(element, 2).nextElementSibling.matches("[data-comment-thread]")).toBe(false);
    expect(line(element, 3).classList.contains("noted")).toBe(true);
});

test("test_outdated_marker: a comment whose lines have changed says so", async () => {
    const {element} = await drawn([...COMMENTS]);
    const thread = line(element, 1).nextElementSibling;
    expect(thread.querySelector("[data-comment-outdated]").textContent).toBe("Lines changed");
    expect(line(element, 4).nextElementSibling.querySelector("[data-comment-outdated]")).toBeNull();
});

test("test_box_comments_on_range: the box says what it comments on, takes the picked lines as the range and sends the comment with it", async () => {
    const {element, runs} = await drawn([]);
    expect(element.querySelector("[data-box-open]").textContent).toContain("Comment on this file, or pick lines first");
    line(element, 2).querySelector("[data-line-number]").click();
    line(element, 3).querySelector("[data-line-number]").dispatchEvent(new MouseEvent("click", {bubbles: true, shiftKey: true}));
    await settle();
    expect(element.querySelector("[data-box-quote]").textContent).toContain("Lines 2 to 3 · cart.py");
    const field = element.querySelector("[data-box-field]");
    field.value = "Why two lines?";
    field.dispatchEvent(new Event("input"));
    await settle();
    element.querySelector("[data-box-send]").click();
    await settle();
    await settle();
    expect(runs).toEqual(["file-comment make shop/cart.py Why two lines? --from 2 --to 3"]);
    expect(element.querySelectorAll(".files-line.picked").length).toBe(0);
    expect(element.querySelector("[data-comment-rail]")).not.toBeNull();
});

test("test_rail_inline_from_980: the rail stands beside the code from 980 px and floats over it when the window is narrower", async () => {
    const callbacks = [];
    const reported = () => callbacks.forEach((callback) => callback());
    vi.stubGlobal("ResizeObserver", class {
        constructor(callback) {
            callbacks.push(callback);
        }

        observe() {}

        disconnect() {}
    });
    let wide = 1200;
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {configurable: true, get() { return this.hasAttribute("data-files") ? wide : 0; }});
    const {element} = await drawn([...COMMENTS]);
    reported();
    await settle();
    expect(element.querySelector("[data-comment-rail]").classList.contains("floating")).toBe(false);
    wide = 700;
    reported();
    await settle();
    expect(element.querySelector("[data-comment-rail]").classList.contains("floating")).toBe(true);
    element.querySelector("[data-rail-close]").click();
    await settle();
    expect(element.querySelector("[data-comment-rail]")).toBeNull();
    element.querySelector("[data-box-count]").click();
    await settle();
    expect(element.querySelector("[data-comment-rail]")).not.toBeNull();
    delete HTMLElement.prototype.clientWidth;
});

test("test_no_rail_without_comments: a file with no comments has the box and no rail, and a journal with no file comments has neither", async () => {
    const none = await drawn([]);
    expect(none.element.querySelector("[data-comment-box]")).not.toBeNull();
    expect(none.element.querySelector("[data-comment-rail]")).toBeNull();
    document.body.innerHTML = "";
    const missing = await drawn(null);
    expect(missing.element.querySelector("[data-comment-box]")).toBeNull();
    expect(missing.element.querySelector("[data-comment-rail]")).toBeNull();
    expect(missing.element.querySelector(".files-line")).not.toBeNull();
});
