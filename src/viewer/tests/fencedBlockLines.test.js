import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {expect, test} from "vitest";

const style = readFileSync(resolve(__dirname, "..", "kit/MessageCard.vue"), "utf8").split("<style")[1];
const blocks = style.split("}").map((block) => block.split("{").map((part) => part.trim()));

const declarations = (selector) => blocks.filter(([name]) => name === selector).map(([, body]) => body).join(" ");

test("inline code in a message does not wrap", () => {
    expect(declarations(".message-card :deep(code)")).toMatch(/white-space:\s*nowrap;/);
});

test("code inside a fenced block takes the block's white space, so its line breaks stay", () => {
    expect(declarations(".message-card :deep(pre code)")).toMatch(/white-space:\s*inherit;/);
});

test("a fenced block keeps its line breaks", () => {
    expect(declarations(".message-card :deep(pre)")).toMatch(/white-space:\s*pre;/);
});
