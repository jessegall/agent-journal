import {describe, expect, test} from "vitest";
import {answers, pendingRow, withoutAnswered} from "../src/domain/placeholders.js";

const at = (seconds) => new Date(seconds * 1000).toISOString();

describe("a row the viewer added while its create call was out", () => {
    const placeholder = pendingRow("reactions", {face: "👍", message_id: 4}, {created_at: at(1000)});
    const real = {table: "reactions", id: 12, face: "👍", message_id: 4, author: "user", created_at: at(1001)};

    test("is answered by the server's row for the same thing, and by no other", () => {
        expect(answers(real, placeholder)).toBe(true);
        expect([answers({...real, face: "❤️"}, placeholder), answers({...real, message_id: 5}, placeholder), answers({...real, id: 0}, placeholder)]).toEqual([false, false, false]);
    });

    test("is dropped when the server's row arrives, so a list never shows the row twice", () => {
        const other = {table: "reactions", id: 9, face: "🎉", message_id: 4, created_at: at(900)};
        expect(withoutAnswered([other, placeholder], [other, real])).toEqual([other]);
        expect(withoutAnswered([other, placeholder], [other])).toEqual([other, placeholder]);
    });

    test("a comment the viewer wrote is answered by the server's comment with its words, and never by an older one", () => {
        const wrote = pendingRow("comments", {text: "Check the second table", on: ["docs:3"]}, {created_at: at(1000)});
        const older = {table: "comments", id: 7, text: "Check the second table", on: ["docs:3"], created_at: at(100)};
        const other = {table: "comments", id: 8, text: "Something else", on: ["docs:3"], created_at: at(1001)};
        const arrived = {table: "comments", id: 9, text: "Check the second table", on: ["docs:3"], created_at: at(1001)};
        expect([answers(older, wrote), answers(other, wrote), answers(arrived, wrote)]).toEqual([false, false, true]);
        const second = pendingRow("comments", {text: "And the third", on: ["docs:3"]}, {created_at: at(1000)});
        expect(withoutAnswered([wrote, second], [arrived])).toEqual([second]);
    });
});
