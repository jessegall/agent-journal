import {afterEach, expect, test, vi} from "vitest";

window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));

const {api} = await import("../src/api/client.js");
const {choose} = await import("../src/state/environment.js");
const {store} = await import("../src/state/store.js");
const {scopeOfChat} = await import("../src/composables/scope.js");
choose("main");

const row = (id, text) => ({table: "messages", id, author: "agent", text, session: "w1", agent_role: "worker", data: {}, created_at: new Date(id * 1000).toISOString()});

afterEach(() => vi.restoreAllMocks());

test("a worker's own chat reads its own rows, pages back through its own route, and leaves the main thread's rows alone", async () => {
    store.rows.messages = [{table: "messages", id: 1, author: "user", text: "main", agent_role: "main", data: {}}];
    const chat = vi.spyOn(api, "chat").mockImplementation(async (session, {before}) => (before ? {rows: [row(10, "first")], is_last_page: true} : {rows: [row(11, "second"), row(12, "third")], is_last_page: false}));
    const scope = scopeOfChat("w1", async () => {});
    await scope.chat.refresh();
    expect(scope.rows("messages").map((m) => m.text)).toEqual(["second", "third"]);
    await scope.earlier("messages");
    expect(chat).toHaveBeenLastCalledWith("w1", {limit: expect.any(Number), before: 11});
    expect(scope.rows("messages").map((m) => m.text).sort()).toEqual(["first", "second", "third"]);
    await scope.holding("messages", [10]);
    expect(store.rows.messages.map((m) => m.text)).toEqual(["main"]);
    await scope.earlier("messages");
    expect(chat).toHaveBeenCalledTimes(2);
});

test("a subagent's own chat takes no message", () => {
    expect(scopeOfChat("a9").chat.send).toBeNull();
});
