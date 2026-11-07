import {expect, test} from "vitest";
import {render} from "../src/text/index.js";
import "../src/text/all.js";

const MESSAGE = "if chain.tests:\n     ....\n\nif chain.writes:\n   ....";

function shown(text) {
    const element = document.createElement("div");
    element.innerHTML = render(text);
    return element;
}

test("an indented line under an if line reads as code, whatever its indent, in each of two pairs", () => {
    const element = shown(MESSAGE);
    const blocks = [...element.querySelectorAll("pre.chat-code")].map((b) => b.textContent.replace(/\n$/, ""));

    expect(blocks).toEqual(["if chain.tests:\n     ....", "if chain.writes:\n   ...."]);
});

test("the two pairs of the message are separate blocks and nothing else is left as text", () => {
    const element = shown(MESSAGE);

    expect(element.querySelectorAll(".chat-code-block")).toHaveLength(2);
    expect(element.querySelector("p")).toBeNull();
});

test("an indented list under a line ending in a colon stays a list", () => {
    const element = shown("Steps:\n  - one\n  - two");

    expect(element.querySelector("pre")).toBeNull();
    expect(element.querySelectorAll("li")).toHaveLength(2);
});

test("a list item ending in a colon with an indented line under it stays a list", () => {
    const element = shown("- Steps:\n  more of the item");

    expect(element.querySelector("pre")).toBeNull();
    expect(element.querySelectorAll("li")).toHaveLength(1);
});

test("a fenced block of several lines keeps its lines, one per line of the text", () => {
    const element = shown("before\n\n```python\n@dataclass\nclass Item:\n    title: str\n```\n\nafter");

    expect(element.querySelector("pre.chat-code").textContent.replace(/\n$/, "").split("\n")).toEqual(["@dataclass", "class Item:", "    title: str"]);
});
