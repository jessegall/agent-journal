import {expect, test} from "vitest";
import {context, drawn, mounted} from "./support/windowContext.js";
import Dumps from "../../core/modules/dumps/web/src/dumps.js";
import DumpDock from "../../core/modules/dumps/web/src/dump-dock.js";

const board = (dumps) => ({"dump board": {ok: true, value: {total: dumps.length, dumps}}});

test("the dumps list shows each dump with its title, or its number, its notes or its outcome and its items, from one read", async () => {
    const windowContext = context(board([
        {id: 1, title: "Call notes", brief: "Notes from the call", outcome: "", items: [{id: 1, text: "The cart rounds twice", state: "filed", note: "", summary: "made a task", refs: ["tasks:1"]}]},
        {id: 2, title: "", brief: "More notes", outcome: "2 filed, 0 failed", items: []},
    ]));
    const text = await drawn(Dumps, windowContext);
    expect(text).toContain("Call notes");
    expect(text).toContain("Notes from the call");
    expect(text).toContain("made a task");
    expect(text).toContain("Filed into tasks:1");
    expect(text).toContain("Dump 2");
    expect(text).toContain("Closed: 2 filed, 0 failed");
    expect(windowContext.reads).toEqual(["dump board"]);
});

test("an empty dumps list shows an empty state", async () => {
    expect(await drawn(Dumps, context(board([])))).toContain("No dumps");
});

test("the dock body shows the dump's title and its notes", async () => {
    const text = (await mounted(DumpDock, context({}), {row: {id: 1, title: "", brief: "Notes from the call", outcome: ""}})).textContent;
    expect(text).toContain("Dump 1");
    expect(text).toContain("Notes from the call");
});
