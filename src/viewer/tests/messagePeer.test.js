import {expect, test} from "vitest";
import {context, mounted} from "./support/windowContext.js";
import MessageCard from "../kit/MessageCard.vue";

const MESSAGE = {id: 1, type: "agent", text: "Check 138 failed", reactions: "[]", files: [], captions: "{}", created_at: "2026-11-02T10:00:00Z"};

test("a message from another session names who sent it", async () => {
    const element = await mounted(MessageCard, context({}), {message: {...MESSAGE, type: "peer", peer: "shop-e6"}});
    expect(element.querySelector("[data-message-peer]").textContent).toBe("Message from shop-e6");
    expect(element.querySelector("[data-message]").dataset.from).toBe("peer");
});

test("any other message has no such line", async () => {
    const element = await mounted(MessageCard, context({}), {message: MESSAGE});
    expect(element.querySelector("[data-message-peer]")).toBeNull();
});
