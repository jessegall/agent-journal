import {expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import Chat from "../../core/modules/messages/web/src/Chat.vue";

const FEED = {"message feed": page([])};

async function composer(window_ = context(FEED)) {
    const element = await mounted(Chat, window_);
    return {element, box: element.querySelector(".composer-input")};
}

test("words put in the box with no input event are kept when a new message redraws the chat", async () => {
    const answers = {...FEED};
    const heard = [];
    const window_ = {...context(answers), follow: (...parts) => heard.push(parts[parts.length - 1])};
    const {element, box} = await composer(window_);
    box.value = "dictated words";
    answers["message feed"] = page([{id: 1, type: "agent", text: "A new message", created_at: "2026-11-02T10:00:00Z"}]);
    heard.forEach((listener) => listener({event: "message.create", row_id: 1}));
    await settle();
    expect(element.textContent).toContain("A new message");
    expect(box.value).toBe("dictated words");
});

test("coming back to the window takes the words into the draft, so they can be sent", async () => {
    const {element, box} = await composer();
    box.value = "dictated words";
    window.dispatchEvent(new Event("focus"));
    await settle();
    expect(element.querySelector("[data-send]")).not.toBeNull();
    expect(box.value).toBe("dictated words");
});

test("Enter sends words that came with no input event", async () => {
    const lines = [];
    const window_ = {...context(FEED), run: async (line) => (lines.push(line), {ok: true, value: {}})};
    const {box} = await composer(window_);
    box.value = "dictated words";
    box.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));
    await settle();
    expect(lines[0]).toEqual(["message", "send", "dictated words"]);
    expect(box.value).toBe("");
});

test("typing still works, and a sent box is empty", async () => {
    const lines = [];
    const window_ = {...context(FEED), run: async (line) => (lines.push(line), {ok: true, value: {}})};
    const {box} = await composer(window_);
    box.value = "typed words";
    box.dispatchEvent(new Event("input"));
    await settle();
    box.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));
    await settle();
    expect(lines[0]).toEqual(["message", "send", "typed words"]);
    expect(box.value).toBe("");
});
