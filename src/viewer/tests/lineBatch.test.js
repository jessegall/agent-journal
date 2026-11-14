import {afterEach, expect, test, vi} from "vitest";
import {lineResult} from "../src/windows/windowContext.js";

afterEach(() => vi.unstubAllGlobals());

const READ_LINES = {ok: true, status: 200, json: async () => ({reads: ["usage show", "agent list", "task list", "developer request-queue", "agent show"]})};

function answering(sent) {
    return async (url, init) => {
        if (url === "/api/read-lines") return READ_LINES;
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

const refusing = (error) => async (url) => (url === "/api/read-lines" ? READ_LINES : {ok: true, json: async () => ({code: 1, value: null, error})});

test("the words of a refused line read as words, with what to do about it", async () => {
    vi.stubGlobal("fetch", refusing(JSON.stringify({guard: "", refused: "too long", skip_flag: "", suggestion: "say it shorter"})));
    expect((await lineResult("a.b", ["usage", "show"], "main")).error).toBe("too long: say it shorter");
});

test("a refusal with no suggestion is its words alone", async () => {
    vi.stubGlobal("fetch", refusing(JSON.stringify({refused: "no agent 1", suggestion: ""})));
    expect((await lineResult("a.b", ["agent", "show", "1"], "main")).error).toBe("no agent 1");
});

test("a refusal printed as plain text is shown as it came", async () => {
    vi.stubGlobal("fetch", refusing("plain words"));
    expect((await lineResult("a.b", ["usage", "show"], "main")).error).toBe("plain words");
});

test("a write goes alone and at once beside reads asked at the same time", async () => {
    const sent = [];
    vi.stubGlobal("fetch", answering(sent));
    await Promise.all([lineResult("a.b", ["message", "send", "hello"], "main"), lineResult("a.b", ["usage", "show"], "main"), lineResult("a.b", ["agent", "list"], "main")]);
    expect(sent.map((entry) => entry.url)).toEqual(["/api/line", "/api/lines"]);
    expect(sent[0].body.line).toEqual(["message", "send", "hello"]);
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

test("an unbatched read goes separately when other lines are asked at the same time", async () => {
    const sent = [];
    vi.stubGlobal("fetch", answering(sent));
    const results = await Promise.all([
        lineResult("developer.hook-requests", ["developer", "request-queue"], "main", undefined, true),
        lineResult("tasks.tasks", ["task", "list"], "main"),
    ]);
    expect(results.map((result) => result.value)).toEqual(["developer request-queue", "task list"]);
    expect(sent).toHaveLength(2);
    expect(sent.every((entry) => entry.url.endsWith("/api/line"))).toBe(true);
});
