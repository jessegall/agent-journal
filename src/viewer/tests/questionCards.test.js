import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {afterEach, expect, test} from "vitest";
import QuestionMarkCard from "../../core/modules/questions/web/src/QuestionMarkCard.vue";
import QuestionRows from "../../core/modules/questions/web/src/QuestionRows.vue";
import {context, mounted, page, settle} from "./support/windowContext.js";

afterEach(() => (document.body.innerHTML = ""));

const QUESTION = {id: 41, text: "Should the queue share one list?", state: "open", options: ["One list", "Two lists"], recommended: "Two lists", created_at: "2026-11-02T10:00:00+00:00"};
const SETTLED = {answered: {...QUESTION, id: 40, state: "answered", answer: "Places"}, closed: {...QUESTION, id: 38, state: "closed"}};
const source = (path) => readFileSync(resolve(__dirname, path), "utf8");
const rule = (text, selector) => text.match(new RegExp(`${selector.replace(/[.()]/g, "\\$&")} \\{([^}]*)\\}`))[1];
const CARD = "../../core/modules/questions/web/src/QuestionCard.vue";

const inWindow = (rows) => mounted(QuestionRows, {...context({"question list": page(rows)}), run: async () => ({ok: true, value: null})});

test("an open question in the window is a flush card: a dot, its number and time, rows with a ring and a chip, and the answer foot", async () => {
    const element = await inWindow([QUESTION]);
    const card = element.querySelector("[data-question-card]");
    expect(card.classList.contains("flush")).toBe(true);
    expect(card.querySelector("[data-question-dot]")).not.toBeNull();
    expect(card.querySelector(".question-label").textContent).toBe("Question 41");
    expect(card.querySelector("[data-question-time]")).not.toBeNull();
    expect(card.querySelector("[data-question-open]").textContent).toBe(QUESTION.text);
    const options = [...card.querySelectorAll("[data-question-option]")];
    expect(options.every((option) => option.querySelector(".question-ring"))).toBe(true);
    expect(options.map((option) => option.querySelector(".question-chip")?.textContent ?? "")).toEqual(["", "Recommended"]);
    expect(card.querySelector(".question-tag")).toBeNull();
    const foot = card.querySelector("form.question-form");
    expect(foot.querySelector("input").placeholder).toBe("Or answer in your own words…");
    expect([...foot.querySelectorAll(".question-buttons button")].map((button) => button.textContent.trim())).toEqual(["Close", "Elaborate", "Answer"]);
});

test("an answered question in the window is a row that says Answered and the answer, and a closed one says Closed", async () => {
    const element = await inWindow([SETTLED.answered, SETTLED.closed]);
    const [answered, closed] = [...element.querySelectorAll("[data-question-settled]")];
    expect(answered.textContent).toBe("Answered: Places");
    expect(answered.querySelector("b").textContent).toBe("Answered:");
    expect(closed.textContent).toBe("Closed");
    expect([...element.querySelectorAll("[data-question-card]")].map((card) => card.dataset.state)).toEqual(["answered", "closed"]);
    expect(element.querySelector("[data-question-option]")).toBeNull();
    expect(element.querySelector("form")).toBeNull();
});

test("the window's cards run edge to edge with no box, a line between neighbours and a foot that wraps", () => {
    const card = source(CARD);
    expect(rule(card, ".question.flush")).toMatch(/max-width: none;[\s\S]*padding: 12px 14px 0;[\s\S]*border: 0;[\s\S]*border-bottom: 1px solid var\(--border\);[\s\S]*border-radius: 0;/);
    expect(rule(card, ".flush .question-form")).toMatch(/flex-wrap: wrap;[\s\S]*margin: 0 -14px;[\s\S]*background: var\(--side\)/);
    expect(rule(card, ".flush .question-options")).toMatch(/margin: 2px -14px 0;[\s\S]*border-top: 1px solid var\(--border\)/);
    expect(rule(card, ".question-buttons")).toContain("flex-wrap: wrap");
    expect(rule(source("../../core/modules/questions/web/src/QuestionRows.vue"), ".questions :deep(.row-list-row)")).toMatch(/padding: 0;/);
});

test("a question in the chat keeps its box, its tag band over the recommended option and its buttons inside the answer box", async () => {
    const chat = {...context({"question show 41": {ok: true, value: QUESTION}}), option: () => ({value: {target_id: 41}}), run: async () => ({ok: true, value: null})};
    const element = await mounted(QuestionMarkCard, chat);
    const card = element.querySelector("[data-question-card]");
    expect(card.classList.contains("flush")).toBe(false);
    expect(card.querySelector("[data-question-dot], .question-ring, .question-chip")).toBeNull();
    expect(card.querySelector(".question-tag").textContent).toBe("Recommended");
    expect(card.querySelector("[data-question-option='One list'] .question-tag")).toBeNull();
    expect(card.querySelector("form .text-field-end [data-question-answer]")).not.toBeNull();
    expect(card.querySelector(".question-buttons")).toBeNull();
    const styles = source(CARD);
    expect(rule(styles, ".question")).toMatch(/max-width: 640px;[\s\S]*padding: 14px 16px 16px;[\s\S]*border: 1px solid var\(--border-2\);[\s\S]*border-radius: 12px;[\s\S]*background: var\(--raised\)/);
    expect(rule(styles, ".question-option")).toMatch(/border: 1px solid var\(--border-2\);[\s\S]*border-radius: 8px/);
});
