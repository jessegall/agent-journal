import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {createApp, h, nextTick, ref} from "vue";
import TaskInspector from "../src/tasks/TaskInspector.vue";
import {pageOf} from "../src/sync/paging.js";
import {settled} from "./settled.js";

const apps = [];
beforeEach(() =>
    vi.stubGlobal(
        "ResizeObserver",
        class {
            observe() {}
            disconnect() {}
        }
    )
);
afterEach(() => {
    for (const app of apps.splice(0)) app.unmount();
    document.body.replaceChildren();
    vi.unstubAllGlobals();
});

async function inspector(logs = async () => ({ok: true, value: {rows: [], is_last_page: true}}), block_renewals = []) {
    const id = ref(7);
    const changes = ref(0);
    const read = vi.fn(async (line) => {
        if (line[0] === "task-log") return logs(line);
        if (line[1] === "inspect")
            return {
                ok: true,
                value: {
                    id: Number(line[2]),
                    title: `Task ${line[2]}`,
                    state: "started",
                    priority: 1,
                    created_at: "2026-11-03T12:00:00Z",
                    updated_at: "2026-11-03T12:00:00Z",
                    brief: "Check the task details",
                    waits: [],
                    logs: [{id: 1, line: "An embedded log that belongs in the Log tab"}],
                    block_renewals,
                },
            };
        if (line[1] === "graph") return {ok: true, value: {tasks: [], edges: []}};
        if (line[1] === "comments")
            return {ok: true, value: {rows: [{id: 2, text: `On task ${id.value}, Task ${id.value}: A comment on the task`}]}};
        return {ok: true, value: {rows: []}};
    });
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp(() => h(TaskInspector, {id: id.value, read, changes: changes.value}));
    app.directive("tip", {});
    app.mount(element);
    apps.push(app);
    await settled();
    return {element, read, id, changes};
}

test("the task inspector shows every block renewal with its reason and time", async () => {
    const renewals = [
        {id: 1, reason: "Needs the price list", created_at: "2026-11-03T12:00:00Z"},
        {id: 2, reason: "The supplier is checking", created_at: "2026-11-03T13:00:00Z"},
        {id: 3, reason: "Delivery is now tomorrow", created_at: "2026-11-03T14:00:00Z"},
    ];
    const {element} = await inspector(undefined, renewals);
    const rows = [...element.querySelectorAll("[data-task-block-renewal]")];
    expect(rows).toHaveLength(3);
    for (const [index, row] of rows.entries()) {
        expect(row.textContent).toContain(renewals[index].reason);
        expect(row.querySelector("time").dateTime).toBe(renewals[index].created_at);
        expect(row.querySelector("time").textContent).toBe(new Date(renewals[index].created_at).toLocaleString());
    }
});

async function choose(element, label) {
    const tab = [...element.querySelectorAll("[data-task-tabs] button")].find((button) => button.textContent.trim() === label);
    expect(tab, `The task inspector has a ${label} tab`).toBeDefined();
    tab.click();
    await settled();
}

test("the Log tab reads only this task's bounded log page and shows its lines and times", async () => {
    const at = "2026-11-03T12:34:00+00:00";
    const {element, read} = await inspector(async () => ({
        ok: true,
        value: {rows: [{id: 3, task_id: 7, line: "Verified the cart totals.\nThe tax is correct.", created_at: at}], is_last_page: true},
    }));
    expect(element.textContent).toContain("Check the task details");
    expect(element.querySelector("[data-resource-logs]")).toBeNull();
    expect(read.mock.calls.some(([line]) => line[0] === "task-log")).toBe(false);
    await choose(element, "Log");
    expect(read).toHaveBeenCalledWith(["task-log", "list", "--task", "7", "--limit", String(pageOf("task_logs")), "--page", "1"]);
    expect(element.querySelector("[data-task-log]").textContent).toContain("Verified the cart totals.\nThe tax is correct.");
    const time = element.querySelector("[data-task-log] time");
    expect(time.dateTime).toBe(at);
    expect(time.textContent).toBe(new Date(at).toLocaleString());
    expect(element.querySelector("[data-task-brief]")).toBeNull();
    await choose(element, "Comments");
    expect(element.querySelector("[data-comment]").textContent).toBe("A comment on the task");
    expect(element.querySelector("[data-task-log]")).toBeNull();
    await choose(element, "Details");
    expect(element.querySelector("[data-task-brief]").textContent).toContain("Check the task details");
});

test("a task with no log entries has a clear empty state", async () => {
    const {element} = await inspector();
    await choose(element, "Log");
    expect(element.querySelector("[data-task-log-empty]").textContent).toBe("No log entries yet.");
});

test("older and newer pages keep the read limit fixed", async () => {
    const {element, read} = await inspector(async (line) => ({
        ok: true,
        value: {
            rows: [{id: line.at(-1), line: `Page ${line.at(-1)}`, created_at: "2026-11-03T12:34:00Z"}],
            is_last_page: line.at(-1) === "2",
        },
    }));
    await choose(element, "Log");
    element.querySelector("[data-task-log-older]").click();
    await settled();
    expect(element.querySelector("[data-task-log]").textContent).toContain("Page 2");
    expect(read).toHaveBeenCalledWith(["task-log", "list", "--task", "7", "--limit", String(pageOf("task_logs")), "--page", "2"]);
    expect(element.querySelector("[data-task-log-older]").disabled).toBe(true);
    element.querySelector("[data-task-log-newer]").click();
    await settled();
    expect(element.querySelector("[data-task-log]").textContent).toContain("Page 1");
});

test("a failed read can be retried and changes reload the selected log", async () => {
    let available = false;
    const {element, changes} = await inspector(async () =>
        available ? {ok: true, value: {rows: [], is_last_page: true}} : {ok: false, error: "The log could not be read"}
    );
    await choose(element, "Log");
    expect(element.querySelector("[data-task-log-failure]").textContent).toBe("The log could not be read");
    available = true;
    element.querySelector("[data-task-log-retry]").click();
    await settled();
    expect(element.querySelector("[data-task-log-empty]")).not.toBeNull();
    available = false;
    changes.value += 1;
    await settled();
    expect(element.querySelector("[data-task-log-failure]")).not.toBeNull();
});

test("switching tasks resets the selected tab and never shows the previous task's late log", async () => {
    let finish;
    const {element, id, read} = await inspector(
        () =>
            new Promise((resolve) => {
                finish = resolve;
            })
    );
    await choose(element, "Log");
    id.value = 8;
    await nextTick();
    finish({ok: true, value: {rows: [{id: 3, line: "The old task's entry", created_at: "2026-11-03T12:34:00Z"}], is_last_page: true}});
    await settled();
    expect(element.textContent).toContain("Task 8");
    expect(element.querySelector("[data-task-log]")).toBeNull();
    expect(element.textContent).not.toContain("The old task's entry");
    expect(read).not.toHaveBeenCalledWith(["task-log", "list", "--task", "8", "--limit", String(pageOf("task_logs")), "--page", "1"]);
});
