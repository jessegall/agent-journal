import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {afterEach, expect, test} from "vitest";
import {mounted, settle} from "./support/windowContext.js";
import {taskWindowContext as context} from "./support/taskWindowContext.js";
import TaskGroups from "../../core/modules/tasks/web/src/TaskGroups.vue";

afterEach(() => (document.body.innerHTML = ""));

const task = (id, title, state, delegatedTo = null) => ({id, title, state, priority: 200, delegated_to: delegatedTo, delegated_name: delegatedTo ? "Lady Lovelace" : null});
const BOARD = {groups: [
    {state: "started", total: 2, rows: [task(3, "Mine", "started"), task(1, "First job", "started", 12)]},
    {state: "testing", total: 1, rows: [task(4, "Being tested", "testing")]},
    {state: "open", total: 1, rows: [task(2, "Second job", "open", 12)]},
]};
const read = (name) => readFileSync(resolve(__dirname, name), "utf8");

test("a task delegated to a worker stays in the section of its state with the worker's icon, and there is no delegated section", async () => {
    const element = await mounted(TaskGroups, context({"task board": {ok: true, value: BOARD}}));
    expect(element.querySelector('[data-state="delegated"]')).toBeNull();
    expect(element.querySelector('[data-state="started"] [data-row="1"] [data-task-agent] [role=\'tooltip\'] b').textContent).toBe("Worker 12");
    expect(element.querySelector('[data-state="open"] [data-row="2"] [data-task-agent] [role=\'tooltip\'] b').textContent).toBe("Worker 12");
    expect(element.querySelector('[data-state="started"] [data-row="3"]')).not.toBeNull();
});

test("while searching, a group with no match is hidden", async () => {
    const element = await mounted(TaskGroups, context({"task board": {ok: true, value: BOARD}}));
    const search = element.querySelector("[data-search-input]");
    search.value = "mine";
    search.dispatchEvent(new Event("input"));
    await settle();
    expect([...element.querySelectorAll("section[data-state]")].map((group) => group.dataset.state)).toEqual(["started"]);
});

test("the filter of the tasks dialog offers no delegated section", () => {
    expect(read("../../core/modules/tasks/web/src/TasksMenus.vue")).not.toMatch(/const STATES = \[[^\]]*"delegated"/);
});

test("the Testing section uses the shared half-filled icon and the testing colour in both themes", async () => {
    const element = await mounted(TaskGroups, context({"task board": {ok: true, value: BOARD}}));
    const testing = element.querySelector('[data-row="4"] .ring.testing');
    expect(testing).not.toBeNull();
    expect(testing.querySelector("path.fill")).not.toBeNull();
    expect(element.querySelector('[data-row="3"] .ring.started')).not.toBeNull();
    expect(read("../src/tasks/TaskStatusIcon.vue")).toContain(".ring.testing {\n    --tone: var(--tone-sequence);");
    expect(read("../../core/modules/tasks/web/src/TaskGroups.vue")).toContain('.tasks-group[data-state="testing"] .tasks-fold');
    expect(read("../src/tokens.css")).toContain("--tone-sequence:");
    expect(read("../src/light.css")).toContain("--tone-sequence:");
});

test("a task queued for an agent shows the agent's name in its own group, and a task nobody holds shows none", async () => {
    const board = {groups: [{state: "open", total: 2, rows: [task(5, "Queued job", "open", 12), task(6, "Free job", "open")]}]};
    const element = await mounted(TaskGroups, context({"task board": {ok: true, value: board}}));
    expect(element.querySelector('[data-row="5"] [data-task-agent] [role=\'tooltip\'] b').textContent).toBe("Worker 12");
    expect(element.querySelector('[data-row="6"] [data-task-agent]')).toBeNull();
});

test("blocked tasks needing a person have a warning", async () => {
    const manual = {...task(10, "Needs attention", "blocked"), automatic: false};
    const waiting = {...task(11, "Waits for a task", "blocked"), automatic: true};
    const board = {groups: [{state: "blocked", total: 2, rows: [manual, waiting]}]};
    const element = await mounted(TaskGroups, context({"task board": {ok: true, value: board}}));
    expect(element.querySelector('[data-row="10"] [data-task-warning]').getAttribute("title")).toBe("Does not open by itself: needs a person");
    expect(element.querySelector('[data-row="11"] [data-task-warning]')).toBeNull();
});
