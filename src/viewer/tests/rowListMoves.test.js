import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {createApp, h} from "vue";
import {afterEach, expect, test} from "vitest";
import RowList from "../kit/RowList.vue";

afterEach(() => (document.body.innerHTML = ""));

const drawn = (props) => {
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(RowList, {rows: [{id: 1}, {id: 2}], loaded: true, empty: "Nothing", ...props}, {default: ({row}) => `Row ${row.id}`})}).mount(element);
    return element;
};

test("a list that moves its rows glides them to their new place, and one that does not is a plain list", () => {
    expect(drawn({moves: true}).querySelector("ul[data-row-list-moves]")).not.toBeNull();
    expect(drawn({}).querySelector("[data-row-list-moves]")).toBeNull();
});

test("the agents window list moves its rows", () => {
    const source = readFileSync(resolve(__dirname, "../../core/modules/agents/web/src/AgentRows.vue"), "utf8");
    expect(source).toMatch(/<RowList moves /);
});
