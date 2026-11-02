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

// the card drawn into the document, with what it asks the chat to comment on
async function card(message) {
    const asked = [];
    host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(MessageCard, {message, onComment: (row) => asked.push(row.id)})});
    app.provide(WINDOW_CONTEXT, context({}));
    app.mount(host);
    await settle();
    return asked;
}

test("a message sent to a worker has a comment button, which hands the message to the chat's composer", async () => {
    const asked = await card(MESSAGE);
    host.querySelector("[data-growing-comment]").click();
    await settle();
    expect(asked).toEqual([7]);
    expect(host.querySelector("textarea")).toBeNull();
});

test("a message from another agent has the comment button as well", async () => {
    await card({...MESSAGE, recipient: "", peer: "shop-e6"});
    expect(host.querySelector("[data-growing-comment]")).not.toBeNull();
});

test("an ordinary message bubble has no comment button on the card", async () => {
    await card({...MESSAGE, type: "agent", recipient: ""});
    expect(host.querySelector("[data-growing-comment]")).toBeNull();
});
