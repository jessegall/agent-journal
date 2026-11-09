import {afterEach, expect, test} from "vitest";
import {mountedMessageCard} from "./support/mountedMessageCard.js";

const REPLY = {id: 4, type: "agent", text: "On it", parent_id: 3, reactions: "[]", files: [], captions: "{}", created_at: "2026-11-02T10:00:00Z"};
const QUOTED = "Fix the cart total\n\nThen check the tax, and tell me which rate it used.";
let shown;

afterEach(() => shown?.unmount());

test("the quote above a reply shows the first line of a message of several paragraphs", async () => {
    shown = await mountedMessageCard({message: REPLY, quote: QUOTED});
    const quote = shown.host.querySelector(".message-quote");
    expect(quote.textContent.trim()).toBe("Fix the cart total");
    expect(quote.querySelectorAll("p")).toHaveLength(1);
});

test("a quote that starts with blank lines shows its first line with text", async () => {
    shown = await mountedMessageCard({message: REPLY, quote: "\n\n  Which one?\nThe second"});
    expect(shown.host.querySelector(".message-quote").textContent.trim()).toBe("Which one?");
});

test("the reply keeps its own whole text under the quote", async () => {
    shown = await mountedMessageCard({message: REPLY, quote: QUOTED});
    expect(shown.host.querySelector(".message-card").textContent).toContain("On it");
});
