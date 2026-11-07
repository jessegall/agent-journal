import {expect, test} from "vitest";
import {context, drawn, mountedDock} from "./support/windowContext.js";
import {dumpWindowContext} from "./support/dumpWindowContext.js";
import Dumps from "../../core/modules/dumps/web/src/dumps.js";
import DumpDock from "../../core/modules/dumps/web/src/dump-dock.js";

const board = (dumps) => ({"dump board": {ok: true, value: {total: dumps.length, dumps}}});

test("the dumps list opens the newest dump with its title, notes and items and lists the others by title or number, from one read", async () => {
    const windowContext = dumpWindowContext(board([
        {id: 1, title: "Call notes", brief: "Notes from the call", outcome: "", items: [{id: 1, text: "The cart rounds twice", state: "filed", note: "", summary: "made a task", refs: ["tasks:1"]}]},
        {id: 2, title: "", brief: "More notes", outcome: "2 filed, 0 failed", items: []},
    ]));
    const text = await drawn(Dumps, windowContext);
    expect(text).toContain("Call notes");
    expect(text).toContain("Notes from the call");
    expect(text).toContain("made a task");
    expect(text).toContain("Filed into tasks:1");
    expect(text).toContain("Dump 2");
    expect(text).not.toContain("More notes");
    expect(windowContext.reads).toEqual(["dump board"]);
});

test("an empty dumps list shows an empty state", async () => {
    expect(await drawn(Dumps, dumpWindowContext(board([])))).toContain("No dumps");
});

test("the dump dock adds its item count to the card's bottom line", async () => {
    const window = context({"dump items 1": {ok: true, value: [{id: 2}, {id: 3}]}});
    const element = await mountedDock(DumpDock, window, {target_id: 1});
    expect(element.querySelector("footer").textContent).toBe("Items: 2");
    expect(window.reads).toEqual(["dump items 1"]);
});
