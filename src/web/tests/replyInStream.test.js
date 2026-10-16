import {createApp, h, nextTick} from "vue";
import {beforeEach, expect, test} from "vitest";
import {threadTurns} from "../src/domain/thread.js";
import {store} from "../src/state/store.js";

globalThis.ResizeObserver ??= class {
    observe() {}

    unobserve() {}

    disconnect() {}
};

const TYPES = {message: {title: "Message"}, todo: {title: "To-do"}};
const base = {deleted: 0, completed: 0, refs: [], sections: [], title: "", abstract: "", updated: 0};
const message = (n, created, who, brief, fields = {}) => ({
    ...base,
    ref: `message:${n}`,
    type: "message",
    n,
    created,
    seen: [who],
    brief,
    data: {author: who},
    ...fields,
});

const older = message(1, 10, "user", "Is the footer fixed?");
const newer = message(2, 20, "user", "And the header?");
const reply = message(3, 30, "agent", "The footer is fixed.", {refs: ["message:1"], data: {author: "agent", reply_to: 1}});
const rows = {message: [older, newer, reply], comment: [], question: [], reaction: [], agent: [], doc: []};
const scope = {env: "", api: {}, rows: (type) => rows[type] || [], loaded: () => true, holding: () => {}, earlier: () => {}};

beforeEach(() => {
    store.spec = {types: TYPES, priority: Object.keys(TYPES), chat_kinds: {turns: {}}};
});

test("an agent's reply to an older message is a message at its own place, at the foot of the chat", () => {
    const {turns} = threadTurns(rows, [], "main");
    expect(turns.map((t) => [t.ref, t.type, t.who])).toEqual([
        ["message:1", "message", "user"],
        ["message:2", "message", "user"],
        ["message:3", "message", "agent"],
    ]);
});

test("the reply shows a quote of the older message it answers", async () => {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
    const {default: TurnMessage} = await import("../src/chat/TurnMessage.vue");
    const {turns} = threadTurns(rows, [], "main");
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
    expect(shown).toEqual({ref: "message:3", quote: "Is the footer fixed?"});
});
