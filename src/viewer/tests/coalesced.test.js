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
