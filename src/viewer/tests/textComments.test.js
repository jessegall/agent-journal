import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test} from "vitest";
import CommentSide from "../src/resource/CommentSide.vue";
import QuickCommentBar from "../src/kit/QuickCommentBar.vue";
import {useTextComments} from "../src/composables/textComments.js";
import {settle} from "./support/windowContext.js";

afterEach(() => (document.body.innerHTML = ""));

const SOURCE = () => ({noun: "doc", id: 4, title: "Cart"});

function mountedComments(answer, readPage = null) {
    const ran = [];
    const rows = [{id: 1, text: "On doc 4, Cart: use cents"}];
    const read = async (line) => {
        ran.push(line.join(" "));
        if (line[1] === "comment") return answer(line);
        if (readPage) return readPage(line);
        return {ok: true, value: {rows: [...rows]}};
    };
    let comments;
    const element = document.createElement("div");
    document.body.append(element);
    createApp({
        setup() {
            comments = useTextComments(SOURCE, read);
            return () => h("div", [
                h(QuickCommentBar, {send: comments.send, count: comments.comments.value.length, onShow: () => (comments.open.value = !comments.open.value)}),
                comments.open.value ? h(CommentSide, {comments: comments.comments.value, words: comments.words,
                    more: Boolean(comments.nextPage?.value), loading: comments.loading?.value, failure: comments.failure?.value, onMore: comments.loadMore}) : null,
            ]);
        },
    }).mount(element);
    return {element, ran, rows, comments: () => comments};
}

async function write(element, text) {
    element.querySelector(".comment-bar-open").click();
    await nextTick();
    const box = element.querySelector("textarea");
    box.value = text;
    box.dispatchEvent(new Event("input"));
    await nextTick();
    box.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));
}

test("the bar counts the comments and shows them under the document's words alone", async () => {
    const {element} = mountedComments(() => ({ok: true}));
    await settle();
    expect(element.querySelector(".count").textContent).toContain("1 comment");
    expect(element.querySelector("[data-comment-side]")).toBeNull();
    element.querySelector(".count").click();
    await settle();
    expect(element.querySelector("[data-comment]").textContent).toBe("use cents");
});

test("sending opens the sidebar at once with the comment in it, before the server answers", async () => {
    let answered;
    const {element, ran, rows} = mountedComments(() => new Promise((resolve) => (answered = resolve)));
    await settle();
    await write(element, "Looks right");
    await nextTick();
    expect([...element.querySelectorAll("[data-comment]")].map((row) => row.textContent)).toEqual(["use cents", "Looks right"]);
    rows.push({id: 2, text: "On doc 4, Cart: Looks right"});
    answered({ok: true});
    await settle();
    expect(ran).toContain("doc comment 4 Looks right");
    expect([...element.querySelectorAll("[data-comment]")].map((row) => row.textContent)).toEqual(["use cents", "Looks right"]);
});

test("a refused comment comes off the sidebar and its words stay in the box", async () => {
    const {element} = mountedComments(() => ({ok: false, error: "no"}));
    await settle();
    await write(element, "Looks right");
    await settle();
    expect([...element.querySelectorAll("[data-comment]")].map((row) => row.textContent)).toEqual(["use cents"]);
    expect(element.querySelector("textarea").value).toBe("Looks right");
    expect(element.querySelector(".error").textContent).toBe("no");
});

test("task 6894: comment pages keep selection details and each comment once", async () => {
    const first = {id: 1, text: "On doc 4, Cart: first", body: "First body", quote: "cents", revision: 2};
    const second = {id: 2, text: "Second body", body: "Second body"};
    const {element, ran, comments} = mountedComments(() => ({ok: true}), (line) => {
        const next = line[line.indexOf("--page") + 1] === "2";
        return {ok: true, value: {rows: next ? [first, second] : [first], total: 2, next_page: next ? null : 2}};
    });
    await settle();
    comments().open.value = true;
    await settle();
    expect(element.querySelector("blockquote").textContent).toBe("cents");
    expect(element.textContent).toContain("Revision 2");
    element.querySelector("[data-page-more]").click();
    await settle();
    expect([...element.querySelectorAll("[data-comment]")].map((node) => node.textContent)).toEqual(["First body", "Second body"]);
    expect(ran.some((line) => line.includes("--page 2 --page-size"))).toBe(true);
});

test("task 6894: comment read failures remain visible", async () => {
    const {element, comments} = mountedComments(() => ({ok: true}), () => ({ok: false, error: "Comments could not be read"}));
    await settle();
    comments().open.value = true;
    await settle();
    expect(element.querySelector("[role=alert]")?.textContent).toContain("Comments could not be read");
    expect(element.textContent).not.toContain("No comments yet");
});
