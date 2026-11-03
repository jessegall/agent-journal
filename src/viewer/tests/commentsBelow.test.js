import {createApp, h} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import TaskInspector from "../src/tasks/TaskInspector.vue";
import {settle} from "./support/windowContext.js";

let measure;

beforeEach(() => {
    vi.stubGlobal("ResizeObserver", class {
        constructor(callback) {
            measure = (width) => callback([{contentRect: {width}}]);
        }
        observe() {}
        disconnect() {}
    });
});

afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

const TASK = {id: 7, title: "Fix the cart", brief: "", state: "open", priority: "normal", reason: "", outcome: "", waits: [], logs: []};

async function inspector() {
    const read = async (line) => {
        if (line[1] === "inspect") return {ok: true, value: TASK};
        if (line[0] === "task" && line[1] === "comments") return {ok: true, value: {rows: [{id: 1, text: "On task 7, Fix the cart: check the tax"}]}};
        return {ok: true, value: {rows: []}};
    };
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(TaskInspector, {id: 7, read})}).directive("tip", {}).mount(element);
    await settle();
    element.querySelector(".count").click();
    await settle();
    return element;
}

const sideOf = (element) => element.querySelector("[data-comment-side]");

test("in a narrow inspector the comments come after the body, under it, not in a sidebar", async () => {
    const element = await inspector();
    measure(440);
    await settle();
    const row = sideOf(element).parentElement;
    expect(row.hasAttribute("data-comments-below")).toBe(true);
    expect(sideOf(element).classList.contains("below")).toBe(true);
    expect(row.firstElementChild.classList.contains("body")).toBe(true);
    expect(row.lastElementChild).toBe(sideOf(element));
    expect(sideOf(element).textContent).toContain("check the tax");
});

// message 101376: the task inspector never gives its comments a sidebar, however wide it is
test("in a wide inspector the comments still stand under the body", async () => {
    const element = await inspector();
    measure(760);
    await settle();
    const row = sideOf(element).parentElement;
    expect(row.hasAttribute("data-comments-below")).toBe(true);
    expect(sideOf(element).classList.contains("below")).toBe(true);
    expect(row.lastElementChild).toBe(sideOf(element));
});
