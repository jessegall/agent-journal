import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import DocumentBody from "../src/resource/document/DocumentBody.vue";
import {settle} from "./support/windowContext.js";

const apps = [];
afterEach(() => {
    apps.splice(0).forEach((app) => app.unmount());
    vi.restoreAllMocks();
    document.body.innerHTML = "";
});

async function inspector(width = 980) {
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(width);
    const questions = [
        {id: 7, text: "Why cents?", quote: "in cents", position: 13, selection_type: "text", state: "open", options: ["Keep cents"], recommended: "Keep cents", answer: ""},
        {id: 8, text: "Keep the total?", quote: "The total", position: 0, selection_type: "text", state: "answered", options: [], answer: "Yes"},
    ];
    const ran = [];
    const read = async (line) => {
        ran.push(line);
        if (line[1] === "inspect") return {ok: true, value: {id: 4, title: "Cart", body: "The total is in cents.", abstract: "Cart totals"}};
        if (line[1] === "comments") return {ok: true, value: {rows: [{id: 7, body: "A comment", quote: "total", position: 4, selection_type: "text"}], total: 1}};
        if (line[0] === "question" && line[1] === "list") return {ok: true, value: {rows: questions.map((row) => ({...row}))}};
        if (line[0] === "question" && line[1] === "answer") {
            Object.assign(questions.find((row) => row.id === Number(line[2])), {state: "answered", answer: line[4]});
            return {ok: true};
        }
        return {ok: true, value: {rows: []}};
    };
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(DocumentBody, {term: "doc", id: 4, read})});
    apps.push(app);
    app.mount(element);
    await settle();
    return {element, ran};
}

test("the sidebar switches to open and answered questions and scrolls to their quotes", async () => {
    const show = vi.fn();
    Element.prototype.scrollIntoView = show;
    const {element, ran} = await inspector();
    expect(element.querySelector("[data-comment-rail]").textContent).toContain("A comment");
    element.querySelector('[data-document-notes="questions"]').click();
    await settle();
    expect(element.querySelector("[data-question-rail]").textContent).toContain("Why cents?");
    expect(element.querySelector("[data-question-rail]").textContent).toContain("Answered: Yes");
    expect(element.querySelector('[data-comment-number="7"]').getAttribute("aria-label")).toContain("Question");
    expect(ran).toContainEqual(["question", "list", "--all", "--row", "doc:4"]);
    element.querySelector('[data-question-show="7"]').click();
    await settle();
    expect(show).toHaveBeenCalled();
    expect(show.mock.contexts.at(-1).dataset.comment).toBe("7");
    expect(element.querySelector('mark[data-comment="7"]').textContent).toContain("in cents");
    element.querySelector('[data-document-notes="comments"]').click();
    await settle();
    expect(element.querySelector("[data-comment-rail]").textContent).toContain("A comment");
});

test("the narrow questions sidebar returns to text when a question is selected", async () => {
    Element.prototype.scrollIntoView = vi.fn();
    const {element} = await inspector(500);
    element.querySelector('[data-document-tab="comments"]').click();
    await settle();
    element.querySelector('[data-document-notes="questions"]').click();
    await settle();
    element.querySelector('[data-question-show="7"]').click();
    await settle();
    expect(element.querySelector("[data-resource-text]")).not.toBeNull();
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
});
