import {afterEach, expect, test, vi} from "vitest";
import {ApiClient} from "../src/api/client.js";

afterEach(() => vi.unstubAllGlobals());

const answering = (body) => vi.fn(async () => new Response(JSON.stringify(body), {status: 200, headers: {"Content-Type": "application/json"}}));
const client = () => new ApiClient({env: () => "main"});

test("each table is read on its own path, by the one list protocol", async () => {
    const fetched = answering({rows: [], is_last_page: true, counts: {all: 0, open: 0, unread: 0}});
    vi.stubGlobal("fetch", fetched);
    await client().list("tasks", {limit: 50, before: 12});
    await client().list("messages", {limit: 50});
    await client().list("tasks", {ids: [3, 4]});
    await client().list("questions", {limit: 1, closed: true});
    expect(fetched.mock.calls.map(([url]) => decodeURIComponent(url))).toEqual([
        "/journal/tasks?limit=50&before=12",
        "/journal/messages?limit=50",
        "/journal/tasks?ids=3,4",
        "/journal/questions?limit=1&closed=1",
    ]);
});

test("the client has no dashboard call and no call to version 3's /api", () => {
    expect(client().dashboard).toBeUndefined();
    expect(client().url("/tasks")).toBe("/journal/tasks");
});
