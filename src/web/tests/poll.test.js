import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";
import {startPoll, wakePolls} from "../src/composables/poll.js";

let keys = 0;
const stops = [];
const begin = (...args) => {
    const stop = startPoll(`poll-${++keys}`, ...args);
    stops.push(stop);
    return stop;
};

beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(1);
});

afterEach(() => {
    stops.splice(0).forEach((stop) => stop());
    vi.useRealTimers();
    vi.restoreAllMocks();
});

const passed = (ms) => vi.advanceTimersByTimeAsync(ms);

describe("a poll", () => {
    test("asks at once, then again after its interval, handing each answer to its user", async () => {
        const ask = vi.fn().mockResolvedValue("row");
        const take = vi.fn();
        begin(ask, 1000, take);
        await passed(0);
        expect(take).toHaveBeenCalledWith("row");
        await passed(1000);
        expect(ask).toHaveBeenCalledTimes(2);
    });

    test("failures back off to a cap of a minute and a good answer returns to the interval", async () => {
        const ask = vi.fn().mockRejectedValue(new Error("down"));
        begin(ask, 1000);
        await passed(0);
        await passed(10000);
        await passed(10000);
        const spaced = ask.mock.calls.length;
        expect(spaced).toBeLessThan(10);
        await passed(3600000);
        const hour = ask.mock.calls.length - spaced;
        expect(hour).toBeLessThanOrEqual(61);
        expect(hour).toBeGreaterThanOrEqual(55);
        ask.mockResolvedValue("ok");
        await passed(60000);
        const before = ask.mock.calls.length;
        await passed(5000);
        expect(ask.mock.calls.length - before).toBeGreaterThanOrEqual(4);
    });

    test("a failed round never reaches the user", async () => {
        const take = vi.fn();
        begin(vi.fn().mockRejectedValue(new Error("down")), 1000, take);
        await passed(5000);
        expect(take).not.toHaveBeenCalled();
    });

    test("waking the polls asks a failing one again soon, and leaves a healthy one alone", async () => {
        const failing = vi.fn().mockRejectedValue(new Error("down"));
        const healthy = vi.fn().mockResolvedValue("ok");
        begin(failing, 1000);
        begin(healthy, 60000);
        await passed(0);
        await passed(30000);
        const [f, h] = [failing.mock.calls.length, healthy.mock.calls.length];
        wakePolls();
        await passed(500);
        expect(failing.mock.calls.length).toBe(f + 1);
        expect(healthy.mock.calls.length).toBe(h);
    });

    test("a hidden page stops asking and a shown one asks again", async () => {
        const ask = vi.fn().mockResolvedValue("ok");
        begin(ask, 1000);
        await passed(0);
        Object.defineProperty(document, "hidden", {configurable: true, value: true});
        document.dispatchEvent(new Event("visibilitychange"));
        await passed(20000);
        expect(ask).toHaveBeenCalledTimes(1);
        Object.defineProperty(document, "hidden", {configurable: true, value: false});
        document.dispatchEvent(new Event("visibilitychange"));
        await passed(500);
        expect(ask).toHaveBeenCalledTimes(2);
    });

    test("an inactive poll asks nothing and a stopped one stays stopped", async () => {
        const ask = vi.fn().mockResolvedValue("ok");
        const stop = begin(ask, 1000, () => {}, () => false);
        await passed(5000);
        expect(ask).not.toHaveBeenCalled();
        const live = vi.fn().mockResolvedValue("ok");
        const stopLive = begin(live, 1000);
        await passed(0);
        stopLive();
        await passed(5000);
        expect(live).toHaveBeenCalledTimes(1);
        stop();
    });

    test("when the first user of a shared poll leaves, the next round asks with the user that stayed", async () => {
        const key = `poll-${++keys}`;
        const first = vi.fn().mockResolvedValue("old");
        const second = vi.fn().mockResolvedValue("new");
        const taken = vi.fn();
        const stopFirst = startPoll(key, first, 1000, () => {}, () => false);
        const stopSecond = startPoll(key, second, 1000, taken);
        stops.push(stopFirst, stopSecond);
        stopFirst();
        await passed(1000);
        expect(second).toHaveBeenCalled();
        expect(first).not.toHaveBeenCalled();
        expect(taken).toHaveBeenCalledWith("new");
    });
});
