import {createApp, h} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
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
