import {afterEach, beforeEach, expect, test, vi} from "vitest";

const TRANSPORT = Symbol.for("journal.transport");
const READS = ["usage tool", "plan outline", "process card"];
let transport;
let lineResult;
let subscriptions;

// a server that holds each line until it is released, and hears which lines reached it
function heldServer() {
    const server = {lines: [], routes: [], open: [], receipts: []};
    vi.stubGlobal("fetch", (url, init) => {
        if (url === "/api/read-lines") return Promise.resolve({ok: true, status: 200, json: async () => ({reads: READS})});
        server.routes.push(url);
        if (url === "/api/repeated-lines") return Promise.resolve({ok: true, json: async () => ({})});
        const body = JSON.parse(init.body);
        if (url === "/api/read-receipts") {
            server.receipts.push(...body.receipts);
            return Promise.resolve({ok: true, json: async () => ({})});
        }
        const lines = body.lines ?? [body];
        server.lines.push(...lines.map((entry) => entry.line.join(" ")));
        return new Promise((resolve, reject) => {
            init.signal?.addEventListener("abort", () => reject(init.signal.reason));
            const answers = lines.map((entry) => ({code: 0, value: entry.line.join(" ")}));
            server.open.push(() => resolve({ok: true, json: async () => (body.lines ? {answers} : answers[0])}));
        });
    });
    server.answer = async () => {
        server.open.splice(0).forEach((release) => release());
        await settled();
    };
    return server;
}

const settled = () => new Promise((resolve) => setTimeout(resolve, 5));

beforeEach(async () => {
    delete globalThis[TRANSPORT];
    vi.resetModules();
    ({transport} = await import("../src/api/transport.js"));
    ({lineResult} = await import("../src/windows/windowContext.js"));
    const {WindowSubscriptions} = await import("../src/windows/windowSubscriptions.js");
    subscriptions = new WindowSubscriptions();
});

afterEach(() => vi.unstubAllGlobals());

test("the funnel counts one batch HTTP request, its commands by window, late joins and one trailing read", async () => {
    const server = heldServer();
    const first = lineResult("a.b", "usage tool", "main");
    await settled();
    transport.recording = true;
    const joined = lineResult("a.b", "usage tool", "main");
    await settled();
    subscriptions.dispatch({event: "hook_call.create"});
    const trailing = lineResult("a.b", "usage tool", "main");
    const joinedTrailing = lineResult("a.b", "usage tool", "main");
    await server.answer();
    await server.answer();
    await Promise.all([first, joined, trailing, joinedTrailing]);
    await transport.flushReadReceipts();
    expect(transport.requestCounts("a.b")).toMatchObject({http_requests: 2, logical_commands: 2, joined_callers: 2, trailing_reads: 1});
    expect(server.receipts).toHaveLength(2);
    expect(server.receipts.map((receipt) => receipt.joined_callers)).toEqual([1, 1]);
    expect(server.receipts[1].followed_command_id).toBe(server.receipts[0].command_id);
    const batch = [lineResult("a.b", "usage tool", "main"), lineResult("c.d", "plan outline 1", "main")];
    await settled();
    await server.answer();
    await Promise.all(batch);
    await transport.flushReadReceipts();
    expect(transport.requestTotals()).toEqual({http_requests: 3, logical_commands: 4, joined_callers: 2, trailing_reads: 1});
    expect(transport.requestCounts("a.b").http_requests).toBe(3);
    expect(transport.requestCounts("c.d").http_requests).toBe(1);
});

test("the same read of the same window joins the one in flight, and both get its answer", async () => {
    const server = heldServer();
    const asked = [lineResult("a.b", ["usage", "tool"], "main"), lineResult("a.b", "usage tool", "main")];
    await settled();
    expect(server.lines).toEqual(["usage tool"]);
    await server.answer();
    expect((await Promise.all(asked)).map((answer) => answer.value)).toEqual(["usage tool", "usage tool"]);
    expect(server.lines).toEqual(["usage tool"]);
});

test("the same line of another window or environment is its own read", async () => {
    const server = heldServer();
    lineResult("a.b", ["usage", "tool"], "main");
    lineResult("c.d", ["usage", "tool"], "main");
    lineResult("a.b", ["usage", "tool"], "other");
    await settled();
    expect(server.lines).toEqual(["usage tool", "usage tool", "usage tool"]);
});

test("a read asked after an event while one is in flight runs once more after it, however many ask", async () => {
    const server = heldServer();
    const first = lineResult("a.b", ["usage", "tool"], "main");
    await settled();
    subscriptions.dispatch({event: "hook_call.create"});
    const later = [lineResult("a.b", ["usage", "tool"], "main"), lineResult("a.b", ["usage", "tool"], "main"), lineResult("a.b", ["usage", "tool"], "main")];
    await settled();
    expect(server.lines, "nothing starts beside the read in flight").toHaveLength(1);
    await server.answer();
    expect(server.lines, "exactly one more").toHaveLength(2);
    await server.answer();
    expect((await first).ok).toBe(true);
    expect((await Promise.all(later)).every((answer) => answer.ok)).toBe(true);
    expect(server.lines).toHaveLength(2);
});

