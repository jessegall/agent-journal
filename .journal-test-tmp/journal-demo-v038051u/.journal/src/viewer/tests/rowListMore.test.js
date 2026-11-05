import {defineComponent, h} from "vue";
import {expect, test} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import RowList from "../kit/RowList.vue";
import {useRows} from "../kit/useRows.js";

const ROWS = [{id: 5}, {id: 4}, {id: 3}, {id: 2}, {id: 1}];

// a window listing "thing list" the way the agents, memories and file edits windows do, over a server that pages by two rows
const Things = defineComponent({
    setup() {
        const {rows, failure, loaded, more, older} = useRows("thing list", ["thing.*"], {incremental: true});
        return () => h(RowList, {rows: rows.value, failure: failure.value, loaded: loaded.value, more: more.value, older, empty: "No things"}, {default: ({row}) => `thing ${row.id}`});
    },
});

// the server's page of rows below the id asked for, with its page number, size and total as the journal answers them
const server = (rows, size = 2) => async (line) => {
    const before = Number(line.match(/--before-id (\d+)/)?.[1] ?? Infinity);
    const left = rows.filter((row) => row.id < before);
    return {ok: true, value: {rows: left.slice(0, size), page: 1, size, total: left.length}};
};

const shown = async (rows) => {
    const window = context({});
    window.read = server(rows);
    const element = await mounted(Things, window);
    document.body.append(element);
    await settle();
    return element;
};

test("a last page shows no Show more button", async () => {
    const element = await shown(ROWS.slice(3));
    expect(element.querySelectorAll(".row-list-row").length).toBe(2);
    expect(element.querySelector("[data-row-list-more]")).toBeNull();
});

test("a page with more behind it shows Show more, which reads the next page and goes once the last one is in", async () => {
    const element = await shown(ROWS);
    expect(element.querySelectorAll(".row-list-row").length).toBe(2);
    element.querySelector("[data-row-list-more]").click();
    await settle();
    expect(element.querySelectorAll(".row-list-row").length).toBe(4);
    expect(element.querySelector("[data-row-list-more]")).not.toBeNull();
    element.querySelector("[data-row-list-more]").click();
    await settle();
    expect(element.querySelectorAll(".row-list-row").length).toBe(5);
    expect(element.querySelector("[data-row-list-more]")).toBeNull();
});
