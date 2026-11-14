import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {ref} from "vue";
import {windowContext} from "../src/windows/windowContext.js";

const SETTLE_MS = 2000;

const sentLines = [];
let answers = [];

const lineOf = (init) => {
    const body = JSON.parse(init.body);
    return (body.lines ?? [body]).map((entry) => entry.line.join(" "));
};

function fetchStub(url, init) {
    if (url === "/api/read-lines") return Promise.resolve({ok: true, status: 200, json: async () => ({reads: ["usage show", "usage tool", "task list"]})});
    sentLines.push(...lineOf(init));
    return new Promise((resolve) => answers.push(resolve));
}

const answerAll = () => {
    const waiting = answers;
    answers = [];
    waiting.forEach((resolve) => resolve({ok: true, status: 200, json: async () => ({code: 0, value: "answered"})}));
};

const made = () => windowContext({window: "a.b", environment: "main", agent: null, visible: () => true, permissions: {}, subscriptions: {stopAll: () => {}, follow: () => {}}, open: () => {}, options: ref({})});

beforeEach(() => {
    vi.useFakeTimers();
    sentLines.length = 0;
    answers = [];
    vi.stubGlobal("fetch", vi.fn(fetchStub));
});

afterEach(async () => {
    answerAll();
    await vi.advanceTimersByTimeAsync(SETTLE_MS);
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

test("a deferred read waits for the window's own reads and the window does not wait for it", async () => {
    const context = made();
    context.read("task list");
    context.read("usage tool", {deferred: true});
    await vi.advanceTimersByTimeAsync(200);
    expect(sentLines).toEqual(["task list"]);
    expect(context.answered.value).toBe(false);
    answerAll();
    await vi.advanceTimersByTimeAsync(SETTLE_MS);
    expect(context.answered.value).toBe(true);
    expect(sentLines).toEqual(["task list", "usage tool"]);
});

test("a window with only deferred reads still loads, and then sends them", async () => {
    const context = made();
    context.read("usage tool", {deferred: true});
    await vi.advanceTimersByTimeAsync(SETTLE_MS);
    expect(context.answered.value).toBe(true);
    expect(sentLines).toEqual(["usage tool"]);
});

test("a deferred read asked after the window has loaded leaves at once", async () => {
    const context = made();
    context.settle();
    await vi.advanceTimersByTimeAsync(SETTLE_MS);
    context.read("usage tool", {deferred: true});
    await vi.advanceTimersByTimeAsync(200);
    expect(sentLines).toEqual(["usage tool"]);
});

test("leaving the window cancels a deferred read that has not left", async () => {
    const context = made();
    context.read("task list");
    const deferred = context.read("usage tool", {deferred: true});
    await vi.advanceTimersByTimeAsync(200);
    context.cancel();
    expect(await deferred).toMatchObject({ok: false});
    await vi.advanceTimersByTimeAsync(SETTLE_MS);
    expect(sentLines).toEqual(["task list"]);
});
