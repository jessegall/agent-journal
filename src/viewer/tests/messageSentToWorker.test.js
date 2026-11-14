import {afterEach, expect, test} from "vitest";
import {context} from "./support/windowContext.js";
import {mountedMessageCard} from "./support/mountedMessageCard.js";
import {linkPage} from "./support/linkPages.js";

const COMMENT = {id: 9, type: "comment", text: "use the new cart", reactions: "[]", files: [], captions: "{}", created_at: "2026-11-02T10:00:00Z", commented_row: "task:1"};
let shown;

afterEach(() => shown?.unmount());

// the card drawn with the links the chat reads for the message
async function cardWithLinks(links) {
    shown = await mountedMessageCard({message: COMMENT}, {...context({}), read: async (line) => linkPage(links, line)});
    return shown.host;
}

test("a comment that also went to a worker says so under its bubble", async () => {
    const host = await cardWithLinks([{link_type: "sent_to", target_model: "agent", target_id: 12}]);
    expect(host.querySelector("[data-message-sent-to]").textContent).toContain("Also sent to worker 12");
});

test("a comment that went to no worker says nothing of one", async () => {
    const host = await cardWithLinks([{link_type: "about", target_model: "task", target_id: 1}]);
    expect(host.querySelector("[data-message-sent-to]")).toBeNull();
});
