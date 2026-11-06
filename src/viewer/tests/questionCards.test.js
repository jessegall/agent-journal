import {questionsWindowContext} from "./support/questionsWindowContext.js";
import {questionCardContext} from "./support/questionCardContext.js";
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

const inWindow = (rows) => mounted(QuestionRows, {...questionsWindowContext({"question list": page(rows)}), run: async () => ({ok: true, value: null})});

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

test("each question in the window is one block: a banner in --bg-2 with the dot, the number and the time, then the text, then the answer", async () => {
    const element = await inWindow([QUESTION, SETTLED.answered]);
    for (const card of element.querySelectorAll("[data-question-card]")) {
        const [banner, text] = [...card.children];
        expect(banner.classList.contains("question-head")).toBe(true);
        expect([...banner.children].map((part) => part.className.split(" ")[0] || part.tagName.toLowerCase())).toEqual(["question-dot", "question-label", "question-time"]);
        expect(banner.querySelectorAll("[data-question-dot]")).toHaveLength(1);
        expect(text.hasAttribute("data-question-open")).toBe(true);
    }
    const [open, answered] = [...element.querySelectorAll("[data-question-card]")];
    expect(open.lastElementChild.classList.contains("question-form")).toBe(true);
    expect(answered.lastElementChild.hasAttribute("data-question-settled")).toBe(true);
    const card = source(CARD);
    expect(rule(card, ".flush .question-head")).toMatch(/margin: 0 -14px;[\s\S]*background: var\(--bg-2\)/);
    expect(rule(card, ".flush .question-open")).toContain("padding: 12px 0;");
    expect(rule(source("../../core/modules/questions/web/src/QuestionRows.vue"), ".questions :deep(.row-list)")).toContain("gap: 16px;");
});

test("the Answered label stays on one line and the answer takes the rest of the row", async () => {
    const element = await inWindow([SETTLED.answered]);
    const settled = element.querySelector("[data-question-settled]");
    expect(settled.querySelector(".question-answered").textContent).toBe("Answered:");
    expect(settled.querySelector(".question-answer").textContent).toBe("Places");
    const card = source(CARD);
    expect(rule(card, ".flush .question-answered")).toMatch(/flex: none;[\s\S]*white-space: nowrap;/);
    expect(rule(card, ".flush .question-answer")).toMatch(/flex: 1;[\s\S]*min-width: 0;/);
});

test("the window's blocks run edge to edge with no box, a line above and below and a foot that wraps", () => {
    const card = source(CARD);
    expect(rule(card, ".question.flush")).toMatch(/max-width: none;[\s\S]*padding: 0 14px;[\s\S]*border: 0;[\s\S]*border-top: 1px solid var\(--border-2\);[\s\S]*border-bottom: 1px solid var\(--border-2\);[\s\S]*border-radius: 0;/);
    expect(rule(card, ".flush .question-form")).toMatch(/flex-wrap: wrap;[\s\S]*margin: 0 -14px;[\s\S]*background: var\(--side\)/);
    expect(rule(card, ".flush .question-options")).toMatch(/margin: 0 -14px;[\s\S]*border-top: 1px solid var\(--border-inner\)/);
    expect(rule(card, ".question-buttons")).toContain("flex-wrap: wrap");
    expect(rule(source("../../core/modules/questions/web/src/QuestionRows.vue"), ".questions :deep(.row-list-row)")).toMatch(/padding: 0;/);
});

test("a question in the chat keeps its box, its tag band over the recommended option and its buttons inside the answer box", async () => {
    const chat = {...questionCardContext({"question show 41": {ok: true, value: QUESTION}}), option: () => ({value: {target_id: 41}}), run: async () => ({ok: true, value: null})};
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

test("a question with context draws it under its title, and an old question with none draws just the title", async () => {
    const asked = {...QUESTION, text: "Which database?", context: "The cart needs a store. sqlite is one file; postgres is a separate server."};
    const element = await inWindow([asked, {...QUESTION, id: 39}]);
    const [withContext, without] = [...element.querySelectorAll("[data-question-card]")];
    const [, title, context] = [...withContext.children];
    expect(title.hasAttribute("data-question-open")).toBe(true);
    expect(title.textContent).toBe("Which database?");
    expect(context.hasAttribute("data-question-context")).toBe(true);
    expect(context.textContent).toBe(asked.context);
    expect(without.querySelector("[data-question-context]")).toBeNull();
    expect(without.querySelector("[data-question-open]").textContent).toBe(QUESTION.text);
    expect(rule(source(CARD), ".question-context")).toContain("margin: 0;");
});
