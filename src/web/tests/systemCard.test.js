import {createApp, h, nextTick} from "vue";
import {beforeEach, expect, test} from "vitest";
import {threadTurns} from "../src/domain/thread.js";
import {store} from "../src/state/store.js";

globalThis.ResizeObserver ??= class {
    observe() {}

    unobserve() {}

    disconnect() {}
};

const TYPES = {message: {title: "Message"}, check: {title: "Check"}, rule: {title: "Rule"}};
const base = {deleted: 0, completed: 0, refs: [], sections: [], title: "", abstract: "", updated: 0};
const message = (n, created, who, brief, data = {}) => ({
    ...base,
    ref: `message:${n}`,
    type: "message",
    n,
    created,
    seen: [who],
    brief,
    data: {author: who, ...data},
});
const card = (kind, fields) => ({card: {kind, session: "s1", icon: "", tone: "", detail: "", row: "", ...fields}});

const rows = {
    message: [
        message(1, 10, "user", "Run the lint?"),
        message(2, 20, "agent", "Running it now."),
        message(3, 30, "system", "Check lint passed", card("card", {icon: "check", tone: "good", detail: "all clean", row: "check:3"})),
        message(4, 40, "system", "Reminded the agent about rule 2", card("whisper", {icon: "rules", row: "rule:2"})),
    ],
    comment: [],
    question: [],
    reaction: [],
    agent: [],
    doc: [],
};
const scope = {env: "", api: {}, rows: (type) => rows[type] || [], loaded: () => true, holding: () => {}, earlier: () => {}};

beforeEach(() => {
    store.spec = {types: TYPES, priority: Object.keys(TYPES), chat_kinds: {turns: {}}};
});

test("the user's words, the agent's and the system's cards are one stream by number", () => {
    const {turns} = threadTurns(rows, [], "main");
    expect(turns.map((t) => [t.ref, t.type])).toEqual([
        ["message:1", "message"],
        ["message:2", "message"],
        ["message:3", "card"],
        ["message:4", "whisper"],
    ]);
    expect(turns[3].data.row).toBe("rule:2");
});

test("a system message is drawn as a card with its label and detail", async () => {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
    const {default: Turn} = await import("../src/chat/Turn.vue");
    const {turns} = threadTurns(rows, [], "main");
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(Turn, {turn: turns[2]})});
    app.provide("scope", scope);
    app.directive("tip", {});
    app.mount(host);
    await nextTick();
    const turn = host.querySelector(".thread-turn.card");
    const shown = {
        ref: turn.dataset.ref,
        label: turn.querySelector(".mark .head").textContent.trim(),
        detail: turn.querySelector(".mark .detail").textContent.trim(),
    };
    app.unmount();
    host.remove();
    expect(shown).toEqual({ref: "message:3", label: "Check lint passed", detail: "all clean"});
});
