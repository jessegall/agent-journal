import {afterEach, expect, test} from "vitest";
import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {context, settle} from "./support/windowContext.js";
import MessageCard from "../kit/MessageCard.vue";

const MESSAGE = {id: 7, type: "peer", text: "Check 138 failed", reactions: "[]", files: [], captions: "{}", created_at: "2026-11-02T10:00:00Z", recipient: "worker 12"};
let app;
let host;

afterEach(() => {
    app?.unmount();
    host?.remove();
});

// the card drawn into the document, with a window that answers the comment line as the test says
async function card(message, answer = {ok: true, value: null}) {
    const lines = [];
    host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(MessageCard, {message})});
    app.provide(WINDOW_CONTEXT, {...context({}), run: async (line) => (lines.push(line), answer)});
    app.mount(host);
    await settle();
    return lines;
}

async function comment(words) {
    host.querySelector("[data-growing-comment]").click();
    await settle();
    const box = host.querySelector("[data-growing-comment-bar] textarea");
    box.value = words;
    box.dispatchEvent(new Event("input"));
    box.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));
    await settle();
}

test("a message sent to a worker has a comment button, which opens a box for the comment", async () => {
    await card(MESSAGE);
    expect(host.querySelector("[data-growing-comment]")).not.toBeNull();
    expect(host.querySelector("[data-growing-comment-bar]")).toBeNull();
    host.querySelector("[data-growing-comment]").click();
    await settle();
    expect(host.querySelector("[data-growing-comment-bar] textarea")).not.toBeNull();
});

test("a message from another agent has the comment button as well", async () => {
    await card({...MESSAGE, recipient: "", peer: "shop-e6"});
    expect(host.querySelector("[data-growing-comment]")).not.toBeNull();
});

test("the comment goes as the comment of any row goes: message comment, the message's number and the words", async () => {
    const lines = await card(MESSAGE);
    await comment("Check the cart too");
    expect(lines).toEqual([["message", "comment", "7", "Check the cart too"]]);
    expect(host.querySelector("[data-growing-comment-bar]")).toBeNull();
});

test("a comment the journal refuses stays in the box with the reason", async () => {
    await card(MESSAGE, {ok: false, error: "give the comment's text"});
    await comment("Check the cart too");
    expect(host.querySelector("[data-growing-comment-bar] textarea").value).toBe("Check the cart too");
    expect(host.querySelector("[data-growing-comment-bar]").textContent).toContain("give the comment's text");
});

test("an ordinary message bubble has no comment button on the card", async () => {
    await card({...MESSAGE, type: "agent", recipient: ""});
    expect(host.querySelector("[data-growing-comment]")).toBeNull();
});
