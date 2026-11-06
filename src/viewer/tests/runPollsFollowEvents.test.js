import {createApp, h} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import RunChip from "../src/chat/RunChip.vue";
import MarkBody from "../src/chat/MarkBody.vue";
import {WINDOW_CONTEXT} from "../kit/windowContextKey.js";
import {tabVisibility} from "./tabVisibility.js";

const OUTPUT_PAGE = {ok: true, value: {lines: [], first_byte: 0, last_byte: 0, cut_bytes: 0, total: 0}};
const CARD = {ok: true, value: {state: "running", progress: 40, title: "Tests"}};
// a window that answers each key it is asked for with the answer given, and counts the requests that name one
function keyWindow(answer, extra = {}) {
    const asked = [];
    return {
        asked,
        visible: {value: true},
        follow: () => {},
        ...extra,
        async readKeys({only = []}) {
            only.forEach((name) => asked.push(name));
            return {ok: true, value: {declared: {}, keys: Object.fromEntries(only.map((name) => [name, answer]))}};
        },
    };
}

const tab = tabVisibility();
const showTab = tab.show;

beforeEach(() => {
    vi.useFakeTimers();
    tab.reset();
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
    const context = keyWindow(CARD, {subscriptions});
    const app = mountedWith(RunChip, {item: {id: 3, target_id: 7, title: "Tests"}}, context);
    await vi.advanceTimersByTimeAsync(0);
    return {app, heard, stops, asked: context.asked};
}

test("a docked run chip reads its card once and again only when a process event names its run", async () => {
    const {heard, asked} = await chip();
    expect(asked).toEqual(["run.7"]);
    await vi.advanceTimersByTimeAsync(60000);
    expect(asked).toEqual(["run.7"]);
    expect(heard[0].patterns).toEqual(["process.*"]);
    heard[0].handler({row_id: 7});
    await vi.advanceTimersByTimeAsync(0);
    expect(asked).toEqual(["run.7", "run.7"]);
    heard[0].handler({row_id: 8});
    await vi.advanceTimersByTimeAsync(0);
    expect(asked).toEqual(["run.7", "run.7"]);
});

test("a docked run chip stops following when it goes", async () => {
    const {app, stops} = await chip();
    app.unmount();
    expect(stops).toEqual(["run chip 3"]);
    expect(vi.getTimerCount()).toBe(0);
});

test("an opened running mark reads its output every two seconds, nothing while the tab is hidden, and once when it is shown again", async () => {
    const context = keyWindow(OUTPUT_PAGE);
    const mark = {id: 1, type: "processes.command", target_model: "process", target_id: 7, ended_at: null};
    const app = mountedWith(MarkBody, {declaration: {}, mark, shown: true}, context);
    await vi.advanceTimersByTimeAsync(0);
    expect(context.asked).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(2001);
    expect(context.asked).toHaveLength(2);
    showTab(true);
    await vi.advanceTimersByTimeAsync(20000);
    expect(context.asked).toHaveLength(2);
    showTab(false);
    await vi.advanceTimersByTimeAsync(0);
    expect(context.asked).toHaveLength(3);
    app.unmount();
    expect(vi.getTimerCount()).toBe(0);
});

test("a mark that is not opened reads no output, and one that ended is not read on the clock", async () => {
    const mark = {id: 1, type: "processes.command", target_model: "process", target_id: 7, ended_at: null};
    const closed = keyWindow(OUTPUT_PAGE);
    const ended = keyWindow(OUTPUT_PAGE);
    mountedWith(MarkBody, {declaration: {}, mark, shown: false}, closed);
    mountedWith(MarkBody, {declaration: {}, mark: {...mark, ended_at: "2026-11-06T10:00:00Z"}, shown: true}, ended);
    await vi.advanceTimersByTimeAsync(20000);
    expect(closed.asked).toHaveLength(0);
    expect(ended.asked).toHaveLength(1);
});
