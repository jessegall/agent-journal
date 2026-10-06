import {beforeEach, expect, test, vi} from "vitest";

const readAll = vi.fn();
vi.mock("../src/api/client.js", () => ({api: {readAll: (...a) => readAll(...a)}}));
const {markSeen} = await import("../src/sync/seen.js");

beforeEach(() => readAll.mockReset());

test("rows are marked read in one call", async () => {
    readAll.mockResolvedValue({});
    await markSeen("message", [1, 2]);
    expect(readAll).toHaveBeenCalledWith("message", [1, 2]);
});

test("nothing to mark makes no call", async () => {
    await markSeen("message", []);
    expect(readAll).not.toHaveBeenCalled();
});

test("a second call during one in flight is skipped, and a failure frees the next", async () => {
    let fail;
    readAll.mockReturnValueOnce(new Promise((_, reject) => (fail = reject)));
    const first = markSeen("message", [1]).catch((e) => e.message);
    await markSeen("message", [2]);
    expect(readAll).toHaveBeenCalledTimes(1);
    fail(new Error("down"));
    expect(await first).toBe("down");
    readAll.mockResolvedValue({});
    await markSeen("message", [3]);
    expect(readAll).toHaveBeenCalledTimes(2);
});
