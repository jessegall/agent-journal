import {afterEach, expect, test} from "vitest";
import {createApp, h} from "vue";
import {settled} from "./settled.js";
import MemoryFacts from "../src/resource/MemoryFacts.vue";
import RowMoves from "../src/resource/RowMoves.vue";
import {movesOf} from "../src/domain/resourceNouns.js";
import {opening, route} from "../src/route.js";
import QuestionRows from "../../core/modules/questions/web/src/QuestionRows.vue";
import SuggestionRows from "../../core/modules/suggestions/web/src/SuggestionRows.vue";
import {context, mounted, page, settle} from "./support/windowContext.js";
import {suggestionWindowContext} from "./support/suggestionWindowContext.js";

afterEach(() => opening([]));

function drawn(component, props) {
    const element = document.createElement("div");
    createApp(() => h(component, props)).mount(element);
    return element;
}

test("a memory's panel lists its keywords, adds one and takes one off", async () => {
    const lines = [];
    const read = async (line) => (lines.push(line), {ok: true, value: {rows: [{id: 7, word: "cart"}]}});
    const element = drawn(MemoryFacts, {id: 3, read});
    await settled();
    expect(lines[0]).toEqual(["memory-keyword", "list", "--memory", "3"]);
    expect(element.querySelector("[data-memory-word]").textContent).toContain("cart");
    const form = element.querySelector("[data-memory-word-form]");
    const input = form.querySelector("input");
    input.value = "total";
    input.dispatchEvent(new Event("input"));
    await settled();
    form.dispatchEvent(new Event("submit", {cancelable: true}));
    await settled();
    expect(lines).toContainEqual(["memory-keyword", "make", "3", "total"]);
    element.querySelector("[data-memory-word-off]").click();
    await settled();
    expect(lines).toContainEqual(["memory-keyword", "delete", "7"]);
});

test("a memory with no keywords says what that means", async () => {
    const element = drawn(MemoryFacts, {id: 3, read: async () => ({ok: true, value: {rows: []}})});
    await settled();
    expect(element.textContent).toContain("No keywords");
});

test("a worker's moves go to the worker command, with its words after its number", async () => {
    const lines = [];
    const read = async (line) => (lines.push(line), {ok: true, value: {}});
    const element = drawn(RowMoves, {noun: "agent", id: 9, row: {role: "worker"}, read});
    await settled();
    element.querySelector('[data-move="release"]').click();
    await settled();
    const form = element.querySelector("[data-resource-ask]");
    const input = form.querySelector("input");
    input.value = "wrong task";
    input.dispatchEvent(new Event("input"));
    await settled();
    form.dispatchEvent(new Event("submit", {cancelable: true}));
    await settled();
    expect(lines).toEqual([["worker", "release", "9", "wrong task"]]);
});

test("only a running worker has worker moves, and the main agent has none", () => {
    expect(movesOf("agent", {role: "main"}).map((move) => move.word)).toEqual(["pause", "stop"]);
    expect(movesOf("agent", {role: "worker"}).map((move) => move.word)).toEqual(["send", "merge", "release", "pause", "stop"]);
    expect(movesOf("agent", {role: "worker", ended_at: "2026-11-01"})).toEqual([]);
});

test("a check can be run, and stopped unless it is", () => {
    expect(movesOf("check", {stopped: false}).map((move) => move.word)).toEqual(["run", "stop"]);
    expect(movesOf("check", {stopped: true}).map((move) => move.word)).toEqual(["run"]);
    expect(movesOf("check", {removed_at: "2026-11-01"})).toEqual([]);
});

test("a question and a suggestion open in the panel", async () => {
    const question = await mounted(QuestionRows, context({"question list": page([{id: 4, text: "Ship it?", state: "open", options: []}])}));
    question.querySelector('[data-question-open="4"]').click();
    await settle();
    expect(route.value.open).toMatchObject({table: "questions", id: 4});
    opening([]);
    const suggestion = await mounted(SuggestionRows, suggestionWindowContext({"suggestion list": page([{id: 6, title: "Add a story", state: "open"}])}));
    suggestion.querySelector('[data-suggestion-open="6"]').click();
    await settle();
    expect(route.value.open).toMatchObject({table: "suggestions", id: 6});
});
