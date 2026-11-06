import {createApp, h, nextTick, ref, watch} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {useWindowData} from "../kit/useWindowData.js";
import {useWindow} from "../kit/windowContextKey.js";
import {WINDOW_CONTEXT} from "../kit/windowContextKey.js";

const DECLARED = {
    rows: {tab: "", events: ["message.*"], reload_seconds: 0},
    open: {tab: "open", events: [], reload_seconds: 0},
    closed: {tab: "closed", events: ["task.*"], reload_seconds: 0},
    usage: {tab: "", events: [], reload_seconds: 10},
};

function mounted({answer, visible = ref(true), tab = ref("open")}) {
    const asked = [];
    const followed = [];
    const context = {
        visible,
        follow: (patterns, heard) => followed.push({patterns, heard}),
        readKeys: async (request) => {
            asked.push(request);
            return answer ? answer(request) : {ok: true, value: {declared: DECLARED, keys: Object.fromEntries((request.only.length ? request.only : ["rows", "open", "usage"]).map((name) => [name, {ok: true, value: name}]))}};
        },
    };
    let data;
    const app = createApp({setup() {
        data = useWindowData(context);
        data.state.tab = tab.value;
        watch(tab, (value) => (data.state.tab = value));
        return () => h("div");
    }});
    app.provide(WINDOW_CONTEXT, context);
    app.mount(document.createElement("div"));
    return {app, asked, followed, data, tab};
}

const settled = async () => {
    await vi.advanceTimersByTimeAsync(0);
    await nextTick();
};

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test("the first load asks for what is on screen, with the tab in its state", async () => {
    const {asked, data} = mounted({});
    await settled();
    expect(asked).toEqual([{only: [], state: {tab: "open"}}]);
    expect(data.props.rows.data.value).toBe("rows");
    expect(data.props.closed.data.value).toBeUndefined();
});

test("a tab switch asks only for the key of that tab, and not again", async () => {
    const {asked, tab} = mounted({});
    await settled();
    tab.value = "closed";
    await settled();
    expect(asked[1].only).toEqual(["closed"]);
    tab.value = "open";
    await settled();
    tab.value = "closed";
    await settled();
    expect(asked).toHaveLength(2);
});

test("switching tabs never requests an id key declaration as a literal name", async () => {
    const declared = {...DECLARED, "run.*": {tab: null, events: [], reload_seconds: 0, loading: "first"}};
    const {asked, tab, data} = mounted({answer: (request) => ({ok: true, value: {declared,
        keys: Object.fromEntries((request.only.length ? request.only : ["rows", "open", "usage"]).map((name) => [name, {ok: true, value: name}]))}})});
    await settled();
    tab.value = "closed";
    await settled();
    expect(asked[1].only).toEqual(["closed"]);
    await Promise.all([data.reload("run.12"), vi.advanceTimersByTimeAsync(0)]);
    expect(asked[2].only).toEqual(["run.12"]);
});

test("an event reloads only its key, and a burst is one request", async () => {
    const {asked, followed} = mounted({});
    await settled();
    followed[0].heard({event: "message.create"});
    followed[0].heard({event: "message.update"});
    await vi.advanceTimersByTimeAsync(60);
    expect(asked.slice(1)).toEqual([{only: ["rows"], state: {tab: "open"}}]);
});

test("an event for a key not on screen reads it when its tab comes into focus", async () => {
    const {asked, followed, tab} = mounted({});
    await settled();
    followed[0].heard({event: "task.create"});
    await vi.advanceTimersByTimeAsync(60);
    expect(asked).toHaveLength(1);
    tab.value = "closed";
    await settled();
    expect(asked[1].only).toEqual(["closed"]);
});

test("a key's timer reloads it alone, and not while the window is hidden", async () => {
    const visible = ref(true);
    const {asked} = mounted({visible});
    await settled();
    await vi.advanceTimersByTimeAsync(10060);
    expect(asked[1].only).toEqual(["usage"]);
    visible.value = false;
    await vi.advanceTimersByTimeAsync(10060);
    expect(asked).toHaveLength(2);
});

test("a key that fails says so and keeps its last value", async () => {
    let failing = false;
    const {data} = mounted({answer: (request) => ({ok: true, value: {declared: DECLARED, keys: {rows: failing ? {ok: false, error: "No rows"} : {ok: true, value: "held"}}}})});
    await settled();
    failing = true;
    await Promise.all([data.reload({only: ["rows"]}), vi.advanceTimersByTimeAsync(0)]);
    expect(data.props.rows.data.value).toBe("held");
    expect(data.props.rows.failure.value).toBe("No rows");
});

test("the timers stop when the window ends", async () => {
    const {app, asked} = mounted({});
    await settled();
    app.unmount();
    await vi.advanceTimersByTimeAsync(20000);
    expect(asked).toHaveLength(1);
});

test("a window reads through its props: a list's rows, and a reload of what it names", async () => {
    const asked = [];
    const answer = (request) => {
        asked.push(request.only);
        const names = request.only.length ? request.only : ["list"];
        return {ok: true, value: {declared: {list: {tab: null, events: [], reload_seconds: 0, loading: "first", page_size: 50}}, keys: Object.fromEntries(names.map((name) => [name, {ok: true, value: {rows: [{id: 1}], page: 1, size: 50, total: 1}}]))}};
    };
    const context = {visible: ref(true), follow: () => {}, readKeys: async (request) => answer(request)};
    let window;
    const app = createApp({setup() {
        window = useWindow();
        return () => h("div");
    }});
    app.provide(WINDOW_CONTEXT, context);
    app.mount(document.createElement("div"));
    const {rows} = window.props.list;
    await settled();
    await vi.advanceTimersByTimeAsync(600);
    expect(rows.value).toEqual([{id: 1}]);
    await Promise.all([window.reload("list"), window.reload({only: ["other"]}), vi.advanceTimersByTimeAsync(0)]);
    expect(asked).toEqual([[], ["list", "other"]]);
});

test("two reads of one key with other flags go in two requests, and each gets its own answer", async () => {
    const {asked, data} = mounted({answer: (request) => ({ok: true, value: {declared: DECLARED, keys: {rows: {ok: true, value: request.state["rows.after"]}}}})});
    await settled();
    asked.length = 0;
    const answers = Promise.all([data.readKey("rows", {after: 1}), data.readKey("rows", {after: 2}), data.readKey("rows", {after: 1})]);
    await vi.advanceTimersByTimeAsync(5);
    expect((await answers).map((answer) => answer.value)).toEqual([1, 2, 1]);
    expect(asked).toHaveLength(2);
});
