import {expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import Chat from "../../core/modules/messages/web/src/Chat.vue";

const FEED = {"message feed": page([{id: 1, type: "agent", text: "An older message", created_at: "2026-11-02T10:00:00Z"}])};
const HEIGHT = 2000;

test("sending a message puts the chat at its foot at once, also when it was scrolled up", async () => {
    const window_ = {...context(FEED), run: async () => ({ok: true, value: {}})};
    const element = await mounted(Chat, window_);
    const history = element.querySelector(".history");
    const glides = [];
    // jsdom has no layout: the history is 2000px tall in a 500px view, and its scroll position is a plain number
    Object.defineProperty(history, "scrollHeight", {value: HEIGHT});
    Object.defineProperty(history, "clientHeight", {value: 500});
    Object.defineProperty(history, "scrollTop", {value: 0, writable: true});
    history.scrollTo = (options) => glides.push(options);
    history.dispatchEvent(new Event("scroll"));
    const box = element.querySelector(".composer-input");
    box.value = "a new message";
    box.dispatchEvent(new Event("input"));
    await settle();
    box.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));
    await settle();
    expect(history.scrollTop).toBe(HEIGHT);
    expect(glides).toEqual([]);
});
