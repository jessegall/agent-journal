// @vitest-environment node
import {beforeEach, expect, test, vi} from "vitest";

const readMessages = vi.fn();
vi.mock("../src/api/client.js", () => ({api: {readMessages: (...a) => readMessages(...a)}}));
const {markSeen} = await import("../src/sync/seen.js");

beforeEach(() => readMessages.mockReset());

test("messages are marked read in one call", async () => {
    readMessages.mockResolvedValue({});
    await markSeen([1, 2]);
    expect(readMessages).toHaveBeenCalledWith([1, 2]);
});

test("nothing to mark makes no call", async () => {
    await markSeen([]);
    expect(readMessages).not.toHaveBeenCalled();
});

test("a second call during one in flight is skipped, and a failure frees the next", async () => {
    let fail;
    readMessages.mockReturnValueOnce(new Promise((_, reject) => (fail = reject)));
    const first = markSeen([1]).catch((e) => e.message);
    await markSeen([2]);
    expect(readMessages).toHaveBeenCalledTimes(1);
    fail(new Error("down"));
    expect(await first).toBe("down");
    readMessages.mockResolvedValue({});
    await markSeen([3]);
    expect(readMessages).toHaveBeenCalledTimes(2);
});
