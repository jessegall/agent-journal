import {afterEach, expect, test, vi} from "vitest";
import {createApp, h} from "vue";
import {ApiClient} from "../src/api/client.js";
import {transport} from "../src/api/transport.js";
import {SHOWN_FOR, pauseToast, resumeToast, toast, toasted, undoToast} from "../src/phone/kit/toast.js";
import {CUE_AFTER, HOLD_FOR, usePress} from "../src/phone/kit/press.js";
import {screenOf, targetOf} from "../src/phone/screens.js";

afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    transport.carry({});
});

test("a pointed client reaches the desktop's routes through the phone, with the phone's header", async () => {
    const fetched = vi.fn(async () => new Response("{}", {status: 200, headers: {"Content-Type": "application/json"}}));
    vi.stubGlobal("fetch", fetched);
    const client = new ApiClient();
    client.point("/p", () => "main");
    transport.carry({"X-Phone": "1"});
    await client.create("todo", {title: "From the phone"});
    const [url, sent] = fetched.mock.calls[0];
    expect(url).toBe("/p/api/main/todo");
    expect(sent.headers).toEqual({"X-Phone": "1", "Content-Type": "application/json"});
});

test("the toast waits while it is touched and goes once let go", () => {
    vi.useFakeTimers();
    const undone = vi.fn();
    toast("Marked to-do 3 done", undone);
    pauseToast();
    vi.advanceTimersByTime(SHOWN_FOR * 2);
    expect(toasted.value.text).toBe("Marked to-do 3 done");
    resumeToast();
    vi.advanceTimersByTime(SHOWN_FOR);
    expect(toasted.value).toBe(null);
    toast("Marked to-do 3 done", undone);
    undoToast();
    expect(undone).toHaveBeenCalledOnce();
    expect(toasted.value).toBe(null);
});

test("a hold shows its press cue first and is cancelled by a slip past 4 pixels", () => {
    vi.useFakeTimers();
    const held = vi.fn();
    let press;
    const app = createApp({setup: () => ((press = usePress(held)), () => h("div"))});
    app.mount(document.createElement("div"));
    const el = document.createElement("div");
    const at = (x, y) => ({button: 0, clientX: x, clientY: y, currentTarget: el});
    press.down(at(10, 10));
    vi.advanceTimersByTime(CUE_AFTER);
    expect(el.classList.contains("pressing")).toBe(true);
    vi.advanceTimersByTime(HOLD_FOR);
    expect(held).toHaveBeenCalledOnce();
    expect(press.took()).toBe(true);
    press.down(at(10, 10));
    press.moved(at(15, 10));
    vi.advanceTimersByTime(HOLD_FOR);
    expect(held).toHaveBeenCalledOnce();
    expect(el.classList.contains("pressing")).toBe(false);
    app.unmount();
});

test("a page route names its screen and what it shows, and an item opens the reader", () => {
    expect(targetOf("list:plan")).toBe("plan");
    expect(screenOf("list:plan")).toBeTruthy();
    expect(screenOf("search:")).toBeTruthy();
    expect(screenOf("plan:21")).toBe(null);
});
