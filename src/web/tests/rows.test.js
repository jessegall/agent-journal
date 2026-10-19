import {beforeEach, describe, expect, test, vi} from "vitest";

const api = {
    env: () => "main",
    list: vi.fn(),
    entries: vi.fn(),
    settings: vi.fn(),
};
vi.mock("../src/api/client.js", () => ({api, onWrite: vi.fn()}));
vi.mock("../src/chat/outbox.js", () => ({onOutboxChange: vi.fn()}));

const {earlier, hasLoaded, holding, rows, load, optimistic, patched, recallEntries, refresh, takeEntries, PAGE} = await import("../src/sync/rows.js");
const {store} = await import("../src/state/store.js");

const at = (seconds) => new Date(seconds * 1000).toISOString();
const row = (id, more = {}) => ({table: "tasks", id, state: "open", finished_at: null, created_at: at(id), updated_at: at(id), ...more});
const done = (id) => row(id, {state: "done", finished_at: at(id)});
const empty = {rows: [], more: false, counts: {}};

beforeEach(async () => {
    api.list.mockReset();
    api.list.mockResolvedValue(empty);
    Object.assign(store, {rows: {}, entries: [], counts: {}, booted: true});
    store.paging = {size: {}, more: {}};
    rows("tasks");
    await vi.waitFor(() => expect(hasLoaded("tasks")).toBe(true));
    store.rows = {};
    api.list.mockClear();
    localStorage.clear();
});

describe("paging rows", () => {
    test("loading keeps a row that arrived while the page was in flight", async () => {
        store.rows.plans = [row(1, {table: "plans"})];
        api.list.mockImplementation(async () => {
            store.rows.plans = [...store.rows.plans, row(9, {table: "plans"})];
            return {rows: [row(1, {table: "plans"}), row(2, {table: "plans"})], more: true, counts: {}};
        });
        await load("plans");
        expect(hasLoaded("plans")).toBe(true);
        expect(store.rows.plans.map((r) => r.id)).toEqual([1, 2, 9]);
        expect([store.paging.size.plans, store.paging.more.plans]).toEqual([PAGE, true]);
    });

    test("loading a window held past a page asks one page at a time and keeps the scrollback", async () => {
        const all = Array.from({length: 2 * PAGE + 10}, (_, i) => done(i + 1));
        store.rows.tasks = all.slice(10);
        store.paging.size.tasks = 2 * PAGE;
        api.list.mockImplementation(async (table, query) => {
            const below = all.filter((r) => !query.before || r.id < query.before);
            const page = below.slice(-query.limit);
            return {rows: page, more: below.length > page.length, counts: {}};
        });
        await load("tasks");
        expect(api.list.mock.calls.map(([, query]) => query.limit)).toEqual([PAGE, PAGE]);
        expect(store.rows.tasks.map((r) => r.id)).toEqual(all.slice(10).map((r) => r.id));
    });

    test("an earlier page goes in front, sorted, with no row twice, asked before the oldest closed row", async () => {
        store.rows.tasks = [done(10), row(11)];
        store.paging.more.tasks = true;
        api.list.mockResolvedValue({rows: [row(8), row(9), done(10)], more: false, counts: {}});
        expect(await earlier("tasks")).toBe(true);
        expect(api.list).toHaveBeenCalledWith("tasks", {limit: PAGE, before: 10});
        expect(store.rows.tasks.map((r) => r.id)).toEqual([8, 9, 10, 11]);
        expect([store.paging.size.tasks, store.paging.more.tasks]).toEqual([4, false]);
    });

    test("a table with nothing more to page is not asked", async () => {
        store.rows.tasks = [row(1)];
        expect(await earlier("tasks")).toBe(false);
        expect(api.list).not.toHaveBeenCalled();
    });

    test("holding asks once for rows it lacks and remembers the ones that do not exist", async () => {
        store.rows.tasks = [row(1)];
        api.list.mockResolvedValue({rows: [row(3)], more: false, counts: {}});
        await holding("tasks", [1, 3, 4]);
        expect(api.list).toHaveBeenCalledWith("tasks", {ids: [3, 4]});
        expect(store.rows.tasks.map((r) => r.id)).toEqual([1, 3]);
        await holding("tasks", [3, 4]);
        expect(api.list).toHaveBeenCalledTimes(1);
    });
});

