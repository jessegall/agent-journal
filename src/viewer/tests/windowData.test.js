import {createApp, h, nextTick, ref} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {useWindowData} from "../kit/useWindowData.js";
import {WINDOW_CONTEXT} from "../kit/windowContextKey.js";

const DECLARED = {
    rows: {tab: "", events: ["message.*"], every_seconds: 0},
    open: {tab: "open", events: [], every_seconds: 0},
    closed: {tab: "closed", events: ["task.*"], every_seconds: 0},
    usage: {tab: "", events: [], every_seconds: 10},
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
        data = useWindowData({tab: () => tab.value});
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
    expect(data.data.rows.value).toBe("rows");
    expect(data.data.closed).toBeUndefined();
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
    await data.reload({only: ["rows"]});
    expect(data.data.rows.value).toBe("held");
    expect(data.data.rows.failure).toBe("No rows");
});

test("the timers stop when the window ends", async () => {
    const {app, asked} = mounted({});
    await settled();
    app.unmount();
    await vi.advanceTimersByTimeAsync(20000);
    expect(asked).toHaveLength(1);
});
