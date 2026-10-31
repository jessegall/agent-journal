import {expect, test} from "vitest";
import {context, drawn, mounted, page} from "./support/windowContext.js";
import Dumps from "../../core/modules/dumps/web/src/dumps.js";
import DumpDock from "../../core/modules/dumps/web/src/dump-dock.js";

test("the dumps list shows each dump with its title, or its number, and its notes or its outcome", async () => {
    const text = await drawn(Dumps, context({"dump list": page([
        {id: 1, title: "Call notes", brief: "Notes from the call", outcome: ""},
        {id: 2, title: "", brief: "More notes", outcome: "2 filed, 0 failed"},
    ])}));
    expect(text).toContain("Call notes");
    expect(text).toContain("Notes from the call");
    expect(text).toContain("Dump 2");
    expect(text).toContain("Closed: 2 filed, 0 failed");
});

test("an empty dumps list shows an empty state", async () => {
    expect(await drawn(Dumps, context({"dump list": page([])}))).toContain("No dumps");
});

test("the dock body shows the dump's title and its notes", async () => {
    const text = (await mounted(DumpDock, context({}), {row: {id: 1, title: "", brief: "Notes from the call", outcome: ""}})).textContent;
    expect(text).toContain("Dump 1");
    expect(text).toContain("Notes from the call");
});
