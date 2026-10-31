import {expect, test} from "vitest";
import {familyKey, familyOptions, shownMarks} from "../src/domain/markFamilies.js";
import {CHAT_WINDOW, withFamilyOptions} from "../src/windows/chatOptions.js";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";

const declarations = [
    {type: "memory", family: "memories.memories", family_title: "Memories"},
    {type: "reminder", family: "memories.reminders", family_title: "Reminders"},
    {type: "compaction", family: "memories.memories", family_title: "Memories"},
];
const declarationOf = (type) => declarations.find((declaration) => declaration.type === type);
const marks = [{id: 1, type: "memory"}, {id: 2, type: "reminder"}, {id: 3, type: "compaction"}];

test("each family gets one switch, on by default", () => {
    expect(familyOptions(declarations)).toEqual([
        {control: "toggle", key: "show-memories.memories", label: "Memories", default: true},
        {control: "toggle", key: "show-memories.reminders", label: "Reminders", default: true},
    ]);
});

test("a family hidden on the pane hides its marks and shows them again when switched on", () => {
    const option = (hidden) => (key) => (hidden.includes(key) ? false : undefined);
    expect(shownMarks(marks, declarationOf, option([])).map((mark) => mark.id)).toEqual([1, 2, 3]);
    expect(shownMarks(marks, declarationOf, option([familyKey("memories.memories")])).map((mark) => mark.id)).toEqual([2]);
});

test("the catalogue lists the chat window with the families' switches, so the pane keeps the choice across a reload", async () => {
    const catalogue = new WindowCatalogue(async () => ({windows: [{name: CHAT_WINDOW, options: []}, {name: "notes.board", options: []}]}), async () => declarations);
    await catalogue.load();
    expect(catalogue.window(CHAT_WINDOW).options.map((option) => option.key)).toEqual(["show-memories.memories", "show-memories.reminders"]);
    expect(catalogue.window("notes.board").options).toEqual([]);
    expect(withFamilyOptions([], declarations)).toEqual([]);
});

import {familyPresets, mainOnlyOptions, optionsFromHidden, presetOfOptions} from "../src/domain/markFamilies.js";
import {renamedLayout} from "../src/windows/legacyLayouts.js";

const kinds = [
    {type: "memory", family: "memories.memories", family_title: "Memories", group: "reminders", shown: true, main: true},
    {type: "reminder", family: "memories.reminders", family_title: "Reminders", group: "reminders", shown: false, main: false},
    {type: "compaction", family: "memories.context", family_title: "Context", group: "agent", shown: true, main: true},
];

test("Only chat hides every family and Chat with context shows those shown by default", () => {
    const [chat, context] = familyPresets(kinds);
    expect(Object.values(chat.options)).toEqual([false, false, false]);
    expect(context.options).toEqual({"show-memories.memories": true, "show-memories.reminders": false, "show-memories.context": true});
    const option = (key) => context.options[key];
    expect(presetOfOptions(kinds, option)).toBe("context");
    expect(presetOfOptions(kinds, () => undefined)).toBe("");
});

test("main only for a group switches off its families without a main mark, and flipping it again switches them on", () => {
    const first = mainOnlyOptions(kinds, "reminders", () => undefined);
    expect(first).toEqual({"show-memories.memories": true, "show-memories.reminders": false});
    expect(mainOnlyOptions(kinds, "reminders", (key) => first[key])).toEqual({"show-memories.memories": true, "show-memories.reminders": true});
});

test("a saved list of hidden version 4 kinds becomes the family switches at first load", () => {
    expect(optionsFromHidden(["reminder", "context"], kinds)).toEqual({"show-memories.memories": true, "show-memories.reminders": false, "show-memories.context": false});
    const layout = {tree: {id: "a"}, panes: {a: {tabs: ["chat"], active: "chat", hide: ["reminder"]}}, next: 2};
    expect(renamedLayout(layout, kinds)?.panes.a.options).toEqual({"show-memories.memories": true, "show-memories.reminders": false, "show-memories.context": true});
});
