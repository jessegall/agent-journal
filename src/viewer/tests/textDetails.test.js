import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test} from "vitest";
import TextDetails from "../src/resource/TextDetails.vue";
import {movesOf} from "../src/domain/resourceKinds.js";
import {settle, typeInto as typeIn} from "./support/windowContext.js";

afterEach(() => (document.body.innerHTML = ""));


const ROW = {id: 4, title: "Cart", abstract: "How the cart counts", body: "# One\ntext\n## Two\nmore", close_reason: ""};

function details(kind = "doc") {
    const ran = [];
    const answers = {
        "doc comments 4": {rows: [{id: 1, text: "On doc 4, Cart: use cents"}]},
        "doc revisions 4": {rows: [{number: 2, change: "Totals in cents", created_at: "2026-11-01"}]},
        "doc revision 4 2": {body: "the old text"},
        "link list --source doc:4": {rows: [{id: 9, target_model: "plan", target_id: 3, link_type: "mentions"}]},
    };
    const read = async (line) => {
        ran.push(line.join(" "));
        return {ok: true, value: answers[line.join(" ")] ?? {rows: []}};
    };
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(TextDetails, {kind, id: 4, row: ROW, read})}).mount(element);
    return {element, ran};
}


test("chapters, comments, links and revisions of a document are listed", async () => {
    const {element} = details();
    await settle();
    expect([...element.querySelectorAll("[data-text-chapters] li")].map((item) => item.textContent)).toEqual(["One", "Two"]);
    expect(element.querySelector("[data-text-comment]").textContent).toContain("use cents");
    expect(element.querySelector("[data-text-link]").textContent).toContain("plan:3");
    element.querySelector('[data-text-revision="2"]').click();
    await settle();
    expect(element.querySelector("[data-text-revision-body]").textContent).toBe("the old text");
});

test("a comment is written and the list read again; a report has no revisions read", async () => {
    const {element, ran} = details();
    await settle();
    const form = element.querySelector("[data-text-comment-form]");
    typeIn(form.querySelector("input"), "Looks right");
    form.dispatchEvent(new Event("submit"));
    await settle();
    expect(ran).toContain("doc comment 4 Looks right");
    expect(ran.filter((line) => line === "doc comments 4").length).toBe(2);
    const report = details("report");
    await settle();
    expect(report.ran.some((line) => line.includes("revisions"))).toBe(false);
});

test("editing starts from the text as it is and saves abstract and body", async () => {
    const {element, ran} = details();
    await settle();
    element.querySelector("[data-text-edit]").click();
    await settle();
    const form = element.querySelector("[data-text-form]");
    expect(form.querySelector("input").value).toBe("How the cart counts");
    typeIn(form.querySelector("textarea"), "new text");
    form.dispatchEvent(new Event("submit"));
    await settle();
    expect(ran).toContain("doc edit 4 --abstract How the cart counts --body new text");
    expect(element.querySelector("[data-text-form]")).toBeNull();
});

test("an open text can be closed with a reason, a closed one cannot", () => {
    expect(movesOf("doc", {close_reason: ""}).map((move) => [move.word, move.flag])).toEqual([["close", "--why"]]);
    expect(movesOf("report", {close_reason: "It shipped"})).toEqual([]);
});
