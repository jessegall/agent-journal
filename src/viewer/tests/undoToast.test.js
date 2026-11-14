import {createApp, h, provide} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import ToastArea from "../src/kit/ToastArea.vue";
import {TOAST_HOLD_MS, makeToasts} from "../src/composables/toasts.js";
import {TOAST, useToast} from "../kit/useToast.js";

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
});

function shown(run = async () => ({ok: true})) {
    const toasts = makeToasts(run);
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(ToastArea, {toasts})}).mount(element);
    return {toasts, element};
}

test("test_undo_runs_command: the Undo button runs the toast's journal command once and the toast goes", async () => {
    const lines = [];
    const {toasts, element} = shown(async (line) => (lines.push(line), {ok: true}));
    toasts.raise("Task 9683 cancelled", {line: ["task", "reopen", "9683"]});
    await vi.advanceTimersByTimeAsync(0);
    expect(element.querySelector("[data-toast-text]").textContent).toBe("Task 9683 cancelled");
    element.querySelector("[data-toast-undo]").click();
    await vi.advanceTimersByTimeAsync(0);
    expect(lines).toEqual([["task", "reopen", "9683"]]);
    expect(element.querySelector("[data-toast]")).toBeNull();
});

test("a refused undo says why in a toast of its own", async () => {
    const {toasts, element} = shown(async () => ({ok: false, error: "Task 9683 is closed"}));
    toasts.raise("Task 9683 cancelled", {line: ["task", "reopen", "9683"]});
    element.querySelector("[data-toast-undo]")?.click();
    toasts.undo();
    await vi.advanceTimersByTimeAsync(0);
    expect(element.querySelector("[data-toast-text]").textContent).toBe("Task 9683 is closed");
    expect(element.querySelector("[data-toast-undo]")).toBeNull();
});

test("test_gone_after_six_seconds: a toast goes after 6 s and not before", async () => {
    const {toasts, element} = shown();
    toasts.raise("Copied", null);
    await vi.advanceTimersByTimeAsync(TOAST_HOLD_MS - 1);
    expect(element.querySelector("[data-toast]")).not.toBeNull();
    await vi.advanceTimersByTimeAsync(1);
    expect(element.querySelector("[data-toast]")).toBeNull();
    expect(TOAST_HOLD_MS).toBe(6000);
});

test("test_one_undo_at_a_time: a new toast replaces the shown one with its Undo, and takes the six seconds again", async () => {
    const lines = [];
    const {toasts, element} = shown(async (line) => (lines.push(line), {ok: true}));
    toasts.raise("Rule 4 removed", {line: ["rule", "restore", "4"]});
    await vi.advanceTimersByTimeAsync(4000);
    toasts.raise("Memory 8 removed", {line: ["memory", "restore", "8"]});
    await vi.advanceTimersByTimeAsync(4000);
    expect(element.querySelectorAll("[data-toast]").length).toBe(1);
    expect(element.querySelector("[data-toast-text]").textContent).toBe("Memory 8 removed");
    element.querySelector("[data-toast-undo]").click();
    await vi.advanceTimersByTimeAsync(0);
    expect(lines).toEqual([["memory", "restore", "8"]]);
});

test("a window raises a toast through useToast, and one outside a page that shows toasts is refused", () => {
    const toasts = makeToasts(async () => ({ok: true}));
    const element = document.createElement("div");
    document.body.append(element);
    let raise = null;
    createApp({setup() {
        provide(TOAST, toasts);
        return () => h({setup() { raise = useToast(); return () => null; }});
    }}).mount(element);
    raise("Saved");
    expect(toasts.current.value.text).toBe("Saved");
    expect(() => createApp({render: () => h({setup: () => (useToast(), () => null)})}).mount(document.createElement("div"))).toThrow();
});
