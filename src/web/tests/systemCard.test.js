import {createApp, h, nextTick} from "vue";
import {expect, test} from "vitest";
import {threadTurns} from "../src/domain/thread.js";

globalThis.ResizeObserver ??= class {
    observe() {}

    unobserve() {}

    disconnect() {}
};

const at = (seconds) => new Date(seconds * 1000).toISOString();
const message = (id, seconds, author, text, data = {}, more = {}) => ({table: "messages", id, created_at: at(seconds), created_by: author === "user" ? "user:1" : "system", author, text, files: [], comments_on: [], idempotency: "", data, ...more});
const card = (kind, fields) => ({kind, session: "s1", icon: "", tone: "", detail: "", row: "", ...fields});

const messages = [
    message(1, 10, "user", "Run the lint?"),
    message(2, 20, "agent", "Running it now."),
    message(3, 30, "system", "Check lint passed", card("card", {icon: "check", tone: "good", detail: "all clean", row: "checks:3"})),
    message(4, 40, "system", "Reminded the agent about rule 2", card("whisper", {icon: "rules", row: "rules:2"})),
];
const scope = {env: "", api: {}, rows: () => [], loaded: () => true, holding: () => {}, earlier: () => {}};

test("the user's words, the agent's and the system's cards are one stream by number", () => {
    const {turns} = threadTurns(messages, []);
    expect(turns.map((t) => [t.key, t.kind])).toEqual([
        ["messages:1", "message"],
        ["messages:2", "message"],
        ["messages:3", "card"],
        ["messages:4", "whisper"],
    ]);
    expect(turns[3].data.row).toBe("rules:2");
});

test("a system message is drawn as a card with its label and detail", async () => {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
    const {default: Turn} = await import("../src/chat/Turn.vue");
    const {turns} = threadTurns(messages, []);
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
    expect(shown).toEqual({ref: "messages:3", label: "Check lint passed", detail: "all clean"});
});

test("a card for the user's own act sits on the user's side", () => {
    const answered = message(5, 50, "system", "You answered question 9", card("card", {icon: "question", tone: "good"}), {created_by: "user:1"});
    const {turns} = threadTurns([...messages, answered], []);
    const mine = turns.find((t) => t.key === "messages:5");
    expect([mine.who, mine.data.side]).toEqual(["user", "user"]);
    expect(turns.find((t) => t.key === "messages:3").data.side).toBe("");
});

test("a plugin's card is drawn by its kind with the plugin's name on it, and its settled replacement stands in its place", async () => {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
    const {default: Turn} = await import("../src/chat/Turn.vue");
    const sin = (label, detail) => message(5, 50, "system", label, card("plugin", {plugin: "lint", card: "sin", key: "a.py", icon: "warn", tone: "warn", detail}), {created_by: "plugin:lint"});
    const drawn = async (row) => {
        const {turns} = threadTurns([...messages, row], []);
        const host = document.createElement("div");
        document.body.append(host);
        const app = createApp({render: () => h(Turn, {turn: turns.find((t) => t.key === "messages:5")})});
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
    expect(await drawn(sin("A sin in a.py", "a long method"))).toEqual({label: "A sin in a.py", name: "lint", detail: "a long method"});
    expect(await drawn(sin("a.py is clean", ""))).toEqual({label: "a.py is clean", name: "lint", detail: ""});
});

test("a plugin's plain message is a card of the plugin's, not a crash", () => {
    const said = message(6, 60, "system", "heard message 4", {}, {created_by: "plugin:echo"});
    const {turns} = threadTurns([...messages, said], []);
    const turn = turns.find((t) => t.key === "messages:6");
    expect([turn.kind, turn.data.icon, turn.data.name, turn.data.label]).toEqual(["card", "plug", "echo", "heard message 4"]);
});
