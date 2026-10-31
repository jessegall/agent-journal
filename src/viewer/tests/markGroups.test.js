import {expect, test} from "vitest";
import {groupMarks, newMarks} from "../src/domain/markGroups.js";

const declarations = {
    memory: {family: "memories.memories", family_title: "Memories", label: "Memories", grouping: "family", group_label: "{family}: {count} updates", group_buttons: [{icon: "x", label: "Open", runs: "window open memories.list"}]},
    reminder: {family: "memories.reminders", family_title: "Reminders", label: "Reminders", grouping: "type", group_label: "{count} rules and reminders recalled", group_buttons: []},
    step: {family: "seq.steps", family_title: "Steps", label: "Step", grouping: "run", group_label: "{count} steps", group_buttons: []},
    compaction: {family: "memories.context", family_title: "Context", label: "Compacted", grouping: "never", group_label: "{count}", group_buttons: []},
    fault: {family: "chat.faults", family_title: "Faults", label: "Faults", grouping: "row", group_label: "{count} faults", group_buttons: []},
};
const declarationOf = (type) => declarations[type] || null;
let id = 0;
const mark = (type, extra = {}) => ({id: ++id, type, agent_id: null, run_key: "", run_step: 0, target_model: "", target_id: null, ...extra});
const kinds = (items) => items.map((item) => item.kind);

test("two marks of a family stay single and three fold into one group with the declared words and buttons", () => {
    expect(kinds(groupMarks([mark("memory"), mark("memory")], declarationOf))).toEqual(["mark", "mark"]);
    const [group] = groupMarks([mark("memory"), mark("memory"), mark("memory")], declarationOf);
    expect(group).toMatchObject({kind: "group", count: 3, label: "Memories: 3 updates"});
    expect(group.buttons[0].runs).toBe("window open memories.list");
});

test("a mark of another family between them breaks a stretch", () => {
    const items = groupMarks([mark("memory"), mark("memory"), mark("compaction"), mark("memory")], declarationOf);
    expect(kinds(items)).toEqual(["mark", "mark", "mark", "mark"]);
});

test("grouping by type, by row and never", () => {
    expect(groupMarks([mark("reminder"), mark("reminder"), mark("reminder")], declarationOf)[0].label).toBe("3 rules and reminders recalled");
    const row = {target_model: "fault", target_id: 4};
    expect(kinds(groupMarks([mark("fault", row), mark("fault", row), mark("fault", {target_model: "fault", target_id: 5})], declarationOf))).toEqual(["mark", "mark", "mark"]);
    expect(kinds(groupMarks([mark("compaction"), mark("compaction"), mark("compaction")], declarationOf))).toEqual(["mark", "mark", "mark"]);
});

test("a worker's own marks fold by the worker first", () => {
    const items = groupMarks([mark("memory", {agent_id: 7}), mark("reminder", {agent_id: 7}), mark("fault", {agent_id: 7})], declarationOf);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({kind: "group", count: 3, label: "Worker 7: 3 events"});
});

test("a run gathers wherever its marks arrive, in step order, and continues further down", () => {
    const a = mark("step", {run_key: "r", run_step: 2});
    const b = mark("step", {run_key: "r", run_step: 1});
    const between = mark("compaction");
    const c = mark("step", {run_key: "r", run_step: 3});
    const items = groupMarks([a, between, b, c], declarationOf);
    expect(items[1]).toMatchObject({kind: "mark"});
    expect(items[0]).toMatchObject({kind: "group", label: "3 steps", news: 2});
    expect(items[0].marks.map((m) => m.run_step)).toEqual([1, 2, 3]);

    const far = [mark("step", {run_key: "q", run_step: 1}), ...Array.from({length: 11}, () => mark("compaction")), mark("step", {run_key: "q", run_step: 2})];
    const later = groupMarks(far, declarationOf).at(-1);
    expect(later).toMatchObject({kind: "group", continues: expect.stringContaining("chat_mark:")});
    expect(later.label).toBe("1 steps, continued");
});

test("a group counts the marks newer than the last one its reader saw", () => {
    const [group] = groupMarks([mark("memory"), mark("memory"), mark("memory")], declarationOf);
    expect(newMarks(group, 0)).toBe(3);
    expect(newMarks(group, group.marks[1].id)).toBe(1);
});
