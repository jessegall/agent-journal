import {expect, test} from "vitest";
import {render} from "../src/text/index.js";

const itemCount = (html) => html.match(/<li>/g).length;

test("a numbered list with blank lines between its items stays one list", () => {
    const html = render("1. First\n\n2. Second\n\n3. Third");
    expect(html.match(/<ol/g)).toHaveLength(1);
    expect(itemCount(html)).toBe(3);
});

test("a numbered list cut by a paragraph goes on counting from its own number", () => {
    const html = render("1. First\n\nA note in between.\n\n2. Second");
    expect(html).toContain('<ol start="2">');
    expect(html).toContain("<p>");
});

test("a bullet list and a numbered list stay two lists", () => {
    const html = render("- One\n\n1. Two");
    expect(html).toContain("<ul>");
    expect(html).toContain("<ol>");
});

test("the line after a list stays outside it", () => {
    const html = render("- One\n- Two\n\nThe end.");
    expect(itemCount(html)).toBe(2);
    expect(html).toContain("<p>");
});

test("an indented line goes on the item it follows", () => {
    expect(itemCount(render("1. One\n   more of one\n2. Two"))).toBe(2);
});
