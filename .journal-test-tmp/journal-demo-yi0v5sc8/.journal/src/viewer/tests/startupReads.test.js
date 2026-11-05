import {afterEach, expect, test, vi} from "vitest";
import {perLine} from "./support/windowContext.js";

afterEach(() => vi.unstubAllGlobals());

test("the session is asked once for the length of the page, however many parts ask", async () => {
    const asked = [];
    vi.stubGlobal("fetch", perLine(async (url) => (asked.push(url), {json: async () => ({type: "person"})})));
    vi.resetModules();
    const {readSession} = await import("../src/windows/startup.js");
    expect(await readSession()).toEqual({type: "person"});
    expect(await readSession()).toEqual({type: "person"});
    expect(asked.filter((url) => String(url).includes("/api/session"))).toHaveLength(1);
});

test("a failed session read is asked again next time", async () => {
    let calls = 0;
    vi.stubGlobal("fetch", perLine(async () => {
        calls += 1;
        if (calls === 1) throw new Error("down");
        return {json: async () => ({type: "person"})};
    }));
    vi.resetModules();
    const {readSession} = await import("../src/windows/startup.js");
    await expect(readSession()).rejects.toThrow("down");
    expect(await readSession()).toEqual({type: "person"});
});

test("two askers of the suite in the same moment get one request, and a write is never shared", async () => {
    const sent = [];
    vi.stubGlobal("fetch", perLine(async (url, init) => (sent.push(JSON.parse(init.body)), {ok: true, json: async () => ({code: 0, value: {suite: "coding"}, error: ""})})));
    vi.resetModules();
    const {shellReader} = await import("../src/windows/startup.js");
    const line = shellReader("main");
    await Promise.all([line(["suite", "current", "main"]), line(["suite", "current", "main"])]);
    await Promise.all([line(["task", "make", "x"]), line(["task", "make", "x"])]);
    const asked = sent.map((body) => JSON.stringify(body));
    expect(asked.filter((text) => text.includes("suite")).length).toBe(1);
    expect(asked.filter((text) => text.includes("task")).length).toBe(2);
});
