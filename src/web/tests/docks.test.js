import {describe, expect, test} from "vitest";
import {dockedRef, dockedRows} from "../src/domain/docks.js";
import {threadTurns} from "../src/domain/thread.js";

const at = (seconds) => new Date(seconds * 1000).toISOString();
const docked = (id, seconds, row, docked = true, heading = `Row ${id}`) => ({
    table: "messages",
    id,
    created_at: at(seconds),
    updated_at: at(seconds),
    author: "system",
    text: heading,
    files: [],
    comments_on: [],
    idempotency: "",
    data: {kind: "docked", row, docked, heading, summary: "", dock: {buttons: [{label: "Open", act: "open"}, {label: "Close", act: "close"}], folds: true}},
});

describe("rows docked above the chat", () => {
    test("are the messages whose data says docked, newest first", () => {
        const rows = dockedRows([docked(1, 10, "tasks:1"), docked(2, 30, "reports:2", false), docked(3, 20, "docs:3"), {id: 4, data: {}}]);
        expect(rows.map((m) => m.id)).toEqual([3, 1]);
    });

    test("name the row's table and number from its ref", () => {
        expect(dockedRef(docked(1, 10, "reports:33"))).toEqual({table: "reports", id: 33});
    });

    test("a made doc or report carries the file its Download button saves", () => {
        const made = {...docked(1, 10, "reports:2", true, "Report 2: Found"), data: {kind: "made", made_type: "reports", row: "reports:2", docked: true, heading: "Report 2: Found", summary: "", file: "Found.docx"}};
        const [turn] = threadTurns([made], []).turns;
        expect(turn.kind).toBe("made");
        expect(turn.made).toMatchObject({table: "reports", id: 2, file: "Found.docx"});
    });

    test("stand in the thread as a card that says the row is docked, with the row's icon", () => {
        const [turn] = threadTurns([docked(1, 10, "tasks:12", true, "Task 12: Write it")], []).turns;
        expect(turn.kind).toBe("card");
        expect(turn.data.icon).toBe("ring");
        expect(turn.data.label).toBe("Docked above the chat");
        expect(turn.data.title).toBe("Task 12: Write it");
    });
});
