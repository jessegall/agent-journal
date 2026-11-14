import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import TaskChain from "../src/tasks/TaskChain.vue";
import {chainAround} from "../src/domain/taskChain.js";

const task = (id, state) => ({id, state, title: `Task ${id}`});
// 5 waits on 4, 4 on 3 (this task), 3 on 2, 2 on 1
const GRAPH = {tasks: [task(1, "started"), task(2, "blocked"), task(3, "blocked"), task(4, "blocked"), task(5, "blocked")], edges: [[5, 4], [4, 3], [3, 2], [2, 1]]};

function chain(current, graph = GRAPH, selected = []) {
    const element = document.createElement("div");
    createApp({render: () => h(TaskChain, {task: graph.tasks.find((candidate) => candidate.id === current), graph, onSelect: (id) => selected.push(id)})}).mount(element);
    return element;
}

const numbers = (element) => [...element.querySelectorAll(".task-chain-link .number")].map((number) => number.textContent);

test("the chain around a task lists what waits on it above and what it waits on below", () => {
    const around = chainAround(3, GRAPH);
    expect(around.above.map((level) => level.map((waiting) => waiting.id))).toEqual([[5], [4]]);
    expect(around.below.map((blocker) => blocker.id)).toEqual([2, 1]);
});

test("a chain that loops back on itself ends instead of repeating", () => {
    const loop = {tasks: [task(1, "blocked"), task(2, "blocked")], edges: [[1, 2], [2, 1]]};
    expect(chainAround(1, loop).below.map((blocker) => blocker.id)).toEqual([2]);
});

test("the inspector shows the nearest task on each side and counts the rest behind Show the whole chain", async () => {
    const element = chain(3);
    expect(element.querySelector("h4").textContent).toBe("What waits on what");
    expect(numbers(element)).toEqual(["4", "3", "2"]);
    expect(element.querySelector(".task-chain-link.current .word").textContent).toBe("This task");
    expect(element.textContent).toContain("↓ waits on");
    expect(element.querySelector("[data-task-chain-more]").textContent).toBe("Show the whole chain (2 more)");
    element.querySelector("[data-task-chain-more]").click();
    await nextTick();
    expect(numbers(element)).toEqual(["5", "4", "3", "2", "1"]);
    expect(element.querySelector("[data-task-chain-more]").textContent).toBe("Show less");
});

test("a task in a chain opens when its link is clicked, and a task alone shows no chain", () => {
    const selected = [];
    chain(3, GRAPH, selected).querySelectorAll(".task-chain-link")[2].click();
    expect(selected).toEqual([2]);
    expect(chain(1, {tasks: [task(1, "started")], edges: []}).querySelector("[data-task-chain]")).toBeNull();
});
