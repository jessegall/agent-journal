import {describe, expect, it} from "vitest";
import {cardTitle} from "../src/domain/cardTitle.js";

describe("a card's title says its own number", () => {
    it("puts the text's number in place of N", () => {
        expect(cardTitle({title: "N or more messages unread?"}, {text: "3"})).toBe("3 or more messages unread?");
        expect(cardTitle({title: "Has the agent been quiet for N seconds?"}, {text: "900"})).toBe(
            "Has the agent been quiet for 900 seconds?"
        );
    });

    it("puts the whole text in place of N when the check reads words", () => {
        expect(cardTitle({title: "Tool is one of N?"}, {text: "Write, Edit"})).toBe("Tool is one of Write, Edit?");
        expect(cardTitle({title: "Time of day within N?"}, {text: "22:00-06:00"})).toBe("Time of day within 22:00-06:00?");
    });

    it("names the count and its number", () => {
        expect(cardTitle({title: "Is a count over N?"}, {text: "edits 20"})).toBe("Is the count edits over 20?");
        expect(cardTitle({title: "Is a count at every Nth?"}, {text: "turns 50"})).toBe("Is the count turns at every 50th?");
        expect(cardTitle({title: "Is a count over N?"}, {text: "edits"})).toBe("Is a count over N?");
    });

    it("leaves a title with no N, or a card with no text, as it is", () => {
        expect(cardTitle({title: "Has unread messages?"}, {text: ""})).toBe("Has unread messages?");
        expect(cardTitle({title: "N or more messages unread?"}, {text: ""})).toBe("N or more messages unread?");
        expect(cardTitle({title: "Send the agent a message"}, {text: "Not now"})).toBe("Send the agent a message");
    });
});
