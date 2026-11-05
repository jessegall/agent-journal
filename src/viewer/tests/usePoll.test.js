import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {createApp, h} from "vue";
import {usePoll} from "../kit/usePoll.js";

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
});

function pollingWindow(load, running = () => true, milliseconds) {
    const app = createApp({setup() {
        usePoll(load, running, milliseconds);
        return () => h("div");
    }});
    app.mount(document.createElement("div"));
    return app;
}

test("closing a window during its first read leaves no poll after the read answers", async () => {
    const read = Promise.withResolvers();
    const load = vi.fn(() => read.promise);
    const app = pollingWindow(load);
    expect(load).toHaveBeenCalledTimes(1);
    app.unmount();
    read.resolve();
    await vi.advanceTimersByTimeAsync(0);
    expect(vi.getTimerCount()).toBe(0);
    await vi.advanceTimersByTimeAsync(10000);
    expect(load).toHaveBeenCalledTimes(1);
});

test("closing a window during a later read leaves no poll after the read answers", async () => {
    const read = Promise.withResolvers();
    const load = vi.fn().mockResolvedValueOnce(undefined).mockImplementation(() => read.promise);
    const app = pollingWindow(load);
    await vi.advanceTimersByTimeAsync(0);
    vi.advanceTimersByTime(2000);
    expect(load).toHaveBeenCalledTimes(2);
    app.unmount();
    read.resolve();
    await vi.advanceTimersByTimeAsync(0);
    expect(vi.getTimerCount()).toBe(0);
    await vi.advanceTimersByTimeAsync(10000);
    expect(load).toHaveBeenCalledTimes(2);
});

test("a mounted window reads every two seconds only while running and stops when closed", async () => {
    const load = vi.fn().mockResolvedValue(undefined);
    let running = true;
    const app = pollingWindow(load, () => running);
    await vi.advanceTimersByTimeAsync(1999);
    expect(load).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(load).toHaveBeenCalledTimes(2);
    running = false;
    await vi.advanceTimersByTimeAsync(4000);
    expect(load).toHaveBeenCalledTimes(2);
    running = true;
    await vi.advanceTimersByTimeAsync(2000);
    expect(load).toHaveBeenCalledTimes(3);
    app.unmount();
    expect(vi.getTimerCount()).toBe(0);
});

test("each poll uses the current interval returned by its window", async () => {
    const load = vi.fn().mockResolvedValue(undefined);
    let milliseconds = 100;
    const app = pollingWindow(load, () => true, () => milliseconds);
    await vi.advanceTimersByTimeAsync(0);
    milliseconds = 300;
    await vi.advanceTimersByTimeAsync(100);
    expect(load).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(299);
    expect(load).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(load).toHaveBeenCalledTimes(3);
    app.unmount();
    expect(vi.getTimerCount()).toBe(0);
});
