import {createApp, h} from "vue";
import {expect, test} from "vitest";
import TaskFacts from "../src/tasks/TaskFacts.vue";

function mounted(state, emitted) {
    const element = document.createElement("div");
    createApp({render: () => h(TaskFacts, {task: {id: 7, state, priority: 200}, onPriority: (priority) => emitted.push(priority)})}).mount(element);
    return element;
}

test.each(["open", "started", "completed", "cancelled"])("a %s task has its priority to change, as in version 4", (state) => {
    const emitted = [];
    const element = mounted(state, emitted);
    [...element.querySelectorAll("[data-task-priority] button")].find((button) => button.textContent.trim() === "High").click();
    expect(emitted).toEqual(["300"]);
});

test("a priority between two levels lights the level at or below it, and the number stays", () => {
    const element = document.createElement("div");
    createApp({render: () => h(TaskFacts, {task: {id: 7, state: "open", priority: 301}})}).mount(element);
    const on = [...element.querySelectorAll("[data-task-priority] button.on")].map((button) => button.textContent.trim());
    expect(on).toEqual(["High"]);
});
