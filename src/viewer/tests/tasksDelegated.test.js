import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {afterEach, expect, test} from "vitest";
import {mounted, settle} from "./support/windowContext.js";
import {taskWindowContext as context} from "./support/taskWindowContext.js";
import TaskGroups from "../../core/modules/tasks/web/src/TaskGroups.vue";

afterEach(() => (document.body.innerHTML = ""));

const task = (id, title, state, delegatedTo = null) => ({id, title, state, priority: 200, delegated_to: delegatedTo, delegated_name: delegatedTo ? "Lady Lovelace" : null});
const BOARD = {groups: [
    {state: "started", total: 1, rows: [task(3, "Mine", "started")]},
    {state: "testing", total: 1, rows: [task(4, "Being tested", "testing")]},
    {state: "open", total: 0, rows: []},
    {state: "delegated", total: 2, rows: [task(2, "Second job", "open", 12), task(1, "First job", "started", 12)]},
]};
const read = (name) => readFileSync(resolve(__dirname, name), "utf8");

test("tasks delegated to a worker are listed in a section of their own, with the worker each is delegated to, apart from the agent's own", async () => {
    const element = await mounted(TaskGroups, context({"task board": {ok: true, value: BOARD}}));
    const delegated = element.querySelector('[data-state="delegated"]');
    expect(delegated.querySelector("[data-group-head]").textContent).toContain("Delegated");
    expect([...delegated.querySelectorAll("[data-row]")].map((row) => row.dataset.row)).toEqual(["1", "2"]);
    expect([...delegated.querySelectorAll("[data-task-agent]")].map((agent) => agent.textContent)).toEqual(["Lady Lovelace", "Lady Lovelace"]);
    expect(element.querySelector('[data-state="started"] [data-row="3"]')).not.toBeNull();
    expect(element.querySelector('[data-state="started"] [data-row="1"]')).toBeNull();
    expect(element.querySelector('[data-state="open"]')).toBeNull();
});

test("while searching, a group with no match is hidden", async () => {
    const element = await mounted(TaskGroups, context({"task board": {ok: true, value: BOARD}}));
    const search = element.querySelector("[data-search-input]");
    search.value = "mine";
    search.dispatchEvent(new Event("input"));
    await settle();
    expect([...element.querySelectorAll("section[data-state]")].map((group) => group.dataset.state)).toEqual(["started"]);
});

test("the filter of the tasks dialog offers the delegated section", () => {
    expect(read("../../core/modules/tasks/web/src/TasksMenus.vue")).toMatch(/const STATES = \[[^\]]*"delegated"/);
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
    expect(element.querySelector('[data-row="5"] [data-task-agent]').textContent).toBe("Lady Lovelace");
    expect(element.querySelector('[data-row="6"] [data-task-agent]')).toBeNull();
});
