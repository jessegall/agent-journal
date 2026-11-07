import {expect, test} from "vitest";
import {context as baseContext, mounted as mount, settle as tick} from "./support/windowContext.js";
import Attachments from "../../core/modules/messages/web/src/Attachments.vue";

const KEYS = {attachments: {line: "attachment list"}};
const context = (answers) => baseContext(answers, null, KEYS);
async function settle() {
    await tick();
    await new Promise((resolve) => setTimeout(resolve, 80));
    await tick();
}
async function mounted(component, window) {
    const element = await mount(component, window);
    await settle();
    return element;
}

const IMAGE = {message_id: 2, name: "cart.png", message_text: "the cart", created_at: "2026-11-01T10:00:00Z", is_image: true};
const FILE = {message_id: 1, name: "notes.txt", message_text: "notes", created_at: "2026-11-01T09:00:00Z", is_image: false};
const counts = {all: 2, images: 1, other: 1};

test("images draw as tiles and other files as rows, with the counts on the types and more to load", async () => {
    const window = context({"attachment list": {ok: true, value: {rows: [IMAGE, FILE], counts, is_last_page: false}}});
    const element = await mounted(Attachments, window);
    expect(element.querySelector("[data-attachment-image] img").getAttribute("src")).toBe("/api/files/message/2/cart.png");
    expect(element.querySelector("[data-attachment-file]").textContent).toContain("notes.txt");
    expect(element.textContent).toContain("Images 1");
    element.querySelector("[data-attachment-more]").click();
    await settle();
    expect(window.reads).toContain("attachment list --category all --skip 2");
});

test("choosing a type reads that type", async () => {
    const window = context({"attachment list": {ok: true, value: {rows: [FILE], counts, is_last_page: true}}});
    const element = await mounted(Attachments, window);
    [...element.querySelectorAll(".segmented-option")].find((option) => option.textContent.includes("Other")).click();
    await settle();
    await new Promise((resolve) => setTimeout(resolve, 5));
    expect(window.reads).toContain("attachment list --category other --skip 0");
});

test("nothing stored says so", async () => {
    const element = await mounted(Attachments, context({"attachment list": {ok: true, value: {rows: [], counts: {all: 0, images: 0, other: 0}, is_last_page: true}}}));
    expect(element.textContent).toContain("Files attached to messages in this environment appear here.");
});
