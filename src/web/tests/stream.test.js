import {afterEach, beforeEach, expect, test, vi} from "vitest";

const sources = [];
class FakeSource {
    static CLOSED = 2;
    constructor() {
        this.readyState = 0;
        this.closed = false;
        sources.push(this);
    }
    close() {
        this.closed = true;
        this.readyState = FakeSource.CLOSED;
    }
}
vi.stubGlobal("EventSource", FakeSource);

const reload = vi.fn();
const takeEvents = vi.fn();
const wakePolls = vi.fn();
vi.mock("../src/api/client.js", () => ({api: {stream: () => new FakeSource()}}));
vi.mock("../src/chat/outbox.js", () => ({startOutbox: vi.fn()}));
vi.mock("../src/composables/poll.js", () => ({wakePolls: () => wakePolls()}));
vi.mock("../src/sync/rows.js", () => ({reload: () => reload(), takeEvents: (e) => takeEvents(e)}));

const {listen} = await import("../src/sync/stream.js");
const {store} = await import("../src/state/store.js");

beforeEach(() => {
    vi.useFakeTimers();
    sources.length = 0;
    [reload, takeEvents, wakePolls].forEach((fn) => fn.mockClear());
    store.offline = false;
    listen();
    sources[0].onopen();
});

afterEach(() => vi.useRealTimers());

const broken = (source, closed = false) => {
    if (closed) source.readyState = FakeSource.CLOSED;
    source.onerror();
};

test("an open stream marks itself open and wakes the polls", () => {
    expect([store.streamOpen, wakePolls.mock.calls.length]).toEqual([true, 1]);
});

test("a broken stream is offline only after fifteen seconds of failing", () => {
    broken(sources[0]);
    expect([store.streamOpen, store.offline]).toEqual([false, false]);
    vi.advanceTimersByTime(14000);
    broken(sources[0]);
    expect(store.offline).toBe(false);
    vi.advanceTimersByTime(1500);
    broken(sources[0]);
    expect(store.offline).toBe(true);
});

test("coming back reloads the rows once, and clears the offline mark", () => {
    broken(sources[0]);
    vi.advanceTimersByTime(16000);
    broken(sources[0]);
    sources[0].onopen();
    expect([store.offline, store.streamOpen, reload.mock.calls.length]).toEqual([false, true, 1]);
    sources[0].onopen();
    expect(reload.mock.calls.length).toBe(1);
});

test("a stream the browser gave up on is opened again, one the browser retries is not", () => {
    broken(sources[0]);
    vi.advanceTimersByTime(5000);
    expect(sources).toHaveLength(1);
    broken(sources[0], true);
    vi.advanceTimersByTime(3000);
    expect(sources).toHaveLength(2);
    expect(sources[0].closed).toBe(true);
});

test("an event is taken, and a damaged one is ignored", () => {
    sources[0].onmessage({data: JSON.stringify({id: 4})});
    sources[0].onmessage({data: "{nope"});
    expect(takeEvents.mock.calls).toEqual([[[{id: 4}]]]);
});
