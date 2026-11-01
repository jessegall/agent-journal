import {afterEach, expect, test, vi} from "vitest";
import {lineResult} from "../src/windows/windowContext.js";

afterEach(() => vi.unstubAllGlobals());

function answering(sent) {
    return async (url, init) => {
        const body = JSON.parse(init.body);
        sent.push({url, body});
        const lines = body.lines ?? [body];
        const answers = lines.map((entry) => ({code: 0, value: entry.line.join(" ")}));
        return {ok: true, json: async () => (body.lines ? {answers} : answers[0])};
    };
}

test("lines asked within a moment go in one request and each gets its own answer, in order", async () => {
    const sent = [];
    vi.stubGlobal("fetch", answering(sent));
    const results = await Promise.all([lineResult("a.b", ["usage", "show"], "main"), lineResult("a.b", ["agent", "list"], "main"), lineResult("c.d", ["task", "list"], "main")]);
    expect(results.map((result) => result.value)).toEqual(["usage show", "agent list", "task list"]);
    expect(sent).toHaveLength(1);
    expect(sent[0].url).toContain("/api/lines");
});

test("a line asked alone goes to the single route as before", async () => {
    const sent = [];
    vi.stubGlobal("fetch", answering(sent));
    expect((await lineResult("a.b", ["usage", "show"], "main")).value).toBe("usage show");
    expect(sent[0].url).toContain("/api/line");
    expect(sent[0].url).not.toContain("/api/lines");
});

test("a line whose request was cancelled before it went answers cancelled and the others still go", async () => {
    const sent = [];
    vi.stubGlobal("fetch", answering(sent));
    const stopper = new AbortController();
    const cancelled = lineResult("a.b", ["usage", "show"], "main", stopper.signal);
    const kept = lineResult("a.b", ["agent", "list"], "main");
    stopper.abort();
    expect((await cancelled).failure).toBe("cancelled");
    expect((await kept).value).toBe("agent list");
});
