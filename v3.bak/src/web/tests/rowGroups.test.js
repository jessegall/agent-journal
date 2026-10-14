import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import RowGroups from "../src/resource/RowGroups.vue";

async function shown(groups) {
    const into = document.createElement("div");
    createApp({render: () => h(RowGroups, {groups, type: "doc"}, {row: ({resource}) => h("p", {class: "stub"}, resource.title)})}).mount(into);
    await nextTick();
    return into;
}

const group = (key, count, titles) => ({key, title: key, count, list: titles.map((title, n) => ({n: n + 1, title}))});

test("a group with count null shows no number, undefined shows how many rows it holds, a number shows itself", async () => {
    const into = await shown([group("none", null, ["a", "b"]), group("held", undefined, ["a", "b", "c"]), group("said", 9, ["a"])]);
    const heads = [...into.querySelectorAll(".ghead")].map((head) => [head.querySelector(".gtitle").textContent, head.querySelector(".gcount")?.textContent ?? ""]);
    expect(heads).toEqual([["none", ""], ["held", "3"], ["said", "9"]]);
});

test("each row of a group is drawn through the row slot", async () => {
    const into = await shown([group("one", undefined, ["first", "second"])]);
    expect([...into.querySelectorAll(".stub")].map((row) => row.textContent)).toEqual(["first", "second"]);
});
