import {computed, ref} from "vue";
import {expect, test, vi} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import TaskCountsWindow from "../../core/modules/tasks/web/src/TaskCountsWindow.vue";

const COUNTS = {ok: true, value: {started: 3, blocked: 1, delegated: 2, completed: 5, since: "2026-11-07T10:00:00+00:00"}};

// a window that keeps its options the way a pane does, and lets the test say a task event arrived
function counting() {
    const window = context({"task counts": COUNTS}, null, {counts: {line: "task counts", events: ["task.*"], arguments: ["hours", "since"]}});
    const options = ref({});
    const held = {};
    window.option = (key) => computed(() => options.value[key]);
    window.setOption = (key, value) => (options.value = {...options.value, [key]: value});
    window.follow = (patterns, heard) => (held.heard = heard);
    return {window, options, held};
}

const numbers = (element) => Object.fromEntries([...element.querySelectorAll("[data-task-count]")].map((tile) => [tile.dataset.taskCount, tile.querySelector("[data-task-count-number]").textContent]));
const pick = async (element, label) => {
    [...element.querySelectorAll(".segmented-option")].find((option) => option.textContent.trim() === label).click();
    await settle();
};

test("the window shows the four counts and the last 24 hours as the range of the completed count", async () => {
    const {window} = counting();
    const element = await mounted(TaskCountsWindow, window);
    expect(numbers(element)).toEqual({started: "3", blocked: "1", delegated: "2", completed: "5"});
    expect(element.querySelector("[data-task-count=completed] [data-task-count-range]").textContent).toBe("in the last 24 hours");
    expect(window.reads).toEqual(["task counts --hours 24"]);
});

test("another number of hours is kept as the window's range and read again", async () => {
    const {window, options} = counting();
    const element = await mounted(TaskCountsWindow, window);
    const hours = element.querySelector("[data-task-counts-hours]");
    hours.value = "6";
    hours.dispatchEvent(new Event("change"));
    await settle();
    expect(options.value.range).toEqual({kind: "hours", hours: 6});
    expect(window.reads.at(-1)).toBe("task counts --hours 6");
    expect(element.querySelector("[data-task-count-range]").textContent).toBe("in the last 6 hours");
});

test("from a time counts the completed tasks after it", async () => {
    const {window, options} = counting();
    const element = await mounted(TaskCountsWindow, window);
    await pick(element, "From a time");
    const time = element.querySelector("[data-task-counts-time]");
    time.value = "2026-11-07T08:30";
    time.dispatchEvent(new Event("change"));
    await settle();
    expect(options.value.range.kind).toBe("time");
    expect(window.reads.at(-1)).toBe(`task counts --since ${new Date("2026-11-07T08:30").toISOString()}`);
});

test("from now counts after the moment it was chosen, and reset moves that moment to now", async () => {
    vi.useFakeTimers({toFake: ["Date"]});
    vi.setSystemTime(new Date("2026-11-07T12:00:00Z"));
    const {window, options} = counting();
    const element = await mounted(TaskCountsWindow, window);
    await pick(element, "From now");
    expect(options.value.range).toEqual({kind: "now", since: "2026-11-07T12:00:00.000Z"});
    expect(window.reads.at(-1)).toBe("task counts --since 2026-11-07T12:00:00.000Z");
    vi.setSystemTime(new Date("2026-11-07T13:30:00Z"));
    element.querySelector("[data-task-counts-reset]").click();
    await settle();
    expect(options.value.range.since).toBe("2026-11-07T13:30:00.000Z");
    expect(window.reads.at(-1)).toBe("task counts --since 2026-11-07T13:30:00.000Z");
    vi.useRealTimers();
});

test("a task event reads the counts again, with no timer", async () => {
    const {window, held} = counting();
    await mounted(TaskCountsWindow, window);
    const before = window.reads.length;
    await held.heard({event: "task.update", row_id: 1});
    await vi.waitFor(() => expect(window.reads.length).toBe(before + 1));
});
