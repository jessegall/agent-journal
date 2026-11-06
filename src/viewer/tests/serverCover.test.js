import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {createApp, nextTick} from "vue";
import ServerCover from "../src/layout/ServerCover.vue";
import {transport} from "../src/api/transport.js";
import {checkServer, covered, LATE_AFTER_MS, serverBack, serverGone, updating} from "../src/state/updating.js";
import {followEvents} from "../src/windows/windowCatalogue.js";
import {lineResult, windowContext} from "../src/windows/windowContext.js";

const WELL = {restarting: false, updating: false};
const answers = (state) => vi.fn(async () => ({ok: true, json: async () => state}));
const refused = () => vi.fn(async () => {
    throw new TypeError("Failed to fetch");
});

async function comesBack() {
    vi.stubGlobal("fetch", answers(WELL));
    await vi.advanceTimersByTimeAsync(6000);
}

beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", refused());
});

afterEach(async () => {
    await comesBack();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

test("a request the server never answered puts the cover up, and the server answering takes it down", async () => {
    await expect(transport.raw("/api/line")).rejects.toThrow("Failed to fetch");
    expect(covered()).toBe(true);
    await vi.advanceTimersByTimeAsync(2000);
    expect(covered()).toBe(true);
    await comesBack();
    expect(covered()).toBe(false);
});

test("a server that answers and goes away again keeps one unbroken cover", async () => {
    serverGone();
    vi.stubGlobal("fetch", answers(WELL));
    await vi.advanceTimersByTimeAsync(4000);
    expect(covered()).toBe(true);
    vi.stubGlobal("fetch", refused());
    await vi.advanceTimersByTimeAsync(2000);
    expect(covered()).toBe(true);
    await comesBack();
    expect(covered()).toBe(false);
});

test("a slow question gets none beside it, from the cover or a broken stream, and the wait starts when it answers", async () => {
    const slow = Promise.withResolvers();
    const asked = vi.fn(() => slow.promise);
    vi.stubGlobal("fetch", asked);
    serverGone();
    await vi.advanceTimersByTimeAsync(2000);
    expect(asked).toHaveBeenCalledTimes(1);
    checkServer();
    await vi.advanceTimersByTimeAsync(20000);
    expect(asked).toHaveBeenCalledTimes(1);
    slow.resolve({ok: true, json: async () => ({restarting: true, updating: false})});
    await vi.advanceTimersByTimeAsync(1999);
    expect(asked).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(asked).toHaveBeenCalledTimes(2);
});

test("the server saying a restart is marked keeps the cover up", async () => {
    serverGone();
    vi.stubGlobal("fetch", answers({restarting: true, updating: false}));
    await vi.advanceTimersByTimeAsync(2000);
    expect(covered()).toBe(true);
});

test("a broken stream with the server well shows nothing", async () => {
    vi.stubGlobal("fetch", answers(WELL));
    const source = {close: vi.fn(), addEventListener: vi.fn()};
    vi.spyOn(transport, "stream").mockReturnValue(source);
    followEvents("main", () => {});
    await source.onerror();
    expect(covered()).toBe(false);
});

test("a broken stream with the server gone puts the cover up", async () => {
    await checkServer();
    expect(covered()).toBe(true);
});

test("a window's read waits out the restart and draws what the server then answers, never a failure", async () => {
    transport.readLines = Promise.resolve(new Set(["usage show"]));
    const context = windowContext({window: "a.b", environment: "main", permissions: [], visible: () => true, subscriptions: {follow: () => {}}});
    const read = context.read("usage show");
    await vi.advanceTimersByTimeAsync(1);
    expect(covered()).toBe(true);
    vi.stubGlobal("fetch", vi.fn(async (url) => ({ok: true, json: async () => (url === "/api/line" ? {code: 0, value: "usage"} : WELL)})));
    await vi.advanceTimersByTimeAsync(6100);
    expect(await read).toEqual({ok: true, value: "usage"});
});

test("a write that did not go through says so in plain words, and is not sent again", async () => {
    transport.readLines = Promise.resolve(new Set());
    const answer = lineResult("a.b", ["task", "close", "1"], "main");
    await vi.advanceTimersByTimeAsync(1);
    const result = await answer;
    expect(result.failure).toBe("unreachable");
    expect(result.error).not.toContain("TypeError");
    expect(fetch).toHaveBeenCalledTimes(1);
});

test("the cover is one card over the page, and offers a reload once it is late", async () => {
    const element = document.createElement("div");
    const app = createApp(ServerCover);
    app.mount(element);
    expect(element.querySelector("[data-server-cover]")).toBeNull();
    serverGone();
    await nextTick();
    expect(element.querySelector("[data-server-cover]").textContent).toContain("Restarting the journal");
    expect(element.querySelector("[data-server-cover]").textContent).toContain("This takes a few seconds");
    expect(element.querySelector("[data-server-cover-reload]")).toBeNull();
    await vi.advanceTimersByTimeAsync(LATE_AFTER_MS);
    expect(updating.late).toBe(true);
    expect(element.querySelector("[data-server-cover]").textContent).toContain("The journal is not answering");
    expect(element.querySelector("[data-server-cover-reload]")).not.toBeNull();
    app.unmount();
});

test("the cover says updating while an install holds the server", async () => {
    serverGone();
    vi.stubGlobal("fetch", answers({restarting: true, updating: true}));
    await vi.advanceTimersByTimeAsync(2000);
    expect(updating.external).toBe(true);
});

test("a server that takes the question and never answers is not asked again until the first ends", async () => {
    let endAsking;
    const pending = vi.fn(() => new Promise((_, reject) => (endAsking = reject)));
    vi.stubGlobal("fetch", pending);
    serverGone();
    await vi.advanceTimersByTimeAsync(10000);
    expect(pending).toHaveBeenCalledTimes(1);
    expect(pending.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
    endAsking(new DOMException("timed out", "TimeoutError"));
    await vi.advanceTimersByTimeAsync(1);
});

test("a browser with no network says it is offline, not that the journal restarts", async () => {
    const online = vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    const element = document.createElement("div");
    const app = createApp(ServerCover);
    app.mount(element);
    serverGone();
    await nextTick();
    expect(element.querySelector("[data-server-cover]").textContent).toContain("You are offline");
    expect(element.querySelector("[data-server-cover]").textContent).not.toContain("Restarting");
    app.unmount();
    online.mockRestore();
});

test("a write cut off by the journal going away says it may have gone through", async () => {
    const answer = lineResult("a.b", ["task", "close", "1"], "main");
    await vi.advanceTimersByTimeAsync(1);
    expect((await answer).error).toContain("may or may not have gone through");
});

test("what waits for the server goes on at once when the server never left", async () => {
    await expect(serverBack()).resolves.toBeUndefined();
});
