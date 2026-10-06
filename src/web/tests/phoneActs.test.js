import {beforeEach, expect, test} from "vitest";
import {itemActions} from "../src/phone/acts.js";
import {store} from "../src/state/store.js";

const kind = (row_actions, more = {}) => ({title: "Thing", command_names: {}, takes_comments: true, row_actions, ...more});
const row = (type, more = {}) => ({type, n: 4, title: "Fix the door", refs: [], data: {}, completed: 0, ...more});
const labels = (one) => itemActions(one).map((action) => action.label);

beforeEach(() => {
    store.spec = {
        types: {
            todo: kind(
                {done: {how: false}, block: {why: true}, unblock: {}, start: {}, stamp: {data: true}, delete: {why: false}, reopen: {why: true}},
                {command_names: {complete: "done"}}
            ),
            launch: kind({lift_off: {}, count_down: {from_number: true}}),
        },
    };
});

test("an item offers its controller's actions in the design's order, without the plumbing", () => {
    expect(labels(row("todo"))).toEqual(["Start it", "Mark done", "Block", "Delete"]);
    expect(labels(row("todo", {data: {blocked: "the rain"}}))).toEqual(["Start it", "Mark done", "Unblock", "Delete"]);
    expect(labels(row("todo", {completed: 5}))).toEqual(["Reopen", "Delete"]);
});

test("an action the phone does not know yet shows by itself in sentence case, asking for its words and a confirm", () => {
    const [liftOff, countDown] = itemActions(row("launch"));
    expect([liftOff.label, liftOff.confirm, liftOff.fields]).toEqual(["Lift off", true, []]);
    expect([countDown.label, countDown.word, countDown.fields]).toEqual(["Count down", "count_down", [{name: "from_number", label: "From number", required: true}]]);
});

test("an item of a type the phone was never told about offers nothing", () => {
    expect(itemActions(row("rocket"))).toEqual([]);
});