test("an event with no read asked after it starts no read", async () => {
    const server = heldServer();
    lineResult("a.b", ["usage", "tool"], "main");
    await settled();
    subscriptions.dispatch({event: "hook_call.create"});
    await server.answer();
    await settled();
    expect(server.lines).toHaveLength(1);
});

test("two identical writes both run, also when they came through a window's read", async () => {
    const server = heldServer();
    const {windowContext} = await import("../src/windows/windowContext.js");
    const context = windowContext({window: "a.b", environment: "main", visible: () => true, permissions: {}, subscriptions});
    lineResult("a.b", ["message", "send", "same words"], "main");
    lineResult("a.b", ["message", "send", "same words"], "main");
    context.read("task close 7");
    await new Promise((resolve) => setTimeout(resolve, 120));
    context.read("task close 7");
    await settled();
    expect(server.lines).toEqual(["message send same words", "message send same words", "task close 7", "task close 7"]);
});

test("a line the server's list does not call a read is a write, so a list that cannot be had joins nothing", async () => {
    const seen = [];
    vi.stubGlobal("fetch", async (url, init) => {
        if (url === "/api/read-lines") throw new TypeError("Failed to fetch");
        seen.push(JSON.parse(init.body).line.join(" "));
        return {ok: true, json: async () => ({code: 0, value: null})};
    });
    await Promise.all([lineResult("a.b", ["usage", "tool"], "main"), lineResult("a.b", ["usage", "tool"], "main")]);
    expect(seen).toEqual(["usage tool", "usage tool"]);
});

test("the table says what each window has in flight: its line, kind and start, until it has answered", async () => {
    const server = heldServer();
    lineResult("a.b", ["usage", "tool"], "main");
    lineResult("c.d", ["message", "send", "hello"], "main");
    await settled();
    expect(transport.inFlight("a.b")).toEqual([expect.objectContaining({window: "a.b", line: "usage tool", kind: "read", started_at: expect.any(Number)})]);
    expect(transport.inFlight("c.d")).toEqual([expect.objectContaining({window: "c.d", line: "message send hello", kind: "write"})]);
    await server.answer();
    expect(transport.inFlight("a.b")).toEqual([]);
    expect(transport.sentCounts("a.b")).toEqual({"usage tool": 1});
});

test("a read that bypasses nothing: uploads, bytes and the stream are in the table too", async () => {
    vi.stubGlobal("EventSource", class {
        close() {}
    });
    vi.stubGlobal("fetch", () => new Promise(() => {}));
    transport.raw("/api/files?name=a", {method: "POST", body: "x"}, {window: "a.b", line: "upload a"});
    transport.bytes("/message-files/1");
    const source = transport.stream("/api/events?environment=main");
    await settled();
    expect(transport.inFlight().map((flight) => [flight.line, flight.kind])).toEqual([["upload a", "write"], ["/message-files/1", "read"], ["/api/events?environment=main", "stream"]]);
    source.close();
    expect(transport.inFlight().map((flight) => flight.kind)).toEqual(["write", "read"]);
});

test("at most four reads are out at once and a write passes them", async () => {
    const server = heldServer();
    for (const id of [1, 2, 3, 4, 5, 6]) lineResult("a.b", ["process", "card", String(id)], "main", undefined, true);
    await settled();
    expect(server.routes).toHaveLength(4);
    lineResult("a.b", ["message", "send", "hello"], "main");
    await settled();
    expect(server.lines.at(-1)).toBe("message send hello");
    await server.answer();
    expect(server.lines).toHaveLength(7);
});

test("reads asked while none can leave go together when one can", async () => {
    const server = heldServer();
    for (const id of [1, 2, 3, 4]) lineResult("a.b", ["process", "card", String(id)], "main", undefined, true);
    await settled();
    lineResult("a.b", ["usage", "tool"], "main");
    lineResult("a.b", ["plan", "outline", "1"], "main");
    await settled();
    expect(server.routes).toHaveLength(4);
    await server.answer();
    expect(server.routes.at(-1)).toBe("/api/lines");
    expect(server.routes).toHaveLength(5);
});

