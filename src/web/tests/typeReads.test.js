import {afterEach, expect, test, vi} from "vitest";
import {ApiClient} from "../src/api/client.js";

afterEach(() => vi.unstubAllGlobals());

const answering = (body) =>
    vi.fn(async () => new Response(JSON.stringify(body), {status: 200, headers: {"Content-Type": "application/json"}}));

function client() {
    const made = new ApiClient();
    made.point("", () => "main");
    return made;
}

test("each type is read on its own path, above the last number seen", async () => {
    const fetched = answering({rows: [], more: false, counts: {all: 0, open: 0, unread: 0}});
    vi.stubGlobal("fetch", fetched);
    await client().rows("todo", {from: 12, last: 50});
    await client().rows("message", {last: 50});
    expect(fetched.mock.calls.map(([url]) => url)).toEqual([
        "/api/todo?last=50&completed=1&from=12",
        "/api/message?last=50&completed=1",
    ]);
});

test("a type's counts come from its own read, not from a call for every type", async () => {
    const fetched = answering({rows: [], more: false, counts: {all: 4, open: 3, unread: 1}});
    vi.stubGlobal("fetch", fetched);
    expect(await client().counts("question")).toEqual({all: 4, open: 3, unread: 1});
    expect(fetched.mock.calls[0][0]).toBe("/api/question?last=1&closed=1");
});

test("the client has no dashboard call left", () => {
    expect(client().dashboard).toBeUndefined();
});
