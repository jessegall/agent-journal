import {afterEach, expect, test} from "vitest";
import {mounted} from "./support/windowContext.js";
import {taskWindowContext as context} from "./support/taskWindowContext.js";
import TaskGroups from "../../core/modules/tasks/web/src/TaskGroups.vue";

afterEach(() => (document.body.innerHTML = ""));

const task = (overrides) => ({id: 1, title: "A task", state: "open", priority: 200, complexity: 0, tags: [], delegated_to: null, delegated_name: null, ...overrides});
const board = (rows) => ({ok: true, value: {groups: [{state: "open", total: rows.length, rows}]}});
const drawn = async (rows, runs = []) => {
    const window = context({"task board": board(rows)});
    window.run = async (line) => {
        runs.push(line.join(" "));
        return {ok: true, value: null};
    };
    return mounted(TaskGroups, window);
};
const cell = (element, id, name) => element.querySelector(`[data-row="${id}"] [data-task-icons] [${name}]`);
const tipOf = (found) => [...found.querySelectorAll("[role='tooltip'] b, [role='tooltip'] span")].map((line) => line.textContent);

test("a row shows its tags in full as outlined chips after the title", async () => {
    const element = await drawn([task({tags: ["viewer", "agents"]})]);
    const row = element.querySelector('[data-row="1"]');
    expect([...row.querySelectorAll("[data-task-tag]")].map((tag) => tag.textContent)).toEqual(["viewer", "agents"]);
    expect(row.querySelector(".task-title").nextElementSibling.classList.contains("task-tags")).toBe(true);
});

test("a task assigned to a main agent shows the solid purple user icon and any other agent keeps its icon", async () => {
    const element = await drawn([task({id: 1, state: "started", delegated_to: 78, delegated_name: "Main", main_delegate: true}), task({id: 2, state: "started", delegated_to: 12, delegated_name: "Joan Clarke", main_delegate: false})]);
    const main = cell(element, 1, "data-task-agent");
    const worker = cell(element, 2, "data-task-agent");
    expect(main.querySelector("[data-task-main-agent] svg")).not.toBeNull();
    expect(main.classList.contains("main")).toBe(true);
    expect(tipOf(main)).toEqual(["Main agent"]);
    expect(worker.querySelector("[data-task-main-agent]")).toBeNull();
    expect(worker.querySelector("[data-icon='agent']")).not.toBeNull();
});

test("the agent column shows the agent icon, solid when it holds the task and dashed when the task waits, with a tooltip that opens the agent", async () => {
    const element = await drawn([task({id: 1, state: "started", delegated_to: 12, delegated_name: "Joan Clarke"}), task({id: 2, delegated_to: 12, delegated_name: "Joan Clarke"}), task({id: 3})]);
    const held = cell(element, 1, "data-task-agent");
    const queued = cell(element, 2, "data-task-agent");
    expect(held.querySelector("[data-icon='agent']")).not.toBeNull();
    expect(held.classList.contains("queued")).toBe(false);
    expect(queued.classList.contains("queued")).toBe(true);
    expect(tipOf(held)).toEqual(["Worker 12"]);
    expect(tipOf(queued)).toEqual(["Worker 12"]);
    expect(cell(element, 3, "data-task-agent")).toBeNull();
    expect(element.querySelector('[data-row="3"] [data-task-icons] .cell.empty')).not.toBeNull();
});

test("the complexity column shows five rising bars filled to the score, amber from 4, with the score's meaning in its tooltip", async () => {
    const element = await drawn([task({id: 1, complexity: 3}), task({id: 2, complexity: 5}), task({id: 3, complexity: 0})]);
    const three = cell(element, 1, "data-task-complexity");
    expect(three.querySelectorAll("rect")).toHaveLength(5);
    expect(three.querySelectorAll("rect.on")).toHaveLength(3);
    expect(three.querySelector(".cx").classList.contains("hard")).toBe(false);
    expect(tipOf(three)).toEqual(["Complexity 3 of 5", "A few files in one module"]);
    expect(cell(element, 2, "data-task-complexity").querySelector(".cx").classList.contains("hard")).toBe(true);
    expect(tipOf(cell(element, 2, "data-task-complexity"))).toEqual(["Complexity 5 of 5", "Core paths, migrations, concurrency, or a design"]);
    expect(cell(element, 3, "data-task-complexity")).toBeNull();
});

test("the priority icon has a tooltip-like menu of Critical, High, Normal and Low, and a pick sets the priority", async () => {
    const runs = [];
    const element = await drawn([task({id: 7, priority: 200})], runs);
    const priority = cell(element, 7, "data-task-priority");
    expect(priority.getAttribute("aria-label")).toBe("Priority: Normal. Change it");
    expect([...priority.querySelectorAll("[data-priority-option]")].map((item) => item.textContent.trim())).toEqual(["Critical", "High", "Normal", "Low"]);
    expect(priority.querySelector('[data-priority-option="200"]').getAttribute("aria-checked")).toBe("true");
    priority.querySelector('[data-priority-option="400"]').click();
    expect(runs).toEqual(["task edit 7 --priority 400"]);
});

test("a click on a cell does not open the task, and the priority menu opens on a click for a touch screen", async () => {
    const element = await drawn([task({id: 7})]);
    const priority = cell(element, 7, "data-task-priority");
    expect(priority.classList.contains("shown")).toBe(false);
    priority.click();
    await Promise.resolve();
    expect(priority.classList.contains("shown")).toBe(true);
    expect(element.querySelector('[data-row="7"]').classList.contains("selected")).toBe(false);
});
