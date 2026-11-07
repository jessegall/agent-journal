import {expect, test} from "vitest";
import {shownMarks} from "../src/domain/markFamilies.js";
import {CHAT_WINDOW, withFamilyOptions} from "../src/windows/chatOptions.js";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";

const declarations = [
    {type: "memory", family: "memories.memories", family_title: "Memories", group: "memories", group_label: "Memory"},
    {type: "reminder", family: "memories.reminders", family_title: "Reminders", group: "memories", group_label: "Memory"},
    {type: "compaction", family: "memories.memories", family_title: "Memories", group: "memories", group_label: "Memory"},
];
const declarationOf = (type) => declarations.find((declaration) => declaration.type === type);
const marks = [{id: 1, type: "memory"}, {id: 2, type: "reminder"}, {id: 3, type: "compaction"}];

test("a family hidden on the pane hides its marks and shows them again when switched on", () => {
    const option = (hidden) => (key) => (hidden.includes(key) ? false : undefined);
    expect(shownMarks(marks, declarationOf, option([])).map((mark) => mark.id)).toEqual([1, 2, 3]);
    expect(shownMarks(marks, declarationOf, option(["show-memories.memories"])).map((mark) => mark.id)).toEqual([2]);
});

test("the catalogue lists the chat window with the families' switches, so the pane keeps the choice across a reload", async () => {
    const catalogue = new WindowCatalogue(async () => ({windows: [{name: CHAT_WINDOW, options: []}, {name: "notes.board", options: []}]}), async () => declarations);
    await catalogue.load();
    expect(catalogue.window(CHAT_WINDOW).options.map((option) => option.key)).toEqual(["show-preset", "main-only-memories", "show-memories.memories", "show-memories.reminders"]);
    expect(catalogue.window(CHAT_WINDOW).options.find((option) => option.control === "preset").presets.map((preset) => preset.label)).toEqual(["Only chat", "Chat with context", "All updates"]);
    expect(catalogue.window("notes.board").options).toEqual([]);
    expect(withFamilyOptions([], declarations)).toEqual([]);
});

import {familyPresets, mainOnlyOptions, optionsFromHidden} from "../src/domain/markFamilies.js";

const types = [
    {type: "memory", family: "memories.memories", family_title: "Memories", group: "reminders", shown: true, main: true},
    {type: "reminder", family: "memories.reminders", family_title: "Reminders", group: "reminders", shown: false, main: false},
    {type: "compaction", family: "memories.context", family_title: "Context", group: "agent", shown: true, main: true},
];

test("Only chat hides every family and Chat with context shows those shown by default", () => {
    const [chat, context] = familyPresets(types);
    expect(Object.values(chat.options)).toEqual([false, false, false]);
    expect(context.options).toEqual({"show-memories.memories": true, "show-memories.reminders": false, "show-memories.context": true});
});

test("main only for a group switches off its families without a main mark, and flipping it again switches them on", () => {
    const first = mainOnlyOptions(types, "reminders", () => undefined);
    expect(first).toEqual({"show-memories.memories": true, "show-memories.reminders": false});
    expect(mainOnlyOptions(types, "reminders", (key) => first[key])).toEqual({"show-memories.memories": true, "show-memories.reminders": true});
});

test("a saved list of hidden version 4 types becomes the family switches at first load", () => {
    expect(optionsFromHidden(["reminder", "context"], types)).toEqual({"show-memories.memories": true, "show-memories.reminders": false, "show-memories.context": false});
});
