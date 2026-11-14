// @vitest-environment node
import {readFileSync} from "node:fs";
import {expect, test} from "vitest";

const source = (name) => readFileSync(new URL(`../kit/${name}`, import.meta.url), "utf8");

// the body of a page of cards or of a list and reader keeps a height of its own, so its empty state is never cut off when the page holds little
test("the body of a card page and of a list and reader page has a minimum height for its empty state", () => {
    expect(source("CardPage.vue")).toMatch(/\.card-page-body \{[^}]*min-height: 120px;/);
    expect(source("ListReaderLayout.vue")).toMatch(/\.list-reader-body \{[^}]*min-height: 160px;/);
});
