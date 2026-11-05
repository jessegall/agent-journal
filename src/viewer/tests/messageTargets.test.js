import {expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import Chat from "../../core/modules/messages/web/src/Chat.vue";
import TranscriptRows from "../../core/modules/agents/web/src/TranscriptRows.vue";

test("main chat sends the current main agent as the message target", async () => {
    const sent = [];
    const window = {...context({"message feed": page([]), "agent main": {ok: true, value: {id: 42}}}), run: async (line) => { sent.push(line); return {ok: true, value: {}}; }};
    const element = await mounted(Chat, window);
    const box = element.querySelector(".composer-input");
    box.value = "Please check this";
    box.dispatchEvent(new Event("input"));
    await settle();
    box.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));
    await settle();
    expect(sent).toContainEqual(["message", "send", "Please check this", "--target-agent", "42"]);
});

test("an agent conversation sends its own agent as the message target", async () => {
    const sent = [];
    const window = {...context({"agent transcript": page([])}), run: async (line) => { sent.push(line); return {ok: true, value: {}}; }};
    const element = await mounted(TranscriptRows, window, {line: "agent transcript 73", agent: 73});
    const box = element.querySelector("textarea");
    expect(box).not.toBeNull();
    box.value = "Continue that task";
    box.dispatchEvent(new Event("input"));
    await settle();
    box.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));
    await settle();
    expect(sent).toContainEqual(["message", "send", "Continue that task", "--target-agent", "73"]);
});
