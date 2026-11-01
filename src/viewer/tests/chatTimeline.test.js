import {expect, test} from "vitest";
import {interleaved} from "../src/domain/chatTimeline.js";

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
