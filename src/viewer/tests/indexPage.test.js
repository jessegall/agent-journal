// @vitest-environment node
import {readFileSync, existsSync} from "node:fs";
import {expect, test} from "vitest";

const page = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("the page names no outside host, so its fonts and styles come from the journal", () => {
    expect(page).not.toMatch(/https?:\/\/(?!www\.w3\.org)/);
});

test("the page preloads the Geist fonts and every font face it declares is a file the journal serves", () => {
    expect(page).toContain('rel="preload" href="/viewer/vendor/fonts/geist.woff2"');
    expect(page).toContain('rel="preload" href="/viewer/vendor/fonts/geist-mono.woff2"');
    const files = [...page.matchAll(/url\(\/viewer\/vendor\/fonts\/([^)]+)\)/g)].map((match) => match[1]);
    expect(files.length).toBe(4);
    for (const file of files) expect(existsSync(new URL(`../public/vendor/fonts/${file}`, import.meta.url))).toBe(true);
});

test("a font face never swaps in late and moves the text", () => {
    expect(page).not.toContain("font-display: swap");
    expect(page.match(/font-display: optional/g)).toHaveLength(4);
});
