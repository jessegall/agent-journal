import {createApp, h} from "vue";
import {expect, test, vi} from "vitest";
import {peekRef} from "../src/route.js";
import {settled} from "./settled.js";
import DocumentLibrary from "../../core/modules/documents/web/src/DocumentLibrary.vue";
import {grouped} from "../../core/modules/documents/web/src/libraryGroups.js";
import {WINDOW_CONTEXT} from "../kit/windowContextKey.js";
import {documentWindowContext} from "./support/documentWindowContext.js";

vi.mock("../src/route.js", async (importOriginal) => ({...(await importOriginal()), peekRef: vi.fn()}));

const NOW = Date.parse("2026-10-31T12:00:00Z");
const DOCS = [
    {id: 1, title: "Cart rules", abstract: "How the cart counts money", updated_at: "2026-10-31T11:00:00Z"},
    {id: 2, title: "Release steps", abstract: "What happens before a release", updated_at: "2026-10-10T11:00:00Z"},
];
const BODY = {id: 1, title: "Cart rules", abstract: "How the cart counts money", body: "## Totals\n- in cents"};

function mounted() {
    const reads = [];
    const read = async (words) => {
        const line = Array.isArray(words) ? words.join(" ") : words;
        reads.push(line);
        if (line.startsWith("doc inspect")) return {ok: true, value: line.endsWith("2") ? {...BODY, id: 2, title: "Release steps", body: "## Steps"} : BODY};
        const rows = line === "document library --type doc --state open" ? DOCS : [];
        return {ok: true, value: {total: rows.length, rows}};
    };
    const context = {...documentWindowContext({}), read, run: async () => ({ok: true}), follow: () => {}, face: "person"};
    const element = document.createElement("div");
    createApp({setup: () => () => h(DocumentLibrary), provide: {[WINDOW_CONTEXT]: context}}).mount(element);
    return {element, reads};
}

test("documents are listed with their title, abstract and number", async () => {
    const {element} = mounted();
    await settled();
    const row = element.querySelector('[data-row="1"]');
    expect(row.textContent).toContain("Cart rules");
    expect(row.textContent).toContain("How the cart counts money");
    expect(row.textContent).toContain("Document 1");
});

test("the library is read once, a page of one type", async () => {
    const {reads} = mounted();
    await settled();
    expect(reads).toEqual(["document library --type doc --state open"]);
});

test("in the window a row opens that document's inspector in place and nothing is read beside the list", async () => {
    const {element, reads} = mounted();
    await settled();
    const row = element.querySelector('[data-row="2"]');
    expect(row.tagName).toBe("BUTTON");
    row.click();
    expect(peekRef).toHaveBeenCalledWith("docs:2");
    expect(reads.some((line) => line.startsWith("doc inspect"))).toBe(false);
});

test("rows fall under the age heading of their last edit", () => {
    expect(grouped(DOCS, "newest", NOW).map((group) => [group.title, group.rows.map((row) => row.id)])).toEqual([
        ["Today", [1]],
        ["Last 30 days", [2]],
    ]);
});

test("the library reads the open texts first and the closed ones when chosen", async () => {
    const {element, reads} = mounted();
    await settled();
    expect(reads[0]).toContain("--state open");
    [...element.querySelectorAll("button")].find((button) => button.textContent.trim() === "Closed").click();
    await settled();
    expect(reads.at(-1)).toContain("--state closed");
});

