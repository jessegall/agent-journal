import {nextTick} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import QuestionOverlay from "../../core/modules/messages/web/src/QuestionOverlay.vue";
import {openInChat, peek} from "../src/route.js";
import {settled} from "./settled.js";
import {context, mounted} from "./support/windowContext.js";

const SHOW_LINE = "question show 3";
let release = null;

afterEach(() => {
    release?.();
    vi.useRealTimers();
});

async function overlay(answers = {}) {
    const closed = [];
    const window = context({[SHOW_LINE]: {ok: true, value: {id: 3, state: "open"}}, ...answers}, 7);
    const element = await mounted(QuestionOverlay, window, {id: 3, onClose: () => closed.push(true)});
    return {closed, element, window};
}

test("a question opened while a chat is on the page goes to the chat, not to the side panel", () => {
    const opened = [];
    release = openInChat("question", (id) => {
        opened.push(id);
        return true;
    });
    const before = location.hash;
    peek("question", 3);
    expect(opened).toEqual([3]);
    expect(location.hash).toBe(before);
});

test("with no chat on the page a question still opens in the side panel", () => {
    peek("question", 4);
    expect(location.hash).toContain("question:4");
});

test("a click beside the question closes it", async () => {
    const {closed, element} = await overlay();
    element.querySelector("[data-question-veil]").click();
    await nextTick();
    expect(closed).toEqual([true]);
});

test("escape closes it", async () => {
    const {closed} = await overlay();
    window.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape"}));
    await settled();
    expect(closed).toEqual([true]);
});
