import {expect, test} from "vitest";
import {createApp, h, nextTick} from "vue";
import TaskSections from "../src/tasks/TaskSections.vue";

async function sections(waits) {
    const element = document.createElement("div");
    createApp({render: () => h(TaskSections, {task: {waits, state: "open", brief: "", outcome: ""}})}).mount(element);
    await nextTick();
    return [...element.querySelectorAll("[data-resource-waits] h4")].map((heading) => heading.textContent);
}

test("a finished task moves from Waits on to Waited on", async () => {
    expect(await sections([{id: 1, title: "Open", state: "open"}, {id: 2, title: "Done", state: "completed"}])).toEqual(["Waits on", "Waited on"]);
});

test("a task with only finished dependencies shows no Waits on heading", async () => {
    expect(await sections([{id: 2, title: "Done", state: "completed"}])).toEqual(["Waited on"]);
});
