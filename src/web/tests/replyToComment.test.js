import {expect, test} from "vitest";
import {replyQuote, withQuote} from "../src/format/quote.js";

test("a reply in the chat to a comment quotes the comment's own words and never its passage, so the reply is talk, not a comment", () => {
    const comment = "> the footer sits too low\n> on small screens\n\nis this still true?";
    expect(replyQuote(comment)).toBe("is this still true?");
    const body = withQuote(replyQuote(comment), "Yes, fixed in the last commit.");
    expect(body).toBe("> is this still true?\n\nYes, fixed in the last commit.");
    expect(body.includes("the footer sits too low")).toBe(false);
});
