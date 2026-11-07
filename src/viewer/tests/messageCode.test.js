import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {expect, test} from "vitest";

const read = (path) => readFileSync(resolve(__dirname, path), "utf8");
const card = read("../kit/MessageCard.vue");
const rule = (selector) => [...card.matchAll(new RegExp(`${selector.replace(/[().]/g, "\\$&")} \\{([^}]*)\\}`, "g"))].map((found) => found[1]).join("");

test("inline code and a code block in a chat bubble sit on the code background", () => {
    expect(rule(".message-card :deep(code)")).toContain("background: var(--code-bg);");
    expect(rule(".message-card :deep(pre)")).toContain("background: var(--code-bg);");
});

test("the code inside a block takes the block's background, not a second one", () => {
    expect(rule(".message-card :deep(pre code)")).toMatch(/padding: 0;\s*background: none;/);
});

test("the dark theme's code background is black", () => {
    const [, red, green, blue] = read("../src/tokens.css").match(/--code-bg: #([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2});/);
    expect(Math.max(...[red, green, blue].map((channel) => parseInt(channel, 16)))).toBeLessThan(0x20);
});
