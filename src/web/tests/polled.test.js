import {beforeEach, describe, expect, test, vi} from "vitest";

const api = {env: () => "main", events: vi.fn(), bar: vi.fn()};
const takeEvents = vi.fn();
vi.mock("../src/api/client.js", () => ({api}));
vi.mock("../src/sync/rows.js", () => ({takeEvents: (...a) => takeEvents(...a)}));
vi.mock("../src/platform/view.js", () => ({floatWindow: false}));

const {polled, windowPolls} = await import("../src/sync/polled.js");
const {store} = await import("../src/state/store.js");

beforeEach(() => {
    api.events.mockReset().mockResolvedValue([]);
    takeEvents.mockReset();
    store.events = [];
    store.bar = null;
    store.streamOpen = false;
    store.agents = [];
});

describe("what the viewer keeps asking for", () => {
    test("the bar is asked twice a second while work queues, and every three seconds when calm", () => {
        expect(polled.bar.every()).toBe(3000);
        store.bar = {queue: [{n: 1}]};
        expect(polled.bar.every()).toBe(500);
    });

    test("a bar without a queue is not taken for one", () => {
        polled.bar.take({nothing: true});
        expect(store.bar).toBeNull();
        polled.bar.take({queue: []});
        expect(store.bar).toEqual({queue: []});
    });

    test("events are polled every second, also while the stream is open", () => {
        store.streamOpen = true;
        expect(polled.events.active).toBeUndefined();
        expect(polled.events.every).toBe(1000);
    });

    test("events are asked for after the newest one held, and each answer moves the mark on", async () => {
        store.events = [{id: 7}];
        await polled.events.ask();
        expect(api.events).toHaveBeenLastCalledWith(7);
        polled.events.take([{id: 8}, {id: 9}]);
        expect(takeEvents).toHaveBeenCalledWith([{id: 8}, {id: 9}]);
        await polled.events.ask();
        expect(api.events).toHaveBeenLastCalledWith(9);
    });

    test("an empty answer changes nothing", () => {
        polled.events.take([]);
        expect(takeEvents).not.toHaveBeenCalled();
    });

    test("a floating window leaves the main window's polls to the main window", () => {
        expect(windowPolls().map((poll) => poll.key)).toContain("pages");
    });
});
