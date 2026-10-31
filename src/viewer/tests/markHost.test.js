import {expect, test, vi} from "vitest";
import {markLook} from "../src/domain/markLook.js";

vi.mock("../src/route.js", () => ({go: vi.fn(), peekRef: vi.fn()}));

// the fields version 4's Turn.vue gave a card mark, for each kind of mark the modules declare today; none of these kinds is a
// process, so a mark in state "ended" still draws as ended: false (only a process mark ends)
const KINDS = [
    {type: "fault", family_icon: "fault", mark_icon: "fault", group: "journal", colouring: "group", click: "unfold"},
    {type: "memory", family_icon: "fact", mark_icon: "fact", group: "reminders", colouring: "group", click: "open row"},
    {type: "reminder", family_icon: "reminder", mark_icon: "rule", group: "reminders", colouring: "group", click: "open row"},
    {type: "compaction", family_icon: "compact", mark_icon: "compact", group: "agent", colouring: "group", click: "nothing"},
];

for (const kind of KINDS) {
    test(`a ${kind.type} mark has the fields ChatMark draws: icon, mark icon, group, label, time and state`, () => {
        const row = {id: 3, text: "words", detail: "more", figure: "2", fraction: 0.5, state: "ended", created_at: 11, target_model: "memories", target_id: 3};
        expect(markLook(row, kind)).toMatchObject({
            key: "chat_mark:3",
            icon: kind.family_icon,
            markIcon: kind.mark_icon,
            group: kind.group,
            tone: "",
            label: "words",
            detail: "more",
            figure: "2",
            fraction: 0.5,
            ended: false,
            active: false,
            time: 11,
        });
    });
}

test("an outcome-coloured family tones a mark by how it ended", () => {
    const kind = {...KINDS[0], colouring: "outcome"};
    const tones = ["passed", "failed", "warned", "running"].map((outcome) => markLook({id: 1, text: "x", outcome}, kind).tone);
    expect(tones).toEqual(["good", "danger", "warn", ""]);
});