describe("entries", () => {
    test("entries are kept in order with no id twice, and only recent ones are remembered", () => {
        takeEntries([{id: 2, kind: "x", data: {}}, {id: 1, kind: "x", data: {}}]);
        takeEntries([{id: 2, kind: "x", data: {}}, {id: 3, kind: "x", data: {}}]);
        expect(store.entries.map((e) => e.id)).toEqual([1, 2, 3]);
        store.entries = [];
        recallEntries();
        expect(store.entries.map((e) => e.id)).toEqual([1, 2, 3]);
    });

    test("recalling never replaces entries already held", () => {
        store.entries = [{id: 9}];
        recallEntries();
        expect(store.entries).toEqual([{id: 9}]);
    });

    test("an entry that changes a row reads that table's rows and counts again", async () => {
        api.list.mockResolvedValue({rows: [row(1)], more: false, counts: {open: 1, all: 1, unread: 0}});
        await takeEntries([{id: 1, kind: "created", data: {table: "tasks", id: 1}}]);
        await vi.waitFor(() => expect(store.rows.tasks).toEqual([row(1)]));
        expect(store.counts.tasks).toEqual({open: 1, all: 1, unread: 0});
        expect(api.list).toHaveBeenCalledWith("tasks", {limit: PAGE});
    });

    test("an entry that deletes a row takes it away at once", () => {
        store.rows.tasks = [row(1), row(2)];
        takeEntries([{id: 1, kind: "deleted", data: {table: "tasks", id: 1}}]);
        expect(store.rows.tasks.map((r) => r.id)).toEqual([2]);
    });

    test("a table that fails to read leaves the others read, and only it is asked again", async () => {
        store.rows.messages = [];
        api.list.mockImplementation(async (table) => {
            if (table === "messages") throw new Error("tripped");
            return {counts: {open: 1}, rows: [row(1)], more: false};
        });
        rows("messages");
        const settled = refresh(["tasks", "messages"]);
        await vi.waitFor(() => expect(store.rows.tasks).toEqual([row(1)]));
        expect(store.counts.tasks).toEqual({open: 1});
        api.list.mockResolvedValue(empty);
        await settled;
        expect(api.list.mock.calls.map(([table]) => table).sort()).toEqual(["messages", "messages", "tasks"]);
    });

    test("a table nobody shows has only its counts read", async () => {
        store.rows.questions = [];
        api.list.mockResolvedValue({rows: [], more: false, counts: {open: 3, all: 4, unread: 1}});
        await refresh(["questions"]);
        expect(store.counts.questions).toEqual({open: 3, all: 4, unread: 1});
        expect(api.list).toHaveBeenCalledWith("questions", {limit: 1, closed: true});
    });
});

describe("optimistic rows", () => {
    test("the row shows while sending and goes once the real one is listed", async () => {
        const mine = row(0, {title: "mine"});
        api.list.mockResolvedValue({counts: {}, rows: [row(5)], more: false});
        let during = [];
        await optimistic("tasks", mine, async () => (during = store.rows.tasks.slice()));
        expect(during.map((r) => r.title)).toContain("mine");
        expect(store.rows.tasks.map((r) => r.title)).not.toContain("mine");
    });

    test("a failed send removes the row again and passes the failure on", async () => {
        const mine = row(0, {title: "mine"});
        await expect(optimistic("tasks", mine, async () => Promise.reject(new Error("no")))).rejects.toThrow("no");
        expect(store.rows.tasks.map((r) => r.title)).not.toContain("mine");
    });

    test("a patched row changes at once and the rows are read again even when the send fails", async () => {
        const mine = row(1, {title: "before"});
        store.rows.tasks = [mine];
        await expect(patched(mine, (r) => (r.title = "after"), async () => Promise.reject(new Error("no")))).rejects.toThrow("no");
        expect(mine.title).toBe("after");
        expect(api.list).toHaveBeenCalled();
    });
});
