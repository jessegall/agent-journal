import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import {threadTurns} from "../src/domain/thread.js";

globalThis.ResizeObserver ??= class {
    observe() {}

    unobserve() {}

    disconnect() {}
};

const at = (seconds) => new Date(seconds * 1000).toISOString();
const message = (id, seconds, author, text, more = {}) => ({table: "messages", id, created_at: at(seconds), author, text, files: [], data: {}, comments_on: [], idempotency: "", reply_to: null, ...more});

const older = message(1, 10, "user", "Is the footer fixed?");
const newer = message(2, 20, "user", "And the header?");
const reply = message(3, 30, "agent", "The footer is fixed.", {reply_to: 1});
const messages = [older, newer, reply];
const scope = {env: "", api: {}, rows: (table) => (table === "messages" ? messages : []), loaded: () => true, holding: () => {}, earlier: () => {}};

test("an agent's reply to an older message is a message at its own place, at the foot of the chat", () => {
    const {turns} = threadTurns(messages, []);
    expect(turns.map((t) => [t.key, t.kind, t.who])).toEqual([
        ["messages:1", "message", "user"],
        ["messages:2", "message", "user"],
        ["messages:3", "message", "agent"],
    ]);
});

test("the reply shows a quote of the older message it answers", async () => {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
    const {default: TurnMessage} = await import("../src/chat/TurnMessage.vue");
    const {turns} = threadTurns(messages, []);
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(TurnMessage, {turn: turns.at(-1)})});
    app.provide("scope", scope);
    app.directive("tip", {});
    app.mount(host);
    await nextTick();
    const shown = {ref: host.querySelector(".thread-turn").dataset.ref, quote: host.querySelector(".thread-quote").textContent.trim()};
    app.unmount();
    host.remove();
    expect(shown).toEqual({ref: "messages:3", quote: "Is the footer fixed?"});
});
