import {createApp, defineComponent, h} from "vue";
import {expect, test} from "vitest";
import {WINDOW_CONTEXT, useRows} from "@journal/window-kit";

function rowsOf(reads, total = 2) {
    const heard = [];
    const context = {
        shared: null,
        read: async (line) => (reads.push(line), {ok: true, value: {rows: reads.answers.shift(), page: 1, size: 2, total}}),
        follow: (_patterns, handler) => heard.push(handler),
    };
    let rows;
    const Inner = defineComponent({setup() { rows = useRows("message list", ["message.*"], {incremental: true}); return () => h("div"); }});
    const app = createApp({render: () => h(Inner)});
    app.provide(WINDOW_CONTEXT, context);
    app.mount(document.createElement("div"));
    return {rows, heard};
}

test("a created row is read alone after the newest one held, and any other change reads the page again", async () => {
    const reads = [];
    reads.answers = [[{id: 2}, {id: 1}], [{id: 3}], [{id: 3}, {id: 2}, {id: 1}]];
    const {rows, heard} = rowsOf(reads);
    await new Promise((resolve) => setTimeout(resolve));
    await heard[0]({event: "message.create"});
    expect(rows.rows.value.map((row) => row.id)).toEqual([3, 2, 1]);
    await heard[0]({event: "message.read"});
    expect([...reads]).toEqual(["message list", "message list --after-id 2", "message list"]);
});

test("a held row that changed is read alone, also one past the first page, and leaves if it no longer lists", async () => {
    const reads = [];
    reads.answers = [[{id: 5, text: "old"}, {id: 4}], [{id: 5, text: "new"}], []];
    const {rows, heard} = rowsOf(reads);
    await new Promise((resolve) => setTimeout(resolve));
    await heard[0]({event: "message.update", row_id: 5});
    expect(rows.rows.value[0].text).toBe("new");
    await heard[0]({event: "message.read", row_id: 4});
    expect(rows.rows.value.map((row) => row.id)).toEqual([5]);
    expect([...reads].slice(1)).toEqual(["message list --before-id 6 --limit 1", "message list --before-id 5 --limit 1"]);
});

test("older rows are read before the oldest held and added behind them", async () => {
    const reads = [];
    reads.answers = [[{id: 5}, {id: 4}], [{id: 3}, {id: 2}], []];
    const {rows} = rowsOf(reads, 5);
    await new Promise((resolve) => setTimeout(resolve));
    expect(await rows.older()).toBe(true);
    expect(rows.rows.value.map((row) => row.id)).toEqual([5, 4, 3, 2]);
    expect(await rows.older()).toBe(false);
    expect([...reads].slice(1)).toEqual(["message list --before-id 4", "message list --before-id 2"]);
});

test("loading the newest page drops older pages and ignores an earlier incremental answer", async () => {
    const reads = [];
    reads.answers = [[{id: 5}, {id: 4}], [{id: 3}, {id: 2}], [{id: 6}], [{id: 50}, {id: 49}]];
    const {rows, heard} = rowsOf(reads, 5);
    await new Promise((resolve) => setTimeout(resolve));
    await rows.older();
    const catchingUp = heard[0]({event: "message.create"});
    const newest = rows.loadLatest();
    await Promise.all([catchingUp, newest]);
    expect(rows.rows.value).toEqual([{id: 50}, {id: 49}]);
});
