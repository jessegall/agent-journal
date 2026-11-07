import {createApp, h} from "vue";
import {afterEach, expect, test} from "vitest";
import {mounted, page, settle} from "./support/windowContext.js";
import {taskWindowContext} from "./support/taskWindowContext.js";
import TaskGroups from "../../core/modules/tasks/web/src/TaskGroups.vue";
import TaskTags from "../src/tasks/TaskTags.vue";
import TaskFacts from "../src/tasks/TaskFacts.vue";

afterEach(() => (document.body.innerHTML = ""));

const CARD = {id: 5, title: "Network queue", state: "open", priority: 200, tags: ["networking", "linux"], complexity: 3};
const BOARD = {ok: true, value: {groups: [{state: "open", total: 2, rows: [CARD]}]}};

test("cards show their tags and complexity", async () => {
    const window = taskWindowContext({"task board": BOARD, "task tags": page([{word: "linux", count: 2}])});
    const element = await mounted(TaskGroups, window);
    expect([...element.querySelectorAll("[data-task-tag]")].map((tag) => tag.textContent)).toEqual(["networking", "linux"]);
    expect(element.querySelector("[data-task-complexity]").textContent).toBe("Complexity 3");
});

test("a tag filter reaches the server and stays on later pages", async () => {
    const window = taskWindowContext({"task board": BOARD, "task tags": page([{word: "linux", count: 2}])});
    const element = await mounted(TaskGroups, window);
    const filter = element.querySelector("[data-task-tag-filter]");
    filter.value = "linux";
    filter.dispatchEvent(new Event("change"));
    await settle();
    expect(window.reads.some((line) => line.startsWith("task board") && line.includes("--tag linux"))).toBe(true);
    element.querySelector('[data-more="open"]').click();
    await settle();
    expect(window.reads.some((line) => line.includes("--tag linux") && line.includes("--before-id 5"))).toBe(true);
});

test("the task tag editor adds a word and removes the selected word", async () => {
    const changes = [];
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(TaskTags, {tags: ["linux"], onAdd: (word) => changes.push(["tag", word]), onRemove: (word) => changes.push(["untag", word])})}).mount(element);
    element.querySelector('[data-remove-tag="linux"]').click();
    const input = element.querySelector("[data-task-tag-input]");
    input.value = "networking";
    input.dispatchEvent(new Event("input"));
    await settle();
    element.querySelector("form").dispatchEvent(new Event("submit", {bubbles: true, cancelable: true}));
    await settle();
    expect(changes).toEqual([["untag", "linux"], ["tag", "networking"]]);
});

test("the task facts let a person choose a complexity score", () => {
    const scores = [];
    const element = document.createElement("div");
    createApp({render: () => h(TaskFacts, {task: {...CARD, complexity: null}, onComplexity: (score) => scores.push(score)})}).mount(element);
    [...element.querySelectorAll("[data-task-complexity] button")].find((button) => button.textContent.trim() === "4").click();
    expect(scores).toEqual(["4"]);
});
