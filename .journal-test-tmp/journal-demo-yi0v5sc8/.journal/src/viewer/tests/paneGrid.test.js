import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import PaneGrid from "../src/panes/PaneGrid.vue";
import {measure} from "../src/domain/panes.js";

const tree = {dir: "row", r: 0.6, a: {id: 1}, b: {dir: "col", r: 0.25, a: {id: 2}, b: {id: 3}}};

function grid(onResize = () => {}) {
    const {rects, splits} = measure(tree);
    const panes = Object.entries(rects).map(([id, rect]) => ({id: Number(id), rect, pane: {tabs: [], active: ""}, state: "live"}));
    const element = document.createElement("div");
    createApp(() => h(PaneGrid, {panes, splits, onResize}, {pane: ({id}) => h("p", {class: "body"}, `pane ${id}`)})).mount(element);
    return element;
}

const boxOf = (section) => ["left", "top", "width", "height"].map((side) => section.style[side]);

test("a nested row and column tree is drawn at its rectangles", async () => {
    const element = grid();
    await nextTick();
    const sections = [...element.querySelectorAll("section.pane")];
    expect(sections.map(boxOf)).toEqual([
        ["0%", "0%", "60%", "100%"],
        ["60%", "0%", "40%", "25%"],
        ["60%", "25%", "40%", "75%"],
    ]);
    expect(element.textContent).toContain("pane 3");
});

test("each split gets one resize handle, which reports its path and ratio, and a ratio near the middle snaps to it", async () => {
    const heard = [];
    const element = grid((path, ratio) => heard.push([path, ratio]));
    await nextTick();
    const handles = element.querySelectorAll(".pane-split");
    expect(handles.length).toBe(2);
    handles[1].dispatchEvent(new MouseEvent("dblclick", {bubbles: true}));
    handles[0].dispatchEvent(new MouseEvent("pointerdown", {bubbles: true}));
    window.dispatchEvent(new MouseEvent("pointermove", {clientX: 10}));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(heard).toEqual([["b", 0.5], ["", 0.5], ["", 0.5]]);
});
