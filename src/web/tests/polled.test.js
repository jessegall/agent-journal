import {beforeEach, describe, expect, test, vi} from "vitest";

const api = {env: () => "main", entries: vi.fn(), bar: vi.fn()};
const takeEntries = vi.fn();
vi.mock("../src/api/client.js", () => ({api}));
vi.mock("../src/sync/rows.js", () => ({takeEntries: (...a) => takeEntries(...a)}));
vi.mock("../src/platform/view.js", () => ({floatWindow: false}));

const {polled, windowPolls} = await import("../src/sync/polled.js");
const {store} = await import("../src/state/store.js");

beforeEach(() => {
    api.entries.mockReset().mockResolvedValue([]);
    takeEntries.mockReset();
    store.entries = [];
    store.bar = null;
    store.streamOpen = false;
    store.agents = [];
});

describe("what the viewer keeps asking for", () => {
    test("the bar is asked twice a second while work queues, and every three seconds when calm", () => {
        expect(polled.bar.every()).toBe(3000);
        store.bar = [{id: 1}];
        expect(polled.bar.every()).toBe(500);
    });

    test("an answer that is not a list is not taken for the bar", () => {
        polled.bar.take({nothing: true});
        expect(store.bar).toBeNull();
        polled.bar.take([]);
        expect(store.bar).toEqual([]);
    });

    test("entries are polled every second, also while the stream is open", () => {
        store.streamOpen = true;
        expect(polled.entries.active).toBeUndefined();
        expect(polled.entries.every).toBe(1000);
    });

    test("entries are asked for after the newest one held, and each answer moves the mark on", async () => {
        store.entries = [{id: 7}];
        await polled.entries.ask();
        expect(api.entries).toHaveBeenLastCalledWith(7);
        polled.entries.take([{id: 8}, {id: 9}]);
        expect(takeEntries).toHaveBeenCalledWith([{id: 8}, {id: 9}]);
        await polled.entries.ask();
        expect(api.entries).toHaveBeenLastCalledWith(9);
    });

    test("an empty answer changes nothing", () => {
        polled.entries.take([]);
        expect(takeEntries).not.toHaveBeenCalled();
    });

    test("every poll runs in the main window", () => {
        expect(windowPolls().map((poll) => poll.key)).toEqual(expect.arrayContaining(["bar", "agents", "entries"]));
    });
});
