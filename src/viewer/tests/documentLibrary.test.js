import {createApp, h} from "vue";
import {expect, test} from "vitest";
import {settled} from "./settled.js";
import DocumentLibrary from "../../core/modules/documents/web/src/DocumentLibrary.vue";
import {grouped} from "../../core/modules/documents/web/src/libraryGroups.js";
import {WINDOW_CONTEXT} from "../kit/windowContextKey.js";

const NOW = Date.parse("2026-10-31T12:00:00Z");
const DOCS = [
    {id: 1, title: "Cart rules", abstract: "How the cart counts money", updated_at: "2026-10-31T11:00:00Z"},
    {id: 2, title: "Release steps", abstract: "What happens before a release", updated_at: "2026-10-10T11:00:00Z"},
];
const BODY = {id: 1, title: "Cart rules", abstract: "How the cart counts money", body: "## Totals\n- in cents"};

function mounted() {
    const reads = [];
    const read = async (line) => (reads.push(line), line.startsWith("doc show") ? {ok: true, value: BODY} : {ok: true, value: {rows: line.startsWith("doc list") ? DOCS : []}});
    const context = {read, run: async () => ({ok: true}), follow: () => {}, face: "person"};
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

test("choosing a document reads it whole and shows its text", async () => {
    const {element, reads} = mounted();
    await settled();
    element.querySelector('[data-row="1"]').click();
    await settled();
    expect(reads).toContain("doc show 1 --json");
    expect(element.querySelector(".reader-title").textContent).toBe("Cart rules");
    expect(element.querySelector(".reader-body").textContent).toContain("in cents");
});

test("rows fall under the age heading of their last edit", () => {
    expect(grouped(DOCS, "newest", NOW).map((group) => [group.title, group.rows.map((row) => row.id)])).toEqual([
        ["Today", [1]],
        ["Last 30 days", [2]],
    ]);
});
