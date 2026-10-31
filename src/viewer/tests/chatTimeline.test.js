import {expect, test} from "vitest";
import {interleaved} from "../src/domain/chatTimeline.js";

test("messages and marks stand in one list by created_at, a message first when both came at once", () => {
    const messages = [{id: 1, created_at: 10}, {id: 2, created_at: 30}];
    const marks = [{id: 1, created_at: 20}, {id: 2, created_at: 30}];
    expect(interleaved(messages, marks).map((item) => item.id)).toEqual(["message:1", "mark:1", "message:2", "mark:2"]);
});
