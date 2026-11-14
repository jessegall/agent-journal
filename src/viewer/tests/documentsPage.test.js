import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {placeUnder} from "../kit/vContext.js";
import {menuEntries} from "../src/composables/contextMenu.js";
import {mounted, settle, typeInto, unmountAll} from "./support/windowContext.js";
import {documentWindowContext} from "./support/documentWindowContext.js";
import DocumentsPage from "../../core/modules/documents/web/src/documents.js";
import DocumentPage from "../../core/modules/documents/web/src/document-page.js";

const DOCS = [
    {id: 1, title: "Cart rules", abstract: "How the cart counts money", updated_at: "2026-10-31T11:00:00Z", close_reason: ""},
    {id: 2, title: "Release steps", abstract: "What happens before a release", updated_at: "2026-10-10T11:00:00Z", close_reason: ""},
];
const REPORTS = [{id: 7, title: "Review of the cart", abstract: "What the review found", updated_at: "2026-10-30T11:00:00Z", close_reason: ""}];
const CLOSED = [{id: 3, title: "Old design", abstract: "No longer needed", updated_at: "2026-09-01T11:00:00Z", close_reason: "Done another way"}];
const BODY = {id: 1, title: "Cart rules", abstract: "How the cart counts money", body: "## Totals\n- in cents", close_reason: ""};

beforeEach(() => {
    vi.stubGlobal("ResizeObserver", class {observe() {} disconnect() {}});
    location.hash = "";
});
afterEach(() => {
    unmountAll();
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

async function drawn(component = DocumentPage) {
    const reads = [];
    const ran = [];
    const window = documentWindowContext({});
    window.read = async (words) => {
        const line = Array.isArray(words) ? words.join(" ") : words;
        reads.push(line);
        if (line.startsWith("document library")) {
            const rows = line.includes("--type report") ? REPORTS : line.includes("--state closed") ? CLOSED : DOCS;
            return {ok: true, value: {total: rows.length, rows}};
        }
        if (line.startsWith("doc inspect") || line.startsWith("report inspect")) return {ok: true, value: BODY};
        if (line.startsWith("doc revisions")) return {ok: true, value: {rows: [{number: 2, change: "Added a heading", author_name: "Ada", created_at: "2026-10-31T10:00:00Z"}, {number: 1, change: "First text", author_name: "Ada", created_at: "2026-10-30T10:00:00Z"}]}};
        return {ok: true, value: {rows: [], total: 0}};
    };
    window.run = async (line) => (ran.push(line), {ok: true, value: {}});
    window.follow = () => () => {};
    const element = await mounted(component, window);
    document.body.append(element);
    await settle();
    return {element, reads, ran};
}
const rowOf = (element, id) => element.querySelector(`[data-row="${id}"]`);
const texts = (element, selector) => [...element.querySelectorAll(selector)].map((found) => found.textContent.trim());
const choose = async (element, id) => {
    rowOf(element, id).click();
    await settle();
    await settle();
};
const pickSeg = async (element, group, label) => {
    [...element.querySelectorAll(`[${group}] button`)].find((button) => button.textContent.trim() === label).click();
    await settle();
};
const itemButton = (label) => [...document.body.querySelectorAll("[data-menu-item]")].find((item) => item.textContent.trim() === label);

test("test_documents_reports_seg: the page lists the documents, and the Reports switch reads the reports", async () => {
    const {element, reads} = await drawn();
    expect(reads[0]).toBe("document library --type doc --state open");
    expect(texts(element, ".list-row-title")).toEqual(["1 Cart rules", "2 Release steps"]);
    expect(element.textContent).not.toMatch(/Document \d/);
    await pickSeg(element, "data-documents-term", "Reports");
    expect(reads.at(-1)).toBe("document library --type report --state open");
    expect(texts(element, ".list-row-title")).toEqual(["7 Review of the cart"]);
});

test("test_open_closed_seg: the Closed switch reads the closed texts, and a closed text cannot be marked as needing no action", async () => {
    const {element, reads} = await drawn();
    await pickSeg(element, "data-documents-state", "Closed");
    expect(reads.at(-1)).toBe("document library --type doc --state closed");
    expect(texts(element, ".list-row-title")).toEqual(["3 Old design"]);
    expect(menuEntries(placeUnder(rowOf(element, 3)).items).map((entry) => entry.label)).not.toContain("Mark as needing no action");
});

test("test_reader_tabs: a chosen text has the Text, Revisions and Links tabs, and a report has no Revisions", async () => {
    const {element, reads} = await drawn();
    await choose(element, 1);
    expect(texts(element, "[data-tab]")).toEqual(["Text", "Revisions", "Links"]);
    expect(reads).toContain("doc inspect 1");
    element.querySelector('[data-tab="revisions"]').click();
    await settle();
    await settle();
    expect(texts(element, "[data-reader-timeline] li")[0]).toContain("Revision 2: Added a heading");
    element.querySelector('[data-tab="links"]').click();
    await settle();
    expect(reads.some((line) => line.startsWith("link list"))).toBe(true);
    await pickSeg(element, "data-documents-term", "Reports");
    await choose(element, 7);
    expect(texts(element, "[data-tab]")).toEqual(["Text", "Links"]);
});

test("test_menu_has_no_delete: a right click has Open, Open in the inspector, Copy the command, Edit the text and Mark as needing no action, and no Duplicate and no Delete", async () => {
    const {element, ran} = await drawn();
    const labels = menuEntries(placeUnder(rowOf(element, 1)).items).filter((entry) => !entry.separator).map((entry) => entry.label);
    expect(labels).toEqual(["Open", "Open in the inspector", "Copy the command", "Edit the text", "Mark as needing no action"]);
    expect(labels.join()).not.toMatch(/delete|duplicate/i);
    menuEntries(placeUnder(rowOf(element, 1)).items).find((entry) => entry.label === "Edit the text").run({say: () => {}});
    await settle();
    await settle();
    typeInto(document.body.querySelector('[data-field="abstract"]'), "How the cart counts cents");
    await settle();
    document.body.querySelector("[data-create-send]").click();
    await settle();
    expect(ran).toContainEqual(["doc", "edit", "1", "--abstract", "How the cart counts cents", "--body", "## Totals\n- in cents"]);
    await choose(element, 1);
    element.querySelector("[data-actions-menu]").click();
    await settle();
    itemButton("Mark as needing no action").click();
    await settle();
    await settle();
    typeInto(document.body.querySelector('[data-field="why"]'), "Done another way");
    await settle();
    document.body.querySelector("[data-create-send]").click();
    await settle();
    expect(ran).toContainEqual(["doc", "close", "1", "--why", "Done another way"]);
});

test("the documents window stays a list that opens a row in the inspector", async () => {
    const {element} = await drawn(DocumentsPage);
    expect(element.querySelector("[data-library-list]")).not.toBeNull();
    expect(element.querySelector("[data-reader-list]")).toBeNull();
});
