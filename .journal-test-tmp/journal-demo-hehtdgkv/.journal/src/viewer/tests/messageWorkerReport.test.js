import {expect, test} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import MessageCard from "../kit/MessageCard.vue";

const REPORT = {id: 4, type: "agent", worker_id: 9, text: "The cart total now adds the tax once.", reactions: "[]", files: [], captions: "{}", created_at: "2026-11-02T10:00:00Z"};
const LONG = `${"The cart total now adds the tax once and rounds to cents. ".repeat(4)}\nThe tests pass.`;

test("a worker's report is a bubble headed with the worker, which opens it", async () => {
    const element = await mounted(MessageCard, context({}), {message: REPORT});
    expect(element.querySelector("[data-message]")).not.toBeNull();
    expect(element.querySelector("[data-message-worker]").textContent).toBe("Worker 9");
    expect(element.querySelector("[data-message-text]").textContent).toContain("adds the tax once");
});

test("a short report is whole and has no Show more", async () => {
    const element = await mounted(MessageCard, context({}), {message: REPORT});
    expect(element.querySelector("[data-message-text]").classList.contains("message-folded")).toBe(false);
    expect(element.querySelector("[data-message-more]")).toBeNull();
});

test("a long report is folded to two lines until Show more opens it, and Show less folds it again", async () => {
    const element = await mounted(MessageCard, context({}), {message: {...REPORT, text: LONG}});
    expect(element.querySelector("[data-message-text]").classList.contains("message-folded")).toBe(true);
    const more = element.querySelector("[data-message-more]");
    expect(more.textContent).toBe("Show more");
    more.click();
    await settle();
    expect(element.querySelector("[data-message-text]").classList.contains("message-folded")).toBe(false);
    expect(element.querySelector("[data-message-more]").textContent).toBe("Show less");
    element.querySelector("[data-message-more]").click();
    await settle();
    expect(element.querySelector("[data-message-text]").classList.contains("message-folded")).toBe(true);
});

test("a message of no worker has no worker header and is not folded", async () => {
    const element = await mounted(MessageCard, context({}), {message: {...REPORT, worker_id: null, text: LONG}});
    expect(element.querySelector("[data-message-worker]")).toBeNull();
    expect(element.querySelector("[data-message-more]")).toBeNull();
});
