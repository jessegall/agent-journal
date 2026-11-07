import {expect, test} from "vitest";
import {foldedMarks, interleaved} from "../src/domain/chatTimeline.js";

test("messages and marks stand in one list by created_at, a message first when both came at once", () => {
    const messages = [{id: 1, created_at: 10}, {id: 2, created_at: 30}];
    const marks = [{id: 1, created_at: 20}, {id: 2, created_at: 30}];
    expect(interleaved(messages, marks).map((item) => item.id)).toEqual(["message:1", "mark:1", "message:2", "mark:2"]);
});

test("rows the journal sends carry their time as text and still stand oldest first, a mark among the messages it came between", () => {
    const messages = [{id: 7, created_at: "2026-11-01T05:00:00+00:00"}, {id: 8, created_at: "2026-11-01T05:10:00+00:00"}];
    const marks = [{id: 3, created_at: "2026-11-01T05:05:00+00:00"}];
    expect(interleaved(messages, marks).map((item) => item.id)).toEqual(["message:7", "mark:3", "message:8"]);
});

const DECLARATIONS = {
    reminder: {family: "memories.reminders", family_title: "Reminders", grouping: "family", group_label: "{count} rules and reminders recalled"},
    exception: {family: "chat.exceptions", family_title: "Exceptions", grouping: "family", group_label: "{family}: {count} updates"},
    compaction: {family: "memories.context", family_title: "Context", grouping: "never", group_label: ""},
    command: {family: "processes.commands", family_title: "Commands", grouping: "family", group_label: "", process: true},
    question: {family: "questions.questions", family_title: "Questions", grouping: "family", group_label: "", card: true},
    edit: {family: "edits", family_title: "Edits", grouping: "row", group_label: "{count} edits"},
};
const declarationOf = (type) => DECLARATIONS[type];
const markItem = (id, type, fields = {}) => ({type: "mark", id: `mark:${id}`, time: id, row: {id, type, ...fields}});
const messageItem = (id) => ({type: "message", id: `message:${id}`, time: id, row: {id}});
const shape = (items) => items.map((item) => (item.type === "mark-group" ? `group:${item.marks.length}` : item.id));

test("three marks of a family standing together fold into one, under the label the type declares", () => {
    const [group] = foldedMarks([markItem(1, "reminder"), markItem(2, "reminder"), markItem(3, "reminder")], declarationOf);
    expect(group).toMatchObject({type: "mark-group", id: "mark-group:1", label: "3 rules and reminders recalled", time: 1});
    expect(group.marks.map((mark) => mark.id)).toEqual([1, 2, 3]);
});

test("the group label names the family where it asks for it", () => {
    const [group] = foldedMarks([markItem(1, "exception"), markItem(2, "exception"), markItem(3, "exception")], declarationOf);
    expect(group.label).toBe("Exceptions: 3 updates");
});

test("two marks stay single, as version 4 folded only from three", () => {
    expect(shape(foldedMarks([markItem(1, "reminder"), markItem(2, "reminder")], declarationOf))).toEqual(["mark:1", "mark:2"]);
});

test("a message between marks splits them, so neither side reaches three", () => {
    const items = [markItem(1, "reminder"), markItem(2, "reminder"), messageItem(3), markItem(4, "reminder"), markItem(5, "reminder")];
    expect(shape(foldedMarks(items, declarationOf))).toEqual(["mark:1", "mark:2", "message:3", "mark:4", "mark:5"]);
});

test("another family between marks splits them too", () => {
    const items = [markItem(1, "reminder"), markItem(2, "reminder"), markItem(3, "exception"), markItem(4, "reminder")];
    expect(shape(foldedMarks(items, declarationOf))).toEqual(["mark:1", "mark:2", "mark:3", "mark:4"]);
});

test("a stretch that reaches three folds and what follows it stays in its place", () => {
    const items = [messageItem(1), markItem(2, "reminder"), markItem(3, "reminder"), markItem(4, "reminder"), messageItem(5)];
    expect(shape(foldedMarks(items, declarationOf))).toEqual(["message:1", "group:3", "message:5"]);
});

test("a mark declared never to group, a process mark and a card mark never fold", () => {
    for (const type of ["compaction", "command", "question"]) {
        const items = [markItem(1, type), markItem(2, type), markItem(3, type)];
        expect(shape(foldedMarks(items, declarationOf))).toEqual(["mark:1", "mark:2", "mark:3"]);
    }
});

test("marks that fold by their row fold only with marks naming the same row", () => {
    const same = {target_model: "task", target_id: 5};
    const items = [markItem(1, "edit", same), markItem(2, "edit", same), markItem(3, "edit", {target_model: "task", target_id: 6})];
    expect(shape(foldedMarks(items, declarationOf))).toEqual(["mark:1", "mark:2", "mark:3"]);
    expect(shape(foldedMarks([markItem(1, "edit", same), markItem(2, "edit", same), markItem(3, "edit", same)], declarationOf))).toEqual(["group:3"]);
});

test("a mark of a type no declaration names stays single", () => {
    expect(shape(foldedMarks([markItem(1, "gone"), markItem(2, "gone"), markItem(3, "gone")], declarationOf))).toEqual(["mark:1", "mark:2", "mark:3"]);
});
