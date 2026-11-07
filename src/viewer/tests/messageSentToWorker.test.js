import {afterEach, expect, test} from "vitest";
import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {context, page, settle} from "./support/windowContext.js";
import MessageCard from "../kit/MessageCard.vue";
import {linkPage} from "./support/linkPages.js";

const COMMENT = {id: 9, type: "comment", text: "use the new cart", reactions: "[]", files: [], captions: "{}", created_at: "2026-11-02T10:00:00Z", commented_row: "task:1"};
let app;
let host;

afterEach(() => {
    app?.unmount();
    host?.remove();
});

// the card drawn into the document, with the links the chat reads for the message
async function card(message, links) {
    host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(MessageCard, {message})});
    app.provide(WINDOW_CONTEXT, {...context({}), read: async (line) => linkPage(links, line)});
    app.mount(host);
    await settle();
}

test("a comment that also went to a worker says so under its bubble", async () => {
    await card(COMMENT, [{link_type: "sent_to", target_model: "agent", target_id: 12}]);
    expect(host.querySelector("[data-message-sent-to]").textContent).toContain("Also sent to worker 12");
});

test("a comment that went to no worker says nothing of one", async () => {
    await card(COMMENT, [{link_type: "about", target_model: "task", target_id: 1}]);
    expect(host.querySelector("[data-message-sent-to]")).toBeNull();
});
