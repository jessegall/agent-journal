import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {coalesced} from "../src/composables/coalesced.js";
import {usageRead} from "../kit/useUsage.js";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test("a burst of asks runs the read at once and once more after the gap", () => {
    const read = vi.fn();
    const ask = coalesced(read, 2000);
    ask();
    ask();
    ask();
    expect(read).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(2000);
    expect(read).toHaveBeenCalledTimes(2);
    vi.advanceTimersByTime(10000);
    expect(read).toHaveBeenCalledTimes(2);
});

test("a cancelled ask does not run", () => {
    const read = vi.fn();
    const ask = coalesced(read, 2000);
    ask();
    ask();
    ask.cancel();
    vi.advanceTimersByTime(5000);
    expect(read).toHaveBeenCalledTimes(1);
});

test("an ask during a slow read waits for its answer and then reads once", async () => {
    const slow = Promise.withResolvers();
    const read = vi.fn().mockImplementationOnce(() => slow.promise).mockResolvedValue(undefined);
    const ask = coalesced(read, 2000);
    ask();
    vi.advanceTimersByTime(5000);
    ask();
    ask();
    await vi.advanceTimersByTimeAsync(5000);
    expect(read).toHaveBeenCalledTimes(1);
    slow.resolve();
    await vi.advanceTimersByTimeAsync(1999);
    expect(read).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(read).toHaveBeenCalledTimes(2);
});

test("a read that fails breaks nothing: the next ask reads again", async () => {
    const read = vi.fn().mockRejectedValueOnce(new Error("the server failed")).mockResolvedValue(undefined);
    const ask = coalesced(read, 0);
    ask();
    await vi.advanceTimersByTimeAsync(0);
    ask();
    expect(read).toHaveBeenCalledTimes(2);
});

test("two windows asking usage at once share one read, and a later ask reads again", async () => {
    let answered = () => {};
    const read = vi.fn(() => new Promise((resolve) => (answered = resolve)));
    const first = usageRead("main", read);
    const second = usageRead("main", read);
    expect(read).toHaveBeenCalledTimes(1);
    answered({ok: true});
    await Promise.all([first, second]);
    usageRead("main", read);
    expect(read).toHaveBeenCalledTimes(2);
    answered({ok: true});
});

test("the wait counts from when the answer arrived, not from when the read began", async () => {
    let answer;
    const read = vi.fn(() => new Promise((resolve) => (answer = resolve)));
    const ask = coalesced(read, 10000);
    ask();
    await vi.advanceTimersByTimeAsync(6000);
    answer();
    await vi.advanceTimersByTimeAsync(0);
    ask();
    await vi.advanceTimersByTimeAsync(9999);
    expect(read).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(read).toHaveBeenCalledTimes(2);
});


test("a read already made waits the full gap before an event reads again", async () => {
    const read = vi.fn();
    const ask = coalesced(read, 5000, Date.now());
    ask();
    ask();
    await vi.advanceTimersByTimeAsync(4999);
    expect(read).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(read).toHaveBeenCalledTimes(1);
    ask.cancel();
});
