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
