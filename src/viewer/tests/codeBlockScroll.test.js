import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {expect, test} from "vitest";

const styles = readFileSync(resolve(__dirname, "../src/text/codeBlock.css"), "utf8");

test("a code block scrolls sideways by itself and its lines never wrap", () => {
    expect(styles).toMatch(/\.chat-code-block > pre\.chat-code \{[^}]*overflow-x: auto;[^}]*white-space: pre;/);
    expect(styles).toMatch(/\.chat-code-block > pre\.chat-code code \{[^}]*white-space: pre;/);
    expect(styles).toMatch(/\.chat-code-block \{[^}]*max-width: 100%;/);
});
