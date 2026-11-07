import {createApp, h} from "vue";
import {expect, test} from "vitest";
import {settled} from "./settled.js";
import DocumentLibrary from "../../core/modules/documents/web/src/DocumentLibrary.vue";
import {grouped} from "../../core/modules/documents/web/src/libraryGroups.js";
import {WINDOW_CONTEXT} from "../kit/windowContextKey.js";
import {opening} from "../src/route.js";
import {documentWindowContext} from "./support/documentWindowContext.js";

const NOW = Date.parse("2026-10-31T12:00:00Z");
const DOCS = [
    {id: 1, title: "Cart rules", abstract: "How the cart counts money", updated_at: "2026-10-31T11:00:00Z"},
    {id: 2, title: "Release steps", abstract: "What happens before a release", updated_at: "2026-10-10T11:00:00Z"},
];
const BODY = {id: 1, title: "Cart rules", abstract: "How the cart counts money", body: "## Totals\n- in cents"};

function mounted() {
    const reads = [];
    const read = async (line) => (reads.push(line), line.startsWith("doc show") ? {ok: true, value: BODY} : {ok: true, value: {total: DOCS.length, rows: line === "document library --type doc --state open" ? DOCS : []}});
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

test("choosing a document opens it in the panel, by the mouse or by Enter", async () => {
    const {element} = mounted();
    await settled();
    element.querySelector('[data-row="1"]').click();
    await settled();
    expect(window.location.href).toContain("docs:1");
    opening([]);
    const list = element.querySelector("[data-library-list]");
    list.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowDown"}));
    list.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));
    await settled();
    expect(window.location.href).toContain("docs:2");
    opening([]);
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

