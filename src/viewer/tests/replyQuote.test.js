import {afterEach, expect, test} from "vitest";
import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {context, settle} from "./support/windowContext.js";
import MessageCard from "../kit/MessageCard.vue";

const REPLY = {id: 4, type: "agent", text: "On it", parent_id: 3, reactions: "[]", files: [], captions: "{}", created_at: "2026-11-02T10:00:00Z"};
const QUOTED = "Fix the cart total\n\nThen check the tax, and tell me which rate it used.";
let app;
let host;

afterEach(() => {
    app?.unmount();
    host?.remove();
});

async function card(quote) {
    host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(MessageCard, {message: REPLY, quote})});
    app.provide(WINDOW_CONTEXT, context({}));
    app.mount(host);
    await settle();
}

test("the quote above a reply shows the first line of a message of several paragraphs", async () => {
    await card(QUOTED);
    const quote = host.querySelector(".message-quote");
    expect(quote.textContent.trim()).toBe("Fix the cart total");
    expect(quote.querySelectorAll("p")).toHaveLength(1);
});

test("a quote that starts with blank lines shows its first line with text", async () => {
    await card("\n\n  Which one?\nThe second");
    expect(host.querySelector(".message-quote").textContent.trim()).toBe("Which one?");
});

test("the reply keeps its own whole text under the quote", async () => {
    await card(QUOTED);
    expect(host.querySelector(".message-card").textContent).toContain("On it");
});
