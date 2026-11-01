import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {followEvents, STREAM_GONE_MS, streamAlive} from "../src/windows/windowCatalogue.js";
import {transport} from "../src/api/transport.js";

let source;

beforeEach(() => {
    vi.useFakeTimers();
    source = {close: vi.fn()};
    vi.spyOn(transport, "stream").mockReturnValue(source);
    streamAlive.value = true;
});

afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
});

test("a short gap in the stream says nothing, and a long one says the journal is gone until it is back", () => {
    const stop = followEvents("main", () => {});
    source.onerror();
    vi.advanceTimersByTime(STREAM_GONE_MS - 1);
    expect(streamAlive.value).toBe(true);
    vi.advanceTimersByTime(1);
    expect(streamAlive.value).toBe(false);
    source.onopen();
    expect(streamAlive.value).toBe(true);
    stop();
    expect(source.close).toHaveBeenCalled();
});

test("a stream back before the wait ends never says it was gone", () => {
    followEvents("main", () => {});
    source.onerror();
    source.onmessage({data: "{}"});
    vi.advanceTimersByTime(STREAM_GONE_MS * 2);
    expect(streamAlive.value).toBe(true);
});
