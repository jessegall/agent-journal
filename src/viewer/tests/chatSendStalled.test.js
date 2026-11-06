import {expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import Chat from "../../core/modules/messages/web/src/Chat.vue";

const FEED = {"message feed": page([])};

// a chat whose lines stay in flight until `answer` is called
function heldChat(answers = FEED) {
    const lines = [];
    const open = [];
    const window = {...context(answers), run: (line) => {
        lines.push(line);
        return new Promise((resolve) => open.push(resolve));
    }};
    return {window, lines, answer: async (value) => {
        open.shift()({ok: true, value});
        await settle();
    }};
}

async function write(element, words) {
    const box = element.querySelector(".composer-input");
    box.value = words;
    box.dispatchEvent(new Event("input"));
    await settle();
}

async function enter(element) {
    element.querySelector(".composer-input").dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));
    await settle();
}

async function arrowUp(element) {
    element.querySelector(".composer-input").dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowUp"}));
    await settle();
}

const shown = (element, words) => [...element.querySelectorAll("[data-message]")].some((row) => row.textContent.includes(words));

test("a sent message shows at once and its write leaves while every read is stalled", async () => {
    const {window, lines} = heldChat();
    const stalled = {...window, read: () => new Promise(() => {})};
    const element = await mounted(Chat, stalled);
    await write(element, "Sent on a stalled network");
    await enter(element);
    expect(shown(element, "Sent on a stalled network"), "the list draws the echo before its first read has answered").toBe(true);
    expect(lines).toEqual([["message", "send", "Sent on a stalled network"]]);
});

test("a sent message shows when the chat's read failed", async () => {
    const {window} = heldChat({});
    const element = await mounted(Chat, window);
    await write(element, "Sent after a failed read");
    await enter(element);
    expect(shown(element, "Sent after a failed read")).toBe(true);
});

test("messages leave one at a time, in the order they were written", async () => {
    const {window, lines, answer} = heldChat();
    const element = await mounted(Chat, window);
    await write(element, "first");
    await enter(element);
    await write(element, "second");
    await enter(element);
    expect(lines).toEqual([["message", "send", "first"]]);
    await answer({id: 1});
    expect(lines).toEqual([["message", "send", "first"], ["message", "send", "second"]]);
});

test("an edit of a message still waiting to leave sends only the new words, once", async () => {
    const {window, lines, answer} = heldChat();
    const element = await mounted(Chat, window);
    await write(element, "first");
    await enter(element);
    await write(element, "secnd");
    await enter(element);
    await arrowUp(element);
    await write(element, "second");
    await enter(element);
    expect(shown(element, "second")).toBe(true);
    expect(shown(element, "secnd")).toBe(false);
    await answer({id: 1});
    await answer({id: 2});
    expect(lines).toEqual([["message", "send", "first"], ["message", "send", "second"]]);
});

test("an edit of a message that has left follows as one edit once the server has answered with its number", async () => {
    const {window, lines, answer} = heldChat();
    const element = await mounted(Chat, window);
    await write(element, "secnd");
    await enter(element);
    await arrowUp(element);
    await write(element, "second");
    await enter(element);
    expect(lines).toEqual([["message", "send", "secnd"]]);
    await answer({id: 7});
    expect(lines).toEqual([["message", "send", "secnd"], ["message", "edit", "7", "--text", "second"]]);
    await answer({id: 7});
    expect(lines).toHaveLength(2);
});
