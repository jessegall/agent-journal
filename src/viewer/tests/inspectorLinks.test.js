import {createApp, h} from "vue";
import {afterEach, expect, test} from "vitest";
import InspectorLinks from "../src/kit/InspectorLinks.vue";
import {settle} from "./support/windowContext.js";

const ROW = (model, id) => ({endpoint: {model, id, title: `${model} ${id}`, open_ref: `${model}s:${id}`}, relations: ["linked"]});
const ANSWER = {ok: true, value: {total: 4, categories: {doc: 2, message: 1, task: 1}, counterparts: [ROW("doc", 1), ROW("doc", 2), ROW("message", 3), ROW("task", 4)]}};
const mounted = [];

function section(read, props = {}) {
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(InspectorLinks, {model: "plan", id: 5, read, ...props})});
    app.mount(element);
    mounted.push(app);
    return element;
}

const answering = (answer, lines = []) => async (line) => {
    lines.push(line);
    return answer;
};

afterEach(() => {
    mounted.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
});

test("it is folded and shows the count", async () => {
    const element = section(answering(ANSWER));
    await settle();
    expect(element.querySelector("[data-inspector-links-count]").textContent).toBe("4");
    expect(element.querySelector("[data-inspector-links-head]").getAttribute("aria-expanded")).toBe("false");
    expect(element.querySelector("[data-inspector-links-body]")).toBeNull();
});

test("pressing it opens it", async () => {
    const element = section(answering(ANSWER));
    await settle();
    element.querySelector("[data-inspector-links-head]").click();
    await settle();
    expect(element.querySelector("[data-inspector-links-body]")).not.toBeNull();
    expect(element.querySelectorAll("[data-inspector-link]")).toHaveLength(4);
});

test("an empty row draws no section", async () => {
    const element = section(answering({ok: true, value: {total: 0, categories: {}, counterparts: []}}));
    await settle();
    expect(element.querySelector("[data-inspector-links]")).toBeNull();
    expect(element.textContent).toBe("");
});

test("the categories option limits the tabs", async () => {
    const element = section(answering(ANSWER), {categories: ["doc", "message"], open: true});
    await settle();
    const tabs = element.querySelector("[data-inspector-links-body]").textContent;
    expect(tabs).toContain("Documents");
    expect(tabs).toContain("Messages");
    expect(tabs).not.toContain("Tasks");
});

test("the outside plan option reaches the read line", async () => {
    const lines = [];
    section(answering(ANSWER, lines), {outsidePlan: true, pageSize: 7, open: true});
    await settle();
    expect(lines[0]).toEqual(["link", "list", "--row", "plan:5", "--group-counterparts", "--outside-plan", "--page-size", "1"]);
    expect(lines.some((line) => line.includes("--outside-plan") && line.includes("7"))).toBe(true);
});

test("a failed read shows one alert", async () => {
    const element = section(answering({ok: false, error: "The links could not be read"}));
    await settle();
    expect(element.querySelectorAll('[role="alert"]')).toHaveLength(1);
    expect(element.querySelector("[data-inspector-links]")).toBeNull();
});

test("a row press tells the host which row to open", async () => {
    const opened = [];
    const element = section(answering(ANSWER), {open: true, onOpen: (row) => opened.push(row)});
    await settle();
    element.querySelector('[data-link-model="task"]').click();
    expect(opened).toEqual([{table: "tasks", id: 4}]);
});
