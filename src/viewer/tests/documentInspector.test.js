import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import DocumentBody from "../src/resource/document/DocumentBody.vue";
import {drawMarks, numbered, selectionIn} from "../src/resource/document/documentMarks.js";
import {settle, typeInto} from "./support/windowContext.js";

afterEach(() => (document.body.innerHTML = ""));

const BODY = "# One\nThe total is in cents.\n\n```python\ndef total():\n    return 1\n```\n\n| Point | Where |\n|---|---|\n| Tax | cart.py |\n";
const ROW = {id: 4, title: "Cart", abstract: "How the cart counts", body: BODY, close_reason: "", created_at: "2026-11-01T10:00:00Z", updated_at: "2026-11-01T10:00:00Z", revision: 2, open_author_id: 42};
const onWords = {id: 7, body: "Why cents?", quote: "in cents", position: 16, selection_type: "text", created_at: "2026-11-01T10:00:00Z"};
const whole = {id: 8, body: "Good plan", quote: "", position: null, selection_type: "", created_at: "2026-11-01T10:00:00Z"};

Element.prototype.scrollIntoView = () => {};

globalThis.ResizeObserver ??= class {
    observe() {}
    disconnect() {}
};

function drawn(comments = [onWords, whole], width = 980) {
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(width);
    const ran = [];
    const read = async (line) => {
        ran.push(line);
        if (line[1] === "inspect") return {ok: true, value: {...ROW, comments}};
        if (line[1] === "comments") return {ok: true, value: {rows: comments, total: comments.length}};
        if (line[1] === "comment" && line.at(-1) === "no") return {ok: false, error: "refused"};
        if (line[0] === "link") return {ok: true, value: {rows: [], counterparts: [{endpoint: {model: "plan", id: 3, title: "plan:3", exists: true, unavailable: false, open_ref: "plans:3"}, relations: ["mentions"], link_ids: [1]}], total: 1}};
        if (line[1] === "revisions") return {ok: true, value: {rows: [{number: 2, change: "Totals", author_name: "Lady Lovelace", created_at: "2026-11-01"}, {number: 1, change: "First", author_name: "Unknown", created_at: "2026-10-31"}]}};
        if (line[1] === "revision") return {ok: true, value: {body: "the old text"}};
        return {ok: true, value: {rows: []}};
    };
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(DocumentBody, {noun: "doc", id: 4, read})}).mount(element);
    return {element, ran};
}

