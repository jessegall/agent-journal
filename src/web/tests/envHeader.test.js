import {afterEach, expect, test, vi} from "vitest";
import {ApiClient, ENV_HEADER} from "../src/api/client.js";

afterEach(() => vi.unstubAllGlobals());

const answering = () => vi.fn(async () => new Response("{}", {status: 200, headers: {"Content-Type": "application/json"}}));

const client = (env = "main") => new ApiClient({env: () => env});

test("every call names its environment in the header and never in the path", async () => {
    const fetched = answering();
    vi.stubGlobal("fetch", fetched);
    await client().list("tasks", {limit: 50});
    await client().entries(0);
    await client().settings();
    await client().saveSettings({features: {thinking: false}});
    await client().create("tasks", {title: "Ship it"});
    await client().act("tasks", 3, "start", {});
    expect(fetched.mock.calls).toHaveLength(6);
    for (const [, sent] of fetched.mock.calls) expect(sent.headers[ENV_HEADER]).toBe("main");
    expect(fetched.mock.calls.map(([url]) => url.split("?")[0])).toEqual([
        "/journal/tasks",
        "/journal/entries",
        "/journal/settings",
        "/journal/settings",
        "/journal/tasks",
        "/journal/tasks/3/start",
    ]);
});

test("two environments reading the same path are two calls, each with its own header", async () => {
    const fetched = answering();
    vi.stubGlobal("fetch", fetched);
    await Promise.all([client("main").list("tasks", {limit: 50}), client("other").list("tasks", {limit: 50})]);
    expect(fetched.mock.calls.map(([, sent]) => sent.headers[ENV_HEADER])).toEqual(["main", "other"]);
});

test("an address the browser opens itself names the environment in its query", () => {
    expect(client().fileUrl("messages", 7, "shot.png")).toBe("/journal/messages/7/files/shot.png?env=main");
});

test("the workflows and the MCP servers carry the header too", async () => {
    const fetched = answering();
    vi.stubGlobal("fetch", fetched);
    await client().chart();
    await client().chartOne(1);
    await client().chartSave(1, {revision: 0, nodes: [], lines: []});
    await client().mcp();
    expect(fetched.mock.calls).toHaveLength(4);
    for (const [url, sent] of fetched.mock.calls) {
        expect(sent.headers[ENV_HEADER]).toBe("main");
        expect(url.startsWith("/journal/")).toBe(true);
    }
});
