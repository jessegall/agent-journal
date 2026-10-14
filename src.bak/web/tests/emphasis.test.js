import {expect, test} from "vitest";
import {render} from "../src/text/index.js";
import "../src/text/all.js";

const html = (text) => render(text, {types: [], env: ""});

test("underscores that start or sit inside a word are not emphasis, so an identifier never turns the text between into italics", () => {
    const shown = html("the card and _reporting all agree, so it was not _reporting that missed it, and snake_case_name stays");
    expect(shown).not.toContain("<em>");
    expect(shown).toContain("_reporting all agree");
    expect(shown).toContain("snake_case_name");
});

test("a word wrapped in underscores or stars is still emphasis, and a lone star between spaces is not", () => {
    expect(html("this is _quite_ clear")).toContain("<em>quite</em>");
    expect(html("this is *quite* clear")).toContain("<em>quite</em>");
    expect(html("two * three * four")).not.toContain("<em>");
});