test("a batch given up on goes line by line, so a stuck line holds only itself, and goes alone from then on", async () => {
    vi.useFakeTimers();
    try {
        const asked = [];
        vi.stubGlobal("fetch", (url, init) => {
            if (url === "/api/read-lines") return Promise.resolve({ok: true, status: 200, json: async () => ({reads: READS})});
            const body = JSON.parse(init.body);
            asked.push(url);
            if (url === "/api/lines" || body.line[0] === "usage") return new Promise((_, reject) => init.signal.addEventListener("abort", () => reject(init.signal.reason)));
            return Promise.resolve({ok: true, json: async () => ({code: 0, value: "drawn"})});
        });
        vi.spyOn(AbortSignal, "timeout").mockImplementation((milliseconds) => {
            const stop = new AbortController();
            setTimeout(() => stop.abort(new DOMException("timed out", "TimeoutError")), milliseconds);
            return stop.signal;
        });
        const stuck = lineResult("a.b", ["usage", "tool"], "main");
        const beside = lineResult("a.b", ["plan", "outline", "1"], "main");
        await vi.advanceTimersByTimeAsync(5100);
        expect((await beside).value).toBe("drawn");
        await vi.advanceTimersByTimeAsync(20000);
        expect((await stuck).ok).toBe(false);
        asked.length = 0;
        lineResult("a.b", ["usage", "tool"], "main");
        lineResult("a.b", ["plan", "outline", "1"], "main");
        await vi.advanceTimersByTimeAsync(10);
        expect(asked.every((url) => url === "/api/line")).toBe(true);
    } finally {
        vi.useRealTimers();
        vi.restoreAllMocks();
    }
});

test("a window that goes cancels only its own wait, and the read stops when every window has gone", async () => {
    const server = heldServer();
    const first = new AbortController();
    const second = new AbortController();
    const going = lineResult("a.b", ["usage", "tool"], "main", first.signal);
    const staying = lineResult("a.b", ["usage", "tool"], "main", second.signal);
    await settled();
    first.abort();
    expect((await going).failure).toBe("cancelled");
    expect(transport.inFlight("a.b")).toHaveLength(1);
    second.abort();
    expect((await staying).failure).toBe("cancelled");
    await settled();
    expect(transport.inFlight("a.b")).toEqual([]);
    server.open.length = 0;
});

test("a window taken down cancels its reads in flight, and the answer is dropped with no failure", async () => {
    heldServer();
    const {windowContext} = await import("../src/windows/windowContext.js");
    const context = windowContext({window: "a.b", environment: "main", visible: () => true, permissions: {}, subscriptions});
    const asked = context.read("usage tool", {unbatched: true});
    await settled();
    expect(transport.inFlight("a.b")).toHaveLength(1);
    context.cancel();
    expect((await asked).failure).toBe("cancelled");
    await settled();
    expect(transport.inFlight("a.b")).toEqual([]);
});

test("a batch holding a read of a window taken down is cut to what others still wait on", async () => {
    const server = heldServer();
    const leaving = new AbortController();
    const gone = lineResult("a.b", ["usage", "tool"], "main", leaving.signal);
    const kept = [lineResult("c.d", ["usage", "tool"], "main"), lineResult("c.d", ["plan", "outline", "1"], "main")];
    await vi.waitFor(() => expect(server.routes).toEqual(["/api/lines"]));
    leaving.abort();
    expect((await gone).failure).toBe("cancelled");
    await vi.waitFor(() => expect(server.routes).toEqual(["/api/lines", "/api/lines"]));
    expect(server.lines.slice(3)).toEqual(["usage tool", "plan outline 1"]);
    await server.answer();
    expect((await Promise.all(kept)).map((answer) => answer.value)).toEqual(["usage tool", "plan outline 1"]);
});

test("a hidden tab has not left: its reads stay in flight", async () => {
    const server = heldServer();
    const {windowContext} = await import("../src/windows/windowContext.js");
    const context = windowContext({window: "a.b", environment: "main", visible: () => false, permissions: {}, subscriptions});
    const asked = context.read("usage tool");
    await settled();
    Object.defineProperty(document, "hidden", {value: true, configurable: true});
    document.dispatchEvent(new Event("visibilitychange"));
    expect(transport.inFlight("a.b")).toHaveLength(1);
    delete document.hidden;
    await server.answer();
    expect((await asked).ok).toBe(true);
});

test("a write always finishes, also when its window has gone", async () => {
    const server = heldServer();
    const {windowContext} = await import("../src/windows/windowContext.js");
    const context = windowContext({window: "a.b", environment: "main", visible: () => true, permissions: {}, subscriptions});
    const asked = context.run(["message", "send", "hello"]);
    await settled();
    context.cancel();
    await settled();
    expect(transport.inFlight("a.b"), "the write is still on its way").toHaveLength(1);
    await server.answer();
    expect(transport.inFlight("a.b")).toEqual([]);
    expect((await asked).failure).toBe("cancelled");
});

test("a window sending one term and verb for many ids in a short time is reported once", async () => {
    const server = heldServer();
    for (const id of Array.from({length: 12}, (_, index) => index)) lineResult("a.b", ["process", "card", String(id)], "main", undefined, true);
    await settled();
    await server.answer();
    await server.answer();
    await server.answer();
    expect(server.routes.filter((route) => route === "/api/repeated-lines")).toHaveLength(1);
});
