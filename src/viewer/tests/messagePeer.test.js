import {expect, test} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import MessageCard from "../kit/MessageCard.vue";

const MESSAGE = {id: 1, type: "peer", text: "Check 138 failed", reactions: "[]", files: [], captions: "{}", created_at: "2026-11-02T10:00:00Z"};

test("a message from another agent is a card naming who sent it, on the incoming side, that grows on a click", async () => {
    const element = await mounted(MessageCard, context({}), {message: {...MESSAGE, peer: "shop-e6"}});
    expect(element.querySelector(".growing-card-title").textContent).toBe("Message from shop-e6");
    expect(element.querySelector(".growing-card-wrap").classList.contains("incoming")).toBe(true);
    expect(element.querySelector("[data-message-between-agents]").hasAttribute("data-incoming")).toBe(true);
    expect(element.querySelector(".growing-card-wrap").classList.contains("open")).toBe(false);
    element.querySelector(".growing-card").click();
    await settle();
    expect(element.textContent).toContain("Check 138 failed");
});

test("a message sent to another agent is a card on the agent's side", async () => {
    const element = await mounted(MessageCard, context({}), {message: {...MESSAGE, recipient: "worker 12"}});
    expect(element.querySelector(".growing-card-title").textContent).toBe("Message sent to worker 12");
    expect(element.querySelector(".growing-card-wrap").classList.contains("incoming")).toBe(false);
    expect(element.querySelector("[data-message-between-agents]").hasAttribute("data-incoming")).toBe(false);
});

test("any other message is a bubble", async () => {
    const element = await mounted(MessageCard, context({}), {message: {...MESSAGE, type: "agent"}});
    expect(element.querySelector(".growing-card")).toBeNull();
    expect(element.querySelector("[data-message]")).not.toBeNull();
});

const REPLY = {...MESSAGE, id: 2, type: "agent", parent_id: 1, text: "Fixing it"};

test("a reply to another agent's message is the between-agents card naming that agent", async () => {
    const element = await mounted(MessageCard, context({}), {message: {...REPLY, recipient: "Merger 7"}});
    expect(element.querySelector(".growing-card-title").textContent).toBe("Message sent to Merger 7");
    expect(element.querySelector("[data-message]")).toBeNull();
});

test("a reply to the user is the bubble it was", async () => {
    const element = await mounted(MessageCard, context({}), {message: REPLY});
    expect(element.querySelector(".growing-card")).toBeNull();
    expect(element.querySelector("[data-message]")).not.toBeNull();
});
