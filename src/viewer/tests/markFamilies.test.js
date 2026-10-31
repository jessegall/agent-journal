import {expect, test} from "vitest";
import {CHAT_WINDOW, familyKey, familyOptions, shownMarks, withFamilyOptions} from "../src/domain/markFamilies.js";
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
