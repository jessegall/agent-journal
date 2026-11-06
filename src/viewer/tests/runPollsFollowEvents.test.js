import {createApp, h} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import RunChip from "../src/chat/RunChip.vue";
import MarkBody from "../src/chat/MarkBody.vue";
import {WINDOW_CONTEXT, lineResult} from "../src/windows/windowContext.js";
import {tabVisibility} from "./tabVisibility.js";

vi.mock("../src/windows/windowContext.js", async (original) => ({...(await original()), lineResult: vi.fn(async () => ({ok: true, value: {state: "running", progress: 40, title: "Tests"}}))}));

const tab = tabVisibility();
const showTab = tab.show;

beforeEach(() => {
    vi.useFakeTimers();
    tab.reset();
    lineResult.mockClear();
});
afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    delete document.hidden;
});

function mountedWith(component, props, context) {
    const app = createApp({render: () => h(component, props)});
    app.provide(WINDOW_CONTEXT, context);
    app.mount(document.createElement("div"));
    return app;
}

async function chip() {
    const heard = [];
    const stops = [];
    const subscriptions = {follow: vi.fn((name, patterns, handler) => (heard.push({patterns, handler}), () => stops.push(name)))};
    const app = mountedWith(RunChip, {item: {id: 3, target_id: 7, title: "Tests"}}, {environment: "main", subscriptions});
    await vi.advanceTimersByTimeAsync(0);
    return {app, heard, stops};
}

test("a docked run chip reads its card once and again only when a process event names its run", async () => {
    const {heard} = await chip();
    expect(lineResult).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(60000);
    expect(lineResult).toHaveBeenCalledTimes(1);
    expect(heard[0].patterns).toEqual(["process.*"]);
    heard[0].handler({row_id: 7});
    await vi.advanceTimersByTimeAsync(0);
    expect(lineResult).toHaveBeenCalledTimes(2);
    heard[0].handler({row_id: 8});
    await vi.advanceTimersByTimeAsync(0);
    expect(lineResult).toHaveBeenCalledTimes(2);
});

test("a docked run chip stops following when it goes", async () => {
    const {app, stops} = await chip();
    app.unmount();
    expect(stops).toEqual(["run chip 3"]);
    expect(vi.getTimerCount()).toBe(0);
});

test("an opened running mark reads its output every two seconds, nothing while the tab is hidden, and once when it is shown again", async () => {
    const run = vi.fn(async () => ({ok: true, value: {lines: [], first_byte: 0, last_byte: 0, cut_bytes: 0, total: 0}}));
    const mark = {id: 1, type: "processes.command", target_model: "process", target_id: 7, ended_at: null};
    const app = mountedWith(MarkBody, {declaration: {}, mark, shown: true}, {run});
    await vi.advanceTimersByTimeAsync(0);
    expect(run).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(2000);
    expect(run).toHaveBeenCalledTimes(2);
    showTab(true);
    await vi.advanceTimersByTimeAsync(20000);
    expect(run).toHaveBeenCalledTimes(2);
    showTab(false);
    await vi.advanceTimersByTimeAsync(0);
    expect(run).toHaveBeenCalledTimes(3);
    app.unmount();
    expect(vi.getTimerCount()).toBe(0);
});

test("a mark that is not opened reads no output, and one that ended is not read on the clock", async () => {
    const run = vi.fn(async () => ({ok: true, value: {lines: [], first_byte: 0, last_byte: 0, cut_bytes: 0, total: 0}}));
    const mark = {id: 1, type: "processes.command", target_model: "process", target_id: 7, ended_at: null};
    mountedWith(MarkBody, {declaration: {}, mark, shown: false}, {run});
    mountedWith(MarkBody, {declaration: {}, mark: {...mark, ended_at: "2026-11-06T10:00:00Z"}, shown: true}, {run});
    await vi.advanceTimersByTimeAsync(20000);
    expect(run).toHaveBeenCalledTimes(1);
});