test("the body holds Edit above its tabs, and the comment box stays at the foot", async () => {
    const {element} = drawn();
    await settle();
    const actions = element.querySelector("[data-document-actions]");
    expect(element.querySelector("[data-comment-input]")).not.toBeNull();
    expect(actions.textContent).toContain("Edit");
    expect(actions.textContent).not.toContain("Close");
    expect(actions.compareDocumentPosition(element.querySelector("[data-document-tab]")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(element.querySelector("[data-resource-close]")).toBeNull();
});

test("a comment on a selection is tinted with its number and its card shows the words it is on", async () => {
    const {element} = drawn();
    await settle();
    const mark = element.querySelector('[data-resource-text] mark[data-comment="7"]');
    expect(mark.textContent).toContain("in cents");
    expect(mark.querySelector("[data-comment-number]").textContent).toBe("1");
    const card = element.querySelector('[data-comment-id="7"]');
    expect(card.querySelector("[data-comment-quote]").textContent).toBe("in cents");
    expect(card.querySelector("[data-comment]").textContent).toBe("Why cents?");
    expect(element.querySelector('[data-comment-id="8"] [data-comment-quote]')).toBeNull();
});

test("the number leads to the comment and the comment leads to its selection, both lit", async () => {
    const {element} = drawn();
    await settle();
    element.querySelector("[data-comment-number]").click();
    await settle();
    expect(element.querySelector('[data-comment-id="7"]').classList.contains("hot")).toBe(true);
    expect(element.querySelector('mark[data-comment="7"]').classList.contains("hot")).toBe(true);
    const show = vi.fn();
    element.querySelector('mark[data-comment="7"]').scrollIntoView = show;
    element.querySelector("[data-comment-show]").click();
    await settle();
    expect(element.querySelector('mark[data-comment="7"]')).not.toBeNull();
});

test("a comment is sent with its selection, and with none it is on the whole document", async () => {
    const {element, ran} = drawn([]);
    await settle();
    const box = element.querySelector("[data-comment-input]");
    typeInto(box, "Good");
    await settle();
    element.querySelector("[data-comment-send]").click();
    await settle();
    expect(ran).toContainEqual(["doc", "comment", "4", "--", "Good"]);
});

test("a refused comment keeps its words and says why", async () => {
    const {element} = drawn([]);
    await settle();
    typeInto(element.querySelector("[data-comment-input]"), "no");
    await settle();
    element.querySelector("[data-comment-send]").click();
    await settle();
    expect(element.querySelector("[data-comment-input]").value).toBe("no");
    expect(element.querySelector("[data-comment-box] [role=alert]").textContent).toBe("refused");
});

test("under 760 wide the margin goes and Comments is a tab", async () => {
    const {element} = drawn([onWords], 500);
    await settle();
    expect(element.querySelector("[data-comment-rail]")).toBeNull();
    element.querySelector('[data-document-tab="comments"]').click();
    await settle();
    expect(element.querySelector("[data-comment-rail]")).not.toBeNull();
    expect(element.querySelector("[data-resource-text]")).toBeNull();
});

test("under 760 wide the number opens its comment under its selection", async () => {
    const {element} = drawn([onWords], 500);
    await settle();
    element.querySelector("[data-comment-number]").click();
    await settle();
    expect(element.querySelector(".inline-comment [data-comment]").textContent).toBe("Why cents?");
});

test("revisions are a tab, and a revision opens its text", async () => {
    const {element} = drawn();
    await settle();
    element.querySelector('[data-document-tab="revisions"]').click();
    await settle();
    element.querySelector('[data-text-revision="2"]').click();
    await settle();
    expect(element.querySelector("[data-text-revision-diff]").textContent).toContain("the old text");
});

test("each revision names its author and date, including an unknown old author", async () => {
    const {element} = drawn();
    await settle();
    element.querySelector('[data-document-tab="revisions"]').click();
    await settle();
    expect(element.querySelector('[data-text-revision="2"]').textContent).toContain("Lady Lovelace");
    expect(element.querySelector('[data-text-revision="2"]').textContent).toContain("2026-11-01");
    expect(element.querySelector('[data-text-revision="1"]').textContent).toContain("Unknown");
});

test("a person can close the agent's open revision from the inspector", async () => {
    const {element, ran} = drawn();
    await settle();
    element.querySelector('[data-document-tab="revisions"]').click();
    await settle();
    element.querySelector('[data-close-revision]').click();
    await settle();
    expect(ran).toContainEqual(['doc', 'close', '4']);
});

test("editing starts from the text as it is and saves abstract and body", async () => {
    const {element, ran} = drawn();
    await settle();
    element.querySelector("[data-text-edit]").click();
    await settle();
    const form = document.body.querySelector("[data-text-form]");
    expect(form.querySelector("input").value).toBe("How the cart counts");
    typeInto(form.querySelector("textarea"), "new text");
    await settle();
    document.body.querySelector("[data-text-save]").click();
    await settle();
    expect(ran).toContainEqual(["doc", "edit", "4", "--abstract", "How the cart counts", "--body", "new text"]);
});

test("a code block and a table scroll by themselves in the document's styles", async () => {
    const {element} = drawn([]);
    await settle();
    expect(element.querySelector(".chat-code-block").dataset.language).toBe("python");
    expect(element.querySelectorAll(".code-line")).toHaveLength(2);
    expect(element.querySelector(".tok-keyword").textContent).toBe("def");
});

test("the text is not drawn again while a selection is being made, so the selection stays where it started", async () => {
    Range.prototype.getBoundingClientRect = () => ({left: 0, top: 0});
    const {element} = drawn([onWords]);
    await settle();
    const paragraph = element.querySelector("[data-resource-text] p");
    const range = document.createRange();
    range.setStart(paragraph.firstChild, 0);
    range.setEnd(paragraph.firstChild, 3);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.dispatchEvent(new Event("selectionchange"));
    await settle();
    expect(element.querySelector("[data-resource-text] p")).toBe(paragraph);
    expect(element.querySelector("[data-comment-on]").textContent).toContain("The");
    window.getSelection().removeAllRanges();
    document.dispatchEvent(new Event("selectionchange"));
    await settle();
    expect(element.querySelector("[data-resource-text] p")).not.toBe(paragraph);
});

function words(html) {
    const root = document.createElement("div");
    root.innerHTML = html;
    document.body.append(root);
    return root;
}

test("a selection's place is counted in the shown text, without buttons", () => {
    const root = words('<p>One two <button>Copy</button>three</p>');
    const range = document.createRange();
    range.setStart(root.querySelector("p").lastChild, 0);
    range.setEnd(root.querySelector("p").lastChild, 5);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    expect(selectionIn(root)).toEqual({quote: "three", position: 8, selection_type: "text"});
});

test("words that have moved are found at their nearest place, and gone words are lost", () => {
    const repeated = words("<p>cat dog cat</p>");
    expect(drawMarks(repeated, [{id: 4, quote: "cat", position: 9, selection_type: "text", number: 1}])).toEqual([]);
    expect(repeated.querySelector("mark").previousSibling.textContent).toBe("cat dog ");
    const root = words("<p>cat dog</p>");
    expect(drawMarks(root, [{id: 3, quote: "bird", position: 0, selection_type: "text", number: 1}])).toEqual([3]);
});

test("a table row and a line of code are tinted whole", () => {
    const root = words('<table><tr><td>Tax</td><td>cart</td></tr></table><pre><code><span class="code-line">one\n</span><span class="code-line">two\n</span></code></pre>');
    drawMarks(root, [{id: 1, quote: "Tax", position: 0, selection_type: "row", number: 1}, {id: 2, quote: "two", position: 11, selection_type: "code", number: 2}]);
    expect(root.querySelector("tr").classList.contains("selection-comment")).toBe(true);
    expect(root.querySelectorAll(".code-line")[1].classList.contains("selection-comment")).toBe(true);
    expect(root.querySelectorAll(".code-line")[0].classList.contains("selection-comment")).toBe(false);
});

test("comments are numbered in the order of their place, one on the whole document has no number", () => {
    const list = numbered([{id: 1, quote: "b", position: 9}, {id: 2, quote: "", position: null}, {id: 3, quote: "a", position: 2}]);
    expect(list.map((comment) => [comment.id, comment.number])).toEqual([[2, undefined], [3, 1], [1, 2]]);
});
