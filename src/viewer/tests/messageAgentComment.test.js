import {afterEach, expect, test} from "vitest";
import {settle} from "./support/windowContext.js";
import {mountedMessageCard} from "./support/mountedMessageCard.js";

const MESSAGE = {id: 7, type: "peer", text: "Check 138 failed", reactions: "[]", files: [], captions: "{}", created_at: "2026-11-02T10:00:00Z", recipient: "worker 12"};
let shown;

afterEach(() => shown?.unmount());

test("a message sent to a worker has a comment button, which hands the message to the chat's composer", async () => {
    const asked = [];
    shown = await mountedMessageCard({message: MESSAGE, onComment: (row) => asked.push(row.id)});
    shown.host.querySelector("[data-growing-comment]").click();
    await settle();
    expect(asked).toEqual([7]);
    expect(shown.host.querySelector("textarea")).toBeNull();
});

test("a message from another agent has the comment button as well", async () => {
    shown = await mountedMessageCard({message: {...MESSAGE, recipient: "", peer: "shop-e6"}});
    expect(shown.host.querySelector("[data-growing-comment]")).not.toBeNull();
});

test("an ordinary message bubble has no comment button on the card", async () => {
    shown = await mountedMessageCard({message: {...MESSAGE, type: "agent", recipient: ""}});
    expect(shown.host.querySelector("[data-growing-comment]")).toBeNull();
});
