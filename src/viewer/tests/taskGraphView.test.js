import {afterEach, expect, test} from "vitest";
import {h} from "vue";
import {mounted, settle} from "./support/windowContext.js";
import {taskWindowContext as context} from "./support/taskWindowContext.js";
import TaskGraphView from "../../core/modules/tasks/web/src/TaskGraphView.vue";
import {NODE, taskGraphLayout} from "../../core/modules/tasks/web/src/taskGraphLayout.js";

afterEach(() => (document.body.innerHTML = ""));

const task = (id, title) => ({id, title, state: "open"});

test("a task stands to the right of what it waits on", () => {
    const {nodes, lines, width} = taskGraphLayout([task(1, "One"), task(2, "Two"), task(3, "Three")], [[2, 1], [3, 2]]);
    expect(nodes.map((node) => node.x)).toEqual([0, NODE.width + NODE.gapX, 2 * (NODE.width + NODE.gapX)]);
    expect(lines.map((line) => line.key)).toEqual(["2-1", "3-2"]);
    expect(width).toBe(3 * NODE.width + 2 * NODE.gapX);
});

test("two tasks waiting on one share a column, and a loop does not hang", () => {
    const {nodes} = taskGraphLayout([task(1, "One"), task(2, "Two"), task(3, "Three")], [[2, 1], [3, 1]]);
    expect(nodes[1].x).toBe(nodes[2].x);
    expect(nodes[1].y).not.toBe(nodes[2].y);
    expect(taskGraphLayout([task(1, "One"), task(2, "Two")], [[1, 2], [2, 1]]).nodes.length).toBe(2);
});

test("the graph draws its cards and lines and picks a task", async () => {
    const picked = [];
    const window = context({"task graph": {ok: true, value: {tasks: [task(1, "One"), task(2, "Two")], edges: [[2, 1]]}}});
    const element = await mounted({render: () => h(TaskGraphView, {onSelect: (id) => picked.push(id)})}, window);
    expect(element.querySelectorAll("[data-graph-line]").length).toBe(1);
    element.querySelector('[data-graph-node="2"]').click();
    await settle();
    expect(picked).toEqual([2]);
});

test("with nothing waiting the graph says so", async () => {
    const window = context({"task graph": {ok: true, value: {tasks: [], edges: []}}});
    expect((await mounted(TaskGraphView, window)).textContent).toContain("Task dependencies appear here when one task is blocked by another.");
});
