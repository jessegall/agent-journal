import {h} from "vue";
import {afterEach, expect, test} from "vitest";
import MessageCard from "../kit/MessageCard.vue";
import TextDisplay from "../src/kit/TextDisplay.vue";
import {appended, context, mounted, settle} from "./support/windowContext.js";

afterEach(() => document.body.replaceChildren());

const message = (text) => ({id: 11, type: "agent", text, created_at: "2026-11-05T12:00:00Z", files: []});
const task = (title) => ({ok: true, value: {id: 3, title, state: "open"}});

test("a message naming an attached file draws its card from a window read", async () => {
    const window = context({"message show 7": {ok: true, value: {id: 7, text: "The cart", files: ["cart.png"]}}});
    const element = await mounted(MessageCard, window, {message: message("message 7 cart.png")});
    await settle();
    const card = element.querySelector('a.file-card[data-attached="cart.png"]');
    expect(card).not.toBeNull();
    expect(card.getAttribute("href")).toBe("/api/files/message/7/cart.png");
    expect(card.querySelector("img").getAttribute("src")).toBe("/api/files/message/7/cart.png");
    expect(window.reads).toContain("message show 7");
});

test("a row card shows the title read through its window", async () => {
    const window = context({"task show 3": task("Use integer cents")});
    const element = await mounted(TextDisplay, window, {text: "task 3"});
    await settle();
    expect(element.querySelector(".row-card-title").textContent).toBe("Use integer cents");
    expect(window.reads).toEqual(["task show 3"]);
});

test("text displays and messages share a referenced row within one window", async () => {
    const window = context({"task show 3": task("Read the row once")});
    const Both = {render: () => h("div", [h(TextDisplay, {text: "task 3"}), h(MessageCard, {message: message("task 3")})])};
    const element = await mounted(Both, window);
    await settle();
    expect([...element.querySelectorAll(".row-card-title")].map((title) => title.textContent)).toEqual(["Read the row once", "Read the row once"]);
    expect(window.reads).toEqual(["task show 3"]);
});

test("a refused row read keeps the reference label and is not repeated on render", async () => {
    const window = context({"task show 3": {ok: false, error: "This window may not read it"}});
    const element = await mounted(TextDisplay, window, {text: "task 3"});
    await settle();
    expect(element.querySelector(".row-card-title").textContent).toBe("task 3");
    expect(window.reads).toEqual(["task show 3"]);
});

test("two windows keep their own answers for the same reference", async () => {
    const first = await mounted(TextDisplay, context({"task show 3": task("First window")}), {text: "task 3"});
    const second = await mounted(TextDisplay, context({"task show 3": task("Second window")}), {text: "task 3"});
    await settle();
    expect(first.querySelector(".row-card-title").textContent).toBe("First window");
    expect(second.querySelector(".row-card-title").textContent).toBe("Second window");
});

test("a referenced row is read again when its window hears that it changed", async () => {
    const answers = {"task show 3": task("Before")};
    const window = context(answers);
    const follows = [];
    window.follow = (patterns, heard) => follows.push({patterns, heard});
    const element = await mounted(TextDisplay, window, {text: "task 3"});
    await settle();
    answers["task show 3"] = task("After");
    const followed = follows.find((entry) => entry.patterns.includes("task.*"));
    expect(followed).toBeDefined();
    followed.heard({event: "task.rename", row_id: 3});
    await settle();
    expect(element.querySelector(".row-card-title").textContent).toBe("After");
    expect(window.reads).toEqual(["task show 3", "task show 3"]);
});

test("text outside a hosted window keeps its reference label", async () => {
    const element = appended(TextDisplay, {text: "task 3"});
    await settle();
    expect(element.querySelector(".row-card-title").textContent).toBe("task 3");
});
