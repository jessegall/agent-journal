import {afterEach, expect, test, vi} from "vitest";
import {transport} from "../src/api/transport.js";

afterEach(() => vi.unstubAllGlobals());

function failingFetch(failures) {
    let calls = 0;
    const fetched = vi.fn(async () => {
        calls += 1;
        if (calls <= failures) throw new TypeError("the connection was closed");
        return new Response("{}", {status: 200});
    });
    vi.stubGlobal("fetch", fetched);
    return fetched;
}

const READ = [{window: "tasks.tasks", line: "/api/data", kind: "read"}];
const WRITE = [{window: "tasks.tasks", line: "/api/line", kind: "write"}];

test("a get that fails on a closed connection is retried once", async () => {
    const fetched = failingFetch(1);
    const answer = await transport.sent("/api/data", {}, READ, 0);
    expect(answer.status).toBe(200);
    expect(fetched).toHaveBeenCalledTimes(2);
});

test("a post that fails is not retried", async () => {
    const fetched = failingFetch(1);
    await expect(transport.sent("/api/line", {method: "POST"}, WRITE, 0)).rejects.toThrow(TypeError);
    expect(fetched).toHaveBeenCalledTimes(1);
});

test("a second failure is reported", async () => {
    const fetched = failingFetch(2);
    await expect(transport.sent("/api/data", {}, READ, 0)).rejects.toThrow(TypeError);
    expect(fetched).toHaveBeenCalledTimes(2);
});
