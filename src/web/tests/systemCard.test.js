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

test("a card for the user's own act sits on the user's side", () => {
    const answered = message(5, 50, "system", "You answered question 9", {
        actor: "user:1",
        ...card("card", {icon: "question", tone: "good"}),
    });
    const {turns} = threadTurns({...rows, message: [...rows.message, answered]}, [], "main");
    const mine = turns.find((t) => t.ref === "message:5");
    expect([mine.who, mine.data.side]).toEqual(["user", "user"]);
    expect(turns.find((t) => t.ref === "message:3").data.side).toBe("");
});

test("a plugin's card is drawn by its kind with the plugin's name on it, and its settled replacement stands in its place", async () => {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
    const {default: Turn} = await import("../src/chat/Turn.vue");
    const sin = (label, detail, updated) => ({
        ...message(5, 50, "system", label, {actor: "plugin:lint", ...card("plugin", {plugin: "lint", card: "sin", key: "a.py", icon: "warn", tone: "warn", detail})}),
        updated,
    });
    const drawn = async (row) => {
        const {turns} = threadTurns({...rows, message: [...rows.message, row]}, [], "main");
        const host = document.createElement("div");
        document.body.append(host);
        const app = createApp({render: () => h(Turn, {turn: turns.find((t) => t.ref === "message:5")})});
        app.provide("scope", scope);
        app.directive("tip", {});
        app.mount(host);
        await nextTick();
        const mark = host.querySelector(".thread-turn.card .mark");
        const name = mark.querySelector(".head strong").textContent.trim();
        const shown = {label: mark.querySelector(".head").textContent.replace(name, "").trim(), name, detail: mark.querySelector(".detail")?.textContent.trim() || ""};
        app.unmount();
        host.remove();
        return shown;
    };
    expect(await drawn(sin("A sin in a.py", "a long method", 50))).toEqual({label: "A sin in a.py", name: "lint", detail: "a long method"});
    expect(await drawn(sin("a.py is clean", "", 60))).toEqual({label: "a.py is clean", name: "lint", detail: ""});
});

test("a plugin's plain message is a card of the plugin's, not a crash", () => {
    const said = message(6, 60, "system", "heard message 4", {actor: "plugin:echo", card: {}});
    const {turns} = threadTurns({...rows, message: [...rows.message, said]}, [], "main");
    const turn = turns.find((t) => t.ref === "message:6");
    expect([turn.type, turn.data.icon, turn.data.name, turn.data.label]).toEqual(["card", "plug", "echo", "heard message 4"]);
});
