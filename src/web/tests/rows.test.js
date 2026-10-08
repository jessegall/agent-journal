import {beforeEach, describe, expect, test, vi} from "vitest";

const api = {
    env: () => "main",
    list: vi.fn(),
    dashboard: vi.fn(),
    manifest: vi.fn(),
    show: vi.fn(),
};
vi.mock("../src/api/client.js", () => ({api, onWrite: vi.fn()}));
vi.mock("../src/chat/outbox.js", () => ({onOutboxChange: vi.fn()}));

const {earlier, hasLoaded, holding, rows, load, optimistic, patched, recallEvents, refresh, takeEvents, PAGE} = await import("../src/sync/rows.js");
const {store} = await import("../src/state/store.js");

const row = (n, more = {}) => ({n, type: "todo", completed: 0, updated: n, ...more});

beforeEach(() => {
    Object.values(api).forEach((fn) => fn.mockReset?.());
    api.env = () => "main";
    Object.assign(store, {rows: {}, events: [], counts: {}, spec: {types: {todo: {}, message: {}}}, booted: true});
    store.paging = {size: {}, more: {}};
    rows("todo");
    localStorage.clear();
});

describe("paging rows", () => {
    test("loading keeps a row that arrived while the page was in flight", async () => {
        store.rows.todo = [row(1)];
        api.list.mockImplementation(async () => {
            store.rows.todo = [...store.rows.todo, row(9)];
            return {rows: [row(1), row(2)], more: true};
        });
        expect(hasLoaded("todo")).toBe(false);
        await load("todo");
        expect(hasLoaded("todo")).toBe(true);
        expect(store.rows.todo.map((r) => r.n)).toEqual([1, 2, 9]);
        expect([store.paging.size.todo, store.paging.more.todo]).toEqual([PAGE, true]);
    });

    test("an earlier page goes in front, sorted, with no row twice", async () => {
        store.rows.todo = [row(10, {completed: 5}), row(11)];
        store.paging.more.todo = true;
        api.list.mockResolvedValue({rows: [row(8), row(9), row(10)], more: false});
        expect(await earlier("todo")).toBe(true);
        expect(api.list).toHaveBeenCalledWith("todo", {last: PAGE, completed: true, before: 10});
        expect(store.rows.todo.map((r) => r.n)).toEqual([8, 9, 10, 11]);
        expect([store.paging.size.todo, store.paging.more.todo]).toEqual([4, false]);
    });

    test("a type with nothing more to page is not asked", async () => {
        store.rows.todo = [row(1)];
        expect(await earlier("todo")).toBe(false);
        expect(api.list).not.toHaveBeenCalled();
    });

    test("holding asks once for rows it lacks and remembers the ones that do not exist", async () => {
        store.rows.todo = [row(1)];
        api.list.mockResolvedValue({rows: [row(3)]});
        api.show.mockResolvedValue({});
        await holding("todo", [1, 3, 4]);
        expect(api.list).toHaveBeenCalledWith("todo", {completed: true, only: [3, 4]});
        expect(store.rows.todo.map((r) => r.n)).toEqual([1, 3]);
        await holding("todo", [3, 4]);
        expect(api.list).toHaveBeenCalledTimes(1);
    });

    test("a row that is damaged on the server says so", async () => {
        api.list.mockResolvedValue({rows: []});
        api.show.mockRejectedValue(new Error("todo 5 is damaged: bad json"));
        await holding("todo", [5]);
        await vi.waitFor(() => expect(store.damaged["todo:5"]).toBe("bad json"));
    });
});

describe("events and unread marks", () => {
    test("events are kept in order with no id twice, and only recent ones are remembered", async () => {
        await takeEvents([{id: 2, type: "todo"}, {id: 1, type: "todo"}]);
        await takeEvents([{id: 2, type: "todo"}, {id: 3, type: "todo"}]);
        expect(store.events.map((e) => e.id)).toEqual([1, 2, 3]);
        store.events = [];
        recallEvents();
        expect(store.events.map((e) => e.id)).toEqual([1, 2, 3]);
    });

    test("recalling never replaces events already held", () => {
        store.events = [{id: 9}];
        recallEvents();
        expect(store.events).toEqual([{id: 9}]);
    });

    test("an event of a type the manifest lacks asks for the manifest once", async () => {
        api.manifest.mockResolvedValue({types: {todo: {}, message: {}}});
        await takeEvents([{id: 1, type: "note"}]);
        await takeEvents([{id: 2, type: "note"}]);
        expect(api.manifest).toHaveBeenCalledTimes(1);
    });

    test("an event that changes a type refreshes that type's rows and counts", async () => {
        api.dashboard.mockResolvedValue({counts: {todo: {unread: 2}}, rows: {todo: {rows: [row(1)], more: false}}});
        await takeEvents([{id: 1, type: "todo"}]);
        await vi.waitFor(() => expect(store.rows.todo).toEqual([row(1)]));
        expect(store.counts.todo).toEqual({unread: 2});
    });
});

describe("optimistic rows", () => {
    test("the row shows while sending and goes once the real one is listed", async () => {
        const mine = row(0, {title: "mine"});
        api.dashboard.mockResolvedValue({counts: {}, rows: {todo: {rows: [row(5)], more: false}}});
        let during = [];
        await optimistic("todo", mine, async () => (during = store.rows.todo.slice()));
        expect(during.map((r) => r.title)).toContain("mine");
        expect(store.rows.todo.map((r) => r.title)).not.toContain("mine");
    });

    test("a failed send removes the row again and passes the failure on", async () => {
        const mine = row(0, {title: "mine"});
        await expect(optimistic("todo", mine, async () => Promise.reject(new Error("no")))).rejects.toThrow("no");
        expect(store.rows.todo.map((r) => r.title)).not.toContain("mine");
    });

    test("a patched row changes at once and the rows are fetched again even when the send fails", async () => {
        api.dashboard.mockResolvedValue({counts: {}, rows: {todo: {rows: [row(1, {seen: true})], more: false}}});
        const mine = row(1, {seen: false});
        store.rows.todo = [mine];
        await expect(patched(mine, (r) => (r.seen = true), async () => Promise.reject(new Error("no")))).rejects.toThrow("no");
        expect(mine.seen).toBe(true);
        expect(api.dashboard).toHaveBeenCalled();
    });
});
