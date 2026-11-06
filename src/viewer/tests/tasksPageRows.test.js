import {ref} from "vue";
import {afterEach, expect, test} from "vitest";
import {mounted, settle} from "./support/windowContext.js";
import {taskWindowContext} from "./support/taskWindowContext.js";
import {windowContext} from "../src/windows/windowContext.js";
import TaskGroups from "../../core/modules/tasks/web/src/TaskGroups.vue";

const BOARD = {ok: true, value: {groups: [{state: "open", total: 1, rows: [{id: 8, title: "Fix the totals", state: "open", priority: "normal"}]}]}};
const DECLARED = [{control: "choice", key: "rows", label: "Tasks per page", choices: [["5", "5"], ["10", "10"], ["25", "25"]], default: "10"}];

afterEach(() => (document.body.innerHTML = ""));

function windowOf(rows) {
    const window = taskWindowContext({"task board": BOARD});
    window.option = (key) => (key === "rows" ? rows : {value: false});
    return window;
}

test("the tasks window reads ten tasks of each group while its pane has chosen nothing", async () => {
    const real = windowContext({window: "tasks.tasks", environment: "main", visible: () => true, options: ref({}), declared: DECLARED, subscriptions: {follow: () => () => {}}});
    const window = windowOf(real.option("rows"));
    await mounted(TaskGroups, window);
    expect(window.reads).toEqual(["task board --limit 10"]);
});

test("a page size chosen in the menu reads the board again with it", async () => {
    const rows = ref("10");
    const window = windowOf(rows);
    await mounted(TaskGroups, window);
    rows.value = "5";
    await settle();
    expect(window.reads).toEqual(["task board --limit 10", "task board --limit 5"]);
});

test("a page size the window was not given reads the board with the server's own page", async () => {
    const window = taskWindowContext({"task board": BOARD});
    await mounted(TaskGroups, window);
    expect(window.reads).toEqual(["task board"]);
});
