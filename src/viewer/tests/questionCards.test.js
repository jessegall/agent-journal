import {questionCardContext} from "./support/questionCardContext.js";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {afterEach, expect, test} from "vitest";
import QuestionMarkCard from "../../core/modules/questions/web/src/QuestionMarkCard.vue";
import {mounted} from "./support/windowContext.js";

afterEach(() => (document.body.innerHTML = ""));

const QUESTION = {id: 41, text: "Should the queue share one list?", state: "open", options: ["One list", "Two lists"], recommended: "Two lists", created_at: "2026-11-02T10:00:00+00:00"};
const source = (path) => readFileSync(resolve(__dirname, path), "utf8");
const rule = (text, selector) => text.match(new RegExp(`${selector.replace(/[.()]/g, "\\$&")} \\{([^}]*)\\}`))[1];
const CARD = "../../core/modules/questions/web/src/QuestionCard.vue";

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
