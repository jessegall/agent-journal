import {afterEach, expect, test} from "vitest";
import {mounted, settle} from "./support/windowContext.js";
import {documentWindowContext as context} from "./support/documentWindowContext.js";
import DocumentLibrary from "../../core/modules/documents/web/src/DocumentLibrary.vue";

afterEach(() => (document.body.innerHTML = ""));

const row = (id, title) => ({id, title, abstract: `About ${title}`, updated_at: "2026-11-01T10:00:00Z"});

async function drawn() {
    const ran = [];
    const window = context({"document library": {ok: true, value: {rows: [row(2, "Totals"), row(1, "Cart")], total: 2}}, "doc show": {ok: true, value: {id: 2, title: "Totals", body: "text"}}});
    window.run = async (line) => (ran.push(line), {ok: true, value: {}});
    return {element: await mounted(DocumentLibrary, window), ran};
}

test("a new document is made with its title, abstract and text", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-library-new]").click();
    await settle();
    const form = element.querySelector("[data-library-draft]");
    const fields = form.querySelectorAll("input, textarea");
    for (const [index, words] of ["Tax", "How tax works", "The rules"].entries()) {
        fields[index].value = words;
        fields[index].dispatchEvent(new Event("input"));
    }
    await settle();
    form.dispatchEvent(new Event("submit", {cancelable: true}));
    await settle();
    expect(ran).toContainEqual(["doc", "make", "Tax", "--abstract", "How tax works", "--body", "The rules"]);
});

test("the arrows walk the documents and escape closes the one open", async () => {
    const {element} = await drawn();
    const list = element.querySelector("[data-library-list]");
    list.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowDown", bubbles: true}));
    await settle();
    expect(element.querySelector(".library-row.chosen")).not.toBeNull();
    list.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape", bubbles: true}));
    await settle();
    expect(element.querySelector(".library-row.chosen")).toBeNull();
});
