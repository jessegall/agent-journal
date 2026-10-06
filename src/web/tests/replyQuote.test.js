import {expect, test} from "vitest";
import {replyQuote} from "../src/format/quote.js";

test("an answer that begins with a quote of your words quotes only the answer", () => {
    expect(replyQuote("> Ffs dude why\n\nA correction to what I wrote")).toBe("A correction to what I wrote");
});

test("a plain answer is quoted unchanged", () => {
    expect(replyQuote("Just an answer")).toBe("Just an answer");
});
