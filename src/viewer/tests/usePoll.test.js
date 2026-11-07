import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";
import {createApp, h} from "vue";
import {usePoll} from "../kit/usePoll.js";
import {tabVisibility} from "./tabVisibility.js";

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

test("a slow read gets no second read beside it, and the wait starts when it answers", async () => {
    const read = Promise.withResolvers();
    const load = vi.fn().mockResolvedValueOnce(undefined).mockImplementationOnce(() => read.promise).mockResolvedValue(undefined);
    const app = pollingWindow(load);
    await vi.advanceTimersByTimeAsync(2000);
    expect(load).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(60000);
    expect(load).toHaveBeenCalledTimes(2);
    expect(vi.getTimerCount()).toBe(0);
    read.resolve();
    await vi.advanceTimersByTimeAsync(1999);
    expect(load).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(load).toHaveBeenCalledTimes(3);
    app.unmount();
});

test("a read that fails polls again at the next interval and every one after it", async () => {
    const load = vi.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error("the server failed")).mockResolvedValue(undefined);
    const app = pollingWindow(load);
    await vi.advanceTimersByTimeAsync(2000);
    expect(load).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(2000);
    expect(load).toHaveBeenCalledTimes(3);
    await vi.advanceTimersByTimeAsync(2000);
    expect(load).toHaveBeenCalledTimes(4);
    app.unmount();
});

test("a first read that fails still starts the poll", async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error("the server failed")).mockResolvedValue(undefined);
    const app = pollingWindow(load);
    await vi.advanceTimersByTimeAsync(2000);
    expect(load).toHaveBeenCalledTimes(2);
    app.unmount();
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

const tab = tabVisibility();
const showTab = tab.show;

describe("a hidden tab", () => {
    beforeEach(() => {
        tab.reset();
    });
    afterEach(() => delete document.hidden);

    test("reads nothing while it is hidden and once when it is shown again", async () => {
        const load = vi.fn().mockResolvedValue(undefined);
        const app = pollingWindow(load);
        await vi.advanceTimersByTimeAsync(0);
        showTab(true);
        await vi.advanceTimersByTimeAsync(20000);
        expect(load).toHaveBeenCalledTimes(1);
        expect(vi.getTimerCount()).toBe(0);
        showTab(false);
        await vi.advanceTimersByTimeAsync(0);
        expect(load).toHaveBeenCalledTimes(2);
        await vi.advanceTimersByTimeAsync(2000);
        expect(load).toHaveBeenCalledTimes(3);
        app.unmount();
        expect(vi.getTimerCount()).toBe(0);
    });

    test("shown again before its next read is due, it reads at once and not twice", async () => {
        const load = vi.fn().mockResolvedValue(undefined);
        pollingWindow(load);
        await vi.advanceTimersByTimeAsync(1000);
        showTab(true);
        showTab(false);
        await vi.advanceTimersByTimeAsync(0);
        expect(load).toHaveBeenCalledTimes(2);
        await vi.advanceTimersByTimeAsync(1999);
        expect(load).toHaveBeenCalledTimes(2);
        await vi.advanceTimersByTimeAsync(1);
        expect(load).toHaveBeenCalledTimes(3);
    });

    test("a read that fails when the tab is shown again polls again", async () => {
        const load = vi.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error("the server failed")).mockResolvedValue(undefined);
        const app = pollingWindow(load);
        await vi.advanceTimersByTimeAsync(0);
        showTab(true);
        showTab(false);
        await vi.advanceTimersByTimeAsync(2000);
        expect(load).toHaveBeenCalledTimes(3);
        app.unmount();
    });

    test("shown again while a read is in flight, it sends no second read", async () => {
        const read = Promise.withResolvers();
        const load = vi.fn().mockResolvedValueOnce(undefined).mockImplementationOnce(() => read.promise).mockResolvedValue(undefined);
        const app = pollingWindow(load);
        await vi.advanceTimersByTimeAsync(2000);
        expect(load).toHaveBeenCalledTimes(2);
        showTab(true);
        showTab(false);
        await vi.advanceTimersByTimeAsync(5000);
        expect(load).toHaveBeenCalledTimes(2);
        read.resolve();
        await vi.advanceTimersByTimeAsync(2000);
        expect(load).toHaveBeenCalledTimes(3);
        app.unmount();
    });

    test("a window that is closed while hidden reads nothing when the tab is shown", async () => {
        const load = vi.fn().mockResolvedValue(undefined);
        const app = pollingWindow(load);
        await vi.advanceTimersByTimeAsync(0);
        showTab(true);
        app.unmount();
        showTab(false);
        await vi.advanceTimersByTimeAsync(10000);
        expect(load).toHaveBeenCalledTimes(1);
    });

    test("a window that is not running reads nothing when the tab is shown", async () => {
        const load = vi.fn().mockResolvedValue(undefined);
        pollingWindow(load, () => false);
        await vi.advanceTimersByTimeAsync(0);
        showTab(true);
        showTab(false);
        await vi.advanceTimersByTimeAsync(10000);
        expect(load).toHaveBeenCalledTimes(1);
    });
});
