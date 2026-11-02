import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {expect, test} from "vitest";

const style = readFileSync(resolve(__dirname, "..", "kit/MessageCard.vue"), "utf8").split("<style")[1];

function declarations(selector) {
    const rule = style.split("}").find((block) => block.split("{")[0].trim() === selector);
    return rule ? rule.split("{")[1] : "";
}

test("a reply bubble has a minimum width of a fixed length, so a short reply still shows its quote", () => {
    expect(declarations(".message-card:has(.message-quote)")).toMatch(/min-width:\s*\d+px;/);
});

test("the minimum width is not a percentage, which a bubble sized to its text resolves to nothing", () => {
    expect(declarations(".message-card:has(.message-quote)")).not.toMatch(/min-width:[^;]*%/);
});
