import {computed, ref} from "vue";
import {expect, test, vi} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import TaskCountsWindow from "../../core/modules/tasks/web/src/TaskCountsWindow.vue";

const COUNTS = {ok: true, value: {in_progress: 3, blocked: 1, open: 2, completed: 5, since: "2026-11-07T10:00:00+00:00"}};

// a window that keeps its options the way a pane does, and lets the test say a task event arrived
function counting() {
    const window = context({"task counts": COUNTS}, null, {counts: {line: "task counts", events: ["task.*"], arguments: ["hours", "since"]}});
    const options = ref({completed: "24"});
    const held = {};
    window.option = (key) => computed(() => options.value[key]);
    window.setOption = (key, value) => (options.value = {...options.value, [key]: value});
    window.follow = (patterns, heard) => (held.heard = heard);
    return {window, options, held};
}

const numbers = (element) => Object.fromEntries([...element.querySelectorAll("[data-task-count]")].map((tile) => [tile.dataset.taskCount, tile.querySelector("[data-task-count-number]").textContent]));
test("the window shows the four counts and the last 24 hours as the period of the completed count", async () => {
    const {window} = counting();
    const element = await mounted(TaskCountsWindow, window);
    expect(numbers(element)).toEqual({in_progress: "3", blocked: "1", open: "2", completed: "5"});
    expect(element.querySelector("[data-task-count-label=completed]").textContent).toBe("Completed in the last 24 hours");
    expect(window.reads).toEqual(["task counts --hours 24"]);
});

test("another period chosen in the menu is read again and named", async () => {
    const {window, options} = counting();
    const element = await mounted(TaskCountsWindow, window);
    options.value = {completed: "6"};
    await settle();
    expect(window.reads.at(-1)).toBe("task counts --hours 6");
    expect(element.querySelector("[data-task-count-label=completed]").textContent).toBe("Completed in the last 6 hours");
});

test("today counts the completed tasks from the reader's midnight", async () => {
    const {window, options} = counting();
    await mounted(TaskCountsWindow, window);
    options.value = {completed: "today"};
    await settle();
    expect(window.reads.at(-1)).toBe(`task counts --since ${new Date(new Date().setHours(0, 0, 0, 0)).toISOString()}`);
});

test("from now keeps the moment it was chosen on the pane and counts after it", async () => {
    vi.useFakeTimers({toFake: ["Date"]});
    vi.setSystemTime(new Date("2026-11-07T12:00:00Z"));
    const {window, options} = counting();
    await mounted(TaskCountsWindow, window);
    options.value = {completed: "now"};
    await settle();
    expect(options.value.since).toBe("2026-11-07T12:00:00.000Z");
    expect(window.reads.at(-1)).toBe("task counts --since 2026-11-07T12:00:00.000Z");
    vi.useRealTimers();
});

test("a task event reads the counts again, with no timer", async () => {
    const {window, held} = counting();
    await mounted(TaskCountsWindow, window);
    const before = window.reads.length;
    await held.heard({event: "task.update", row_id: 1});
    await vi.waitFor(() => expect(window.reads.length).toBe(before + 1));
});
