import {afterEach, expect, test} from "vitest";
import {mounted, settle} from "./support/windowContext.js";
import {taskWindowContext as context} from "./support/taskWindowContext.js";
import TaskGroups from "../../core/modules/tasks/web/src/TaskGroups.vue";

afterEach(() => (document.body.innerHTML = ""));

const task = (overrides) => ({id: 1, title: "A task", state: "open", priority: 200, complexity: 0, tags: [], assigned_actor_id: null, assigned_name: null, ...overrides});
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
const hovered = async (found) => {
    found.dispatchEvent(new Event("mouseenter"));
    await settle();
    return found;
};
const tipOf = (found) => [...found.querySelectorAll("[role='tooltip'] b, [role='tooltip'] span")].map((line) => line.textContent);

test("a row shows its tags in full as outlined chips after the title", async () => {
    const element = await drawn([task({tags: ["viewer", "agents"]})]);
    const row = element.querySelector('[data-row="1"]');
    expect([...row.querySelectorAll("[data-task-tag]")].map((tag) => tag.textContent)).toEqual(["viewer", "agents"]);
    expect(row.querySelector(".task-title").nextElementSibling.classList.contains("task-tags")).toBe(true);
});

test("a task assigned to a main agent shows the solid purple user icon and any other agent keeps its icon", async () => {
    const element = await drawn([task({id: 1, state: "started", assigned_actor_id: 78, assigned_name: "Main", is_main_assignee: true}), task({id: 2, state: "started", assigned_actor_id: 12, assigned_name: "Joan Clarke", is_main_assignee: false})]);
    const main = cell(element, 1, "data-task-agent");
    const worker = cell(element, 2, "data-task-agent");
    expect(main.querySelector("[data-agent-main-icon]")).not.toBeNull();
    expect(main.querySelector("[data-agent-main]")).not.toBeNull();
    expect(tipOf(await hovered(main))[0]).toBe("main agent");
    expect(worker.querySelector("[data-agent-main-icon]")).toBeNull();
    expect(worker.querySelector("[data-icon='agent']")).not.toBeNull();
});

test("the agent column shows the agent icon, solid when it holds the task and dashed when the task waits, with a tooltip that opens the agent", async () => {
    const element = await drawn([task({id: 1, state: "started", assigned_actor_id: 12, assigned_name: "Joan Clarke"}), task({id: 2, assigned_actor_id: 12, assigned_name: "Joan Clarke"}), task({id: 3})]);
    const held = cell(element, 1, "data-task-agent");
    const queued = cell(element, 2, "data-task-agent");
    expect(held.querySelector("[data-icon='agent']")).not.toBeNull();
    expect(held.classList.contains("queued")).toBe(false);
    expect(queued.classList.contains("queued")).toBe(true);
    expect(tipOf(await hovered(held))[0]).toBe("Worker 12");
    expect(tipOf(await hovered(queued))[0]).toBe("Worker 12");
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

test("a task assigned to a person shows the people icon with the person's name and opens nothing", async () => {
    const element = await drawn([task({id: 1, state: "started", assigned_actor_id: 4, assigned_name: "Ada", assigned_type: "user"}), task({id: 2, assigned_actor_id: 4, assigned_name: "Ada", assigned_type: "user"})]);
    const held = cell(element, 1, "data-task-person");
    const queued = cell(element, 2, "data-task-person");
    expect(held.querySelector("[data-icon='people']")).not.toBeNull();
    expect(cell(element, 1, "data-task-agent")).toBeNull();
    expect(held.classList.contains("queued")).toBe(false);
    expect(queued.classList.contains("queued")).toBe(true);
    expect(tipOf(await hovered(held))[0]).toBe("Ada");
});
