import {afterEach, expect, test, vi} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import Chat from "../../core/modules/messages/web/src/Chat.vue";

vi.mock("../src/chat/VoiceFigure.vue", async () => {
    const {h} = await import("vue");
    return {__esModule: true, default: {props: ["voice", "running", "thinking", "asking", "waitingFor", "marks", "messages", "here"], render() {
        return h("i", {"data-figure-of": this.voice, "data-given": JSON.stringify({running: this.running, thinking: this.thinking, asking: this.asking, waitingFor: this.waitingFor, marks: this.marks.length, messages: this.messages.length, here: this.here})});
    }}};
});

const KEY = "setting show journal.core.voices.";
const settings = (profile, avatar = true, shown = "always") => ({
    [`${KEY}profile`]: {ok: true, value: {key: "profile", value: profile, source: "project"}},
    [`${KEY}avatar`]: {ok: true, value: {key: "avatar", value: avatar, source: "project"}},
    [`${KEY}avatar-shown`]: {ok: true, value: {key: "avatar-shown", value: shown, source: "project"}},
});

// the chat with the figure option the pane holds, over the settings the journal answers and the tool the agent has in hand
async function chat({figure = "voice", answers = settings("coach"), tool = "", facts = {}, rows = {}} = {}) {
    const base = context({"message feed": page([]), "usage tool": {ok: true, value: {tool, wait_target: "", ...facts}}, ...rows});
    const window_ = {...base, option: (key) => ({value: key === "figure" ? figure : undefined}), read: async (line) => {
        const text = Array.isArray(line) ? line.join(" ") : line;
        return answers[text] ?? base.read(line);
    }};
    const element = await mounted(Chat, window_);
    await settle();
    return element;
}

const figure = (element) => element.querySelector("[data-figure-of]")?.dataset.figureOf ?? null;

afterEach(() => localStorage.clear());

test("by default the figure is the voice the user chose", async () => {
    expect(figure(await chat())).toBe("coach");
});

test("a pane that names a figure keeps it whatever the voice is, and a pane that names none shows none", async () => {
    expect(figure(await chat({figure: "butler"}))).toBe("butler");
    expect(figure(await chat({figure: "none"}))).toBeNull();
});

test("the setting that turns the figure off shows none, and so does never", async () => {
    expect(figure(await chat({answers: settings("coach", false)}))).toBeNull();
    expect(figure(await chat({answers: settings("coach", true, "never")}))).toBeNull();
});

test("shown while the agent works draws the figure only while a tool is in hand", async () => {
    expect(figure(await chat({answers: settings("squire", true, "working"), tool: "Bash make test"}))).toBe("squire");
    expect(figure(await chat({answers: settings("squire", true, "working"), tool: ""}))).toBeNull();
});

test("the figure is given what the chat reads: the tool, what the agent waits for, its marks and its messages", async () => {
    const element = await chat({
        tool: "Bash make test",
        facts: {wait_target: "your answer to question 1", thinking: true, asking: true},
        rows: {
            "message feed": page([{id: 1, type: "user", text: "hello", created_at: "2026-11-01T10:00:00Z", reactions: "[]"}]),
            "chat-mark main": page([{id: 1, type: "tasks.task", variant: "closed", key: "task:1", text: "Task 1 closed", created_at: "2026-11-01T10:00:00Z"}]),
        },
    });
    expect(JSON.parse(element.querySelector("[data-figure-of]").dataset.given)).toEqual({running: "Bash make test", thinking: true, asking: true, waitingFor: "your answer to question 1", marks: 1, messages: 1, here: true});
});

test("a journal that cannot say the voice shows no figure", async () => {
    expect(figure(await chat({answers: {[`${KEY}profile`]: {ok: false, error: "refused"}}}))).toBeNull();
});
